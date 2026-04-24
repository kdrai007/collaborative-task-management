import { BadgeCheckIcon, Bell, LogOutIcon, Mail, Search } from 'lucide-react';
import { useMe, useLogout } from '@/hooks/auth';
import { UserAvtar } from './UserAvtar';
import { ThemeToggle } from './theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

export default function Header() {
  const logoutMutation = useLogout();
  const { data } = useMe();
  if (!data?.user) {
    return null;
  }
  const { user } = data;



  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-12">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
          <input className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant outline-none" placeholder="Search tasks or team..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
            <Bell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-lowest dark:bg-red-500"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <Mail />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <UserAvtar />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel> {user.name}</DropdownMenuLabel>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => logoutMutation.mutate()}>
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}