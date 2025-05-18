import { BookOpen, Users, ArrowLeftRight, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/", { replace: true });  // evita volver atrás
};


  return (
    <aside className="w-64 min-h-screen bg-zinc-900 text-white flex flex-col">
      <div className="flex items-center justify-center py-6 border-b border-zinc-700">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-xl font-bold">
            Lib
          </div>
          <h1 className="text-lg font-semibold mt-2">Chime's Library <br /> Manager</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
        <Link to="/dashboard/books" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800">
          <BookOpen size={18} /> Libros
        </Link>
        <Link to="/dashboard/members" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800">
          <Users size={18} /> Miembros
        </Link>
        <Link to="/dashboard/transactions" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800">
          <ArrowLeftRight size={18} /> Préstamos y Devoluciones
        </Link>
      </nav>

      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>

      <div className="p-4 border-t border-zinc-700 text-xs text-zinc-400">
        Admin - Supervisor
        <br />
        v1.0 — 2025
      </div>
    </aside>
  )
}

export default Sidebar
