import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Dashboard = () => {
  const { token, role } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const companies = ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'IBM', 'Accenture']

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mb-4">Logout</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl mb-4">General Preparation</h2>
          <button onClick={() => navigate('/mcq')} className="block bg-blue-500 text-white p-2 mb-2 w-full">MCQs</button>
          <button onClick={() => navigate('/coding')} className="block bg-blue-500 text-white p-2 mb-2 w-full">Coding</button>
          <button onClick={() => navigate('/interview')} className="block bg-blue-500 text-white p-2 mb-2 w-full">Interview Q&A</button>
        </div>
        <div>
          <h2 className="text-2xl mb-4">Company-Wise Preparation</h2>
          {companies.map(company => (
            <button key={company} onClick={() => navigate(`/company/${company}`)} className="block bg-green-500 text-white p-2 mb-2 w-full">{company}</button>
          ))}
        </div>
      </div>
      <button onClick={() => navigate('/progress')} className="bg-purple-500 text-white p-2 mt-4 w-full md:w-auto">View Progress</button>
      {role === 'admin' && <button onClick={() => navigate('/admin')} className="bg-orange-500 text-white p-2 mt-4 ml-4 w-full md:w-auto">Admin Panel</button>}
    </div>
  )
}

export default Dashboard