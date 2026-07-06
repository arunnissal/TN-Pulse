import { Outlet, Link, useLocation } from 'react-router';
import { Home, PlusCircle, User, Map as MapIcon, Bell, List, Settings, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const location = useLocation();
  const user = useAuthStore(state => state.user);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Feed', path: '/feed', icon: <List className="w-5 h-5" /> },
    { name: 'Map', path: '/map', icon: <MapIcon className="w-5 h-5" /> },
    { name: 'Report', path: '/report', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  if (user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MODERATOR')) {
    navItems.push({ name: 'Admin', path: '/admin', icon: <Settings className="w-5 h-5" /> });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 glass border-r h-screen sticky top-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
            TN
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">TN Pulse</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative z-10">
        <header className="h-16 glass border-b sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold md:hidden">TN Pulse</h2>
          <div className="hidden md:block" /> {/* Spacer */}
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              <div className="dark:hidden"><Moon className="w-5 h-5" /></div>
              <div className="hidden dark:block"><Sun className="w-5 h-5" /></div>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative text-slate-600 dark:text-slate-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 text-white flex items-center justify-center font-medium shadow-sm hover:ring-2 hover:ring-primary-300 transition-all cursor-pointer uppercase">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            </Link>
          </div>
        </header>
        
        <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full glass border-t flex justify-around p-3 z-50 pb-safe">
        {navItems.filter(i => i.name !== 'Admin').map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 ${
              location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
