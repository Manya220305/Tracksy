import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserDetails } = useAuth(); // Assume we need to refresh user state

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (token) {
        // 1. Save token
        localStorage.setItem('token', token);
        
        try {
          // 2. Fetch authenticated user details to populate context if needed
          // Some auth contexts might handle this automatically, but let's be safe.
          if (fetchUserDetails) {
             await fetchUserDetails();
          }
          
          toast.success("Successfully logged in!");
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error("Failed to fetch user after OAuth:", error);
          toast.error("Failed to retrieve profile");
          navigate('/login', { replace: true });
        }
      } else {
        toast.error("Authentication failed. No token received.");
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, fetchUserDetails]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <h2 className="text-xl font-bold text-foreground">Completing sign in...</h2>
        <p className="text-text-secondary text-sm">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
