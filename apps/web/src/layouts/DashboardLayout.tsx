import { Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageHeader from '../components/PageHeader';
import Board from '../components/Board';
import BottomNav from '../components/BottomNav';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen pb-20 md:pb-0">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 md:ml-72 min-h-screen flex flex-col w-full overflow-hidden">
        <Header />
        <PageHeader />
        <Board />
      </main>

      <div className="block md:hidden z-50">
        <BottomNav />
      </div>

      <button className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 rounded-full pulse-gradient text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Plus className="text-3xl" />
      </button>
    </div>
  );
}
