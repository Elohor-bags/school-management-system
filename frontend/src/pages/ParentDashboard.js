import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Bell, BookOpen } from 'lucide-react';

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api/parent',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = async () => {
    try {
      const resChildren = await api.get('/children');
      const resEvents = await api.get('/events');
      const resNotifs = await api.get('/notifications');
      setChildren(resChildren.data);
      setEvents(resEvents.data);
      setNotifications(resNotifs.data);
    } catch (err) { console.error(err); }
  };

  const selectChild = async (child) => {
    setSelectedChild(child);
    try {
      const resAtt = await api.get(`/children/${child.id}/attendance`);
      const resGrades = await api.get(`/children/${child.id}/grades`);
      setAttendance(resAtt.data);
      setGrades(resGrades.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-green-800 text-white p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Parent Portal</h1>
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 p-2 bg-green-700 rounded cursor-pointer"><User size={20}/> Children</div>
          <div className="flex items-center gap-2 p-2 hover:bg-green-700 rounded cursor-pointer"><Calendar size={20}/> Events</div>
          <div className="flex items-center gap-2 p-2 hover:bg-green-700 rounded cursor-pointer"><Bell size={20}/> Notifications</div>
        </div>
        <button onClick={logout} className="bg-red-600 p-2 rounded mt-auto">Logout</button>
      </nav>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Welcome, {user?.name}</h2>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
            <Bell className="text-yellow-600" size={20}/>
            <span className="font-bold">{notifications.length} New Alerts</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
            <h3 className="text-xl font-semibold mb-4">Your Children</h3>
            <div className="space-y-2">
              {children.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectChild(c)}
                  className={`w-full text-left p-3 rounded transition ${selectedChild?.id === c.id ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-gray-100'}`}
                >
                  {c.first_name} {c.last_name} <span className="text-xs text-gray-500 block">Grade {c.grade_level}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-3 space-y-6">
            {selectedChild ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Calendar className="text-green-600"/> Attendance History</h3>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr><th className="p-2">Date</th><th className="p-2">Status</th><th className="p-2">In</th><th className="p-2">Out</th></tr>
                    </thead>
                    <tbody>
                      {attendance.map((a, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{a.date}</td>
                          <td className={`p-2 font-bold ${a.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>{a.status}</td>
                          <td className="p-2 text-sm">{a.check_in_time ? new Date(a.check_in_time).toLocaleTimeString() : '-'}</td>
                          <td className="p-2 text-sm">{a.check_out_time ? new Date(a.check_out_time).toLocaleTimeString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><BookOpen className="text-green-600"/> Academic Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grades.map((g, i) => (
                      <div key={i} className="p-4 border rounded flex justify-between items-center">
                        <span className="font-medium">{g.subject}</span>
                        <span className="text-lg font-bold">{g.score} / {g.max_score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow-md text-center text-gray-500">
                Please select a child to view their records.
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.map((e, i) => (
                  <div key={i} className="p-3 border-l-4 border-green-600 bg-gray-50 flex justify-between">
                    <div>
                      <span className="font-bold">{e.title}</span>
                      <p className="text-sm text-gray-600">{e.description}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{new Date(e.event_date).toDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
