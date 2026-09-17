import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bill, setBill] = useState(null);
  const [transferCustomerId, setTransferCustomerId] = useState("");

  const load = () => api(`/customers/${id}`).then(setCustomer);

  useEffect(() => { load(); }, [id]);

  async function transfer(subscriptionId) {
    if (!transferCustomerId) return;
    await api(`/subscriptions/${subscriptionId}/transfer`, {
      method: "POST",
      body: JSON.stringify({
        newCustomerId: Number(transferCustomerId),
        transferDate: "2026-09-16"
      })
    });
    setTransferCustomerId("");
    load();
  }

  if (!customer) return <><Navbar/><main>Loading...</main></>;

  return (
    <>
      <Navbar/>
      <main>
        <h2>{customer.name}</h2>
        <p>{customer.phone}</p>

        {customer.subscriptions.map(subscription => (
          <div className="card" key={subscription.id}>
            <h3>₹{subscription.monthlyPrice}/month · {subscription.status}</h3>
            <p>Cycle started: {subscription.startDate.slice(0, 10)}</p>

            <button onClick={() =>
              api(`/subscriptions/${subscription.id}/pause`, {
                method: "POST",
                body: JSON.stringify({
                  startDate: "2026-09-21",
                  endDate: "2026-09-22"
                })
              }).then(load)
            }>
              Pause sample range
            </button>

            <button onClick={() =>
              api(`/subscriptions/${subscription.id}/resume`, { method: "POST" }).then(load)
            }>
              Resume
            </button>

            <button onClick={() =>
              api(`/billing/customer/${customer.id}?month=2026-09`).then(setBill)
            }>
              Calculate September bill
            </button>

            <h4>Pause history</h4>
            {subscription.pauses.map(pause => (
              <p key={pause.id}>
                {pause.startDate.slice(0, 10)} → {pause.endDate.slice(0, 10)}
              </p>
            ))}

            <h4>T6 — Transfer subscription</h4>
            <input
              value={transferCustomerId}
              onChange={e => setTransferCustomerId(e.target.value)}
              placeholder="New customer ID"
            />
            <button onClick={() => transfer(subscription.id)}>Transfer on Sep 16</button>

            <h4>Assignment history</h4>
            {subscription.assignments.map(a => (
              <p key={a.id}>
                {a.customer.name}: {a.startDate.slice(0, 10)} → {a.endDate ? a.endDate.slice(0, 10) : "current"}
              </p>
            ))}
          </div>
        ))}

        {bill && <pre>{JSON.stringify(bill.bill, null, 2)}</pre>}
      </main>
    </>
  );
}
