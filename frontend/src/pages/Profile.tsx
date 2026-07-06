import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, Shield, Award, Star, Activity, Settings, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/me');
        if (res.data.success) {
          setStats(res.data.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;
  
  if (loading) return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Your Profile</h1>
        <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-primary-500/30">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center gap-1">
            <Award className="w-3 h-3" /> Level {Math.max(1, Math.floor((stats?.totalCredits || 0) / 100))}
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h2>
          <p className="text-slate-500">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            {user.roles?.map(role => (
              <span key={role} className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-bold uppercase">
                {role.replace('ROLE_', '')}
              </span>
            ))}
            {(stats?.trustScore || 0) >= 80 && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase">
                Verified Citizen
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl flex items-center justify-center mb-3">
            <Star className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalCredits || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Total Credits</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.trustScore || 0}%</p>
          <p className="text-sm text-slate-500 mt-1">Trust Score</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.communityImpactScore || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Impact Score</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Account Settings</h3>
        <ul className="space-y-3">
          {/* Preferences */}
          <li className="border dark:border-slate-800 rounded-xl overflow-hidden transition-all">
            <button 
              onClick={() => setOpenSection(openSection === 'pref' ? null : 'pref')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-5 h-5 ${openSection === 'pref' ? 'text-primary-500' : 'text-slate-400'}`} />
                <span className="font-medium text-slate-700 dark:text-slate-300">Preferences</span>
              </div>
              <span className={`text-slate-400 transition-transform duration-300 ${openSection === 'pref' ? 'rotate-90' : ''}`}>→</span>
            </button>
            {openSection === 'pref' && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive updates on your reported issues</p>
                  </div>
                  <div className="w-10 h-6 bg-primary-500 rounded-full flex items-center p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">SMS Alerts</p>
                    <p className="text-xs text-slate-500">Get text messages for emergencies</p>
                  </div>
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* Privacy & Security */}
          <li className="border dark:border-slate-800 rounded-xl overflow-hidden transition-all">
            <button 
              onClick={() => setOpenSection(openSection === 'privacy' ? null : 'privacy')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${openSection === 'privacy' ? 'text-primary-500' : 'text-slate-400'}`} />
                <span className="font-medium text-slate-700 dark:text-slate-300">Privacy & Security</span>
              </div>
              <span className={`text-slate-400 transition-transform duration-300 ${openSection === 'privacy' ? 'rotate-90' : ''}`}>→</span>
            </button>
            {openSection === 'privacy' && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Public Profile</p>
                    <p className="text-xs text-slate-500">Allow others to see your community rank</p>
                  </div>
                  <div className="w-10 h-6 bg-primary-500 rounded-full flex items-center p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Two-Factor Auth</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security</p>
                  </div>
                  <button className="text-xs font-bold text-primary-600 hover:text-primary-700">ENABLE</button>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
