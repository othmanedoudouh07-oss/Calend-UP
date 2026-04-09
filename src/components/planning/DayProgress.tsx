import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

interface DayProgressProps {
  total: number;
  completed: number;
  pending: number;
}

export function DayProgress({ total, completed, pending }: DayProgressProps) {
  if (total === 0) return null;

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-5 mt-4 p-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground">Progression du jour</span>
        <span className={cn(
          'text-xs font-bold px-2 py-0.5 rounded-full',
          pct === 100 ? 'bg-green-500/15 text-green-500' : 'bg-primary/10 text-primary'
        )}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            pct === 100 ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <ListTodo className="w-3 h-3" />
          <span>{total} total</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-green-500">
          <CheckCircle2 className="w-3 h-3" />
          <span>{completed} fait{completed > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{pending} restant{pending > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
