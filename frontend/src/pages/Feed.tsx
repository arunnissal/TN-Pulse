import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, MessageSquare, Shield, Clock, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { motion } from 'framer-motion';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  priority: string;
  confirmationCount: number;
  commentCount: number;
  gpsVerificationLevel: number;
  heatScore: number;
  createdAt: string;
  locality: { name: string };
  district: { name: string };
  category: { name: string, icon: string };
}

export default function Feed() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      // Hardcoding API for now to avoid pagination state in this demo component
      const res = await api.get('/issues?page=0&size=20&sortBy=heatScore');
      if (res.data.success) {
        setIssues(res.data.data.content);
      }
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string, severity: string) => {
    if (priority === 'EMERGENCY' || priority === 'DISASTER') {
      return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse uppercase">{priority}</span>;
    }
    if (severity === 'CRITICAL') {
      return <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase">CRITICAL</span>;
    }
    if (severity === 'HIGH') {
      return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase">HIGH</span>;
    }
    return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase">{severity}</span>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'bg-blue-100 text-blue-700';
      case 'VERIFIED': return 'bg-indigo-100 text-indigo-700';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Community Feed</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover and verify civic issues around you.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search issues..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="p-2.5 glass rounded-full text-slate-600 hover:text-primary-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Clear!</h3>
            <p className="text-slate-500 mt-1">No active issues in your area. Great job, community!</p>
          </div>
        ) : (
          issues.map((issue, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={issue.id} 
              onClick={() => navigate(`/report/${issue.id}`)}
              className="glass rounded-2xl p-5 card-hover cursor-pointer flex flex-col md:flex-row gap-5"
            >
              <div className="w-full md:w-48 h-48 md:h-32 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                {/* Image Placeholder - In real app, load from Cloudinary URL in issue.images[0] */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-medium">No Image</div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase backdrop-blur-md bg-white/80 dark:bg-slate-900/80 ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">{issue.title}</h3>
                    <div className="flex-shrink-0">
                      {getPriorityBadge(issue.priority, issue.severity)}
                    </div>
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                    {issue.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" />
                      {issue.locality?.name}, {issue.district?.name}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      ⭐ {issue.gpsVerificationLevel}/5 GPS
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      🔥 Heat: {issue.heatScore}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                      <Shield className="w-4 h-4" /> {issue.confirmationCount}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                      <MessageSquare className="w-4 h-4" /> {issue.commentCount}
                    </span>
                  </div>
                  <span className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'Recently'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
