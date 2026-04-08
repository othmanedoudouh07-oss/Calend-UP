import { useState, useMemo } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { format, isToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { QuickAddSheet } from '@/components/QuickAddSheet';
import { ChevronDown, Check, Clock, Trash2 } from 'lucide-react';

type Filter = 'today' | 'week' | 'all';

export default function Tasks() {
  const [filter, setFilter] = useState<Filter>('today');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const categories = useSettingsStore((s) => s.categories);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      if (filter === 'today') return isToday(new Date(t.date));
      if (filter === 'week') {
        const ws = startOfWeek(now, { weekStartsOn: 1 });
        const we = endOfWeek(now, { weekStartsOn: 1 });
        return isWithinInterval(new Date(t.date), { start: ws, end: we });
      }
      return true;
    });
  }, [tasks, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredTasks> = {};
    filteredTasks.forEach((t) => {
      if (!groups[t.categoryId]) groups[t.categoryId] = [];
      groups[t.categoryId].push(t);
    });
    return groups;
  }, [filteredTasks]);

  const overdue = tasks.filter(
    (t) => t.status === 'pending' && new Date(t.date) < new Date() && !isToday(new Date(t.date))
  ).length;

  const filters: { key: Filter; label: string }[] = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'all', label: 'Toutes' },
  ];

  return (
    <div className="pb-24 safe-top">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tâches</h1>
          {overdue > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              {overdue} en retard
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-5 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-medium transition-all',
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped tasks */}
      <div className="px-5 space-y-3">
        {Object.entries(grouped).map(([catId, catTasks]) => {
          const cat = categories.find((c) => c.id === catId);
          const expanded = expandedCat === catId || expandedCat === null;
          return (
            <div key={catId} className="rounded-2xl bg-card border border-border overflow-hidden">
              <button
                onClick={() => setExpandedCat(expanded && expandedCat !== null ? null : catId)}
                className="w-full flex items-center gap-3 p-3"
              >
                <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm', cat?.color + '/20')}>
                  {cat?.icon}
                </span>
                <span className="text-sm font-semibold flex-1 text-left">{cat?.name || catId}</span>
                <span className="text-xs text-muted-foreground mr-2">{catTasks.length}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {catTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 border-t border-border/50">
                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              status: task.status === 'completed' ? 'pending' : 'completed',
                            })
                          }
                          className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                            task.status === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-muted-foreground/30'
                          )}
                        >
                          {task.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm truncate', task.status === 'completed' && 'line-through text-muted-foreground')}>
                            {task.title}
                          </p>
                          {task.time && (
                            <p className="text-xs text-muted-foreground">{task.time} · {format(new Date(task.date), 'dd/MM')}</p>
                          )}
                        </div>
                        <button
                          onClick={() => updateTask(task.id, { status: 'postponed' })}
                          className="p-1.5 text-muted-foreground hover:text-amber-500"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-sm text-muted-foreground">Aucune tâche</p>
          </div>
        )}
      </div>

      <FloatingAddButton onClick={() => setQuickAddOpen(true)} />
      <QuickAddSheet open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </div>
  );
}
