import { Bell, Mail, Search } from 'lucide-react';
import { useMe } from '../hooks/auth';

export default function Header() {
  const { data } = useMe();
  if (!data?.user) {
    return null;
  }
  const { user } = data;
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-12">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400" placeholder="Search tasks or team..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <Bell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Mail />
          </button>
        </div>
        <div className="flex items-center gap-3 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-background">{user.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Lead Designer</p>
          </div>
          <img alt="User profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50" data-alt-prop="professional portrait of a man in a modern workspace with soft natural lighting and minimalist background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAe-AMxlx_z8KU7Cs4uYFgNXOdSXLd4AZ8Y55a_sl29tDEeJfRcFS2aLNKjDHJEQwHnQ5UhyP5rrhczWzvQ-bylVV9CcBfNqYOSxeJ2_WNCa6mDjSS2LJjTyFABK_AmNCL2hp0YW3QZvqeyhHavE7MzNehZzY0lbY8RWVB4mu1iqxAuVIeR-ecFmtVY9TV4gsfcDYRh-rTi5gZxK0Vz_yzQVu_L044eHo6sHFgqfwTksNFoMkkmlJ0AJ_lS3F1V9qIgMp28qRxWFo" />
        </div>
      </div>
    </header>
  );
}