import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Bell, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/parent`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchInitData = useCallback(async () => {
    try {
      const resChildren = await api.get('/children');
      const resEvents = await api.get('/events');
      const resNotifs = await api.get('/notifications');
      setChildren(resChildren.data);
      setEvents(resEvents.data);
      setNotifications(resNotifs.data);
    } catch (err) { console.error(err); }
  }, [api]);

  useEffect(() => {
    fetchInitData();
  }, [fetchInitData]);

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
            <LayoutDashboard size={20} /> Parent Portal
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <User size={20} /> My Children
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <Calendar size={20} /> Events
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white">
            <Bell size={20} /> Notifications
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
            <h2 className="text-4xl font-black text-academic-navy">Welcome, {user?.name}</h2>
            <p className="text-slate-500 mt-1">Stay connected with your children's academic progress.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-soft border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-academic-navy flex items-center justify-center text-academic-gold font-bold">
              {user?.name?.[0] || 'P'}
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-academic-navy leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500">Parent Portal</p>
            </div>
          </div>
        </header>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-academic-navy to-blue-900 text-white border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Registered Children</p>
                <h3 className="text-3xl font-black mt-1">{children.length}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <User size={24} />
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Upcoming Events</p>
                <h3 className="text-3xl font-black text-academic-navy mt-1">{events.length}</h3>
              </div>
              <div className="bg-academic-navy/5 p-3 rounded-2xl text-academic-navy">
                <Calendar size={24} />
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">New Notifications</p>
                <h3 className="text-3xl font-black text-academic-navy mt-1">{notifications.length}</h3>
              </div>
              <div className="bg-academic-gold/10 p-3 rounded-2xl text-academic-gold">
                <Bell size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Children List */}
          <Card className="col-span-1" title="Your Children">
            <div className="space-y-3">
              {children.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectChild(c)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${selectedChild?.id === c.id ? 'bg-academic-navy text-white shadow-md scale-105' : 'bg-academic-slate hover:bg-gray-100 text-academic-navy'}`}
                >
                  <div className="font-bold">{c.first_name} {c.last_name}</div>
                  <div className={`text-xs ${selectedChild?.id === c.id ? 'text-blue-200' : 'text-slate-500'}`}>Grade {c.grade_level}</div>
                </button>
              ))}
            </div>
          </Card>

          <div className="col-span-3 space-y-8">
            {selectedChild ? (
              <>
                <Card title="Attendance History" subtitle={`Tracking for ${selectedChild.first_name}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="text-slate-400 text-sm uppercase tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="pb-4 font-semibold">Date</th>
                          <th className="pb-4 font-semibold">Status</th>
                          <th className="pb-4 font-semibold">Check In</th>
                          <th className="pb-4 font-semibold">Check Out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {attendance.map((a, i) => (
                          <tr key={i} className="group hover:bg-academic-slate transition-colors">
                            <td className="py-4 text-sm">{a.date}</td>
                            <td className={`py-4 font-bold ${a.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>{a.status}</td>
                            <td className="py-4 text-sm text-slate-500">{a.check_in_time ? new Date(a.check_in_time).toLocaleTimeString() : '-'}</td>
                            <td className="py-4 text-sm text-slate-500">{a.check_out_time ? new Date(a.check_out_time).toLocaleTimeString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card title="Academic Performance" subtitle={`Current marks for ${selectedChild.first_name}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grades.map((g, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-academic-slate/30 flex justify-between items-center hover:shadow-md transition-all">
                        <span className="font-bold text-academic-navy">{g.subject}</span>
                        <span className="text-lg font-black text-academic-gold">{g.score} / {g.max_score}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center py-20 text-center space-y-4">
                <div className="bg-academic-navy/5 p-6 rounded-full text-academic-navy">
                  <User size={48} />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-xl font-bold text-academic-navy">No Child Selected</h3>
                  <p className="text-slate-500">Please select a child from the list on the left to view their academic records.</p>
                </div>
              </Card>
            )}

            <Card title="Upcoming School Events" subtitle="Stay informed about important dates">
              <div className="space-y-4">
                {events.map((e, i) => (
                  <div key={i} className="p-4 rounded-2xl border-l-4 border-academic-gold bg-academic-slate/50 flex justify-between items-center hover:bg-white transition-all group">
                    <div className="space-y-1">
                      <span className="font-bold text-academic-navy group-hover:text-academic-gold transition-colors">{e.title}</span>
                      <p className="text-sm text-slate-600">{e.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 uppercase">{new Date(e.event_date).toDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
