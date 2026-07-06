import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import IssueDetails from './pages/IssueDetails';
import InteractiveMap from './pages/InteractiveMap';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user) {
    const hasRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="feed" element={<Feed />} />
            <Route path="report" element={<ReportIssue />} />
            <Route path="report/:id" element={<IssueDetails />} />
            <Route path="map" element={<InteractiveMap />} />
            <Route path="profile" element={<Profile />} />
            
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']} />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
