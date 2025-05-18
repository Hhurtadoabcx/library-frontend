
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const MemberLoans = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        if (!id || isNaN(id)) {
          setError("ID de miembro inválido")
          setLoading(false)
          return
        }
        
        const response = await axios.get(`http://localhost:5087/api/Loans/member/${id}`)
        setLoans(response.data)
      } catch (err) {
        setError(err.response?.data || "Error al obtener préstamos")
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [id])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Préstamos del Miembro</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-md"
        >
          ← Volver al listado
        </button>
      </div>

      {loading && <p className="text-zinc-300">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && loans.length === 0 && (
        <p className="text-zinc-400">Este miembro no tiene préstamos registrados.</p>
      )}

      {!loading && loans.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-800 text-zinc-300 text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Libro</th>
                <th className="px-6 py-3 text-left">Préstamo</th>
                <th className="px-6 py-3 text-left">Devolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200">
              {loans.map((loan) => (
                <tr key={loan.loanId}>
                  <td className="px-6 py-4">{loan.title}</td>
                  <td className="px-6 py-4">
                    {new Date(loan.loanDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {loan.returnDate 
                      ? new Date(loan.returnDate).toLocaleDateString()
                      : <span className="text-red-400">Pendiente</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MemberLoans