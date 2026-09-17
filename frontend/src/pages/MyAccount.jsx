import { useEffect, useState } from "react";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

export default function MyAccount() {
  const [customer, setCustomer] = useState(null);
  const [bill, setBill] = useState(null);

  const load = () => api("/my-account").then(setCustomer);

  useEffect(() => { load(); }, []);

  if (!customer) return <><Navbar/><main>Loading...</main></>;

  const subscription = customer.subscriptions?.[0];

  return (
    <>
      <Navbar/>
      <main>
        <h2>My Tiffin</h2>
        <div className="card">
          <h3>Welcome, {customer.name}</h3>
          <p>{customer.phone}</p>

          {subscription && <>
            <p>Plan: ₹{subscription.monthlyPrice}/month</p>
            <p>Status: <b>{subscription.status}</b></p>

            <button onClick={() =>
              api(`/subscriptions/${subscription.id}/pause`, {
                method: "POST",
                body: JSON.stringify({
                  startDate: "2026-09-21",
                  endDate: "2026-09-22"
                })
              }).then(load)
            }>
              Pause delivery
            </button>

            <button onClick={() =>
              api(`/subscriptions/${subscription.id}/resume`, { method: "POST" }).then(load)
            }>
              Resume
            </button>

            <button onClick={() =>
              api(`/billing/customer/${customer.id}?month=2026-09`).then(setBill)
            }>
              View September bill
            </button>
          </>}
        </div>

        {bill && (
          <div className="card">
            <h3>September 2026</h3>
            <p>Served days: {bill.bill.servedDays}</p>
            <p>Paused weekdays: {bill.bill.pausedWeekdays}</p>
            <h2>₹{bill.bill.bill}</h2>
          </div>
        )}
      </main>
    </>
  );
}
