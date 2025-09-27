import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const InterviewPractice = () => {
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (!token) return navigate('/login')
    axios.get('/api/interview', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setQuestions(res.data))
      .catch(err => {
        if (err.response.status === 401) dispatch(logout())
      })
  }, [token, navigate, dispatch])

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/interview/submit', { questionId: selectedQuestion._id, answer }, { headers: { Authorization: `Bearer ${token}` } })
      setFeedback(res.data.feedback)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl mb-6">Interview Practice</h1>
        {questions.map(q => (
          <button key={q._id} onClick={() => setSelectedQuestion(q)} className="block bg-blue-500 text-white p-2 mb-2 w-full">{q.question}</button>
        ))}
      </div>
      {selectedQuestion && (
        <div className="w-full md:w-1/2">
          <h2>{selectedQuestion.question} ({selectedQuestion.type})</h2>
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full h-40 p-2 border" placeholder="Your answer"></textarea>
          <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 mt-4">Get Feedback</button>
          {feedback && <div className="mt-4 p-4 border"><pre>{feedback}</pre></div>}
        </div>
      )}
    </div>
  )
}

export default InterviewPractice