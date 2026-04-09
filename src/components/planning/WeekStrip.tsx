import { format, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeekStripProps {
  days: Date[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  taskCounts: Record<string, number>;
}

export function WeekStrip({ days, selectedDay, onSelectDay, onPrev, onNext, onToday, taskCounts }: WeekStripProps) {
  return (
    <div className="mx-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 p-3">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrev} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={onToday}
          className="text-xs font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          Aujourd'hui
        </button>
        <button onClick={onNext} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const active = isSameDay(day, selectedDay);
          const today = isToday(day);
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = taskCounts[dateStr] || 0;

          return (
            <motion.button
              key={day.toISOString()}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectDay(day)}
              className={cn(
                'flex flex-col items-center py-2 px-1 rounded-xl transition-all relative',
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : today
                  ? 'bg-accent/80 text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide">
                {format(day, 'EEE', { locale: fr })}
              </span>
              <span className={cn('text-lg font-bold mt-0.5', active && 'text-primary-foreground')}>
                {format(day, 'd')}
              </span>
              {count > 0 && (
                <div className={cn(
                  'flex gap-0.5 mt-1',
                )}>
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1 h-1 rounded-full',
                        active ? 'bg-primary-foreground/70' : 'bg-primary/60'
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
