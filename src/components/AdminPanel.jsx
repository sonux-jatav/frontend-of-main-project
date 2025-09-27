import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  // Similar for coding, interview
  const [formData, setFormData] = useState({}); // For add/edit

  useEffect(() => {
    if (!token || role !== 'admin') return navigate('/dashboard');
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/mcq`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMcqs(res.data))
      // Get others
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) dispatch(logout());
        console.error('Error fetching MCQs:', err);
      });
  }, [token, role, navigate]);

  const handleAdd = async (type) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/${type}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list (e.g., call useEffect again or refetch data)
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/mcq`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setMcqs(res.data));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) dispatch(logout());
      console.error('Error adding item:', err);
    }
  };

  const handleEdit = async (type, id) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admin/${type}/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/mcq`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setMcqs(res.data));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) dispatch(logout());
      console.error('Error editing item:', err);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/mcq`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setMcqs(res.data));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // UI with forms for add/edit MCQ, Coding, Interview
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Admin Panel</h1>
      {/* Tabs or sections for MCQ, Coding, Interview */}
      <h2>MCQs</h2>
      {mcqs.map((mcq) => (
        <div key={mcq._id} className="flex justify-between p-2 border">
          <p>{mcq.question}</p>
          <button
            onClick={() => handleDelete('mcq', mcq._id)}
            className="bg-red-500 text-white p-1"
          >
            Delete
          </button>
          {/* Edit button opens form */}
          <button
            onClick={() => handleEdit('mcq', mcq._id)}
            className="bg-yellow-500 text-white p-1 ml-2"
          >
            Edit
          </button>
        </div>
      ))}
      {/* Form for add MCQ */}
      {/* Similar for others */}
    </div>
  );
};

export default AdminPanel;