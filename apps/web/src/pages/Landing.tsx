import { Link } from 'react-router';

export function Landing() {
  return (
    <div className="bg-background font-body text-on-background antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm dark:shadow-none bg-white/80 backdrop-blur-[20px]">
        <div className="flex justify-between items-center px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <div className="text-lg md:text-xl font-bold tracking-tighter text-indigo-700 dark:text-indigo-400 font-headline">
            The Fluid Studio
          </div>
          <div className="hidden lg:flex items-center gap-8 font-headline font-semibold tracking-tight">
            <a className="text-indigo-700 font-bold border-b-2 border-indigo-600 px-1 py-1" href="#platform">
              Platform
            </a>
            <a className="text-slate-600 hover:text-indigo-600 transition-colors duration-300" href="#solutions">
              Solutions
            </a>
            <a className="text-slate-600 hover:text-indigo-600 transition-colors duration-300" href="#resources">
              Resources
            </a>
            <a className="text-slate-600 hover:text-indigo-600 transition-colors duration-300" href="#pricing">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/login" className="hidden sm:block px-4 py-2 md:px-5 md:py-2 text-slate-600 font-headline font-semibold text-sm hover:bg-slate-50/50 transition-all">
              Log In
            </Link>
            <Link to="/signup" className="px-4 py-2 md:px-6 md:py-2.5 pulse-gradient bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-lg font-headline font-semibold text-xs md:text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 md:pt-24 overflow-hidden flex-1">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-8 pt-12 md:pt-20 pb-16 md:pb-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-box">
            <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary font-label text-xs font-semibold tracking-wide uppercase mt-4 lg:mt-0">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Version 2.0 is now live
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-headline font-extrabold tracking-tight leading-[1.1] md:leading-[1.05] text-on-surface">
                The Future of <span className="text-primary italic">Work</span> is Fluid
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
                A collaborative digital canvas where teams flow from ideation to execution without the friction of traditional management tools.
              </p>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 pt-4 lg:justify-start justify-center">
                <Link to="/signup" className="w-full sm:w-auto justify-center px-6 md:px-8 py-4 pulse-gradient bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white rounded-xl font-headline font-bold text-lg shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center gap-3">
                  Get Started Free
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <button className="w-full sm:w-auto justify-center px-6 md:px-8 py-4 bg-surface-container-high text-on-surface rounded-xl font-headline font-bold text-lg hover:bg-surface-container-highest transition-all flex items-center">
                  View Demo
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative lg:mt-0 mt-8">
              <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl md:rotate-2">
                <img
                  alt="Abstract Workflow Illustration"
                  className="w-full h-auto object-cover aspect-square"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoNALFnw60W9m2bnXf5NZ7L5hZ8oyPPUVCPs2S5cN-Y79_UYSjaq8G6JvFhwCl0JHHk5lRLe8KNqIWrvjIv_K1Mykyne7N9UTxsMXrL4vUoOKzby0ZWKKAIDgCZpl1MZ6QpkxeOuaENpEVeWDbyE7DyTg76389iWOseuV6siElLu0vI2VUxHGg9d4N5ebYiLS2K3k5zjgPyfJspiXPHNE4HayURltdhRGDMxsSlD7xHsVDG4VKGwJyMpvPnuTmIRA37R4UmL9A6Ws"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-10 sm:-left-10 bg-white p-3 sm:p-6 rounded-2xl shadow-xl z-20 flex items-center gap-3 max-w-[200px] sm:max-w-[240px]">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden">
                    <img
                      alt="User 1"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlyq4w65-YlhIAsMoh1TtEs74udK1jlucFVklRk8fpb4btUt6SikTDmyW1XVavVV1NPoIAGw7DIni8V7oXWdXTdlE_zJEvEsvD0DfJT59UlHUJumQBWqK2Pc4pU-UqwHBYEivxnsCO3DuVPjXswbbasezDH5LPoHh_zbEJcozrFpzh3cyraX4_mZ5lztjDYdt_Lu4ENpQ06vyYJkdR4eU0iKBUSntY-gUd64cRcasIv3nuFXCByeMyAp83jFRTTko7eXHY3s9MTvc"
                    />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden">
                    <img
                      alt="User 2"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu7BSsH_95gMYMYMuhvMuugLsiuip1Aw1thAicIV8POnLmxZpDHoLOqpGH2b9o5-ymTGJzyPpXjVQbIFQy_N-OwhdUtZD_FM4bOGqBc1CGh2P7tCNhRoyZDTdoAsufVgQY1P8TqNOCvTB5Y7HBX6WLYWAXud2jt5HlF_i-zBJ961RazZX_QAxEXPTT1sKnNz9VjSmp7d6OPWPQsrUawp8jdK8KpiobaPKCWBPkQuS5DLsjEorOhhdpTTtUS8xW0XnDdwPoeFD7CEA"
                    />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-tertiary text-white text-[9px] sm:text-[10px] font-bold">
                    +12
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-on-surface-variant flex-1 leading-tight">Active Collaborators</div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-surface-container-low py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <p className="text-center text-[10px] md:text-sm font-label font-medium uppercase tracking-widest text-on-surface-variant mb-8 md:mb-12">
              Trusted by world-class teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="font-headline font-extrabold text-xl md:text-2xl tracking-tighter">VERTEX</span>
              <span className="font-headline font-extrabold text-xl md:text-2xl tracking-tighter italic">Lumina</span>
              <span className="font-headline font-extrabold text-xl md:text-2xl tracking-tighter">STARK.</span>
              <span className="font-headline font-extrabold text-xl md:text-2xl tracking-tighter italic underline decoration-primary decoration-4">
                Nexus
              </span>
              <span className="font-headline font-extrabold text-xl md:text-2xl tracking-tighter">PRISM</span>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-16 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20 text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface">Momentum in every click</h2>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto px-4">
              Precision-engineered tools designed to get out of your way and let the work take center stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Large Card */}
            <div className="md:col-span-8 bg-surface-container rounded-3xl md:rounded-[2rem] p-6 lg:p-10 relative overflow-hidden group">
              <div className="relative z-10 max-w-md space-y-4 lg:space-y-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-surface-container-highest rounded-xl lg:rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl lg:text-3xl" data-icon="dashboard">
                    dashboard
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-headline font-bold">Agile Kanban Boards</h3>
                <p className="text-base lg:text-lg text-on-surface-variant">
                  Experience a board that breathes. Drag, drop, and nest tasks with editorial ease. No rigid structures, just pure flow.
                </p>
                <div className="flex items-center gap-2 lg:gap-4 text-primary font-bold hover:gap-4 lg:hover:gap-6 transition-all cursor-pointer">
                  Learn about Flow Boards
                  <span className="material-symbols-outlined">east</span>
                </div>
              </div>
              <div className="hidden sm:block absolute right-[-10%] bottom-[-10%] w-[60%] h-[80%] rounded-tl-3xl bg-white shadow-2xl p-4 transition-transform group-hover:scale-105 duration-500">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
                  <div className="flex gap-2">
                    <div className="h-20 w-1/3 bg-primary/10 rounded-xl"></div>
                    <div className="h-20 w-2/3 bg-slate-50 rounded-xl"></div>
                  </div>
                  <div className="h-32 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="md:col-span-4 bg-white rounded-3xl md:rounded-[2rem] p-6 lg:p-10 flex flex-col justify-between border border-outline-variant/20 hover:shadow-xl transition-all">
              <div className="space-y-4 lg:space-y-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-tertiary/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-2xl lg:text-3xl" data-icon="sync">
                    sync
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-headline font-bold">Real-time Team Sync</h3>
                <p className="text-sm lg:text-base text-on-surface-variant">See who's active, where they're working, and what's next in one continuous pulse.</p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container"></div>
                  <div className="w-8 h-8 rounded-full bg-tertiary-container"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container"></div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Typing...</span>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="md:col-span-4 bg-on-surface text-white rounded-3xl md:rounded-[2rem] p-6 lg:p-10 flex flex-col justify-between group">
              <div className="space-y-4 lg:space-y-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-2xl lg:text-3xl" data-icon="insights">
                    insights
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-headline font-bold">Smart Project Analytics</h3>
                <p className="text-sm lg:text-base text-slate-400">Identify bottlenecks before they become roadblocks with automated performance heatmaps.</p>
              </div>
              <div className="mt-8 h-20 lg:h-24 flex items-end gap-1 overflow-hidden">
                <div className="w-full bg-primary-container h-[40%] rounded-t-lg transition-all group-hover:h-[60%]"></div>
                <div className="w-full bg-primary-container h-[70%] rounded-t-lg transition-all group-hover:h-[90%]"></div>
                <div className="w-full bg-primary-container h-[50%] rounded-t-lg transition-all group-hover:h-[70%]"></div>
                <div className="w-full bg-primary-container h-[90%] rounded-t-lg transition-all group-hover:h-[50%]"></div>
                <div className="w-full bg-primary-container h-[60%] rounded-t-lg transition-all group-hover:h-[80%]"></div>
              </div>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-8 bg-surface-container-high rounded-3xl md:rounded-[2rem] p-6 lg:p-10 overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-headline font-bold">Built for speed.</h3>
                  <p className="text-sm lg:text-base text-on-surface-variant">Fluid Studio is optimized for keyboard-first navigation and millisecond responsiveness.</p>
                  <div className="flex gap-3">
                    <kbd className="px-3 py-1.5 bg-white rounded-lg shadow-sm font-mono text-xs font-bold text-on-surface">⌘ K</kbd>
                    <span className="text-xs text-on-surface-variant flex items-center">Open Command Palette</span>
                  </div>
                </div>
                <div className="hidden lg:block relative h-full">
                  <img
                    alt="Speed Focus"
                    className="rounded-2xl shadow-lg absolute right-[-40px] top-1/2 -translate-y-1/2 min-w-[120%]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHena-i1dU8xPPKVoIlOMiKFK1GHc8Hz_z__3wzG8tkKPyQ2-qWgbKcy5t30R8N_srCCPT3lpFs_KuZ8rOZA8CYxT_MVno7Dp81lYwFHKAfAVCAXrMduOXSQ5tTyXqOlLC829e7K5tAl2m_esF79akbQlCOHwjbCeQStgEfXfP_DwX-J6Xb14ce7FB5SaTabl9URUvcBF47MkdxCEyeVn8bwc1nVU8_AH3LYUVqic5dfvNX9PXFNwuAVeHT-OP3y7GzsHsn6DSPIQ"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="px-4 sm:px-8 pb-16 md:pb-32">
          <div className="max-w-7xl mx-auto pulse-gradient bg-gradient-to-br from-[#3525cd] to-[#4f46e5] rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-24 text-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-10 -left-10 md:-top-20 md:-left-20 w-64 h-64 md:w-96 md:h-96 border-[20px] md:border-[40px] border-white rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 w-40 h-40 md:w-64 md:h-64 border-[10px] md:border-[20px] border-white rounded-full"></div>
            </div>

            <div className="relative z-10 space-y-6 md:space-y-10">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-headline font-extrabold text-white leading-tight max-w-4xl mx-auto">
                Join 10,000+ teams moving faster together.
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                The best work doesn't happen in a silo. It happens in the flow. Start your 14-day free trial today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full">
                <Link to="/signup" className="w-full sm:w-auto px-6 md:px-10 py-4 lg:py-5 bg-white text-primary rounded-xl md:rounded-2xl font-headline font-extrabold text-base md:text-xl hover:bg-surface-bright transition-all shadow-2xl inline-flex justify-center items-center">
                  Get Started Now
                </Link>
                <button className="w-full sm:w-auto px-6 md:px-10 py-4 lg:py-5 bg-white/10 text-white rounded-xl md:rounded-2xl font-headline font-extrabold text-base md:text-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 inline-flex justify-center items-center">
                  Book a Demo
                </button>
              </div>
              <div className="pt-4 md:pt-8 text-white/60 font-label text-xs md:text-sm">
                No credit card required. Cancel anytime.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-6 md:px-8 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 max-w-7xl mx-auto">
          <div className="space-y-4 md:space-y-6">
            <div className="font-headline font-bold text-slate-900 dark:text-slate-100 text-xl md:text-2xl">The Fluid Studio</div>
            <p className="font-inter text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Redefining productivity for the modern, distributed creative team.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all cursor-pointer">
                <span className="material-symbols-outlined text-sm" data-icon="public">
                  public
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all cursor-pointer">
                <span className="material-symbols-outlined text-sm" data-icon="alternate_email">
                  alternate_email
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end justify-between space-y-6 md:space-y-0 text-left md:text-right">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-8 font-inter text-sm text-slate-500 dark:text-slate-400 justify-start md:justify-end">
              <a className="hover:text-indigo-600 transition-colors" href="#privacy">Privacy Policy</a>
              <a className="hover:text-indigo-600 transition-colors" href="#terms">Terms of Service</a>
              <a className="hover:text-indigo-600 transition-colors" href="#security">Security</a>
              <a className="hover:text-indigo-600 transition-colors" href="#status">Status</a>
              <a className="hover:text-indigo-600 transition-colors" href="#contact">Contact Us</a>
            </div>
            <div className="font-inter text-xs md:text-sm text-slate-500 dark:text-slate-400 opacity-80 hover:opacity-100 transition-opacity">
              © {new Date().getFullYear()} The Fluid Studio. Built for momentum.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
