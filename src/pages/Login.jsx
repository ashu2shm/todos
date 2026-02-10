import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function Login({ switchToSignup }) {
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // ✅ NEW

  // 🔍 SIMPLE VALIDATION
  // const validate = () => {
  //   if (!email.includes("@")) {
  //     return "Please enter a valid email"
  //   }
  //   if (password.length < 8) {
  //     return "Password must be at least 8 characters"
  //   }
  //   return ""
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // const validationError = validate()
    // if (validationError) {
    //   setError(validationError)
    //   return
    // }

    setLoading(true)
    setError("")

    try {
      await login({ email, password })
    } catch (err) {
      // ✅ Friendly messages
      if (err?.code === 401) {
        setError("Invalid email or password")
      } else if (err?.code === 404) {
        setError("User not found")
      } else {
        setError(err.message || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#172842] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a2333] p-6 rounded w-100"
      >
        <h2 className="text-xl mb-4 text-center">Login</h2>

        {/* ✅ ERROR MESSAGE */}
        {error && (
          <div className="mb-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 p-2 rounded text-slate-400 border border-slate-400 disabled:opacity-60"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError("") // ✅ clear error while typing
          }}
          disabled={loading}
          required
        />

        <input
          className="w-full mb-4 p-2 rounded text-slate-400 border border-slate-400 disabled:opacity-60"
          placeholder="Password (min 8 characters)"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError("") // ✅ clear error while typing
          }}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-2 rounded transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <span
            onClick={!loading ? switchToSignup : undefined}
            className={`cursor-pointer ${
              loading ? "text-gray-400" : "text-blue-400"
            }`}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login
