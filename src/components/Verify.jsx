// frontend/src/components/Verify.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const Verify = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify/${token}`)
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response?.data?.error || 'Error'));
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-xl">{message}</p>
      <Link to="/login" className="ml-4 text-blue-500">
        Go to Login
      </Link>
    </div>
  );
};

export default Verify;