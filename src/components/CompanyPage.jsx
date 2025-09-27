// frontend/src/component/companyPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const CompanyPage = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('coding');
  const [code, setCode] = useState('// Write code here'); // Code state globally
  const [languageId, setLanguageId] = useState(63); // LanguageId globally, default to JS

  useEffect(() => {
    if (!token) return navigate('/login');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    let endpoint = '';
    if (selectedCategory === 'coding') endpoint = '/api/coding';
    else if (selectedCategory === 'mcq') endpoint = '/api/mcq';
    else if (selectedCategory === 'interview') endpoint = '/api/interview';

    axios
      .get(`${endpoint}?companyTag=${company}`, headers)
      .then((res) => setItems(res.data))
      .catch((err) => {
        if (err.response?.status === 401) dispatch(logout());
        console.error('Fetch error:', err);
      });
  }, [company, token, navigate, dispatch, selectedCategory]);

  const handleSelect = (id, selected) => {
    setAnswers((prev) => ({ ...prev, [id]: selected }));
  };

  const handleSubmit = async (itemId) => {
    const selectedItem = items.find(item => item._id === itemId);
    if (!selectedItem) return alert('Item not found');

    if (selectedCategory === 'coding') {
      if (!code.trim()) return alert('Please write code');
      try {
        const res = await axios.post(
          '/api/coding/submit',
          { problemId: itemId, code, languageId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults((prev) => ({ ...prev, [itemId]: res.data }));
      } catch (err) {
        console.error('Submit error:', err.response?.data?.error || err.message);
        alert('Submission failed: ' + (err.response?.data?.error || 'Server error'));
      }
    } else if (selectedCategory === 'mcq') {
      if (!answers[itemId]) return alert('Please select an answer');
      try {
        const res = await axios.post(
          '/api/mcq/submit',
          { answers: [{ id: itemId, selected: answers[itemId] }] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults((prev) => ({ ...prev, [itemId]: res.data }));
      } catch (err) {
        console.error('Submit error:', err.response?.data?.error || err.message);
        alert('Submission failed: ' + (err.response?.data?.error || 'Server error'));
      }
    }
  };

  const categories = [
    { id: 'coding', name: 'Coding Problems' },
    { id: 'mcq', name: 'MCQs' },
    { id: 'interview', name: 'Interview Questions' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{company} Preparation</h1>
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setAnswers({});
          setResults({});
          setCode('// Write code here'); // Reset code on category change
          setLanguageId(63); // Reset languageId on category change
        }}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id} className="p-2">
            {cat.name}
          </option>
        ))}
      </select>
      {items.length === 0 ? (
        <p className="text-gray-600">No {selectedCategory === 'mcq' ? 'MCQs' : selectedCategory === 'interview' ? 'interview questions' : 'coding problems'} available.</p>
      ) : selectedCategory === 'coding' ? (
        <div className="mb-6">
          {items.map((item) => (
            <div key={item._id} className="mb-6 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Examples:</h3>
              {item.examples?.map((ex, idx) => (
                <div key={idx} className="mb-2 text-gray-600">
                  <p>Input: {ex.input}</p>
                  <p>Output: {ex.output}</p>
                </div>
              ))}
              <select
                value={languageId}
                onChange={(e) => setLanguageId(Number(e.target.value))}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={63}>JavaScript</option>
                <option value={71}>Python</option>
                <option value={54}>C++</option>
              </select>
              <Editor
                height="30vh"
                language={languageId === 63 ? 'javascript' : languageId === 71 ? 'python' : 'cpp'}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                className="mb-4"
              />
              <button
                onClick={() => handleSubmit(item._id)}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200"
                disabled={!code.trim()}
              >
                Submit
              </button>
              {results[item._id] && (
                <div className="mt-4 p-2 border rounded bg-gray-50">
                  <p className="text-lg font-medium text-gray-800">Result: {results[item._id].result}</p>
                  {results[item._id].details.map((det, idx) => (
                    <div key={idx} className="p-2 border mt-2 rounded-lg">
                      <p className="text-gray-600">Test Input: {det.testInput}</p>
                      <p className="text-gray-600">Output: {det.output}</p>
                      <p className="text-gray-600">Stderr: {det.stderr}</p>
                      <p className="text-gray-600">Status: {det.status}</p>
                      <p className={det.status.includes('Accepted') ? 'text-green-600' : 'text-red-600'}>
                        {det.status.includes('Accepted') ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : selectedCategory === 'mcq' ? (
        <div className="mb-6">
          {items.map((item) => (
            <div key={item._id} className="mb-6 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.question}</h2>
              {item.options?.map((opt, idx) => (
                <label key={idx} className="block mb-1">
                  <input
                    type="radio"
                    name={item._id}
                    value={opt}
                    onChange={(e) => handleSelect(item._id, e.target.value)}
                    checked={answers[item._id] === opt}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
              <button
                onClick={() => handleSubmit(item._id)}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200 mt-2"
                disabled={!answers[item._id]}
              >
                Submit
              </button>
              {results[item._id] && (
                <div className="mt-4 p-2 border rounded bg-gray-50">
                  <p className="text-lg font-medium text-gray-800">Score: {results[item._id].score}/{results[item._id].total}</p>
                  {results[item._id].explanations.map((exp, idx) => (
                    <div key={idx} className="mt-2">
                      <p className="text-gray-600">Correct: {exp.correct}</p>
                      <p className="text-gray-600">Your Answer: {exp.yourAnswer}</p>
                      <p className="text-gray-600">Explanation: {exp.explanation}</p>
                      <p className={exp.correct ? 'text-green-600' : 'text-red-600'}>
                        {exp.correct ? 'Correct!' : 'Wrong!'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : selectedCategory === 'interview' ? (
        <div className="mb-6">
          {items.map((item) => (
            <div key={item._id} className="mb-6 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.question}</h2>
              <p className="text-gray-600 mb-2">Type: {item.type}</p>
              {/* Placeholder for interview prep */}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CompanyPage;