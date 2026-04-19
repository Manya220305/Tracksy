import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Chrome, 
  Apple, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  React.useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Send username field for login
        await login(formData.username, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await register(formData.username, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || (isLogin ? 'Invalid credentials' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-all duration-500 overflow-hidden">
      
      {/* --- LEFT SIDE: Visual Panel (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-auth-gradient">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-white">
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-3 mb-8 animate-in slide-in-from-left duration-700">
              <div className="p-3 glass-card rounded-2xl shadow-xl">
                <LayoutDashboard size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">Tracksy</h1>
            </div>

            <h2 className="text-5xl font-extrabold mb-6 leading-tight animate-in slide-in-from-left duration-700 delay-100">
              Track habits.<br />
              <span className="text-white/80">Stay consistent.</span><br />
              Achieve more.
            </h2>
            
            <p className="text-xl text-white/70 mb-12 animate-in slide-in-from-left duration-700 delay-200">
              Join thousands of high-achievers using Tracksy to build lasting habits and transform their lives.
            </p>

            {/* Illustration Container */}
            <div className="relative animate-in zoom-in duration-1000 delay-300">
               <img 
                 src="/assets/auth-illustration.png" 
                 alt="Productivity illustration" 
                 className="w-full rounded-3xl shadow-2xl animate-float transform hover:scale-105 transition-transform duration-700"
               />
               
               {/* Floating Stats or Badges (Extra Touch) */}
               <div className="absolute -top-6 -right-6 p-4 glass-card rounded-2xl shadow-lg border border-white/20 animate-bounce cursor-default">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-green-400" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Daily Streak</p>
                      <p className="text-xl font-black">15 Days</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="absolute bottom-10 left-12 right-12 flex justify-between items-center text-white/50 text-sm">
          <p>© 2026 Tracksy Inc.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Auth Form --- */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24 bg-surface relative">
        <div className="w-full max-w-md">
          
          {/* Mobile-only Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <LayoutDashboard size={32} className="text-primary" />
            <h1 className="text-3xl font-black tracking-tight text-foreground">Tracksy</h1>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-text-secondary">
              Start your consistency journey today 🚀
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-surface-raised rounded-2xl mb-8 border border-border text-center">
            <Link 
              to="/login"
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLogin 
                ? 'bg-surface text-primary shadow-sm border border-border' 
                : 'text-text-secondary hover:text-foreground'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/register"
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isLogin 
                ? 'bg-surface text-primary shadow-sm border border-border' 
                : 'text-text-secondary hover:text-foreground'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-secondary ml-1">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input 
                  name="username"
                  type="text" 
                  placeholder="Enter your username (e.g. manya_07)" 
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-semibold text-text-secondary ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-text-secondary">Password</label>
                {isLogin && (
                  <Link to="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                )}
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-300 delay-100">
                <label className="text-sm font-semibold text-text-secondary ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                  <input 
                    name="confirmPassword"
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm"
                    required
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-4 text-text-secondary font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-2xl hover:bg-surface-raised transition-colors duration-300 font-semibold shadow-sm group">
                <Chrome size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-2xl hover:bg-surface-raised transition-colors duration-300 font-semibold shadow-sm group">
                <Apple size={20} className="text-text-secondary group-hover:text-foreground transition-colors" />
                <span>Apple</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer for desktop mobile toggle - Small helper */}
        <div className="mt-auto pt-10 text-center">
           <p className="text-sm text-text-secondary">
             {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
             <Link 
               to={isLogin ? "/register" : "/login"}
               className="text-primary font-bold hover:underline"
             >
               {isLogin ? 'Sign up for free' : 'Log in here'}
             </Link>
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
