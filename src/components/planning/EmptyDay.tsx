import { CalendarPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyDayProps {
  onAdd: () => void;
}

export function EmptyDay({ onAdd }: EmptyDayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <CalendarPlus className="w-7 h-7 text-muted-foreground/60" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground mb-1">Journée libre</p>
      <p className="text-xs text-muted-foreground/60 text-center mb-4">
        Aucune tâche ni événement prévu
      </p>
      <button
        onClick={onAdd}
        className="text-xs font-semibold text-primary px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        + Ajouter quelque chose
      </button>
    </motion.div>
  );
}
