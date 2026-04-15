import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="min-h-screen bg-background font-body flex flex-col items-center justify-center text-center px-6 gap-6">
      {/* Decorative blob */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <p className="text-8xl font-headline font-extrabold text-primary tracking-tighter select-none">
        404
      </p>

      <div className="space-y-3 max-w-sm">
        <h1 className="text-2xl font-headline font-bold text-on-surface">
          Page not found
        </h1>
        <p className="text-on-surface-variant leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link
        to="/"
        className="pulse-gradient bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white px-8 py-3 rounded-xl font-headline font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-200"
      >
        Back to home
      </Link>
    </div>
  );
}
