import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Verify from './components/Verify'
import Reset from './components/Reset'
import Dashboard from './components/Dashboard'
import McqPractice from './components/McqPractice'
import CodingPractice from './components/CodingPractice'
import InterviewPractice from './components/InterviewPractice'
import CompanyPage from './components/CompanyPage'
import Progress from './components/Progress'
import AdminPanel from './components/AdminPanel'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/reset/:token" element={<Reset />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mcq" element={<McqPractice />} />
        <Route path="/coding" element={<CodingPractice />} />
        <Route path="/interview" element={<InterviewPractice />} />
        <Route path="/company/:company" element={<CompanyPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App