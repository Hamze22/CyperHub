import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CyberLogo } from '../ui/Primitives';
import { ExperienceLevel } from '../../types';

function getPasswordStrength(pw: string): { label: string; score: number; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-[#FF9F43]' };
  if (score === 2) return { label: 'Fair', score: 50, color: 'bg-[#FF9F43]' };
  if (score === 3) return { label: 'Good', score: 75, color: 'bg-[#1677FF]' };
  return { label: 'Strong', score: 100, color: 'bg-[#12D69A]' };
}

export const AuthPages: React.FC = () => {
  const { currentPage, navigate, loginDemo, updateUserProfile } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Somalia');
  const [expLevel, setExpLevel] = useState<ExperienceLevel>('Beginner');
  const [interest, setInterest] = useState('Ethical Hacking');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const strength = getPasswordStrength(password);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginDemo(email.trim());
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !username.trim() || !email.trim() || password.length < 6) {
      setErrorMsg('Please complete all required fields (password minimum 6 characters).');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms of Service and Community Guidelines.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateUserProfile({
        fullName: fullName.trim(),
        username: username.trim().replace(/^@/, ''),
        email: email.trim(),
        country,
        experienceLevel: expLevel,
        learningInterest: interest,
      });
      navigate('auth-verify');
    }, 600);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Enter your registered email address.');
      return;
    }
    setSuccessMsg(`Demo reset instructions prepared for ${email}.`);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length < 6 || password !== confirmPassword) {
      setErrorMsg('Passwords must match and be at least 6 characters.');
      return;
    }
    setSuccessMsg('Password updated in demo session. You may now sign in.');
  };

  const handleGoogleNotice = () => {
    setErrorMsg('Google OAuth login requires a connected backend OAuth provider. Please use the demo form below to explore CyberHub.');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg cyber-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <CyberLogo />
          <div className="flex items-center gap-2 text-xs">
            <button onClick={() => navigate('auth-login')} className={`px-2.5 py-1 rounded-lg ${currentPage === 'auth-login' ? 'bg-[#713BFF] text-white' : 'text-[#A5B1C8]'}`}>Login</button>
            <button onClick={() => navigate('auth-signup')} className={`px-2.5 py-1 rounded-lg ${currentPage === 'auth-signup' ? 'bg-[#713BFF] text-white' : 'text-[#A5B1C8]'}`}>Sign Up</button>
          </div>
        </div>

        {/* Demo notice */}
        <div className="rounded-xl bg-[#14213B] border border-[rgba(120,150,210,0.2)] px-3.5 py-2.5 text-xs text-[#A5B1C8]">
          Frontend Demo Mode: Authentication interactions update local demo state until an identity backend is connected.
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-[#FF9F43]/15 border border-[#FF9F43]/40 px-3.5 py-2.5 text-xs text-[#FF9F43] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-[#12D69A]/15 border border-[#12D69A]/40 px-3.5 py-2.5 text-xs text-[#12D69A] flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN */}
        {currentPage === 'auth-login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-[#F5F7FF]">Welcome back</h1>
              <p className="text-xs text-[#A5B1C8] mt-1">Sign in to continue your CyberHub learning path.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5B1C8] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed.ali@cyberhub.demo"
                className="w-full h-11 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF] focus:outline-none focus:border-[#713BFF]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#A5B1C8]">Password</label>
                <button type="button" onClick={() => navigate('auth-forgot')} className="text-xs text-[#08D9E8] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 px-3.5 pr-11 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF] focus:outline-none focus:border-[#713BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-3 text-[#A5B1C8]"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl cyber-gradient-btn text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleGoogleNotice}
              className="w-full h-11 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.22)] text-sm font-medium text-[#F5F7FF] hover:bg-[#14213B]"
            >
              Continue with Google (OAuth UI Only)
            </button>

            <div className="text-center text-xs text-[#A5B1C8]">
              New to CyberHub?{' '}
              <button type="button" onClick={() => navigate('auth-signup')} className="text-[#08D9E8] hover:underline font-medium">
                Create a free account
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP */}
        {currentPage === 'auth-signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <h1 className="text-xl font-bold text-[#F5F7FF]">Create your CyberHub account</h1>
              <p className="text-xs text-[#A5B1C8] mt-1">Start learning cybersecurity step by step.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmed Ali"
                  className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ahmed_sec"
                  className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A5B1C8] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full h-10 px-3 pr-9 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-2.5 text-[#A5B1C8]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Confirm Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
                />
              </div>
            </div>

            {password && (
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-full bg-[#050B18] overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all`} style={{ width: `${strength.score}%` }} />
                </div>
                <div className="text-[11px] text-[#A5B1C8]">Password strength: {strength.label}</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Experience</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value as ExperienceLevel)}
                  className="w-full h-10 px-2.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#A5B1C8] mb-1">Interest</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-xs text-[#F5F7FF]"
                >
                  <option>Ethical Hacking</option>
                  <option>Web Security</option>
                  <option>Linux & Cloud</option>
                  <option>SOC & Forensics</option>
                </select>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#A5B1C8] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[rgba(120,150,210,0.3)]"
              />
              <span>I agree to CyberHub Terms of Service, Privacy Policy, and ethical training guidelines.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl cyber-gradient-btn text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleGoogleNotice}
              className="w-full h-10 rounded-xl bg-[#0A1224] border border-[rgba(120,150,210,0.22)] text-xs font-medium text-[#F5F7FF]"
            >
              Sign up with Google (OAuth UI Only)
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {currentPage === 'auth-forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <h1 className="text-xl font-bold text-[#F5F7FF]">Forgot Password</h1>
            <p className="text-xs text-[#A5B1C8]">Enter your account email to preview the password reset workflow.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
            />
            <button type="submit" className="w-full h-11 rounded-xl cyber-gradient-btn text-white text-sm font-semibold">
              Send Reset Link
            </button>
            <div className="flex justify-between text-xs text-[#08D9E8]">
              <button type="button" onClick={() => navigate('auth-login')}>Back to Login</button>
              <button type="button" onClick={() => navigate('auth-reset')}>Preview Reset Form</button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD */}
        {currentPage === 'auth-reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <h1 className="text-xl font-bold text-[#F5F7FF]">Reset Password</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full h-11 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-11 px-3.5 rounded-xl bg-[#050B18] border border-[rgba(120,150,210,0.22)] text-sm text-[#F5F7FF]"
            />
            <button type="submit" className="w-full h-11 rounded-xl cyber-gradient-btn text-white text-sm font-semibold">
              Update Password
            </button>
            <button type="button" onClick={() => navigate('auth-login')} className="text-xs text-[#08D9E8]">
              Return to Sign In
            </button>
          </form>
        )}

        {/* EMAIL VERIFICATION */}
        {currentPage === 'auth-verify' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#08D9E8]/15 text-[#08D9E8] flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#F5F7FF]">Verify Your Email</h1>
            <p className="text-xs text-[#A5B1C8] leading-relaxed">
              In this frontend demo, your verification step is ready to confirm locally. Click below to complete onboarding.
            </p>
            <button
              onClick={() => navigate('auth-onboarding')}
              className="w-full h-11 rounded-xl cyber-gradient-btn text-white text-sm font-semibold"
            >
              Confirm Demo Verification & Continue
            </button>
          </div>
        )}

        {/* ONBOARDING */}
        {currentPage === 'auth-onboarding' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-[#F5F7FF]">Personalize Your Learning Path</h1>
              <p className="text-xs text-[#A5B1C8] mt-1">Select your primary track to tailor AI Academy recommendations.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Ethical Hacking', 'Web Security', 'Linux & Cloud', 'SOC & Forensics'].map((track) => (
                <button
                  key={track}
                  onClick={() => setInterest(track)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    interest === track
                      ? 'bg-[#713BFF]/20 border-[#713BFF] text-[#F5F7FF]'
                      : 'bg-[#050B18] border-[rgba(120,150,210,0.2)] text-[#A5B1C8]'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                updateUserProfile({ learningInterest: interest });
                loginDemo();
              }}
              className="w-full h-11 rounded-xl cyber-gradient-btn text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              Enter CyberHub Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
