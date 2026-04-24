import { useMe } from '@/hooks/auth';
import {
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  MoreHorizontal
} from 'lucide-react';

export function Home() {

  const { data } = useMe();

  function getGreeting() {
    const hour = new Date().getHours();
    const firstName = data?.user.name.split(' ')[0] ?? 'there';
    let greeting: string;

    if (hour < 12) {
      greeting = "Good Morning";
    } else if (hour < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
    return greeting + ", " + firstName;
  }

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-[1440px] mx-auto w-full">
      {/* Hero Greeting */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-extrabold font-headline tracking-tighter text-on-background">
              {getGreeting()}.
            </h2>
            <p className="text-lg text-on-surface-variant mt-2 max-w-xl">
              You have <span className="text-primary font-bold">4 high-priority tasks</span> requiring attention today. The studio is humming.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Deadlines Summary (Wide) */}
        <div className="md:col-span-8 bg-surface-container-low rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-headline tracking-tight text-on-surface">Critical Deadlines</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              View Schedule <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 group hover:bg-surface-container hover:border-transparent transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Due Today
                </span>
                <Clock className="text-on-surface-variant w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-headline mb-1 group-hover:text-primary transition-colors text-on-surface">
                Mobile App V2 Final Review
              </h4>
              <p className="text-sm text-on-surface-variant line-clamp-2">
                Complete the high-fidelity prototypes for the checkout flow and user onboarding.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-error w-[85%] rounded-full"></div>
                </div>
                <span className="text-xs font-bold text-error">85%</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 group hover:bg-surface-container hover:border-transparent transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Tomorrow
                </span>
                <Zap className="text-on-surface-variant w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-headline mb-1 group-hover:text-primary transition-colors text-on-surface">
                Brand Identity Guidelines
              </h4>
              <p className="text-sm text-on-surface-variant line-clamp-2">
                Document the typography system and color palette for Kinetic Indigo.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[40%] rounded-full"></div>
                </div>
                <span className="text-xs font-bold text-primary">40%</span>
              </div>
            </div>
          </div>
        </div>
        {/* Priority Tasks (Bottom Wide) */}
        <div className="md:col-span-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-headline tracking-tight text-on-surface">Top Priority Tasks</h3>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-surface-container-low rounded-lg text-sm font-medium hover:bg-surface-container transition-colors text-on-surface">
                All Projects
              </button>
              <button className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                My Tasks
              </button>
            </div>
          </div>
          <div className="bg-surface-container rounded-3xl overflow-hidden p-2">
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low">
                    <th className="px-8 py-4">Task Name</th>
                    <th className="px-8 py-4">Project</th>
                    <th className="px-8 py-4">Assignee</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high relative">
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-bold text-on-surface group-hover:text-primary transition-colors cursor-pointer">Refactor API Middleware</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">Phoenix Platform</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <img className="w-6 h-6 rounded-full" data-alt="Portrait of a professional man in a casual shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDosTnzFmjBLXU-SZg3GlOYkVmYMRUFtCykbeUhwojiqO8-uKnQw4ZUQDQJzG8L_QvoDuvz-mzu8lSadF2je6cb79PU9Z-Ro7mS3ccjeStTE26bBx6oailXpprERXGrjFro3WsYW5ALd6Y4mM-Om4pXZFunySmoQJ0qXoiD29O96R5pUPXF6IxScCSlCk31qriOg8rxU2W5ilrtfqQqLiL8i7lhbvZbfiEpG_lm2GLoTDK8T387S5i0pUFG9KPTzJWRiAQe_kIcbEk" />
                        <span className="text-xs font-medium text-on-surface">David K.</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-wider">In Progress</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-outline-variant hover:text-primary"><MoreHorizontal className="w-5 h-5" /></button>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Circle className="w-5 h-5 text-outline-variant" />
                        <span className="font-bold text-on-surface group-hover:text-primary transition-colors cursor-pointer">User Feedback Interviews</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">Product Research</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <img className="w-6 h-6 rounded-full" data-alt="Portrait of a creative professional woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRUBgUbgpIv8tWo8GZf-cgwqHXOWI1HmGLf8T_CB0jCGVI0XVYaneh6AJISHm5k6KK-O4hSqCItDzyiiaB-QtG93cbwFYl5WqLbi7yvhGSIByw0nB5Wd-ENSkRiFNdO8V_Ql19rRUFzw_Ve9NMFSUFmB6uK_hsxAC2Hb9j52j6DrOi7dyvQZkL3n87g5NoC-DXIT91aN6E6BQd6Ak0B4Ix_dHJr8b1q4xHmROJOK82A5ivbo5MpurcKtZELaliSZdHz3t4oBDToMo" />
                        <span className="text-xs font-medium text-on-surface">Emma L.</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-wider">Pending</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-outline-variant hover:text-primary"><MoreHorizontal className="w-5 h-5" /></button>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-bold text-on-surface group-hover:text-primary transition-colors cursor-pointer">Secure Payment Gateway</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">E-Commerce Flow</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <img className="w-6 h-6 rounded-full" data-alt="Portrait of a technical lead" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5FR2UNh9ilYj4CoQcMeM7Cn2zZyUpyTdpe3cKWFHdzcuRuYett18aZaivZHGe-C95juQ0lJ3R0yK_4Vc71ZppnVrGhnMRF0vZ2bk_CNncqH6Y6cizobXXIt3xrpzWONyFpQQzlQvXoNSsvOMCL01Qbl5nkReNrCYfqKqvBDbUC8mOYJoaxLEVXydrOWS18gUDoyO7TGF0jo66S9rEBYHoVm7_MGaylFdp7H8bdcEw7s80HLbYqMZ-NbYb5KmNyPmmvc--RrLOjJ8" />
                        <span className="text-xs font-medium text-on-surface">Alex R.</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-[10px] font-bold uppercase tracking-wider">Critical</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-outline-variant hover:text-primary"><MoreHorizontal className="w-5 h-5" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
