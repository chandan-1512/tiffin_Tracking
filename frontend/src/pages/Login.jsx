import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("demo@tiffintrack.local");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);
      localStorage.setItem("customerId", result.user.customerId || "");
      navigate(result.user.role === "OWNER" ? "/dashboard" : "/my-account");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="auth">
      <form onSubmit={submit}>
        <h2>Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
        <button className="primary">Login</button>
        {error && <p className="error">{error}</p>}
        <small>
          Owner: demo@tiffintrack.local / Demo@123<br/>
          Customer: rahul@tiffintrack.local / Rahul@123
        </small>
        <Link to="/">Back</Link>
      </form>
    </div>
  );
}
