import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await register({ name, email, password, role: "OWNER" });
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="auth">
      <form onSubmit={submit}>
        <h2>Owner Registration</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"/>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
        <button className="primary">Register</button>
        {error && <p className="error">{error}</p>}
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
}
