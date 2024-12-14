import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const { email, password } = formData;
  
    if (!email || !password) {
      setError('Both fields are required');
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        console.log('Logged in successfully:', response.data);
  
        // Store user or tokens if needed
        const { user, accessToken } = response.data.data;
  
        // Optionally save tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
  
        // Navigate to home page
        navigate('/home');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('An error occurred during login:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/" className="text-purple-400 hover:text-purple-300 transition">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
