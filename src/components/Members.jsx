import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Search, Edit, Trash2, Plus, ArrowLeftRight } from "lucide-react"

const Members = () => {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentMember, setCurrentMember] = useState(null)
  const [deleteMemberId, setDeleteMemberId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ci: "",
    phoneNumber: ""
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:5087/api/Members")
      setMembers(response.data)
      setFilteredMembers(response.data)
    } catch (err) {
      setError("Error cargando miembros")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase()) ||
      member.ci.includes(query) ||
      member.phoneNumber.includes(query)
    )
    setFilteredMembers(filtered)
  }

const handleFormSubmit = async (e) => {
  e.preventDefault()
  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      ci: formData.ci,
      phoneNumber: formData.phoneNumber
    }

    if (currentMember) {
      await axios.put(`http://localhost:5087/api/Members/${currentMember.memberId}`, payload)
    } else {
      await axios.post("http://localhost:5087/api/Members", payload)
    }
    setShowModal(false)
    fetchMembers()
  } catch (err) {
    const errorDetails = err.response?.data?.errors || err.response?.data
    const errorMessage = Object.entries(errorDetails || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    
    setError(`Error al guardar:\n${errorMessage || err.message}`)
  }
}

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5087/api/Members/${deleteMemberId}`)
      fetchMembers()
    } catch (err) {
      setError("Error eliminando el miembro: " + (err.response?.data || err.message))
    }
    setShowDeleteModal(false)
    setDeleteMemberId(null)
  }

  const openEditModal = (member) => {
    setCurrentMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      ci: member.ci,
      phoneNumber: member.phoneNumber
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    setCurrentMember(null)
    setFormData({
      name: "",
      email: "",
      ci: "",
      phoneNumber: ""
    })
    setShowModal(true)
  }

  const handleViewLoans = (memberId) => {
    if (!memberId) {
      setError("ID de miembro inválido")
      return
    }
    navigate(`/dashboard/members/${memberId}/loans`)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Listado de Miembros</h1>

      <div className="flex justify-between mb-6 gap-4">
        <div className="flex-1 relative">
          <div className="flex items-center bg-zinc-800 rounded-lg px-4 py-3 border border-zinc-700">
            <Search className="text-zinc-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Buscar miembros..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none placeholder-zinc-500"
            />
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo Miembro
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-800/20 border border-red-700 rounded-md">
        <p className="text-red-400 text-sm">{error}</p>
      </div>}

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead className="bg-zinc-800 text-zinc-300 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">CI</th>
              <th className="px-6 py-3 text-left">Teléfono</th>
              <th className="px-6 py-3 text-left">Préstamos</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {filteredMembers.map((member) => (
              <tr key={member.memberId}>
                <td className="px-6 py-4">{member.name}</td>
                <td className="px-6 py-4 text-zinc-400">{member.email}</td>
                <td className="px-6 py-4">{member.ci}</td>
                <td className="px-6 py-4">{member.phoneNumber}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewLoans(member.memberId)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1"
                  >
                    <ArrowLeftRight size={14} /> Ver préstamos
                  </button>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="text-zinc-400 hover:text-orange-500"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteMemberId(member.memberId)
                      setShowDeleteModal(true)
                    }}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Crear y editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-700">
            <h2 className="text-xl font-bold mb-4">
              {currentMember ? "Editar Miembro" : "Nuevo Miembro"}
            </h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
  <label className="block text-sm text-zinc-300 mb-1">CI</label>
  <input
    type="text"
    required
    readOnly={!!currentMember} 
    className={`w-full border rounded-md px-4 py-2 focus:outline-none
      ${currentMember 
        ? "bg-zinc-700 cursor-not-allowed text-zinc-300 border-zinc-700" 
        : "bg-zinc-800 text-white border-zinc-700 focus:ring-2 focus:ring-orange-500"
      }`}
    value={formData.ci}
    onChange={(e) => {
      if (!currentMember) {
        setFormData({ ...formData, ci: e.target.value })
      }
    }}
  />
</div>

                
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-zinc-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md"
                >
                  {currentMember ? "Guardar Cambios" : "Crear Miembro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-700">
            <div className="text-center">
              <Trash2 className="mx-auto text-red-500 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">¿Eliminar miembro?</h3>
              <p className="text-zinc-400 mb-6">Esta acción no se puede deshacer</p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteMemberId(null)
                  }}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members