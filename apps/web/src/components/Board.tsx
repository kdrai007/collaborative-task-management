import { CalendarDays, CheckCircle, Eye, History, MessageSquare, MoreHorizontal, Paperclip, Plus } from 'lucide-react';
export default function Board() {
  return (
    <section className="flex-1 px-10 pb-10 overflow-x-auto no-scrollbar">
      <div className="flex gap-8 h-full min-w-[1200px]">

        <div className="flex flex-col w-80 shrink-0">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <h3 className="font-headline font-bold text-lg text-on-background">To Do</h3>
              <span className="bg-surface-container text-slate-500 px-2 py-0.5 rounded text-xs font-bold">3</span>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <Plus />
            </button>
          </div>
          <div className="flex flex-col gap-4 p-3 rounded-2xl bg-surface-container-low min-h-[500px]">

            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-ambient hover:bg-surface-container transition-all group cursor-grab active:cursor-grabbing">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-error-container text-on-error-container text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">High Priority</span>
                <button className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal />
                </button>
              </div>
              <h4 className="font-bold text-on-background leading-snug mb-3">Refine color palette for Dark Mode</h4>
              <p className="text-slate-500 text-xs mb-4 line-clamp-2">Ensure accessibility ratios pass WCAG AA standards for all primary action buttons.</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" data-alt-prop="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU2XC3-7re7aN9y1ZgBwfFuJBU_da5Lew4OVc-PdPHrYHfv7PsFnOhlZTMRLZ6UUCVKlePdP4BuYXKGiKJPRKZJ47v-yrL4hQY1Zx7EFHQRPLUdrQ7744DaDSHw2MhP6YPRUX1PYQwNHVown-QMpmfPCNYurMkMnGXmU6r3MdhfY6RPEMko06WOHxrI9Zvclkh2ax3wJdCEjFVs1OW2gq2JVD_rWCQIIRXNmhaedOJ8q61yqtQNtMtTUle3Lu0G_izrD6EMSS8fiI" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                  <CalendarDays className="text-sm" />
                  Oct 24
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-ambient hover:bg-surface-container transition-all group cursor-grab">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">Medium</span>
                <button className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal />
                </button>
              </div>
              <h4 className="font-bold text-on-background leading-snug mb-3">SEO Audit for Home Page</h4>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" data-alt-prop="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhUU-k2RS2PhyckeJHsd8js3-Cod4p8faJHDbEAdtvaAyDve6e7IuK-jCXYD1U-T8jXuHANB7zSzsWte7-x5_bw7DHKDtPHXaPjkJcL5Fb4Zz7DxuPiWnG_Kw7ONQfGAHUbdeSbcUOdTqowuri-AVvLBYQhVu4FDl1eqzIsw-9u4CJE5viTIIm9NSgOfi8vHXwqTGJhnuiq_NkgS8uB6eX_HMnlea1GI4ClYUo-xyE5X6hwVm6F5Buy_AcAX165GNxhfodB882npg" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                  <CalendarDays className="text-sm" />
                  Oct 28
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-80 shrink-0">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <h3 className="font-headline font-bold text-lg text-on-background">In Progress</h3>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">2</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-3 rounded-2xl bg-surface-container min-h-[500px]">

            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-ambient hover:bg-surface-container transition-all group cursor-grab">
              <div className="mb-3">
                <img className="w-full h-32 object-cover rounded-lg mb-4" data-alt-prop="a minimalist flat lay of design sketches and a sleek laptop on a wooden desk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRvfwjRopqUm32y4lqV9a2babO0s45I29lB8ZYToL8jKOhh2xhw6vbPXOslzNNPSQZBwnjBLsAhxQPPgLyeW5dz6iwZRr9NzIbl2ktbL8-LA0J8WedKOSFBso3lJeZVoxl5W7nGpKIkzLdQph1Jf2w_mryR7II66Y4FtI_ClCiGKcScbugctUmrEMyU-WFhfUWt1TkpUPNWeYmmCLI7vSXmU-Rf1HwGc6mMwAAbXANkpxAfj8mKFwI27-Kff_bjfwrADdmlHgTiJo" />
                <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">Development</span>
              </div>
              <h4 className="font-bold text-on-background leading-snug mb-3">Component Library Architecture</h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary w-[65%] h-full"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" data-alt-prop="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9AbFPhuoV1LZ248sUh8QIlyljp0-NndZAZtpXZ-2EIHuq-kJa01DHRIYrtPnSgD4KsUUd-zgEGDkge0UOs52baRzfhlD-VgaXWszlM8cNCT3vMiNwQxnUpu-IU1MoJ9BhcxQ6mWJeZK6qSpLBBWIX5mEnJjeCoGICs4SNGbN-KvcsE8YmqeUv_dtiiWWzHES6d-pJDqhWDVBeTPlOvyr0uW5PAeA9jVAQqXZujRq904R7NG_TYTRyul-pAL4NtGwg85yrlTJHfME" />
                  <img className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" data-alt-prop="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4g7PRKskL9yK5ADyj9cwqxVQ5PJ4xkzmDo0irOgQxZ7iD39ua-RwpT4dS2b_BCYjN5uNqV5smN5xSoQ7ZceXruxsN584Im7LwfsR9Jdx5bTwjUZBT3ViFwpcS3aYpIwshcgw4Syn4SxvoTS-ork6hP_57DYry5z5kN67KZCbCHo0xYmFbdv9gAbNGXq6-u-KluYuY7U5vBIJugn8OWsqasga2Nz0AkratGZbJNyiAxu5zcZXVXSbyJGivfyagYTu6-dkEzqdlkiw" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <MessageSquare className="text-sm" />
                    8
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <Paperclip className="text-sm" />
                    3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-80 shrink-0">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <h3 className="font-headline font-bold text-lg text-on-background">In Review</h3>
              <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-xs font-bold">1</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-3 rounded-2xl bg-surface-container-high min-h-[500px]">

            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-ambient hover:bg-surface-container border border-outline-variant/15 transition-all group cursor-grab">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-error-container text-on-error-container text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">High Priority</span>
                <Eye className="text-primary" />
              </div>
              <h4 className="font-bold text-on-background leading-snug mb-3">User Interview Summary Report</h4>
              <p className="text-slate-500 text-xs mb-4">Finalizing the data points from 25 customer sessions in Q3.</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" data-alt-prop="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx38MdNKJyE7BtRyoAvv6RySgzb-kVMWOBbFTYUI5ei8TcGptAOZFsTuA021CwSTV1kJvnC4NbRXcnDofzz98z_1P1stOrjT-jDVz3A0RqvLRqA8GjjCCkQVGuLW2ckkHeZudqrLNPs2YjpTgRZNgLT246cqcxfZJHDEeirXfNKROmR3B6lzLArqOfbmu_35pUqqwXO-dlBW7XnCbhlpqXSU-1iaS06tWDnjwa_1x7rdL3xPl1voOHUQ1_LaZJeE3hQT0Q35o4iMM" />
                </div>
                <div className="flex items-center gap-1.5 text-error text-[11px] font-bold">
                  <History className="text-sm" />
                  Overdue
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-80 shrink-0">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <h3 className="font-headline font-bold text-lg text-on-background">Done</h3>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">12</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-3 rounded-2xl bg-surface-container-high/50 min-h-[500px]">

            <div className="bg-white/50 p-5 rounded-xl shadow-sm hover:shadow-ambient hover:bg-surface-container opacity-60 hover:opacity-100 transition-all group grayscale hover:grayscale-0">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-200 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">Low</span>
                <CheckCircle className="text-green-600" />
              </div>
              <h4 className="font-bold text-slate-400 line-through leading-snug mb-3">Domain name registration</h4>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" data-alt-prop="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV72Ou-uw4W7nrJBT9cVF6dc4Z5peZYcTgBOdjKgQsKpADbNABkdUTniFIUSRfGUlvMTqt3zEsi54uMOOl5WFS7jQMD0n6jfGvvoOfxGH5mBQmlEoIfu6Et7Y9zkC0mDcL5p0rqYznxIg1MKkhEVGVQevU7Cs7jiEhhIMHH4Ny2faHhreHKoNrvZP_SF5leqctwrcujT0Ve3gJMoOjkvkSonvxUw6IkNUUWUGOd3zxZg9InDWyKTmSh1xGEpFoFwtJggNpYnlPJ5Y" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                  Completed Oct 12
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}