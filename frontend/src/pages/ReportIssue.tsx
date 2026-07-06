import { useState, useEffect } from 'react';
import { Camera, MapPin, AlertCircle, CheckCircle2, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import { useNavigate } from 'react-router';
import LiveCamera from '../components/LiveCamera';

export default function ReportIssue() {
  const { register, handleSubmit } = useForm();
  const [locationState, setLocationState] = useState<'pending' | 'verifying' | 'verified' | 'error'>('pending');
  const [gpsData, setGpsData] = useState<{lat: number, lng: number, acc: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    verifyLocation();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const verifyLocation = () => {
    setLocationState('verifying');
    if (!navigator.geolocation) {
      setLocationState('error');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          acc: position.coords.accuracy
        });
        setLocationState('verified');
      },
      () => {
        setLocationState('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const onSubmit = async (data: any) => {
    if (locationState !== 'verified' || !gpsData) {
      alert("Please verify your GPS location first.");
      return;
    }

    if (!data.categoryId) {
      alert("Please select a category.");
      return;
    }

    if (!imageBase64) {
      alert("Please capture a live photo as proof.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId, 
        severity: data.severity,
        latitude: gpsData.lat,
        longitude: gpsData.lng,
        gpsAccuracy: gpsData.acc,
        imageBase64: imageBase64
      };

      const res = await api.post('/issues', payload);
      if (res.data.success) {
        navigate(`/report/${res.data.data.id}`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Report an Issue</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Help keep Tamil Nadu clean and safe by reporting civic issues.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* GPS Verification Card */}
        <div className={`p-4 rounded-xl border ${locationState === 'verified' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'glass'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${locationState === 'verified' ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">GPS Verification Required</h3>
                <p className="text-sm text-slate-500">We need your exact location to route this to authorities.</p>
              </div>
            </div>
            {locationState === 'verified' ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle2 className="w-5 h-5" /> Verified
              </div>
            ) : (
              <button 
                type="button"
                onClick={verifyLocation}
                disabled={locationState === 'verifying'}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                {locationState === 'verifying' ? 'Verifying...' : 'Verify GPS'}
              </button>
            )}
          </div>
          {locationState === 'error' && (
            <div className="mt-3 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Please enable location permissions in your browser.
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issue Title</label>
            <input 
              {...register("title", { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="E.g., Huge pothole on Main Road"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select {...register("categoryId", { required: true })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severity</label>
              <select {...register("severity")} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="LOW">Low - Not urgent</option>
                <option value="MEDIUM">Medium - Needs attention</option>
                <option value="HIGH">High - Dangerous</option>
                <option value="CRITICAL">Critical - Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea 
              {...register("description", { required: true })}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              placeholder="Provide more details about the issue..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Live Photo Evidence</label>
            {imageBase64 ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black aspect-video flex items-center justify-center group">
                <img src={imageBase64} alt="Captured proof" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => setImageBase64(null)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-lg transition-colors"
                  >
                    Remove Photo
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3" /> Captured
                </div>
              </div>
            ) : (
              <LiveCamera onCapture={(base64) => setImageBase64(base64)} />
            )}
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || locationState !== 'verified'}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          Submit Report & Earn Credits
        </button>
      </form>
    </div>
  );
}
