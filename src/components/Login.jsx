import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      dispatch(setCredentials({ token: res.data.token, role: res.data.role }))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-4 border" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-4 border" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Login</button>
        <p className="mt-4">No account? <Link to="/signup" className="text-blue-500">Signup</Link></p>
        <p><Link to="/forgot" className="text-blue-500">Forgot password?</Link></p>
      </form>
    </div>
  )
}

export default Login