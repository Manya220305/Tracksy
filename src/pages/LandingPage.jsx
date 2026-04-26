import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  BarChart3,
  Calendar,
  Trophy,
  Zap,
  Target,
  Users,
  Award
} from 'lucide-react';

const HERO_SLIDES = [
  {
    image: "https://lh3.googleusercontent.com/aida/ADBb0ui8WEaV4F97S-jw0SiZ01zg9iU_IYaVQUwMwpslh8i8d9YvhorJIYvvMvkZU6yyS0eLAc-ISByj4mvLhFM6KEPeG-gAxBILhiuNIRiXK3fhiLxRbkBAM9ADBGExz018K8PcOLh-DMiUkiWXv4iM3JpXOdC0C54xzOB_2cqvLVw8w5YTZN_Eh5Ecwdj8qn2lxOn2ENz-69hJiP4l48eui4lDHWqwMCOyXL0NAytyUHHLaTWVx9hkaioNvGYv",
    title: "The Midnight Architect",
    value: "Professional Focus",
    icon: <Target size={24} className="text-indigo-400" />
  },
  {
    image: "https://i.pinimg.com/1200x/49/0c/f8/490cf84de34bc8175bc3aede91d2c457.jpg",
    title: "Editorial Precision",
    value: "SaaS Performance",
    icon: <Zap size={24} className="text-blue-400" />
  }
];

const LandingPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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

  // Scroll Fade-in logic
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      
      {/* --- SECTION 1: HERO (AUTH + BRANDING) --- */}
      <section id="hero" className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Branding (Marketing) */}
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-[#0B1326] via-[#131B2E] to-[#171F33]">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] animate-float" style={{ animationDelay: '-3s' }}></div>
          </div>

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
                Build better habits and manage your daily tasks with a clean and powerful system designed for high-achievers.
              </p>

              <div className="relative animate-in zoom-in duration-1000 delay-300 h-[300px] sm:h-[400px]">
                 {/* Rotating Image Container */}
                 <div className="absolute inset-0 bg-white/10 rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                    {HERO_SLIDES.map((slide, idx) => (
                      <div 
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          currentSlide === idx ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img 
                          src={slide.image} 
                          alt={slide.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                    ))}
                 </div>
                 
                 {/* Floating Stat Card (Bottom Right) */}
                 <div className="absolute bottom-6 right-6 p-5 glass-card rounded-2xl shadow-lg border border-white/20 animate-in slide-in-from-right duration-500 overflow-hidden min-w-[180px]">
                    <div className="flex items-center gap-4 transition-all duration-500">
                      <div className="p-2.5 bg-white/10 rounded-xl">
                        {HERO_SLIDES[currentSlide].icon}
                      </div>
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" key={currentSlide}>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-0.5">{HERO_SLIDES[currentSlide].title}</p>
                        <p className="text-2xl font-black text-white">{HERO_SLIDES[currentSlide].value}</p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-primary transition-all duration-[4000ms] ease-linear"
                         style={{ 
                           width: '100%', 
                           transform: `translateX(-${100 - (100 / HERO_SLIDES.length)}%)` // This is just for visual fun
                         }}
                         key={currentSlide}
                       ></div>
                    </div>
                 </div>

                 {/* Slide Indicators */}
                 <div className="absolute bottom-6 left-6 flex gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
                        }`}
                      />
                    ))}
                 </div>
              </div>

              <div className="mt-16 flex items-center gap-4 text-white/60 text-sm animate-in slide-in-from-bottom-4 duration-700 delay-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-surface flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p>Join <span className="text-white font-bold">10,000+</span> users building better habits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-surface relative z-20 perspective-1000">
          
          {/* 3D Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[10%] right-[10%] w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-float"></div>
             <div className="absolute bottom-[10%] left-[10%] w-48 h-48 bg-slate-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-indigo-500/5 to-transparent opacity-50"></div>
          </div>

          <div 
            className="w-full max-w-md tilt-card preserve-3d"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              boxShadow: tilt.x !== 0 || tilt.y !== 0 
                ? `${-tilt.y * 2}px ${tilt.x * 2}px 30px rgba(0,0,0,0.15)` 
                : '0 10px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            
            {/* Mobile-only Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <LayoutDashboard size={32} className="text-primary" />
              <h1 className="text-3xl font-black tracking-tight text-foreground">Tracksy</h1>
            </div>

            <div className="text-center mb-10 overflow-hidden">
              <h3 className="text-3xl font-bold text-foreground mb-2 animate-in slide-in-from-top duration-500">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h3>
              <p className="text-text-secondary animate-in slide-in-from-top duration-500 delay-75">
                {isLogin ? 'Continue your consistency journey 🚀' : 'Start your consistency journey today 🚀'}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex p-1 bg-surface-raised rounded-xl mb-8 border border-border/50 text-center overflow-hidden animate-in fade-in duration-700">
              <Link 
                to="/login"
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isLogin 
                  ? 'bg-surface text-primary shadow-sm border border-border/50' 
                  : 'text-text-secondary hover:text-foreground'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !isLogin 
                  ? 'bg-surface text-primary shadow-sm border border-border/50' 
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

            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-1000 delay-200">
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
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm hover:shadow-md focus:translate-z-2"
                    style={{ transform: 'translateZ(10px)' }}
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
                      className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm hover:shadow-md focus:translate-z-2"
                      style={{ transform: 'translateZ(10px)' }}
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
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm hover:shadow-md focus:translate-z-2"
                    style={{ transform: 'translateZ(10px)' }}
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
                      className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 font-medium placeholder:text-text-secondary/50 shadow-sm hover:shadow-md focus:translate-z-2"
                      style={{ transform: 'translateZ(10px)' }}
                      required
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-xl shadow-indigo-900/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 hover:translate-y-[-2px]"
                style={{ transform: 'translateZ(20px)' }}
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
            <div className="mt-10 animate-in fade-in duration-1000 delay-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-4 text-text-secondary font-bold tracking-widest">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => toast.info('Google Sign-In coming soon! 🚀')}
                  className="flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-2xl hover:bg-surface-raised transition-colors duration-300 font-semibold shadow-sm group"
                >
                  <Chrome size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Apple Sign-In coming soon! 🍎')}
                  className="flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-2xl hover:bg-surface-raised transition-colors duration-300 font-semibold shadow-sm group"
                >
                  <Apple size={20} className="text-text-secondary group-hover:text-foreground transition-colors" />
                  <span>Apple</span>
                </button>
              </div>
            </div>

            <div className="mt-10 text-center animate-in fade-in duration-1000 delay-400">
               <p className="text-sm text-text-secondary">
                 {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                 <Link 
                   to={isLogin ? "/register" : "/login"}
                   className="text-primary font-bold hover:underline transition-colors"
                 >
                   {isLogin ? 'Sign up for free' : 'Log in here'}
                 </Link>
               </p>
            </div>
          </div>

          <div className="mt-auto pt-10 text-text-secondary/40 text-xs flex gap-6">
             <a href="#features" className="hover:text-primary transition-colors">Why Tracksy?</a>
             <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
             <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: FEATURES --- */}
      <section id="features" className="py-24 px-6 md:px-12 bg-surface-raised">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
               <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Features</h2>
               <h3 className="text-4xl md:text-5xl font-black mb-6">Why Tracksy?</h3>
               <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                 We've combined the best productivity frameworks into one seamless experience to help you stay focused and achieve your goals.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 {
                   title: "Habit Tracking",
                   desc: "Track daily habits and build unstoppable streaks with visual heatmaps.",
                   icon: <Zap size={28} className="text-indigo-400" />,
                   color: "bg-indigo-500/5"
                 },
                 {
                   title: "Smart Planner",
                   desc: "Organize your day with integrated tasks and time-blocked schedules.",
                   icon: <Calendar size={28} className="text-indigo-400" />,
                   color: "bg-indigo-500/5"
                 },
                 {
                   title: "Achievements",
                   desc: "Earn badges and level up as you complete your goals and build streaks.",
                   icon: <Award size={28} className="text-indigo-400" />,
                   color: "bg-indigo-500/5"
                 },
                 {
                   title: "Analytics",
                   desc: "Visualize your progress with detailed charts and productivity trends.",
                   icon: <BarChart3 size={28} className="text-indigo-400" />,
                   color: "bg-indigo-500/5"
                 }
               ].map((feature, idx) => (
                 <div 
                   key={idx}
                   className="p-8 bg-surface-raised rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-on-scroll opacity-0 translate-y-10"
                   style={{ transitionDelay: `${idx * 100}ms` }}
                 >
                    <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 border border-indigo-500/10`}>
                       {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-text-secondary leading-relaxed text-sm">
                       {feature.desc}
                    </p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- SECTION 3: HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
        <div className="absolute -left-20 top-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
           <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Process</h2>
              <h3 className="text-4xl md:text-5xl font-black mb-6">How it works</h3>
           </div>

           <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Create habits & tasks",
                  desc: "Set up your daily routines and one-off tasks in seconds using our intuitive editor.",
                  icon: <Target className="text-primary" />
                },
                {
                  step: "02",
                  title: "Track daily progress",
                  desc: "Check off your habits as you complete them. Use the planner to stay on top of your tasks.",
                  icon: <CheckCircle2 className="text-green-500" />
                },
                {
                  step: "03",
                  title: "Build streaks & consistency",
                  desc: "Watch your streaks grow and your heatmaps fill up as you maintain your habits day after day.",
                  icon: <Zap className="text-orange-500" />
                },
                {
                  step: "04",
                  title: "Earn rewards",
                  desc: "Unlock new achievements and badges that celebrate your productivity milestones.",
                  icon: <Trophy className="text-yellow-500" />
                }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col md:flex-row gap-8 items-center bg-surface border border-border p-8 rounded-3xl animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                >
                   <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-primary/20">
                      {step.step}
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        {step.icon}
                        <h4 className="text-2xl font-bold">{step.title}</h4>
                      </div>
                      <p className="text-text-secondary text-lg">
                        {step.desc}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- SECTION 4: MOTIVATION & STATS --- */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
               "Consistency beats motivation."
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
               {[
                 { label: "Active Users", value: "12K+", icon: <Users size={20} /> },
                 { label: "Habits Tracked", value: "850K+", icon: <Zap size={20} /> },
                 { label: "Streaks Built", value: "45K+", icon: <Target size={20} /> },
                 { label: "Badges Earned", value: "100K+", icon: <Trophy size={20} /> }
               ].map((stat, idx) => (
                 <div key={idx} className="glass-card p-6 rounded-3xl animate-on-scroll opacity-0 translate-y-10 transition-all duration-700" style={{ transitionDelay: `${idx * 150}ms` }}>
                    <div className="flex justify-center mb-3 text-white/60">
                       {stat.icon}
                    </div>
                    <div className="text-4xl font-black mb-1">{stat.value}</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-white/60">{stat.label}</div>
                 </div>
               ))}
            </div>
        </div>
      </section>

      {/* --- SECTION 5: FINAL CTA & FOOTER --- */}
      <section className="py-32 px-6 text-center bg-surface relative overflow-hidden">
         <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-primary/10 rounded-3xl mb-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
               <Zap className="text-primary w-12 h-12" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
               Start your journey today 🚀
            </h2>
            <p className="text-text-secondary text-xl mb-12 max-w-2xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
               Join thousands of others building lasting habits and transforming their lives with Tracksy.
            </p>
            <button 
              onClick={scrollToHero}
              className="px-12 py-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
            >
               Get Started Now
            </button>
         </div>

         <footer className="mt-32 pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 text-text-secondary text-sm">
            <div className="flex items-center gap-2">
               <LayoutDashboard size={20} className="text-primary" />
               <span className="font-bold text-foreground">Tracksy © 2026</span>
            </div>
            <div className="flex gap-10">
               <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            </div>
         </footer>
      </section>

    </div>
  );
};

export default LandingPage;
