import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useLogin } from "../hooks/auth";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login successful");
          navigate("/dashboard");
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to login");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col md:grid md:grid-cols-12 md:overflow-hidden">
      {/* Left Presentation Panel */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-6 bg-[#1a1c4b] flex-col relative overflow-hidden">
        {/* Top Content */}
        <div className="pt-24 px-12 lg:px-24">
          <h1 className="font-headline font-bold text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            The Fluid Studio
          </h1>
          <p className="font-body text-base lg:text-lg text-white/70">
            Where ideas flow without friction.
          </p>
        </div>

        {/* Graphic Image */}
        <div className="flex-1 flex items-end justify-center pb-12 lg:pb-24"></div>
      </div>

      {/* Right Form Panel */}
      <div className="col-span-12 md:col-span-7 lg:col-span-6 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-32 bg-surface relative h-full">
        <div className="w-full max-w-100 mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-headline font-bold text-on-surface mb-3">
              Welcome back
            </h2>
            <p className="text-[15px] font-body text-on-surface-variant">
              Access your shared digital desk and
              <br />
              continue the flow.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                aria-live="polite"
                className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-label text-center px-4 transition-all duration-200"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-md bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/50 focus:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-colors border-none"
                placeholder="name@studio.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-[11px] font-bold text-primary hover:text-primary-container transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-md bg-surface-container-low px-4 py-3 placeholder-on-surface-variant/50 focus:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-colors border-none"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex w-full justify-center items-center rounded-md pulse-gradient hover:opacity-90 text-white px-4 py-3.5 text-sm font-bold shadow-sm transition-opacity cursor-pointer disabled:opacity-70"
              >
                {loginMutation.isPending ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span className="bg-surface px-4">Or use magic link</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-on-surface-variant text-[13px]">
              New to the studio?{" "}
            </span>
            <Link
              to="/signup"
              className="text-primary text-[13px] font-bold hover:underline"
            >
              Create a new account
            </Link>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} The Fluid Studio. Built for
            momentum.
          </p>
        </div>
      </div>
    </div>
  );
}
