import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      login(res.data.token, res.data.user);

      if (res.data.user.role === 'student') navigate('/student');
      else if (res.data.user.role === 'parent') navigate('/parent');
      else if (res.data.user.role === 'teacher') navigate('/teacher');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-academic-slate p-6">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-glass bg-white">
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
              Unlock Your <br />
              <span className="text-academic-gold">Academic Potential.</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-md">
              Join a prestigious community of learners and educators. Access your records, track progress, and stay connected.
            </p>
          </div>

          <div className="relative z-10 text-sm text-gray-400">
            © 2026 Academia Pro. All rights reserved.
          </div>
        </div>

        {/* Right side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl font-bold text-academic-navy">Welcome Back</h2>
              <p className="text-slate-500">Please enter your credentials to access your portal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-academic-navy focus:ring-academic-navy" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-academic-navy font-medium hover:underline">Forgot password?</a>
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 text-lg">
                Sign In
              </Button>
            </form>

            <p className="text-center text-slate-600">
              Don't have an account? <a href="/register" className="text-academic-navy font-bold hover:underline">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
