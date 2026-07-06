import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.success) {
        const payload = response.data.data;
        login({
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          roles: payload.roles,
        }, payload.token);
        navigate('/');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30 mb-4 transform rotate-12 hover:rotate-0 transition-all cursor-pointer">
            TN
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">TN Pulse</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Community Powered Local Issue Reporting</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input 
                {...register("email", { required: true })}
                type="email"
                className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="citizen@tn.gov.in"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot?</a>
              </div>
              <input 
                {...register("password", { required: true })}
                type="password"
                className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
