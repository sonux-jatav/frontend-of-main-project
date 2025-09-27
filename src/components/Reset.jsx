import { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const Reset = () => {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`/api/auth/reset/${token}`, { password })
      setMessage(res.data.message)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Reset Password</h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full p-2 mb-4 border" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Reset</button>
      </form>
    </div>
  )
}

export default Reset