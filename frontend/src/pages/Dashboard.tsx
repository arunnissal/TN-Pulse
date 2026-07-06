import { Shield, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import LocationSelector from '../components/LocationSelector';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [localityId, setLocalityId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [districtId, localityId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (districtId) params.append('districtId', districtId);
      if (localityId) params.append('localityId', localityId);
      
      const res = await api.get(`/issues/dashboard-stats?${params.toString()}`);
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Active Issues', value: stats?.activeIssues || 0, icon: <AlertTriangle className="text-orange-500" /> },
    { label: 'Resolved', value: stats?.resolvedIssues || 0, icon: <Shield className="text-green-500" /> },
    { label: 'Community Credits', value: stats?.communityCredits || 0, icon: <TrendingUp className="text-primary-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Platform Analytics & Trends</p>
        </div>
        
        <LocationSelector 
          selectedDistrictId={districtId}
          selectedLocalityId={localityId}
          onLocationChange={(dId, lId) => {
            setDistrictId(dId);
            setLocalityId(lId);
          }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass rounded-2xl p-6 card-hover relative overflow-hidden"
          >
            {loading && <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 animate-pulse z-10" />}
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Trending Issues</h2>
          
          <div className="space-y-4 relative min-h-[200px]">
            {loading && <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 animate-pulse z-10" />}
            
            {stats?.trendingIssues?.length === 0 ? (
              <div className="text-center p-8 glass rounded-2xl text-slate-500">No trending issues in this area.</div>
            ) : (
              stats?.trendingIssues?.map((issue: any) => (
                <div 
                  key={issue.id} 
                  onClick={() => navigate(`/report/${issue.id}`)}
                  className="glass rounded-2xl p-4 flex gap-4 card-hover cursor-pointer"
                >
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden">
                    {issue.images && issue.images.length > 0 ? (
                      <img src={issue.images[0].imageUrl} alt="issue" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><MapPin /></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        issue.priority === 'EMERGENCY' ? 'bg-red-100 text-red-700' : 
                        issue.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.priority}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3"/> {issue.locality?.name}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-1">{issue.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="text-primary-600 font-medium">{issue.confirmationCount} Confirmed</span>
                      <span>🔥 {issue.heatScore} Heat</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Hero of the Week 👑</h2>
          <div className="glass rounded-2xl p-6 text-center border-t-4 border-yellow-400 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 animate-pulse z-10" />}
            
            {stats?.heroOfTheWeek ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-1 mb-4">
                  {stats.heroOfTheWeek.user?.avatarUrl ? (
                    <img src={stats.heroOfTheWeek.user.avatarUrl} alt="Hero" className="w-full h-full rounded-full border-2 border-white object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full border-2 border-white bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-xl uppercase">
                      {stats.heroOfTheWeek.user?.firstName?.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                  {stats.heroOfTheWeek.user?.firstName} {stats.heroOfTheWeek.user?.lastName}
                </h3>
                <p className="text-slate-500 text-sm">Top Contributor</p>
                <div className="mt-4 pt-4 border-t dark:border-slate-700 flex justify-around">
                  <div>
                    <p className="text-xs text-slate-500">Weekly Credits</p>
                    <p className="font-bold text-primary-600">{stats.heroOfTheWeek.weeklyCredits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Credits</p>
                    <p className="font-bold text-primary-600">{stats.heroOfTheWeek.totalCredits}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-slate-500">No heroes yet this week.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
