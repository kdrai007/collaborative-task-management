import { NavLink } from 'react-router';
import {
  Briefcase,
  Calendar,
  Kanban,
  LayoutDashboard,
  ListPlus,
  Settings,
  Users,
} from "lucide-react";
export default function Sidebar() {
  return (
    <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-surface-container-low z-50">

      <div className="flex flex-col h-full py-8 gap-y-4">

        <div className="px-8 mb-6">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-xl pulse-gradient flex items-center justify-center text-white">

              <LayoutDashboard />
            </div>
            <h1 className="text-lg font-extrabold text-on-surface font-headline">
              Collaborative
            </h1>
          </div>
          <p className="text-on-surface-variant dark:text-on-surface-variant font-medium tracking-tight text-xs px-1">
            Fluid Workspace
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-1">

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-manrope transition-all tracking-tight ${isActive
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant font-medium hover:text-primary hover:bg-surface-container'
              }`
            }
          >
            <LayoutDashboard /> <span>Home</span>
          </NavLink>
          <NavLink
            to="/dashboard/workspaces"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-manrope transition-all tracking-tight ${isActive
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant font-medium hover:text-primary hover:bg-surface-container'
              }`
            }
          >
            <Briefcase /> <span>Workspaces</span>
          </NavLink>
          <NavLink
            to="/dashboard/projects"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-manrope transition-all tracking-tight ${isActive
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant font-medium hover:text-primary hover:bg-surface-container'
              }`
            }
          >
            <Kanban /> <span>Projects</span>
          </NavLink>
          <a
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all font-manrope font-medium tracking-tight"
            href="#"
          >
            <Calendar /> <span>Calendar</span>
          </a>
          <a
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all font-manrope font-medium tracking-tight"
            href="#"
          >
            <Users /> <span>Team</span>
          </a>
          <a
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all font-manrope font-medium tracking-tight"
            href="#"
          >
            <Settings /> <span>Settings</span>
          </a>
        </nav>
        <div className="px-6 mt-auto">

          <button className="w-full pulse-gradient text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">

            <ListPlus /> <span>Create New Task</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
