import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-orange-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-2">Finance Tracker</h1>
        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">Create a new account</p>

        {['name', 'email', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <button
          onClick={handleRegister}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-orange-500 font-medium cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
