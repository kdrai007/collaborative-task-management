import { Calendar, Kanban, LayoutDashboard, ListPlus, Settings, Users } from 'lucide-react';
export default function Sidebar() {
  return (
    <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-indigo-50 dark:bg-indigo-950/20 z-50">
      <div className="flex flex-col h-full py-8 gap-y-4">

        <div className="px-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl pulse-gradient flex items-center justify-center text-white">
              <LayoutDashboard />
            </div>
            <h1 className="text-lg font-extrabold text-indigo-900 dark:text-indigo-100 font-headline">Collaborative</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight text-xs px-1">Fluid Workspace</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all font-manrope font-medium tracking-tight" href="#">
            <LayoutDashboard />
            <span >Home</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-100/50 dark:bg-indigo-900/30 transition-all font-manrope tracking-tight" href="#">
            <Kanban />
            <span >Projects</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all font-manrope font-medium tracking-tight" href="#">
            <Calendar />
            <span >Calendar</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all font-manrope font-medium tracking-tight" href="#">
            <Users />
            <span >Team</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all font-manrope font-medium tracking-tight" href="#">
            <Settings />
            <span >Settings</span>
          </a>
        </nav>

        <div className="px-6 mt-auto">
          <button className="w-full pulse-gradient text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform active:scale-95">
            <ListPlus />
            <span >Create New Task</span>
          </button>
        </div>
      </div>
    </aside>
  );
}