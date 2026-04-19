import { NavLink } from 'react-router';
import { Calendar, Kanban, LayoutDashboard, Settings, Users } from 'lucide-react';
export default function BottomNav() {
  return (
<nav className="fixed bottom-0 left-0 right-0 h-20 glass-nav flex items-center justify-around px-2 pb-5 z-50">
<NavLink 
  to="/dashboard" 
  end
  className={({ isActive }) => 
    `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-slate-400'}`
  }
>
<LayoutDashboard />
<span className="text-[10px] font-medium">Home</span>
</NavLink>
<NavLink 
  to="/dashboard/projects"
  className={({ isActive }) => 
    `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-slate-400'}`
  }
>
<Kanban />
<span className="text-[10px] font-bold">Projects</span>
</NavLink>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<Calendar />
<span className="text-[10px] font-medium">Events</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<Users />
<span className="text-[10px] font-medium">Team</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<Settings />
<span className="text-[10px] font-medium">Settings</span>
</a>
</nav>
  );
}