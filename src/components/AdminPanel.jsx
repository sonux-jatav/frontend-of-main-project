import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const { token, role } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mcqs, setMcqs] = useState([])
  // Similar for coding, interview
  const [formData, setFormData] = useState({}) // For add/edit

  useEffect(() => {
    if (!token || role !== 'admin') return navigate('/dashboard')
    axios.get('/api/mcq', { headers: { Authorization: `Bearer ${token}` } }).then(res => setMcqs(res.data))
    // Get others
  }, [token, role, navigate])

  const handleAdd = async (type) => {
    try {
      await axios.post(`/api/admin/${type}`, formData, { headers: { Authorization: `Bearer ${token}` } })
      // Refresh list
    } catch (err) {
      if (err.response.status === 401 || 403) dispatch(logout())
    }
  }

  const handleEdit = async (type, id) => {
    // Similar
  }

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`/api/admin/${type}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      // Refresh
    } catch (err) {
      console.error(err)
    }
  }

  // UI with forms for add/edit MCQ, Coding, Interview
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Admin Panel</h1>
      {/* Tabs or sections for MCQ, Coding, Interview */}
      <h2>MCQs</h2>
      {mcqs.map(mcq => (
        <div key={mcq._id} className="flex justify-between p-2 border">
          <p>{mcq.question}</p>
          <button onClick={() => handleDelete('mcq', mcq._id)} className="bg-red-500 text-white p-1">Delete</button>
          {/* Edit button opens form */}
        </div>
      ))}
      {/* Form for add MCQ */}
      {/* Similar for others */}
    </div>
  )
}

export default AdminPanel