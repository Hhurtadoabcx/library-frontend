import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Members from "./components/Members";
import MemberLoans from "./components/MembersLoans";
import Books from "./components/Books";
import Transactions from "./components/Transactions";
import PrivateRoute from "./components/PrivateRoute";  // Importa aquí

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="members" element={<Members />} />
          <Route path="members/:id/loans" element={<MemberLoans />} />
          <Route path="books" element={<Books />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
