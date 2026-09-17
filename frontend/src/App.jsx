import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import MyAccount from "./pages/MyAccount";
import ImportCustomers from "./pages/ImportCustomers";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

      <Route
        path="/dashboard"
        element={<ProtectedRoute role="OWNER"><Dashboard/></ProtectedRoute>}
      />
      <Route
        path="/customers"
        element={<ProtectedRoute role="OWNER"><Customers/></ProtectedRoute>}
      />
      <Route
        path="/customers/:id"
        element={<ProtectedRoute role="OWNER"><CustomerDetails/></ProtectedRoute>}
      />
      <Route
        path="/import"
        element={<ProtectedRoute role="OWNER"><ImportCustomers/></ProtectedRoute>}
      />
      <Route
        path="/my-account"
        element={<ProtectedRoute role="CUSTOMER"><MyAccount/></ProtectedRoute>}
      />
    </Routes>
  );
}
