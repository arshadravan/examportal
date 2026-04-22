import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Sparkles,
  CheckCircle2,
  Github,
  Mail,
  Phone,
  ArrowLeft,
  Globe,
  MessageSquare,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';

// --- FIREBASE GOOGLE AUTH IMPORTS ---
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginProps {
  onLogin: (role: 'admin' | 'student', name?: string) => void;
}

type AuthMode = 'login' | 'signup' | 'verify-otp' | 'contact-admin' | 'forgot-password' | 'forgot-otp' | 'new-password';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.login({ identifier: email || phone, password });
      onLogin(result.role, result.name || 'User');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiService.register({ 
        username: name, 
        email, 
        phoneNumber: phone, 
        password,
        role: 'STUDENT'
      });
      setMode('verify-otp');
    } catch (err) {
      setError('Signup failed. Please check if your backend is running at http://localhost:8080');
      console.error('Signup error:', err);
      setMode('verify-otp'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiService.verifyOtp(email, otp);
      onLogin('student', name);
    } catch (err) {
      setError('Invalid OTP or verification failed. Please try again.');
      console.error('OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- REAL GOOGLE LOGIN WITH FIREBASE ---
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin('student', user.displayName || 'Google User');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google login cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked by browser. Please allow popups for this site.');
      } else {
        setError('Google login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORGOT PASSWORD HANDLERS ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiService.forgotPassword(forgotEmail);
      setMode('forgot-otp');
    } catch (err) {
      setError('Failed to send OTP. Please check your email.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiService.verifyForgotOtp(forgotEmail, forgotOtp);
      setMode('new-password');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await apiService.resetPassword(forgotEmail, forgotOtp, newPassword);
      setSuccessMsg('Password reset successful! Redirecting to login...');
      setForgotEmail('');
      setForgotOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccessMsg(null);
        setMode('login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactAdmin = () => {
    window.location.href = 'mailto:arshhassan40@gmail.com?subject=Admin Role Request&body=Hello, I would like to request an administrator role for ExamIntel. My details are:';
  };

  // Reusable boxes
  const ErrorBox = ({ msg }: { msg: string }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-error-container text-error text-sm font-bold rounded-xl border border-error/20 flex items-center gap-3"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
      {msg}
    </motion.div>
  );

  const SuccessBox = ({ msg }: { msg: string }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-200 flex items-center gap-3"
    >
      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
      {msg}
    </motion.div>
  );

  const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.6 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6.1l6.2 5.2C36.7 37.7 44 33 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-lg">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-white font-headline text-3xl font-extrabold tracking-tight">ExamIntel</h1>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h2 className="text-white font-headline text-5xl font-extrabold leading-tight">
              Secure. Intelligent. <br />
              <span className="text-indigo-300">Uncompromising.</span>
            </h2>
            <p className="text-indigo-100 text-lg max-w-md font-medium leading-relaxed">
              The ultimate platform for high-stakes examinations, featuring AI-driven proctoring and deep performance analytics.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'AI Proctoring', icon: ShieldCheck },
              { label: 'Smart Analytics', icon: Sparkles },
              { label: 'Instant Grading', icon: CheckCircle2 },
              { label: 'Cloud Security', icon: Globe },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 text-white/80">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                  <feature.icon className="h-4 w-4 text-indigo-200" />
                </div>
                <span className="text-sm font-bold font-headline">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-indigo-200 text-xs font-bold uppercase tracking-widest">
          <span>© 2026 ExamIntel Systems</span>
          <div className="flex gap-4">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-surface relative">
        <AnimatePresence mode="wait">

          {/* ========== LOGIN ========== */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
              <div className="text-center lg:text-left space-y-2">
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Welcome Back</h2>
                <p className="text-on-surface-variant font-medium">Access your secure examination portal.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && <ErrorBox msg={error} />}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Identity</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or Phone Number" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Secret Key</label>
                    <button type="button" onClick={() => { setError(null); setForgotEmail(''); setMode('forgot-password'); }} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:translate-y-[1px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="h-5 w-5" /></>}
                </button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-highest" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-outline bg-surface px-4">Social Authentication</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-surface-container-highest rounded-2xl hover:border-primary/20 hover:bg-surface-container-low transition-all font-bold text-sm shadow-sm disabled:opacity-50">
                  <GoogleIcon />Google
                </button>
                <button type="button" className="flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-surface-container-highest rounded-2xl hover:border-primary/20 hover:bg-surface-container-low transition-all font-bold text-sm shadow-sm">
                  <Github className="h-4 w-4" />GitHub
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-center text-sm font-medium text-on-surface-variant">
                  Don't have an account? <button onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Create Account</button>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" />
                  Administrator Role?
                  <button onClick={() => setMode('contact-admin')} className="text-primary hover:underline">Apply Here</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== FORGOT PASSWORD - STEP 1: EMAIL ========== */}
          {mode === 'forgot-password' && (
            <motion.div key="forgot-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
              <button onClick={() => { setError(null); setMode('login'); }} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="h-4 w-4" />Back to Login
              </button>

              <div className="space-y-3">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <KeyRound className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Forgot Password</h2>
                <p className="text-on-surface-variant font-medium">Enter your registered email. We'll send you an OTP to reset your password.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                {error && <ErrorBox msg={error} />}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="john@university.edu" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:translate-y-[1px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Send OTP</span><ArrowRight className="h-5 w-5" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* ========== FORGOT PASSWORD - STEP 2: OTP ========== */}
          {mode === 'forgot-otp' && (
            <motion.div key="forgot-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
              <button onClick={() => { setError(null); setMode('forgot-password'); }} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="h-4 w-4" />Back
              </button>

              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Check Your Email</h2>
                <p className="text-on-surface-variant font-medium">
                  We've sent a 6-digit OTP to <span className="text-primary font-bold">{forgotEmail}</span>
                </p>
              </div>

              <form onSubmit={handleForgotOtp} className="space-y-6">
                {error && <ErrorBox msg={error} />}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Enter OTP</label>
                  <input type="text" maxLength={6} value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="000000" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-5 text-center text-3xl font-bold tracking-[1em] text-on-surface focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                </div>

                <button type="submit" disabled={isLoading || forgotOtp.length !== 6} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:translate-y-[1px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Verify OTP</span><ArrowRight className="h-5 w-5" /></>}
                </button>

                <p className="text-center text-sm font-medium text-on-surface-variant">
                  Didn't receive the code?{' '}
                  <button type="button" onClick={() => { setForgotOtp(''); setMode('forgot-password'); }} className="text-primary font-bold hover:underline">Resend OTP</button>
                </p>
              </form>
            </motion.div>
          )}

          {/* ========== FORGOT PASSWORD - STEP 3: NEW PASSWORD ========== */}
          {mode === 'new-password' && (
            <motion.div key="new-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Lock className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">New Password</h2>
                <p className="text-on-surface-variant font-medium">Set a strong new password for your account.</p>
              </div>

              <form onSubmit={handleNewPassword} className="space-y-5">
                {error && <ErrorBox msg={error} />}
                {successMsg && <SuccessBox msg={successMsg} />}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs font-bold ml-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-error'}`}>
                      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:translate-y-[1px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Reset Password</span><CheckCircle2 className="h-5 w-5" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* ========== SIGNUP ========== */}
          {mode === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
              <button onClick={() => setMode('login')} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="h-4 w-4" />Back to Login
              </button>

              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Create Account</h2>
                <p className="text-on-surface-variant font-medium">Join the next generation of academic intelligence.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                {error && <ErrorBox msg={error} />}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@university.edu" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 text-on-surface font-semibold focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:translate-y-[1px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Send Verification OTP</span><ArrowRight className="h-5 w-5" /></>}
                </button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-highest" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-outline bg-surface px-4">Or sign up with</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-surface-container-highest rounded-2xl hover:border-primary/20 hover:bg-surface-container-low transition-all font-bold text-sm shadow-sm disabled:opacity-50">
                  <GoogleIcon />Google
                </button>
                <button type="button" className="flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-surface-container-highest rounded-2xl hover:border-primary/20 hover:bg-surface-container-low transition-all font-bold text-sm shadow-sm">
                  <Github className="h-4 w-4" />GitHub
                </button>
              </div>
            </motion.div>
          )}

          {/* ========== VERIFY OTP (SIGNUP) ========== */}
          {mode === 'verify-otp' && (
            <motion.div key="verify-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
              <button onClick={() => setMode('signup')} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="h-4 w-4" />Back to Signup
              </button>

              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Verify Email</h2>
                <p className="text-on-surface-variant font-medium">
                  We've sent a 6-digit code to <span className="text-primary font-bold">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {error && <ErrorBox msg={error} />}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ml-1">Verification Code</label>
                  <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-5 text-center text-3xl font-bold tracking-[1em] text-on-surface focus:border-primary/20 focus:bg-white transition-all outline-none" required />
                </div>

                <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:translate-y-[1px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Verify & Register</span><CheckCircle2 className="h-5 w-5" /></>}
                </button>

                <p className="text-center text-sm font-medium text-on-surface-variant">
                  Didn't receive the code? <button type="button" className="text-primary font-bold hover:underline">Resend OTP</button>
                </p>
              </form>
            </motion.div>
          )}

          {/* ========== CONTACT ADMIN ========== */}
          {mode === 'contact-admin' && (
            <motion.div key="contact-admin" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md space-y-8">
              <button onClick={() => setMode('login')} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="h-4 w-4" />Back to Login
              </button>

              <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-primary/10 border border-surface-container-highest space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-extrabold font-headline text-on-surface">Admin Access Request</h2>
                  <p className="text-on-surface-variant text-sm font-medium">Administrator roles are manually vetted for security. Please contact our system administrator to request access.</p>
                </div>

                <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
                    <Mail className="h-4 w-4 text-primary" />arshhassan40@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
                    <MessageSquare className="h-4 w-4 text-primary" />Response time: ~24 hours
                  </div>
                </div>

                <button onClick={handleContactAdmin} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                  Send Request Email<Mail className="h-5 w-5" />
                </button>

                <p className="text-[10px] text-center text-outline font-bold uppercase tracking-widest">
                  Your request will be reviewed by Arsh Hassan
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
