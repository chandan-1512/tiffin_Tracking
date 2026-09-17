import { useEffect, useState } from "react";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/dashboard").then(setData);
  }, []);

  return (
    <>
      <Navbar/>
      <main>
        <h2>Owner Dashboard</h2>
        <div className="stats">
          {data && <>
            <div className="card"><b>{data.totalCustomers}</b><span>Customers</span></div>
            <div className="card"><b>{data.activeCustomers}</b><span>Active</span></div>
            <div className="card"><b>{data.pausedCustomers}</b><span>Paused</span></div>
          </>}
        </div>

        {/* <div className="card"> */}
          {/* <h3>Assessment twists</h3>
          <p><b>T1</b> — POST /api/clock creates delivery notifications in the outbox.</p>
          <p><b>T6</b> — subscription transfers preserve assignment history and split billing.</p>
          <p><b>T4</b> — CSV import returns imported, deduped and rejected counts.</p> */}
        {/* </div> */}
      </main>
    </>
  );
}
