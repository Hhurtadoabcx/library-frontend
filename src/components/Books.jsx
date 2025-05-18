// src/pages/Books.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import { Search, Edit, Trash2, Plus } from "lucide-react"

const Books = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentBook, setCurrentBook] = useState(null)
  const [deleteBookId, setDeleteBookId] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    isAvailable: true
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5087/api/Books")
      setBooks(response.data)
      setFilteredBooks(response.data)
    } catch (err) {
      setError("Error cargando libros")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (query, status) => {
    let result = books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.isbn.includes(query)
    )

    if (status === "available") {
      result = result.filter(book => book.isAvailable)
    } else if (status === "borrowed") {
      result = result.filter(book => !book.isAvailable)
    }

    setFilteredBooks(result)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    applyFilters(query, filterStatus)
  }

  const handleFilterChange = (status) => {
    setFilterStatus(status)
    applyFilters(searchQuery, status)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        Title: formData.title,
        Author: formData.author,
        ISBN: formData.isbn,
        IsAvailable: formData.isAvailable,
        BookId: currentBook?.bookId || 0
      }

      if (currentBook) {
        await axios.put(`http://localhost:5087/api/Books/${currentBook.bookId}`, payload)
      } else {
        await axios.post("http://localhost:5087/api/Books", payload)
      }

      setShowModal(false)
      fetchBooks()
    } catch (err) {
      console.error("Error detallado:", err.response?.data)
      setError(err.response?.data?.title || "Error guardando el libro")
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5087/api/Books/${deleteBookId}`)
      fetchBooks()
    } catch (err) {
      setError("Error eliminando el libro")
    }
    setShowDeleteModal(false)
    setDeleteBookId(null)
  }

  const openEditModal = (book) => {
    setCurrentBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      isAvailable: book.isAvailable,
      bookId: book.bookId
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    setCurrentBook(null)
    setFormData({
      title: "",
      author: "",
      isbn: "",
      isAvailable: true
    })
    setShowModal(true)
  }

  // Contadores dinámicos por estado
  const allCount = books.length
  const availableCount = books.filter(book => book.isAvailable).length
  const borrowedCount = books.filter(book => !book.isAvailable).length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Listado de Libros</h1>

      {/* Buscar y agregar */}
      <div className="flex justify-between mb-4 gap-4">
        <div className="flex-1 relative">
          <div className="flex items-center bg-zinc-800 rounded-lg px-4 py-3 border border-zinc-700">
            <Search className="text-zinc-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Buscar libros..."
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
          <Plus size={18} /> Nuevo Libro
        </button>
      </div>

      {/* Filtros por disponibilidad con contadores */}
      <div className="mb-6 flex gap-3">
        {[
          { status: "all", label: "Todos", count: allCount },
          { status: "available", label: "Disponibles", count: borrowedCount },
          { status: "borrowed", label: "Prestados", count: availableCount }
        ].map(({ status, label, count }) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-4 py-2 rounded-md border border-zinc-700 transition-colors ${
              filterStatus === status
                ? "bg-orange-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabla de libros */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead className="bg-zinc-800 text-zinc-300 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Título</th>
              <th className="px-6 py-3 text-left">Autor</th>
              <th className="px-6 py-3 text-left">ISBN</th>
              <th className="px-6 py-3 text-left">Disponible</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {filteredBooks.map((book) => (
              <tr key={book.bookId}>
                <td className="px-6 py-4">{book.title}</td>
                <td className="px-6 py-4">{book.author}</td>
                <td className="px-6 py-4 text-zinc-400">{book.isbn}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.isAvailable 
                      ? "bg-green-600 text-white" 
                      : "bg-red-600 text-white"
                  }`}>
                    {book.isAvailable ? "Disponible" : "Prestado"}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(book)}
                    className="text-zinc-400 hover:text-orange-500"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteBookId(book.bookId)
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

      {/* Crear/editar modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-700">
            <h2 className="text-xl font-bold mb-4">
              {currentBook ? "Editar Libro" : "Nuevo Libro"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Autor</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">ISBN</label>
                  <input
                    type="text"
                    required
                    disabled={!!currentBook}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none ${
                      currentBook 
                        ? "bg-zinc-700 cursor-not-allowed text-zinc-400 border-zinc-700" 
                        : "bg-zinc-800 text-white border-zinc-700 focus:ring-2 focus:ring-orange-500"
                    }`}
                    value={formData.isbn}
                    onChange={(e) => !currentBook && setFormData({...formData, isbn: e.target.value})}
                    readOnly={!!currentBook}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 bg-zinc-800 border-zinc-700 rounded focus:ring-orange-500"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                  <label className="text-sm text-zinc-300">Disponible</label>
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
                  {currentBook ? "Guardar Cambios" : "Crear Libro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmar eliminación modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-700">
            <div className="text-center">
              <Trash2 className="mx-auto text-red-500 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">¿Eliminar libro?</h3>
              <p className="text-zinc-400 mb-6">Esta acción no se puede deshacer</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteBookId(null)
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

export default Books
