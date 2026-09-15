import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, BookOpen, Calendar } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [attendanceMsg, setAttendanceMsg] = useState('');
  const [grades, setGrades] = useState([]);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/student`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const fetchGrades = useCallback(async () => {
    try {
      const res = await api.get('/grades');
      setGrades(res.data);
    } catch (err) { console.error(err); }
  }, [api]);

  const handleClock = async () => {
    try {
      const res = await api.post('/clock');
      setAttendanceMsg(res.data.message);
      setTimeout(() => setAttendanceMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.error || 'Clock failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-blue-800 text-white p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Student Portal</h1>
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 p-2 bg-blue-700 rounded cursor-pointer"><Clock size={20}/> Dashboard</div>
          <div className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded cursor-pointer"><BookOpen size={20}/> My Grades</div>
          <div className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded cursor-pointer"><Calendar size={20}/> Events</div>
        </div>
        <button onClick={logout} className="bg-red-600 p-2 rounded mt-auto">Logout</button>
      </nav>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Welcome, {user?.name}!</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Clock className="mx-auto mb-4 text-blue-600" size={48}/>
            <h3 className="text-xl font-semibold mb-4">Attendance</h3>
            <button onClick={handleClock} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
              Sign In / Out
            </button>
            {attendanceMsg && <p className="mt-4 text-green-600 font-medium">{attendanceMsg}</p>}
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-600"/> Academic Records
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2">Subject</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Max Score</th>
                  <th className="p-2">Term</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{g.subject}</td>
                    <td className="p-2 font-medium">{g.score}</td>
                    <td className="p-2">{g.max_score}</td>
                    <td className="p-2">{g.term}</td>
                  </tr>
                ))}
                {grades.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No records yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
