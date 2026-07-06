import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, MessageSquare, Shield, Clock, CheckCircle2, User, Share2, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const res = await api.get(`/issues/${id}`);
      if (res.data.success) {
        setIssue(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch issue", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await api.post(`/issues/${id}/confirm`);
      fetchIssue(); // reload data
    } catch (error) {
      alert("Failed to confirm issue. You might have already confirmed it.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading details...</div>;
  if (!issue) return <div className="text-center py-20 text-slate-500">Issue not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header section with back button could go here */}
      <button onClick={() => navigate(-1)} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors mb-4">
        ← Back to Feed
      </button>

      <div className="glass rounded-3xl overflow-hidden">
        {/* Main Image */}
        <div className="w-full h-64 md:h-96 bg-slate-200 dark:bg-slate-800 relative">
           <div className="absolute inset-0 flex items-center justify-center text-slate-400">No Image Uploaded</div>
           <div className="absolute top-4 right-4 flex gap-2">
             <button className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm hover:scale-105 transition-transform text-slate-700 dark:text-white">
               <Share2 className="w-4 h-4" />
             </button>
           </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">{issue.status}</span>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">{issue.priority}</span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> GPS Verified ({issue.gpsVerificationLevel}★)
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{issue.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary-500" />
              {issue.locality?.name}, {issue.district?.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'Unknown'}
            </span>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {issue.description}
            </p>
          </div>

          {/* Action Bar */}
          <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{issue.confirmationCount}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Confirmations</p>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{issue.reliabilityScore}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Reliability Score</p>
              </div>
            </div>
            
            <button 
              onClick={handleConfirm}
              disabled={confirming || issue.reporter?.id === currentUser?.id}
              className="w-full md:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {issue.reporter?.id === currentUser?.id ? "Your Report" : confirming ? "Confirming..." : "Confirm Issue"}
            </button>
          </div>
          
          {/* Reporter Info */}
          <div className="mt-8 flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Reported by</p>
              <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {issue.reporter?.firstName} {issue.reporter?.lastName}
                <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-[10px] uppercase font-bold tracking-wider">Trusted</span>
              </p>
            </div>
            <div className="ml-auto">
              <button className="text-sm font-medium text-slate-500 flex items-center gap-1 hover:text-red-500 transition-colors">
                <AlertTriangle className="w-4 h-4" /> Report
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Comments Section placeholder */}
      <div className="glass rounded-3xl p-6 md:p-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Comments ({issue.commentCount})
        </h3>
        <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          Be the first to comment on this issue.
        </div>
      </div>
    </div>
  );
}
