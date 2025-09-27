import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Progress = () => {
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    if (!token) return navigate('/login')
    axios.get('/api/progress', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubmissions(res.data))
      .catch(err => {
        if (err.response.status === 401) dispatch(logout())
      })
  }, [token, navigate, dispatch])

  const chartData = submissions.filter(s => s.problemType === 'mcq').map(s => ({ date: new Date(s.timestamp).toLocaleDateString(), score: s.score }))

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Progress</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <h2 className="text-2xl mt-6">Submissions</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Type</th>
            <th>Result/Score</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(sub => (
            <tr key={sub._id}>
              <td>{sub.problemType}</td>
              <td>{sub.score || sub.result}</td>
              <td>{sub.feedback?.substring(0, 50)}...</td>
              <td>{new Date(sub.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Progress