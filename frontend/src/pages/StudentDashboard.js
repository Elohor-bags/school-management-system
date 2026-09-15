import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, BookOpen, Calendar, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [attendanceMsg, setAttendanceMsg] = useState('');
  const [grades, setGrades] = useState([]);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/student`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchGrades = useCallback(async () => {
    try {
      const res = await api.get('/grades');
      setGrades(res.data);
    } catch (err) { console.error(err); }
  }, [api]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const handleClock = async () => {
    try {
      const res = await api.post('/clock');
      setAttendanceMsg(res.data.message);
      setTimeout(() => setAttendanceMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.error || 'Clock failed'); }
  };

  return (
    <div className="min-h-screen bg-academic-slate flex">
      {/* Sidebar */}
      <nav className="w-72 bg-academic-navy text-white p-6 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-academic-gold p-2 rounded-lg">
            <GraduationCap className="text-academic-navy" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Academia Pro</span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-academic-gold text-academic-navy rounded-xl font-bold cursor-pointer shadow-md">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <BookOpen size={20} /> My Grades
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <Calendar size={20} /> Events
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className="mt-auto justify-start text-gray-300 hover:text-white border-white/10 hover:bg-white/10"
        >
          <LogOut size={20} /> Logout
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-academic-navy">Welcome, {user?.name}!</h2>
            <p className="text-slate-500 mt-1">Your academic journey is unfolding. Keep pushing boundaries.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-soft border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-academic-navy flex items-center justify-center text-academic-gold font-bold">
              {user?.name?.[0] || 'S'}
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-academic-navy leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>
        </header>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-academic-navy to-blue-900 text-white border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Average Score</p>
                <h3 className="text-3xl font-black mt-1">
                  {grades.length > 0
                    ? Math.round(grades.reduce((acc, g) => acc + Number(g.score), 0) / grades.length) + '%'
                    : 'N/A'}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <BookOpen size={24} />
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Courses Enrolled</p>
                <h3 className="text-3xl font-black text-academic-navy mt-1">
                  {new Set(grades.map(g => g.subject)).size || 0}
                </h3>
              </div>
              <div className="bg-academic-navy/5 p-3 rounded-2xl text-academic-navy">
                <GraduationCap size={24} />
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Attendance Status</p>
                <h3 className="text-3xl font-black text-academic-navy mt-1">Active</h3>
              </div>
              <div className="bg-academic-gold/10 p-3 rounded-2xl text-academic-gold">
                <Clock size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Card */}
          <Card className="text-center space-y-6 py-8">
            <div className="bg-academic-navy/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-academic-navy">
              <Clock size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-academic-navy">Daily Attendance</h3>
              <p className="text-slate-500 text-sm px-6">Clock in and out to maintain your academic record.</p>
            </div>
            <Button
              onClick={handleClock}
              variant="primary"
              className="w-full py-4 text-lg rounded-2xl"
            >
              Sign In / Out
            </Button>
            {attendanceMsg && (
              <div className="p-3 rounded-xl bg-green-50 text-green-600 font-medium text-sm animate-pulse">
                {attendanceMsg}
              </div>
            )}
          </Card>

          {/* Academic Records Table */}
          <Card className="lg:col-span-2" title="Academic Records" subtitle="Your latest performance across all subjects">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-4 font-semibold">Subject</th>
                    <th className="pb-4 font-semibold">Score</th>
                    <th className="pb-4 font-semibold">Max Score</th>
                    <th className="pb-4 font-semibold">Term</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {grades.map((g, i) => (
                    <tr key={i} className="group hover:bg-academic-slate transition-colors">
                      <td className="py-4 font-bold text-academic-navy group-hover:text-academic-gold transition-colors">{g.subject}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-lg bg-academic-navy/5 text-academic-navy font-bold">
                          {g.score}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500">{g.max_score}</td>
                      <td className="py-4 text-slate-500">{g.term}</td>
                    </tr>
                  ))}
                  {grades.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400 italic">
                        No academic records found. Keep studying!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
