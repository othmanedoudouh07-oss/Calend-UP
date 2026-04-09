import { cn } from '@/lib/utils';
import { AlarmClock, Calendar, CheckCircle2, Circle, Clock, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

type ItemType = 'recurring' | 'medication' | 'event' | 'task';

interface TimelineItemProps {
  type: ItemType;
  title: string;
  subtitle: string;
  time?: string;
  status?: 'pending' | 'completed' | 'postponed' | 'taken' | 'missed';
  categoryIcon?: string;
  categoryColor?: string;
  badge?: string;
  index: number;
}

const typeConfig: Record<ItemType, { icon: typeof AlarmClock; accent: string }> = {
  recurring: { icon: AlarmClock, accent: 'border-primary/30 bg-primary/5' },
  medication: { icon: Pill, accent: 'border-destructive/20 bg-destructive/5' },
  event: { icon: Calendar, accent: 'border-border' },
  task: { icon: Circle, accent: 'border-border' },
};

const statusConfig: Record<string, { label: string; class: string }> = {
  completed: { label: '✅', class: 'bg-green-500/10 text-green-500' },
  taken: { label: '✅ Pris', class: 'bg-green-500/10 text-green-500' },
  missed: { label: '❌ Oublié', class: 'bg-destructive/10 text-destructive' },
  postponed: { label: '⏳', class: 'bg-amber-500/10 text-amber-500' },
  pending: { label: '○', class: 'bg-muted text-muted-foreground' },
};

export function TimelineItem({ type, title, subtitle, time, status, categoryIcon, badge, index }: TimelineItemProps) {
  const config = typeConfig[type];
  const statusCfg = status ? statusConfig[status] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-2xl bg-card border transition-all',
        config.accent,
        status === 'completed' && 'opacity-50'
      )}
    >
      {/* Time column */}
      {time && (
        <div className="flex flex-col items-center min-w-[40px]">
          <span className="text-xs font-bold text-foreground">{time.split(':')[0]}</span>
          <span className="text-[10px] text-muted-foreground">:{time.split(':')[1]}</span>
        </div>
      )}

      {/* Divider line */}
      {time && <div className="w-px h-8 bg-border/60 self-center" />}

      {/* Icon */}
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
        type === 'recurring' ? 'bg-primary/10' :
        type === 'medication' ? 'bg-destructive/10' :
        'bg-muted'
      )}>
        {categoryIcon ? (
          <span className="text-base">{categoryIcon}</span>
        ) : type === 'medication' ? (
          <span className="text-base">💊</span>
        ) : (
          <config.icon className={cn(
            'w-4 h-4',
            type === 'recurring' ? 'text-primary' : 'text-muted-foreground'
          )} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-semibold truncate',
          status === 'completed' && 'line-through text-muted-foreground'
        )}>
          {title}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>
      </div>

      {/* Badge / Status */}
      {badge && (
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary shrink-0">
          {badge}
        </span>
      )}
      {statusCfg && (
        <span className={cn('text-[11px] font-medium px-2 py-1 rounded-full shrink-0', statusCfg.class)}>
          {statusCfg.label}
        </span>
      )}
    </motion.div>
  );
}
