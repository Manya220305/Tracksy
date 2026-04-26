import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import Planner from './pages/Planner';
import LandingPage from './pages/LandingPage';
import Settings from './pages/Settings';
import Community from './pages/Community';
import TermsAndConditions from './pages/TermsAndConditions';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <>
      <ToastContainer theme="dark" position="top-right" />
      <Router>
        <Routes>
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="planner" element={<Planner />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </>
  );
}

export default App;
