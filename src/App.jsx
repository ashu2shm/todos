import { useEffect, useState } from 'react'
import { TodoProvider } from './context'
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import authService from './services/authService'



import './App.css'
import { TodoForm, TodoItems } from './components'


function App() {

  // 🔑 AUTH STATE
  const { isAuthenticated, loading, logout } = useAuth()

  // 🔄 UI STATE
  const [showSignup, setShowSignup] = useState(false)

  // 📝 TODO STATE
  const [todos, setTodos] = useState([])

  // 🧠 TRACK AUTH TRANSITION (ONLY for UI reset)
  const [wasAuthenticated, setWasAuthenticated] = useState(false)

  const [user, setUser] = useState(null)
  const todoStorageKey = user ? `todoes_${user.$id}` : null

  // ---------------- TODO ACTIONS ----------------

  const addTodo = (todo) => {
    setTodos(prev => [{ id: Date.now(), ...todo }, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, ...todo } : t))
    )
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    )
  }

  // ---------------- EFFECTS ----------------

  // ✅ 1. LOAD TODOS AFTER LOGIN
useEffect(() => {
  if (!isAuthenticated || !user) return

  const storedTodos = JSON.parse(localStorage.getItem(todoStorageKey))
  if (storedTodos) {
    setTodos(storedTodos)
  }
}, [isAuthenticated, user])

  // ✅ 2. SAVE TODOS ON EVERY CHANGE (ADD / EDIT / DELETE)
 useEffect(() => {
  if (!isAuthenticated || !user) return

  localStorage.setItem(todoStorageKey, JSON.stringify(todos))
}, [todos, isAuthenticated, user])

  // ✅ 3. CLEAR UI ONLY ON LOGOUT (NOT STORAGE)
  useEffect(() => {
    if (wasAuthenticated && !isAuthenticated) {
      setTodos([]) 
      setUser(null)
    }

  

    if (isAuthenticated) {
      setWasAuthenticated(true)
    }
  }, [isAuthenticated, wasAuthenticated])

  useEffect(() => {
      if (!isAuthenticated) {
        setUser(null)
        return
      }

      authService.getCurrentUser()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          setUser(null)
        })
    }, [isAuthenticated])


  // ---------------- AUTH GUARDS ----------------

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>
  }

  if (!isAuthenticated) {
    return showSignup ? (
      <Signup switchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login switchToSignup={() => setShowSignup(true)} />
    )
  }

  // ---------------- APP UI ----------------

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      <div className="bg-[#172842] min-h-screen py-8">

        <div
          className="w-full max-w-2xl mx-auto rounded-lg px-4 pt-2 pb-8 text-white"
          style={{ backgroundColor: "#1a2333" }}
        >
          <div className='flex justify-between'>
            <div>
              Hello, {user?.name || user?.email}
            </div>

            <button
              onClick={logout}
              className="mb-4 px-3 py-1 bg-[oklch(0.42_0.16_25.15)] rounded text-white"
            >
              Logout
            </button>
          </div>


          <h1 className="text-2xl font-bold text-center mb-8 mt-2">
            Manage Your Todos
          </h1>

          <div className="mb-4">
            <TodoForm />
          </div>

          <div className="flex flex-wrap gap-y-3">
            {todos.map(todo => (
              <div key={todo.id} className="w-full">
                <TodoItems todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App