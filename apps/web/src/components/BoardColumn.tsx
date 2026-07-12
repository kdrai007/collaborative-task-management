import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

interface BoardColumnProps {
  title: string;
  count: number;
  countBadgeClass: string;
  columnBgClass: string;
  showAddButton?: boolean;
  children: ReactNode;
}

export default function BoardColumn({
  title,
  count,
  countBadgeClass,
  columnBgClass,
  showAddButton = false,
  children,
}: BoardColumnProps) {
  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <h3 className="font-headline font-bold text-lg text-on-background">{title}</h3>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${countBadgeClass}`}>
            {count}
          </span>
        </div>
        {showAddButton && (
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <Plus />
          </button>
        )}
      </div>
      <div className={`flex flex-col gap-4 p-3 rounded-2xl min-h-[500px] ${columnBgClass}`}>
        {children}
      </div>
    </div>
  );
}
