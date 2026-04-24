import { CalendarDays, CheckCircle, Eye, History, MessageSquare, MoreHorizontal, Paperclip } from 'lucide-react';
import DOMPurify from 'dompurify';

export interface TaskTag {
  label: string;
  containerClass: string;
}

export interface TaskAssignee {
  src: string;
  name?: string;
}

export interface TaskProgress {
  percentage: number;
}

export interface TaskStats {
  comments?: number;
  attachments?: number;
}

export interface TaskCardProps {
  title: string;
  description?: string;
  image?: string;
  tag: TaskTag;
  assignees?: TaskAssignee[];
  dueDate?: string;
  completedDate?: string;
  isOverdue?: boolean;
  isCompleted?: boolean;
  progress?: TaskProgress;
  stats?: TaskStats;
  badgeIcon?: 'more' | 'eye' | 'check';
  className?: string;
}

export default function TaskCard({
  title,
  description,
  image,
  tag,
  assignees = [],
  dueDate,
  completedDate,
  isOverdue,
  isCompleted,
  progress,
  stats,
  badgeIcon = 'more',
  className = '',
}: TaskCardProps) {
  const getBadgeIcon = () => {
    switch (badgeIcon) {
      case 'eye':
        return <Eye className="text-primary transition-transform duration-300 group-hover:scale-110" />;
      case 'check':
        return <CheckCircle className="text-green-600 transition-transform duration-300 group-hover:scale-110" />;
      case 'more':
      default:
        return (
          <button className="text-on-surface-variant/50 opacity-0 group-hover:opacity-100 transition-opacity hover:text-on-surface">
            <MoreHorizontal />
          </button>
        );
    }
  };

  const baseClasses = "p-5 rounded-xl shadow-sm transition-all duration-500 group cursor-grab active:cursor-grabbing hover:-translate-y-0.5";
  // The 'Done' generic look
  const defaultBg = className.includes('bg-') ? '' : 'bg-surface-container-lowest hover:bg-surface-container hover:shadow-ambient';

  return (
    <div
      className={`${baseClasses} ${defaultBg} ${className}`}
    >
      {image ? (
        <div className="mb-3">
          <img
            className="w-full h-32 object-cover rounded-lg mb-4"
            alt="Task cover"
            src={image}
          />
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${tag.containerClass}`}>
            {tag.label}
          </span>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${tag.containerClass}`}>
            {tag.label}
          </span>
          {getBadgeIcon()}
        </div>
      )}

      <h4 className={`font-bold leading-snug mb-3 ${isCompleted ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
        {title}
      </h4>

      {description && (
        <div
          className="text-on-surface-variant text-xs mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
        />
      )}

      {progress && (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${progress.percentage}%` }}></div>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant">{progress.percentage}%</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        {assignees.length > 0 && (
          <div className="flex -space-x-2">
            {assignees.map((user, idx) => (
              <img
                key={idx}
                className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover"
                alt={user.name || 'Assignee'}
                src={user.src}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {stats && (
            <>
              {stats.comments ? (
                <div className="flex items-center gap-1 text-on-surface-variant text-[10px]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {stats.comments}
                </div>
              ) : null}
              {stats.attachments ? (
                <div className="flex items-center gap-1 text-on-surface-variant text-[10px]">
                  <Paperclip className="w-3.5 h-3.5" />
                  {stats.attachments}
                </div>
              ) : null}
            </>
          )}

          {!stats && dueDate && (
            <div className={`flex items-center gap-1.5 text-[11px] ${isOverdue ? 'text-error font-bold' : 'text-on-surface-variant font-medium'}`}>
              {isOverdue ? <History className="w-3.5 h-3.5" /> : <CalendarDays className="w-3.5 h-3.5" />}
              {isOverdue ? 'Overdue' : dueDate}
            </div>
          )}

          {isCompleted && completedDate && (
            <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-medium">
              Completed {completedDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
