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

  const handleSubmit = (e: React.SubmitEvent) => {
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
    <div className="min-h-screen bg-surface-container-low flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-headline font-bold tracking-tight text-on-surface">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm font-label text-on-surface-variant">
          Join the Fluid Studio and start collaborating
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-10 px-4 shadow-ambient sm:rounded-xl sm:px-10 border-none">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-full text-sm font-label text-center px-4">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-label font-medium text-on-surface"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-label font-medium text-on-surface"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-label font-medium text-on-surface"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex w-full justify-center rounded-md pulse-gradient px-4 py-3 text-sm font-label font-medium text-white shadow-ambient hover:scale-[1.02] focus:outline-none disabled:opacity-70 disabled:hover:scale-100 transition-all mt-4"
              >
                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/15" />
              </div>
              <div className="relative flex justify-center text-sm font-label">
                <span className="bg-surface-container-lowest px-2 text-on-surface-variant">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-container font-label transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
