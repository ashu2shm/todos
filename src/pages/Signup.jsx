import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function Signup({ switchToLogin }) {
  const { signup } = useAuth()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // ✅ NEW (error message)

  // 🔍 SIMPLE VALIDATION
  const validate = () => {
    if (form.name.trim().length < 2) {
      return "Name must be at least 2 characters"
    }
    if (!form.email.includes("@")) {
      return "Please enter a valid email"
    }
    if (form.password.length < 8) {
      return "Password must be at least 8 characters"
    }
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      await signup(form)
    } catch (err) {
      // ✅ Appwrite-friendly messages
      if (err?.code === 409) {
        setError("User already exists with this email")
      } else {
        setError(err.message || "Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError("") // ✅ clear error while typing
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#172842] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a2333] p-6 rounded w-100"
      >
        <h2 className="text-xl mb-4 text-center">Sign Up</h2>

        {error && (
          <div className="mb-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 p-2 rounded text-slate-400 border border-slate-400 disabled:opacity-60"
          placeholder="Name"
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={loading}
          required
        />

        <input
          className="w-full mb-3 p-2 rounded text-slate-400 border border-slate-400 disabled:opacity-60"
          placeholder="Email"
          type="email"
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={loading}
          required
        />

        <input
          className="w-full mb-4 p-2 rounded text-slate-400 border border-slate-400 disabled:opacity-60"
          placeholder="Password (min 8 characters)"
          type="password"
          onChange={(e) => handleChange("password", e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Signing up..." : "Create Account"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={!loading ? switchToLogin : undefined}
            className={`cursor-pointer ${
              loading ? "text-gray-400" : "text-blue-400"
            }`}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  )
}

export default Signup