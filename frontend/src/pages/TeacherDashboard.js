import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, TrendingUp, Bell, Plus, Search } from 'lucide-react';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [gradeForm, setGradeForm] = useState({ student_id: '', subject: '', score: '', max_score: '', term: 'Term 1' });
  const [notifForm, setNotifForm] = useState({ user_id: '', message: '' });

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/teacher`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  }, [api]);

  const fetchAnalytics = async (id) => {
    try {
      const res = await api.get(`/analytics/${id}`);
      setAnalytics(res.data);
      setSelectedStudent(id);
    } catch (err) { alert('No analytics found for this student'); }
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();
    try {
      await api.post('/grades', gradeForm);
      alert('Grade updated!');
      setGradeForm({ student_id: '', subject: '', score: '', max_score: '', term: 'Term 1' });
    } catch (err) { alert('Update failed'); }
  };

  const handleSendNotif = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', notifForm);
      alert('Notification sent!');
      setNotifForm({ user_id: '', message: '' });
    } catch (err) { alert('Send failed'); }
  };

  const filteredStudents = students.filter(s =>
    s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_id_number.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Teacher Portal</h1>
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 p-2 bg-indigo-800 rounded cursor-pointer"><Users size={20}/> Students</div>
          <div className="flex items-center gap-2 p-2 hover:bg-indigo-800 rounded cursor-pointer"><TrendingUp size={20}/> Analytics</div>
          <div className="flex items-center gap-2 p-2 hover:bg-indigo-800 rounded cursor-pointer"><Bell size={20}/> Communication</div>
        </div>
        <button onClick={logout} className="bg-red-600 p-2 rounded mt-auto">Logout</button>
      </nav>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Management Dashboard</h2>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><Users className="text-indigo-600"/> Student Directory</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 p-2 border rounded-full text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Grade/Sec</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(s => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-sm">{s.student_id_number}</td>
                      <td className="p-2">{s.first_name} {s.last_name}</td>
                      <td className="p-2">{s.grade_level}-{s.section}</td>
                      <td className="p-2">
                        <button onClick={() => fetchAnalytics(s.id)} className="text-indigo-600 hover:underline text-sm font-medium">View Rank</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedStudent && analytics && (
              <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200 shadow-sm">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Performance Analysis</h3>
                <div className="flex gap-8">
                  <div className="bg-white p-4 rounded shadow-sm text-center flex-1">
                    <span className="text-gray-500 block text-sm uppercase">Average Score</span>
                    <span className="text-3xl font-black text-indigo-600">{parseFloat(analytics.avg_score).toFixed(2)}%</span>
                  </div>
                  <div className="bg-white p-4 rounded shadow-sm text-center flex-1">
                    <span className="text-gray-500 block text-sm uppercase">Class Position</span>
                    <span className="text-3xl font-black text-indigo-600">#{analytics.position}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Plus className="text-indigo-600"/> Update Grade</h3>
              <form onSubmit={handleUpdateGrade} className="space-y-3">
                <input type="text" placeholder="Student ID" className="w-full p-2 border rounded" required
                  value={gradeForm.student_id} onChange={(e) => setGradeForm({...gradeForm, student_id: e.target.value})} />
                <input type="text" placeholder="Subject" className="w-full p-2 border rounded" required
                  value={gradeForm.subject} onChange={(e) => setGradeForm({...gradeForm, subject: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Score" className="w-full p-2 border rounded" required
                    value={gradeForm.score} onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})} />
                  <input type="number" placeholder="Max Score" className="w-full p-2 border rounded" required
                    value={gradeForm.max_score} onChange={(e) => setGradeForm({...gradeForm, max_score: e.target.value})} />
                </div>
                <select className="w-full p-2 border rounded" value={gradeForm.term}
                  onChange={(e) => setGradeForm({...gradeForm, term: e.target.value})}>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Update Record</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Bell className="text-indigo-600"/> Send Alert</h3>
              <form onSubmit={handleSendNotif} className="space-y-3">
                <input type="text" placeholder="User ID (UUID)" className="w-full p-2 border rounded" required
                  value={notifForm.user_id} onChange={(e) => setNotifForm({...notifForm, user_id: e.target.value})} />
                <textarea placeholder="Message..." className="w-full p-2 border rounded h-24" required
                  value={notifForm.message} onChange={(e) => setNotifForm({...notifForm, message: e.target.value})} />
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Notify User</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
