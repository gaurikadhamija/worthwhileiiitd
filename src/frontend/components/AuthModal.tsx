import React, { useState } from 'react';
import { X, Lock, Mail, User, Compass, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

const DELHI_REGIONS = [
  'South Delhi (IIT Delhi / IIIT Delhi / JNU)',
  'North Delhi (Delhi University North Campus)',
  'West Delhi (NSUT Dwarka)',
  'North West Delhi (DTU Rohini)',
  'Central Delhi (Connaught Place / IHC Lodhi)',
  'Gurugram NCR (Cyber City)',
  'Noida NCR (Sector 62 Institutional)'
];

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { refreshData, setIsGoalsModalOpen } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [delhiRegion, setDelhiRegion] = useState(DELHI_REGIONS[0]);
  const [role, setRole] = useState<'student' | 'organizer'>('student');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        await api.signup({
          email: email.trim(),
          password,
          name: name.trim(),
          role,
          delhi_region: delhiRegion
        });
        await refreshData();
        onClose();
        // Immediately launch post-login goals setup
        setIsGoalsModalOpen(true);
      } else if (mode === 'login') {
        await api.login(email.trim(), password);
        await refreshData();
        onClose();
      } else if (mode === 'forgot') {
        await api.forgotPassword(email.trim());
        setSuccessMessage('Password reset link sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.googleLogin({
        email: email.trim() || 'student@campus.du.ac.in',
        name: name.trim() || 'Delhi Scholar',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      });
      await refreshData();
      onClose();
      setIsGoalsModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FFFDF8] rounded-3xl border border-[#E8DCC8] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-[#5A3828] hover:bg-[#F4EBDD] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Editorial Brand Panel (Coffee & Warm Cream Aesthetic from Image 1) */}
        <div className="md:w-5/12 bg-gradient-to-b from-[#2C0F12] via-[#3D1418] to-[#2A1B16] text-[#FFFDF8] p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle atmospheric glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#6B1E23]/40 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#6B1E23] flex items-center justify-center text-[#FFFDF8]">
                <Compass className="w-4 h-4 text-[#E8DCC8]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#FFFDF8]">
                WorthWhile
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B1E23]/50 border border-[#B99A6B]/30 text-[10px] uppercase font-semibold tracking-wider text-[#E8DCC8] mb-4">
              <Sparkles className="w-3 h-3 text-[#B99A6B]" />
              <span>Delhi NCR Campus Network</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-snug text-[#FFFDF8]">
              "Don't just find events. Find the ones worth your time."
            </h2>

            <p className="text-xs text-[#E8DCC8]/80 mt-3 leading-relaxed font-light">
              Personalized matching, audited organizer claims, and verified peer evidence across IIT Delhi, DU, NSUT, DTU, and NCR campuses.
            </p>
          </div>

          <div className="pt-6 border-t border-[#6B1E23]/40 space-y-2 text-[11px] text-[#E8DCC8]/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99A6B]" />
              <span>Real verified attendance evidence</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A6B]" />
              <span>Explainable 7-factor relevance score</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="md:w-7/12 p-8 sm:p-10 bg-[#FAF4EB] flex flex-col justify-center">
          
          {/* Form Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-serif font-bold text-[#2A1B16]">
              {mode === 'login'
                ? 'Welcome back.'
                : mode === 'signup'
                ? 'Join WorthWhile.'
                : 'Reset Password'}
            </h3>
            <p className="text-xs text-[#5A3828] mt-1">
              {mode === 'login'
                ? 'Continue discovering events worth your time across Delhi.'
                : mode === 'signup'
                ? 'Create your account to unlock personalized relevance scores.'
                : 'Enter your university email to receive recovery instructions.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#9A1B28]/10 border border-[#9A1B28]/30 text-xs text-[#9A1B28] font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-xs text-[#2D6A4F] font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="font-semibold text-[#2A1B16] uppercase tracking-wider text-[11px] block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3828]/60" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Gaurika Dhamija"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/30 text-xs focus:outline-none focus:border-[#6B1E23]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-[#2A1B16] uppercase tracking-wider text-[11px] block mb-1">
                College / University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3828]/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@college.du.ac.in or iitd.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/30 text-xs focus:outline-none focus:border-[#6B1E23]"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[#2A1B16] uppercase tracking-wider text-[11px]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#6B1E23] hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3828]/60" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/30 text-xs focus:outline-none focus:border-[#6B1E23]"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label className="font-semibold text-[#2A1B16] uppercase tracking-wider text-[11px] block mb-1">
                    Primary Delhi / NCR Campus Region
                  </label>
                  <select
                    value={delhiRegion}
                    onChange={e => setDelhiRegion(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/30 text-xs focus:outline-none focus:border-[#6B1E23]"
                  >
                    {DELHI_REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#2A1B16] uppercase tracking-wider text-[11px] block mb-1">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2 rounded-xl border text-xs font-semibold text-center transition-colors ${
                        role === 'student'
                          ? 'border-[#6B1E23] bg-[#2C0F12] text-[#FFFDF8]'
                          : 'border-[#E8DCC8] bg-[#FFFDF8] text-[#5A3828]'
                      }`}
                    >
                      Student Attendee
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('organizer')}
                      className={`p-2 rounded-xl border text-xs font-semibold text-center transition-colors ${
                        role === 'organizer'
                          ? 'border-[#6B1E23] bg-[#2C0F12] text-[#FFFDF8]'
                          : 'border-[#E8DCC8] bg-[#FFFDF8] text-[#5A3828]'
                      }`}
                    >
                      Club / Organizer
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Primary Action Button (Wine Gradient) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#2C0F12] to-[#6B1E23] text-[#FFFDF8] text-xs font-semibold hover:from-[#3D1418] hover:to-[#7E242A] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>
                {loading
                  ? 'Verifying...'
                  : mode === 'login'
                  ? 'Sign In to Campus Hub'
                  : mode === 'signup'
                  ? 'Create Account & Begin Onboarding'
                  : 'Send Reset Instructions'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Social Google Sign In Option */}
          <div className="mt-5 pt-4 border-t border-[#F4EBDD]">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FFFDF8] hover:bg-[#F4EBDD]/60 text-xs font-semibold text-[#2A1B16] transition-colors flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Mode Switcher Footer */}
          <div className="mt-5 text-center text-xs text-[#5A3828]">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-[#6B1E23] hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#6B1E23] hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
