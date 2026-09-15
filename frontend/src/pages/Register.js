import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', role: 'student', first_name: '', last_name: '',
    student_id_number: '', grade_level: '', section: '', parent_id: '',
    phone_number: '', address: '', employee_id: '', specialization: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input type="text" className="w-full p-2 border rounded" required
              onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
          </div>
          <div>
            <label className="block mb-1">Last Name</label>
            <input type="text" className="w-full p-2 border rounded" required
              onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded" required
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" className="w-full p-2 border rounded" required
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Role</label>
          <select className="w-full p-2 border rounded" value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {formData.role === 'student' && (
          <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded">
            <div>
              <label className="block mb-1">Student ID Number</label>
              <input type="text" className="w-full p-2 border rounded" required
                onChange={(e) => setFormData({...formData, student_id_number: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Grade Level</label>
                <input type="number" className="w-full p-2 border rounded" required
                  onChange={(e) => setFormData({...formData, grade_level: e.target.value})} />
              </div>
              <div>
                <label className="block mb-1">Section</label>
                <input type="text" className="w-full p-2 border rounded" required
                  onChange={(e) => setFormData({...formData, section: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block mb-1">Parent ID (UUID)</label>
              <input type="text" className="w-full p-2 border rounded"
                onChange={(e) => setFormData({...formData, parent_id: e.target.value})} />
            </div>
          </div>
        )}

        {formData.role === 'parent' && (
          <div className="space-y-4 mb-6 p-4 bg-green-50 rounded">
            <div>
              <label className="block mb-1">Phone Number</label>
              <input type="text" className="w-full p-2 border rounded" required
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <input type="text" className="w-full p-2 border rounded" required
                onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>
        )}

        {formData.role === 'teacher' && (
          <div className="space-y-4 mb-6 p-4 bg-yellow-50 rounded">
            <div>
              <label className="block mb-1">Employee ID</label>
              <input type="text" className="w-full p-2 border rounded" required
                onChange={(e) => setFormData({...formData, employee_id: e.target.value})} />
            </div>
            <div>
              <label className="block mb-1">Specialization</label>
              <input type="text" className="w-full p-2 border rounded" required
                onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default Register;
