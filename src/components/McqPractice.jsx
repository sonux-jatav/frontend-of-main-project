// frontend/src/components/McqPractice.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const McqPractice = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({}); // Individual results for each MCQ

  useEffect(() => {
    if (!token) return navigate('/login');
    axios
      .get('/api/mcq', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMcqs(res.data))
      .catch((err) => {
        if (err.response?.status === 401) dispatch(logout());
        console.error('Error fetching MCQs:', err);
      });
  }, [token, navigate, dispatch]);

  const handleSelect = (id, selected) => {
    setAnswers((prev) => ({ ...prev, [id]: selected }));
  };

  const handleSubmit = async (mcqId) => {
    if (!answers[mcqId]) return alert('Please select an answer for this MCQ');
    try {
      const res = await axios.post(
        '/api/mcq/submit',
        { answers: [{ id: mcqId, selected: answers[mcqId] }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults((prev) => ({ ...prev, [mcqId]: res.data }));
    } catch (err) {
      console.error('Error submitting MCQ:', err);
      alert('Submission failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6">MCQ Practice</h1>
      {mcqs.length === 0 ? (
        <p>No MCQs available.</p>
      ) : (
        mcqs.map((mcq) => (
          <div key={mcq._id} className="mb-6 p-4 border rounded-lg shadow-md">
            <p className="font-bold text-lg mb-2">{mcq.question}</p>
            {mcq.options.map((opt, idx) => (
              <label key={idx} className="block mb-1">
                <input
                  type="radio"
                  name={mcq._id}
                  value={opt}
                  onChange={(e) => handleSelect(mcq._id, e.target.value)}
                  checked={answers[mcq._id] === opt}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
            <button
              onClick={() => handleSubmit(mcq._id)}
              className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition"
              disabled={!answers[mcq._id]}
            >
              Submit
            </button>
            {results[mcq._id] && (
              <div className="mt-4 p-2 border rounded bg-gray-50">
                <p>Score: {results[mcq._id].score}/{results[mcq._id].total}</p>
                {results[mcq._id].explanations.map((exp, idx) => (
                  <div key={idx} className="mt-2">
                    <p>Correct: {exp.correct}</p>
                    <p>Your: {exp.yourAnswer}</p>
                    <p>Explanation: {exp.explanation}</p>
                    <p className={exp.correct ? 'text-green-600' : 'text-red-600'}>
                      {exp.correct ? 'Correct!' : 'Wrong!'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default McqPractice;