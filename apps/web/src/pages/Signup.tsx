import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useRegister } from '../hooks/auth';
import { toast } from 'sonner';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success("Registration successful");
          navigate('/dashboard');
        },
        onError: (err: Error) => {
          setError(err.message || 'Failed to register');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:grid md:grid-cols-12 md:overflow-hidden">
      {/* Left Presentation Panel - visible on md/lg/xl, hidden on mobile */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-6 bg-gradient-to-br from-surface-container-low via-surface-container-high to-surface-container-highest flex-col justify-between p-12 lg:p-16 relative overflow-hidden border-r border-outline-variant/10">
        {/* Abstract shapes or glows in background */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-tertiary/5 blur-3xl" />

        {/* Brand details */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-ambient">
            <span className="text-white font-headline font-bold text-xl">F</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-on-surface">Fluid Studio</span>
        </div>

        {/* Dynamic task canvas mockup */}
        <div className="my-auto space-y-8 z-10 max-w-lg">
          <div className="space-y-4">
            <h1 className="font-headline font-extrabold text-4xl lg:text-5xl leading-tight text-on-surface tracking-tight">
              Begin the <br />
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Flow.</span>
            </h1>
            <p className="font-body text-base lg:text-lg text-on-surface-variant leading-relaxed">
              Experience collaboration without gridlock. Work live, track tasks, and build together in real time.
            </p>
          </div>

          {/* Floating task cards group */}
          <div className="relative pt-6">
            {/* Task Card 1 */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-5 shadow-ambient relative hover:translate-y-[-4px] transition-transform duration-300">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-primary/10 text-primary text-xs font-label font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Review
                </span>
                <span className="font-label text-xs text-on-surface-variant">Active now</span>
              </div>
              <h3 className="font-headline font-bold text-base text-on-surface mb-1">
                Implement Socket DB Writes
              </h3>
              <p className="font-body text-xs text-on-surface-variant mb-4">
                Wrap writes in try/catch and ensure ack callbacks are fired properly.
              </p>
              
              <div className="flex justify-between items-center">
                {/* Overlapping avatars stack */}
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full bg-tertiary/20 text-tertiary text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest">
                    ML
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest">
                    KH
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest">
                    +1
                  </div>
                </div>
                {/* Presence indicator */}
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <span className="text-[10px] font-label text-on-surface-variant">3 editing</span>
                </div>
              </div>
            </div>

            {/* Task Card 2 - Offset floating behind */}
            <div className="w-[90%] bg-surface-container rounded-xl p-4 shadow-sm opacity-60 absolute top-[-30px] right-[-10px] -z-10 scale-[0.95] blur-[0.5px]">
              <span className="bg-tertiary/10 text-tertiary text-[10px] font-label font-bold px-2 py-0.5 rounded-full uppercase">
                Completed
              </span>
              <h4 className="font-headline font-bold text-sm text-on-surface mt-2">
                LexoRank Ordering Helper
              </h4>
            </div>
          </div>
        </div>

        {/* Editorial Footer Info */}
        <div className="flex justify-between items-center text-xs font-label text-on-surface-variant/75 z-10">
          <span>&copy; {new Date().getFullYear()} Fluid Studio.</span>
          <span>v2.0.0</span>
        </div>
      </div>

      {/* Right Form Panel - spans 12 columns on mobile, 7 on md, 6 on lg */}
      <div className="col-span-12 md:col-span-7 lg:col-span-6 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20 overflow-y-auto bg-surface">
        <div className="mx-auto w-full max-w-md">
          {/* Logo only on mobile */}
          <div className="flex items-center space-x-3 mb-8 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-ambient">
              <span className="text-white font-headline font-bold text-xl">F</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-on-surface">Fluid Studio</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
              Create an account
            </h2>
            <p className="text-sm font-body text-on-surface-variant">
              Join the Fluid Studio and start collaborating with your team in minutes.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div aria-live="polite" className="bg-error-container text-on-error-container p-3 rounded-xl text-xs font-label text-center px-4 transition-all duration-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-label font-semibold text-on-surface uppercase tracking-wider"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded-lg bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/40 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all duration-200 border-none"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-label font-semibold text-on-surface uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-lg bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/40 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all duration-200 border-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-label font-semibold text-on-surface uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/40 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all duration-200 border-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex w-full justify-center items-center rounded-xl pulse-gradient px-4 py-3 text-sm font-label font-semibold text-white shadow-ambient hover:scale-[1.02] focus:outline-none disabled:opacity-70 disabled:hover:scale-100 transition-all duration-200 cursor-pointer"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account…</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/15" />
            </div>
            <div className="relative flex justify-center text-xs font-label uppercase tracking-wider">
              <span className="bg-surface px-3 text-on-surface-variant/60">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-label font-semibold px-4 py-3 transition-colors duration-200"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
