import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

export default function Customers() {
  const [data, setData] = useState({ items: [], pagination: {} });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api(`/customers?search=${encodeURIComponent(search)}&page=${page}&limit=10&sort=name&order=asc`)
      .then(setData);
  }, [search, page]);

  return (
    <>
      <Navbar/>
      <main>
        <h2>Customers</h2>
        <input
          placeholder="Search by name or phone"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="table">
          {data.items.map(customer => (
            <Link className="row" key={customer.id} to={`/customers/${customer.id}`}>
              <span>{customer.name}</span>
              <span>{customer.phone}</span>
              <span>{customer.subscriptions?.[0]?.status || "NONE"}</span>
            </Link>
          ))}
        </div>

        <div className="pager">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>{page} / {data.pagination.pages || 1}</span>
          <button
            disabled={page >= (data.pagination.pages || 1)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
}
