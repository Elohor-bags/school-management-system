import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Student Management',
      description: 'Comprehensive tracking of grades, attendance, and academic progress in real-time.',
      icon: <BookOpen className="text-academic-gold" size={32} />,
    },
    {
      title: 'Teacher Empowerment',
      description: 'Streamlined tools for grade entry, student analytics, and direct communication.',
      icon: <Users className="text-academic-gold" size={32} />,
    },
    {
      title: 'Parental Insight',
      description: 'A dedicated portal for parents to stay connected with their children\'s growth.',
      icon: <ShieldCheck className="text-academic-gold" size={32} />,
    },
  ];

  return (
    <div className="min-h-screen bg-academic-slate text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-academic-navy p-2 rounded-lg">
            <GraduationCap className="text-academic-gold" size={24} />
          </div>
          <span className="text-xl font-bold text-academic-navy tracking-tight">Academia Pro</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="primary" onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-8 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-academic-navy/10 text-academic-navy text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academic-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-academic-gold"></span>
            </span>
            Modern School Management
          </div>
          <h1 className="text-6xl font-black text-academic-navy leading-tight">
            Elevating Education <br />
            <span className="text-academic-gold">Through Innovation.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            A prestigious management system designed for forward-thinking institutions.
            Empowering students, teachers, and parents with a seamless digital experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" className="px-8 py-4 text-lg" onClick={() => navigate('/register')}>
              Start Your Journey <ArrowRight size={20} />
            </Button>
            <Button variant="ghost" className="px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> Secure Data
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> Real-time Sync
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> Cloud Based
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Decorative Background Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-academic-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-academic-navy/10 rounded-full blur-3xl"></div>

          {/* Main Illustration Placeholder */}
          <div className="relative z-10 aspect-square bg-white rounded-3xl shadow-glass border border-white/50 p-8 flex flex-col items-center justify-center text-center gap-6">
            <div className="bg-academic-navy/5 p-6 rounded-full">
              <GraduationCap size={120} className="text-academic-navy opacity-80" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-academic-navy">Academic Excellence</h3>
              <p className="text-slate-500">Managed with precision and prestige.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-8 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-academic-navy">All-in-One Ecosystem</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide a unified platform that bridges the gap between the classroom and home.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-gray-100 bg-academic-slate/30 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-academic-navy mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 bg-academic-navy text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-academic-gold" size={24} />
            <span className="text-lg font-bold tracking-tight">Academia Pro © 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-academic-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-academic-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-academic-gold transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
