import { ChevronRight, Filter, Share } from 'lucide-react';
export default function PageHeader() {
  return (
    <section className="px-10 pt-20 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div >
          <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-widest">
            <span >Projects</span>
            <ChevronRight className="text-sm" />
            <span className="text-primary">Current Board</span>
          </nav>
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface">Website Redesign</h2>
          <div className="flex items-center gap-4 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Collaboration
            </span>
            <div className="flex -space-x-3">
              <img className="w-8 h-8 rounded-full border-2 border-background object-cover" data-alt-prop="close up of a smiling woman with glasses in a creative office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrvWajzhSm5BmOraPvI34mev_fPilcJxtNM_xQk2DAwaQlN3ZuHGmCvK21vTnIQqmlgBlUFSpVu8wu0BrCmp_nEzeR2HaLCj-_HMMJ7XXlArXD8XTV151b964kxzd_WAAsfHW0l5sFJtW-Izxt1qxHJ8X4hqli1I5LPk1tXHsnm1vxcauVhGzBLJNQpMZwfzZ20G8uDm1-rvH_omdMXDBHIf_dO8UOiE1CcBy2IJCf8LgFLIxoMa6Sfcq_jbt81RTruJD_zlIu5ow" title="Sarah" />
              <img className="w-8 h-8 rounded-full border-2 border-background object-cover" data-alt-prop="portrait of a focused man in professional attire with a warm sunlight glow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtoPhblzDbCUBtQMlb9qi0FqH7e80fdBEJbdVGOg3j5FFrTT4GBoQTmh4pRYtpox66poV8Y_5DYtNKwsFIuYsJkT6QXbTf2_C7kivORuiGHdMlTPW4nU9QY0kJF1d3sn9y8Cs9DrvsFg-FSVHh8THr_6ZBXFafH4BVsUOrSdZ8JuBUMM9flMKmUjdBx7HrQz61CEdtVFmT1cz7lFWJIYBg4qBnEIMPAuFrv6rtBEz-cEbWSA4Nlut8bzWNpJAb7aLZTEPjQKHj9HI" title="Marcus" />
              <img className="w-8 h-8 rounded-full border-2 border-background object-cover" data-alt-prop="professional woman in a modern tech office smiling towards the camera" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUZsbozs98ZuolTFQQAKMU0jwrNQCHMmDfB_2EyiM3vfNr4ts0wBlhjexJ3jOOUyk1YomJw3PACOd7o8gEnMUV96LtFUNXhVyZn4_IXNw3Wm9O6AT4mT7Y7n33CsDa66bm9W68xCeXn83HeurM6E3sFx17AM5whzzxuRNXR1rX38o6rTDdM34_JtwnpxlvHl_h5RRHdBi3_mm8tdetaXmNth9uQJP0-OljZxUX6qr6zx_nj4JOGNkEQYcWEYFW7brwtXP8FrxVhkM" title="Elena" />
              <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-secondary-container">+4</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container-high px-5 py-2.5 rounded-xl font-bold text-sm text-on-surface flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
            <Filter className="text-lg" />
            Filter
          </button>
          <button className="bg-surface-container-high px-5 py-2.5 rounded-xl font-bold text-sm text-on-surface flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
            <Share className="text-lg" />
            Share
          </button>
          <button className="pulse-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            View Roadmap
          </button>
        </div>
      </div>
    </section>
  );
}