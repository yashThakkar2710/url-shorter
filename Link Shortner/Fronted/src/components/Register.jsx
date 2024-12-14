import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    userName: '',
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

    const { email, userName, password } = formData;

    if (!email || !userName || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/register',
        { email, userName, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setFormData({
          email: '',
          userName: '',
          password: '',
        });
        navigate('/home');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Create an Account
        </h1>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="mb-4">
  <label className="block text-sm font-medium mb-1.5 text-gray-300">
    Username
  </label>
  <input
    type="text"
    name="userName"
    value={formData.userName}
    onChange={handleInputChange}
    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-300 focus:text-white"
    placeholder="Your username"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium mb-1.5 text-gray-300">
    Email
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleInputChange}
    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-300 focus:text-white"
    placeholder="you@example.com"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium mb-1.5 text-gray-300">
    Password
  </label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-300 focus:text-white"
    placeholder="••••••••"
  />
</div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
