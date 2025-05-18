"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!username || !password) {
      setError("Por favor, ingrese ambos campos.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("http://localhost:5087/api/auth/login", {
        username,
        password,
      })

      const token = response.data.token
      localStorage.setItem("token", token)

      navigate("/dashboard/books", { replace: true }) // CAMBIO AQUÍ
    } catch (err) {
      setError("Nombre de usuario o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-center mb-6">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
            <span className="text-white text-2xl text-center font-bold">Chime´s Library</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-center text-white">Administrator Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-zinc-700"></div>
            <div className="flex-grow h-px bg-zinc-700"></div>
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-md font-medium transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:from-red-600 hover:to-orange-600"
            }`}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
