import type { SyntheticEvent } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { useWorkspaces, useCreateWorkspace } from '@/hooks/workspace';
import type { Workspace } from '@repo/types';

export function Workspaces() {
  const { data, isLoading } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();

  const workspaces = data?.workspaces || [];

  const handleCreate = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      await createWorkspace.mutateAsync({ name, description });
      toast.success('Workspace created successfully!', { position: "top-center" });
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create workspace';
      toast.error(message, { position: "top-center" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight mb-2">Workspace Overview</h1>
        <p className="text-on-surface-variant font-body">Manage your team's environments or establish a new creative hub.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Side: Workspace List */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Active Workspaces</h2>

          {isLoading ? (
            <div className="bg-surface-container-low rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-outline-variant/30 rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-1/2"></div>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-6 border border-dashed border-outline-variant/50 text-center">
              <p className="text-sm font-medium text-on-surface-variant">No workspaces yet.</p>
              <p className="text-xs text-on-surface-variant mt-1">Create your first one on the right!</p>
            </div>
          ) : (
            workspaces.map((ws: Workspace) => (
              <Link
                key={ws.id}
                to={`/dashboard/projects?workspaceId=${ws.id}`}
                className="block bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container transition-colors cursor-pointer group mb-4 border border-transparent hover:border-outline-variant/20"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center text-primary transition-transform group-hover:scale-105">
                    <span className="font-bold text-xl uppercase font-headline">{ws.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-headline font-bold text-on-background group-hover:text-primary transition-colors">{ws.name}</h3>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{ws.description || 'No description provided'}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Side: Create Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-3xl p-8 lg:p-10 shadow-[0px_20px_40px_rgba(11,28,48,0.04)] h-full border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary text-2xl font-bold font-headline shadow-sm">
                +
              </div>
              <div>
                <h2 className="text-2xl font-headline font-extrabold text-on-background">Create New Workspace</h2>
                <p className="text-sm text-on-surface-variant mt-1">Establish a new dedicated collaborative environment.</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-on-background mb-2" htmlFor="workspace-name">Workspace Name *</label>
                <input
                  id="workspace-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="e.g., Q4 Engineering Sprint…"
                  className="w-full bg-surface-container-low text-on-background rounded-xl px-4 py-3 border-none ring-1 ring-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-surface-container-lowest transition-[background-color,ring] shadow-sm placeholder:text-on-surface-variant/70 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-background mb-2" htmlFor="workspace-desc">Description</label>
                <textarea
                  id="workspace-desc"
                  name="description"
                  rows={3}
                  autoComplete="off"
                  placeholder="Briefly describe the purpose of this workspace…"
                  className="w-full bg-surface-container-low text-on-background rounded-xl px-4 py-3 border-none ring-1 ring-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-surface-container-lowest transition-[background-color,ring] shadow-sm placeholder:text-on-surface-variant/70 resize-none font-medium"
                ></textarea>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/20"></div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createWorkspace.isPending}
                  className="px-8 py-2.5 rounded-xl pulse-gradient bg-primary text-on-primary font-bold text-sm shadow-[0px_20px_40px_rgba(11,28,48,0.1)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {createWorkspace.isPending ? 'Creating…' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
