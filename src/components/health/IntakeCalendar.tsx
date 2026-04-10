import { useMemo } from 'react';
import { useHealthStore } from '@/stores/useHealthStore';
import { format, subDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function IntakeCalendar() {
  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const activeMeds = medications.filter((m) => m.active);

  const days = useMemo(() => {
    const result: { date: string; label: string; dayName: string; status: 'perfect' | 'partial' | 'missed' | 'empty' }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayIntakes = intakes.filter((int) => int.date === dateStr);
      const totalExpected = activeMeds.reduce((sum, m) => sum + m.times.length, 0);

      let status: 'perfect' | 'partial' | 'missed' | 'empty' = 'empty';
      if (totalExpected > 0) {
        const taken = dayIntakes.filter((int) => int.status === 'taken').length;
        if (taken >= totalExpected) status = 'perfect';
        else if (taken > 0) status = 'partial';
        else if (dayIntakes.length > 0) status = 'missed';
        else status = 'empty';
      }

      result.push({
        date: dateStr,
        label: format(d, 'd'),
        dayName: format(d, 'EEEEE', { locale: fr }),
        status,
      });
    }
    return result;
  }, [intakes, activeMeds]);

  const statusColors = {
    perfect: 'bg-green-500',
    partial: 'bg-amber-500',
    missed: 'bg-red-500',
    empty: 'bg-muted',
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.slice(-28).map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.015 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[9px] text-muted-foreground">{day.dayName}</span>
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all',
              statusColors[day.status],
              day.status !== 'empty' ? 'text-white' : 'text-muted-foreground',
              day.date === format(new Date(), 'yyyy-MM-dd') && 'ring-2 ring-primary ring-offset-1 ring-offset-card'
            )}>
              {day.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        {[
          { label: 'Parfait', color: 'bg-green-500' },
          { label: 'Partiel', color: 'bg-amber-500' },
          { label: 'Manqué', color: 'bg-red-500' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded-sm', l.color)} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
