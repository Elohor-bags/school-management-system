import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, TrendingUp, Bell, Plus, Search, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

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

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  }, [api]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
            <LayoutDashboard size={20} /> Management
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <Users size={20} /> Student Directory
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <TrendingUp size={20} /> Class Analytics
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <Bell size={20} /> Communications
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
            <h2 className="text-4xl font-black text-academic-navy">Faculty Dashboard</h2>
            <p className="text-slate-500 mt-1">Welcome back, Professor {user?.name}. Your classroom is ready.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-soft border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-academic-navy flex items-center justify-center text-academic-gold font-bold">
              {user?.name?.[0] || 'T'}
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-academic-navy leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500">Faculty Member</p>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-academic-navy to-blue-900 text-white border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Students</p>
                <h3 className="text-3xl font-black mt-1">{students.length}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <Users size={24} />
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Active Courses</p>
                <h3 className="text-3xl font-black text-academic-navy mt-1">4</h3>
              </div>
              <div className="bg-academic-navy/5 p-3 rounded-2xl text-academic-navy">
                <BookOpen size={24} />
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Pending Alerts</p>
                <h3 className="text-3xl font-black text-academic-navy mt-1">12</h3>
              </div>
              <div className="bg-academic-gold/10 p-3 rounded-2xl text-academic-gold">
                <Bell size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <Card title="Student Directory" subtitle="Search and manage your current student roster">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    className="w-full pl-10 p-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-academic-navy transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-slate-400 text-sm uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="pb-4 font-semibold">ID</th>
                      <th className="pb-4 font-semibold">Name</th>
                      <th className="pb-4 font-semibold">Grade/Sec</th>
                      <th className="pb-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="group hover:bg-academic-slate transition-colors">
                        <td className="py-4 text-sm text-slate-500">{s.student_id_number}</td>
                        <td className="py-4 font-bold text-academic-navy group-hover:text-academic-gold transition-colors">{s.first_name} {s.last_name}</td>
                        <td className="py-4 text-slate-600">{s.grade_level}-{s.section}</td>
                        <td className="py-4">
                          <Button
                            variant="ghost"
                            className="text-xs py-1 px-3"
                            onClick={() => fetchAnalytics(s.id)}
                          >
                            View Rank
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {selectedStudent && analytics && (
              <Card className="bg-indigo-50 border-indigo-200" title="Performance Analysis">
                <div className="flex gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm text-center flex-1">
                    <span className="text-slate-500 block text-xs uppercase font-bold mb-2">Average Score</span>
                    <span className="text-4xl font-black text-academic-navy">{parseFloat(analytics.avg_score).toFixed(2)}%</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm text-center flex-1">
                    <span className="text-slate-500 block text-xs uppercase font-bold mb-2">Class Position</span>
                    <span className="text-4xl font-black text-academic-navy">#{analytics.position}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card title="Update Grade" subtitle="Assign marks to student records">
              <form onSubmit={handleUpdateGrade} className="space-y-4">
                <Input label="Student ID" required value={gradeForm.student_id} onChange={(e) => setGradeForm({...gradeForm, student_id: e.target.value})} />
                <Input label="Subject" required value={gradeForm.subject} onChange={(e) => setGradeForm({...gradeForm, subject: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Score" type="number" required value={gradeForm.score} onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})} />
                  <Input label="Max Score" type="number" required value={gradeForm.max_score} onChange={(e) => setGradeForm({...gradeForm, max_score: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 ml-1">Term</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-academic-navy transition-all bg-white/50 backdrop-blur-sm"
                    value={gradeForm.term}
                    onChange={(e) => setGradeForm({...gradeForm, term: e.target.value})}
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" className="w-full py-3">Update Record</Button>
              </form>
            </Card>

            <Card title="Send Alert" subtitle="Communicate with students or parents">
              <form onSubmit={handleSendNotif} className="space-y-4">
                <Input label="User ID (UUID)" required value={notifForm.user_id} onChange={(e) => setNotifForm({...notifForm, user_id: e.target.value})} />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 ml-1">Message</label>
                  <textarea
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-academic-navy transition-all bg-white/50 backdrop-blur-sm h-32"
                    placeholder="Type your alert here..."
                    required
                    value={notifForm.message}
                    onChange={(e) => setNotifForm({...notifForm, message: e.target.value})}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full py-3">Notify User</Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
