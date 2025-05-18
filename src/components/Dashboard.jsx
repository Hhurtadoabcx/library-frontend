import Sidebar from "../components/Sidebar"
import { Outlet, Navigate, useLocation } from "react-router-dom"

const Dashboard = () => {
  const location = useLocation()

  // Si accedes exactamente a /dashboard, redirige a /dashboard/books
  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/books" replace />
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-zinc-950 p-6 text-white overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard
