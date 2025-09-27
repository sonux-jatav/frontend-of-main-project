// frontend/src/components/CodingPractice.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const CodingPractice = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('// Write code here');
  const [languageId, setLanguageId] = useState(63); // Default JS
  const [result, setResult] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(''); // Company filter

  useEffect(() => {
    if (!token) return navigate('/login');
    axios
      .get('/api/coding', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyTag: selectedCompany },
      })
      .then((res) => setProblems(res.data))
      .catch((err) => {
        if (err.response?.status === 401) dispatch(logout());
        console.error('Error fetching coding problems:', err);
      });
  }, [token, navigate, dispatch, selectedCompany]);

  const handleSubmit = async () => {
    if (!selectedProblem || !code.trim()) return alert('Please select a problem and write code');
    try {
      const res = await axios.post(
        '/api/coding/submit',
        { problemId: selectedProblem._id, code, languageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error('Submit error:', err.response?.data?.error || err.message);
      alert('Submission failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  const companies = ['All', 'IBM', 'TCS', 'Google', 'Microsoft', 'Facebook', 'Infosys'];

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Coding Practice</h1>
      <select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      >
        {companies.map((company) => (
          <option key={company} value={company === 'All' ? '' : company}>
            {company}
          </option>
        ))}
      </select>
      {problems.length === 0 ? (
        <p>No coding problems available.</p>
      ) : (
        problems.map((problem) => (
          <button
            key={problem._id}
            onClick={() => setSelectedProblem(problem)}
            className="block bg-blue-500 text-white p-2 mb-2 w-full"
          >
            {problem.title} ({problem.companyTag || 'General'})
          </button>
        ))
      )}
      {selectedProblem && (
        <div className="mt-4">
          <h2 className="text-2xl mb-2">{selectedProblem.title}</h2>
          <p className="mb-2">{selectedProblem.description}</p>
          <h3 className="text-xl mb-2">Examples:</h3>
          {selectedProblem.examples.map((ex, idx) => (
            <div key={idx} className="mb-2">
              <p>Input: {ex.input}</p>
              <p>Output: {ex.output}</p>
            </div>
          ))}
          <select
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            className="mb-4 p-2 border rounded"
          >
            <option value={63}>JavaScript</option>
            <option value={71}>Python</option>
            <option value={54}>C++</option>
          </select>
          <Editor
            height="50vh"
            language={languageId === 63 ? 'javascript' : languageId === 71 ? 'python' : 'cpp'}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 mt-4 rounded"
            disabled={!code.trim()}
          >
            Submit
          </button>
          {result && (
            <div className="mt-4">
              <p>Result: {result.result}</p>
              {result.details.map((det, idx) => (
                <div key={idx} className="p-2 border mt-2">
                  <p>Test Input: {det.testInput}</p>
                  <p>Output: {det.output}</p>
                  <p>Stderr: {det.stderr}</p>
                  <p>Status: {det.status}</p>
                  <p className={det.status.includes('Accepted') ? 'text-green-600' : 'text-red-600'}>
                    {det.status.includes('Accepted') ? 'Passed' : 'Failed'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingPractice;