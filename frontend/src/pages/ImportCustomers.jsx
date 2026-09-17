import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

export default function ImportCustomers() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      setResult(await api("/import/customers", {
        method: "POST",
        body: form
      }));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Navbar/>
      <main>
        <h2>T4 — Messy Customer Import</h2>
        <p>CSV columns: name, phone, startDate, monthlyPrice</p>

        <form className="card" onSubmit={submit}>
          <input
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files[0])}
          />
          <button className="primary" disabled={!file}>Import CSV</button>
        </form>

        {error && <p className="error">{error}</p>}
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </main>
    </>
  );
}
