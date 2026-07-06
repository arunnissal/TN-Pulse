import { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin & Moderation Panel</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform overview and content moderation.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass rounded-2xl p-6 border-l-4 border-blue-500 card-hover">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500">Total Users</span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics?.totalUsers || 0}</p>
            </div>
            
            <div className="glass rounded-2xl p-6 border-l-4 border-orange-500 card-hover">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500">Active Issues</span>
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics?.totalIssues || 0}</p>
            </div>
            
            <div className="glass rounded-2xl p-6 border-l-4 border-green-500 card-hover">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500">Resolved</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics?.resolvedIssues || 0}</p>
            </div>
            
            <div className="glass rounded-2xl p-6 border-l-4 border-purple-500 card-hover">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500">Needs Review</span>
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics?.pendingModeration || 0}</p>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Moderation Queue</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search reported issues..."
                  className="w-full md:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Issue</th>
                    <th className="px-4 py-3">Reported By</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mocked Moderation Data */}
                  <tr className="border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">Fake Pothole Report</td>
                    <td className="px-4 py-4">Suresh K.</td>
                    <td className="px-4 py-4 text-red-500">Spam / Fake Info</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">PENDING</span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button className="text-green-600 hover:underline font-medium">Approve</button>
                      <button className="text-red-600 hover:underline font-medium">Reject</button>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">Inappropriate Comment</td>
                    <td className="px-4 py-4">Priya M.</td>
                    <td className="px-4 py-4 text-red-500">Harassment</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">PENDING</span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button className="text-green-600 hover:underline font-medium">Approve</button>
                      <button className="text-red-600 hover:underline font-medium">Reject</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
