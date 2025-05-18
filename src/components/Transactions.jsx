import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Book, User, Calendar, CheckCircle, ArrowLeftRight, Plus } from "lucide-react";

const Transactions = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [formData, setFormData] = useState({
    memberId: "",
    bookId: ""
  });

  const [books, setBooks] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [bookDropdownVisible, setBookDropdownVisible] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchBooks();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:5087/api/Loans");
      setLoans(response.data);
      handleSearch(searchQuery, statusFilter, response.data);
    } catch (err) {
      setError("Error cargando préstamos");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5087/api/Books"); // Ajusta URL si es necesario
      setBooks(response.data);
    } catch (err) {
      setError("Error cargando libros");
    }
  };

  const handleSearch = (query, status = statusFilter, data = loans) => {
    setSearchQuery(query);
    setStatusFilter(status);

    const filtered = data.filter((loan) => {
      const matchesQuery =
        loan.book.title.toLowerCase().includes(query.toLowerCase()) ||
        loan.member.name.toLowerCase().includes(query.toLowerCase()) ||
        (loan.returnDate ? "devuelto" : "prestado").includes(query.toLowerCase());

      const matchesStatus =
        status === "Todos" ||
        (status === "Prestado" && !loan.returnDate) ||
        (status === "Devuelto" && loan.returnDate);

      return matchesQuery && matchesStatus;
    });

    setFilteredLoans(filtered);
  };

  const handleReturn = async () => {
    try {
      await axios.post(`http://localhost:5087/api/Loans/return?loanId=${selectedLoanId}`);
      fetchLoans();
    } catch (err) {
      setError("Error registrando devolución");
    }
    setShowReturnModal(false);
    setSelectedLoanId(null);
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5087/api/Loans/loan?memberId=${formData.memberId}&bookId=${formData.bookId}`);
      setShowNewLoanModal(false);
      fetchLoans();
      setFormData({ memberId: "", bookId: "" });
      setBookSearch("");
    } catch (err) {
      setError("Error creando préstamo: " + (err.response?.data || err.message));
    }
  };

  const handleBookSearchChange = (value) => {
    setBookSearch(value);
    setFormData({ ...formData, bookId: "" }); // reset bookId si cambia búsqueda
    setBookDropdownVisible(true);
  };

  const selectBook = (book) => {
    setFormData({ ...formData, bookId: book.bookId });
    setBookSearch(book.title);
    setBookDropdownVisible(false);
  };

  // Conteos para los filtros con contadores
  const countPrestado = loans.filter(loan => !loan.returnDate).length;
  const countDevuelto = loans.filter(loan => loan.returnDate).length;
  const countTodos = loans.length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Préstamos y Devoluciones</h1>

      <div className="flex justify-between mb-6 gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <div className="flex items-center bg-zinc-800 rounded-lg px-4 py-3 border border-zinc-700">
            <Search className="text-zinc-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Buscar por libro, miembro o estado..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none placeholder-zinc-500"
            />
          </div>

          {/* Botones de filtro con contadores, justo debajo de la barra de búsqueda */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleSearch(searchQuery, "Todos")}
              className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                statusFilter === "Todos"
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Todos ({countTodos})
            </button>

            <button
              onClick={() => handleSearch(searchQuery, "Prestado")}
              className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                statusFilter === "Prestado"
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Prestado ({countPrestado})
            </button>

            <button
              onClick={() => handleSearch(searchQuery, "Devuelto")}
              className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                statusFilter === "Devuelto"
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Devuelto ({countDevuelto})
            </button>
          </div>
        </div>
      </div>

      {/* Botón Nuevo Prestamo abajo, como estaba */}
      <button
        onClick={() => setShowNewLoanModal(true)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mb-6"
      >
        <Plus size={18} /> Nuevo Préstamo
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-800/20 border border-red-700 rounded-md">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead className="bg-zinc-800 text-zinc-300 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Libro</th>
              <th className="px-6 py-3 text-left">Miembro</th>
              <th className="px-6 py-3 text-left">Préstamo</th>
              <th className="px-6 py-3 text-left">Devolución</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {[...filteredLoans]
              .sort((a, b) => {
                if (!a.returnDate && b.returnDate) return -1;
                if (a.returnDate && !b.returnDate) return 1;
                return 0;
              })
              .map((loan) => (
                <tr key={loan.loanId}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Book size={18} className="text-orange-500" />
                      {loan.book.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-blue-500" />
                      {loan.member.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(loan.loanDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {loan.returnDate ? (
                      new Date(loan.returnDate).toLocaleDateString()
                    ) : (
                      <span className="text-zinc-500">Pendiente</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        loan.returnDate ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {loan.returnDate ? "Devuelto" : "Prestado"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!loan.returnDate && (
                      <button
                        onClick={() => {
                          setSelectedLoanId(loan.loanId);
                          setShowReturnModal(true);
                        }}
                        className="text-zinc-400 hover:text-green-500"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Prestamo */}
      {showNewLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-700">
            <h2 className="text-xl font-bold mb-4">
              <ArrowLeftRight size={20} className="inline mr-2" />
              Nuevo Préstamo
            </h2>

            <form onSubmit={handleCreateLoan}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">ID Miembro</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.memberId}






ChatGPT Plus
php-template
Copiar
Editar
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-zinc-300 mb-1">Libro</label>
              <input
                type="text"
                placeholder="Buscar libro por título"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={bookSearch}
                onChange={(e) => handleBookSearchChange(e.target.value)}
                onFocus={() => setBookDropdownVisible(true)}
                autoComplete="off"
                required
              />
              {bookDropdownVisible && bookSearch && (
                <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-zinc-800 border border-zinc-700 rounded-md mt-1">
                  {books
                    .filter((b) =>
                      b.title.toLowerCase().includes(bookSearch.toLowerCase())
                    )
                    .map((book) => (
                      <li
                        key={book.bookId}
                        className="px-4 py-2 hover:bg-orange-600 cursor-pointer"
                        onClick={() => selectBook(book)}
                      >
                        {book.title}
                      </li>
                    ))}
                  {books.filter((b) =>
                    b.title.toLowerCase().includes(bookSearch.toLowerCase())
                  ).length === 0 && (
                    <li className="px-4 py-2 text-zinc-500">No se encontraron libros</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowNewLoanModal(false)}
              className="px-4 py-2 text-zinc-300 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.bookId || !formData.memberId}
              className={`px-4 py-2 rounded-md text-white ${
                formData.bookId && formData.memberId
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-orange-400 cursor-not-allowed"
              }`}
            >
              Registrar Préstamo
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* Modal Devolución */}
  {showReturnModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-sm border border-zinc-700">
        <h2 className="text-xl font-bold mb-4">Registrar Devolución</h2>
        <p className="mb-6">¿Está seguro que desea registrar la devolución?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowReturnModal(false)}
            className="px-4 py-2 text-zinc-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleReturn}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);
};

export default Transactions;