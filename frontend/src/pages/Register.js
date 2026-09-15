import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-academic-slate p-6 py-12">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-glass bg-white">
        {/* Left side: Decorative/Imagery */}
        <div className="hidden lg:flex bg-academic-navy p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-academic-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-academic-gold/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <GraduationCap className="text-academic-gold" size={32} />
              <span className="text-2xl font-bold tracking-tight">Academia Pro</span>
            </div>
            <h1 className="text-5xl font-black leading-tight mb-6">
              Begin Your <br />
              <span className="text-academic-gold">Legacy.</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-md">
              Enter the portals of excellence. Register today to join our prestigious academic community.
            </p>
          </div>

          <div className="relative z-10 text-sm text-gray-400">
            © 2026 Academia Pro. All rights reserved.
          </div>
        </div>

        {/* Right side: Form */}
        <div className="p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl font-bold text-academic-navy">Create Account</h2>
              <p className="text-slate-500">Join our community of scholars and educators.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  required
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
                <Input
                  label="Last Name"
                  type="text"
                  required
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />

              <Input
                label="Password"
                type="password"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 ml-1">Your Role</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-academic-navy transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              {/* Role-specific fields */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 space-y-4">
                {formData.role === 'student' && (
                  <>
                    <Input label="Student ID Number" required onChange={(e) => setFormData({...formData, student_id_number: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Grade Level" type="number" required onChange={(e) => setFormData({...formData, grade_level: e.target.value})} />
                      <Input label="Section" required onChange={(e) => setFormData({...formData, section: e.target.value})} />
                    </div>
                    <Input label="Parent ID (UUID)" onChange={(e) => setFormData({...formData, parent_id: e.target.value})} />
                  </>
                )}

                {formData.role === 'parent' && (
                  <>
                    <Input label="Phone Number" required onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
                    <Input label="Address" required onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </>
                )}

                {formData.role === 'teacher' && (
                  <>
                    <Input label="Employee ID" required onChange={(e) => setFormData({...formData, employee_id: e.target.value})} />
                    <Input label="Specialization" required onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
                  </>
                )}
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 text-lg">
                Complete Registration
              </Button>
            </form>

            <p className="text-center text-slate-600">
              Already have an account? <a href="/login" className="text-academic-navy font-bold hover:underline">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
