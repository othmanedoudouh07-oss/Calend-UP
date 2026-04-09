import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTaskStore, type DailyRecurring } from '@/stores/useTaskStore';
import { useHealthStore } from '@/stores/useHealthStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles, AlarmClock, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { QuickAddSheet } from '@/components/QuickAddSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Planning() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [recurringTitle, setRecurringTitle] = useState('');
  const [recurringTime, setRecurringTime] = useState('07:00');
  const [recurringPermanent, setRecurringPermanent] = useState(true);
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [recurringCategoryId, setRecurringCategoryId] = useState('personal');

  const tasks = useTaskStore((s) => s.tasks);
  const events = useTaskStore((s) => s.events);
  const dailyRecurrings = useTaskStore((s) => s.dailyRecurrings);
  const addDailyRecurring = useTaskStore((s) => s.addDailyRecurring);
  const deleteDailyRecurring = useTaskStore((s) => s.deleteDailyRecurring);
  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const categories = useSettingsStore((s) => s.categories);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayStr = format(selectedDay, 'yyyy-MM-dd');
  const dayTasks = useMemo(() => tasks.filter((t) => t.date === dayStr), [tasks, dayStr]);
  const dayEvents = useMemo(() => events.filter((e) => e.date === dayStr), [events, dayStr]);

  // Filter daily recurrings active for the selected day
  const activeDailyRecurrings = useMemo(() => {
    return dailyRecurrings.filter((r) => {
      if (!r.active) return false;
      if (dayStr < r.startDate) return false;
      if (!r.permanent && r.endDate && dayStr > r.endDate) return false;
      return true;
    });
  }, [dailyRecurrings, dayStr]);

  const dayMeds = useMemo(() => {
    return medications.filter((m) => m.active).map((m) => {
      const intake = intakes.find(
        (i) => i.medicationId === m.id && i.date === dayStr
      );
      return { ...m, intake };
    });
  }, [medications, intakes, dayStr]);

  const getCategoryColor = (id: string) =>
    categories.find((c) => c.id === id)?.color || 'bg-muted';
  const getCategoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon || '📌';

  const weekday = selectedDay.getDay();
  const suggestions = useMemo(() => {
    const dayCounts: Record<string, number> = {};
    tasks.forEach((t) => {
      const d = new Date(t.date).getDay();
      if (d === weekday) {
        dayCounts[t.title] = (dayCounts[t.title] || 0) + 1;
      }
    });
    return Object.entries(dayCounts)
      .filter(([, count]) => count >= 2)
      .map(([title]) => title)
      .slice(0, 3);
  }, [tasks, weekday]);

  const handleAddRecurring = () => {
    if (!recurringTitle.trim()) return;
    addDailyRecurring({
      id: crypto.randomUUID(),
      title: recurringTitle,
      categoryId: recurringCategoryId,
      time: recurringTime,
      permanent: recurringPermanent,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: recurringPermanent ? undefined : recurringEndDate,
      active: true,
      createdAt: new Date().toISOString(),
    });
    setRecurringTitle('');
    setRecurringOpen(false);
  };

  return (
    <div className="pb-24 safe-top">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(weekStart, "'Semaine du' d MMMM", { locale: fr })}
          </p>
        </div>
        <button
          onClick={() => setRecurringOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium"
        >
          <AlarmClock className="w-4 h-4" />
          Récurrent
        </button>
      </div>

      {/* Week navigation */}
      <div className="px-5 flex items-center justify-between mb-3">
        <button onClick={() => setWeekOffset((o) => o - 1)} className="p-2 rounded-xl bg-muted">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setWeekOffset(0); setSelectedDay(new Date()); }}
          className="text-xs font-medium text-primary"
        >
          Aujourd'hui
        </button>
        <button onClick={() => setWeekOffset((o) => o + 1)} className="p-2 rounded-xl bg-muted">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day pills */}
      <div className="flex gap-1.5 px-5 overflow-x-auto pb-2">
        {days.map((day) => {
          const active = isSameDay(day, selectedDay);
          const today = isToday(day);
          const hasTasks = tasks.some((t) => t.date === format(day, 'yyyy-MM-dd'));
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex flex-col items-center min-w-[44px] py-2 px-2 rounded-2xl transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : today
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <span className="text-[10px] font-medium uppercase">
                {format(day, 'EEE', { locale: fr })}
              </span>
              <span className="text-lg font-bold">{format(day, 'd')}</span>
              {hasTasks && !active && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mx-5 mt-4 p-3 rounded-2xl bg-accent/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="px-5 mt-5 space-y-3">
        <AnimatePresence mode="popLayout">
          {/* Daily recurring tasks */}
          {activeDailyRecurrings.map((r) => (
            <motion.div
              key={`recurring-${r.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-primary/20 bg-primary/5"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg', getCategoryColor(r.categoryId) + '/10')}>
                <AlarmClock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.time} · {r.permanent ? '♾️ Permanent' : `Jusqu'au ${r.endDate}`}
                </p>
              </div>
              <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">Quotidien</span>
            </motion.div>
          ))}

          {/* Medication reminders */}
          {dayMeds.map((med) =>
            med.times.map((t) => (
              <motion.div
                key={`med-${med.id}-${t}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-lg">💊</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage} · {t}</p>
                </div>
                <div className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  med.intake?.status === 'taken' ? 'bg-green-500/10 text-green-500' :
                  med.intake?.status === 'missed' ? 'bg-red-500/10 text-red-500' :
                  'bg-muted text-muted-foreground'
                )}>
                  {med.intake?.status === 'taken' ? '✅ Pris' :
                   med.intake?.status === 'missed' ? '❌ Oublié' : '⏳ En attente'}
                </div>
              </motion.div>
            ))
          )}

          {/* Events */}
          {dayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg', getCategoryColor(event.categoryId) + '/10')}>
                {getCategoryIcon(event.categoryId)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.startTime} - {event.endTime}</p>
              </div>
            </motion.div>
          ))}

          {/* Tasks */}
          {dayTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-2xl bg-card border border-border',
                task.status === 'completed' && 'opacity-50'
              )}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg', getCategoryColor(task.categoryId) + '/10')}>
                {getCategoryIcon(task.categoryId)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold truncate', task.status === 'completed' && 'line-through')}>
                  {task.title}
                </p>
                {task.time && <p className="text-xs text-muted-foreground">{task.time}</p>}
              </div>
              <div className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                task.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                task.status === 'postponed' ? 'bg-amber-500/10 text-amber-500' :
                'bg-muted text-muted-foreground'
              )}>
                {task.status === 'completed' ? '✅' : task.status === 'postponed' ? '⏳' : '○'}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {dayTasks.length === 0 && dayEvents.length === 0 && dayMeds.length === 0 && activeDailyRecurrings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-sm text-muted-foreground">Aucun événement pour ce jour</p>
            <p className="text-xs text-muted-foreground mt-1">Appuyez sur + pour en ajouter</p>
          </div>
        )}
      </div>

      <FloatingAddButton onClick={() => setQuickAddOpen(true)} />
      <QuickAddSheet open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      {/* Recurring task sheet */}
      <Sheet open={recurringOpen} onOpenChange={setRecurringOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg flex items-center gap-2">
              <AlarmClock className="w-5 h-5 text-primary" />
              Tâche récurrente quotidienne
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Titre de la tâche</Label>
              <Input
                value={recurringTitle}
                onChange={(e) => setRecurringTitle(e.target.value)}
                placeholder="Ex: Méditation, Sport, Lecture..."
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label>Catégorie</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setRecurringCategoryId(cat.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      recurringCategoryId === cat.id
                        ? `${cat.color} text-white shadow-md`
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Heure</Label>
              <Input
                type="time"
                value={recurringTime}
                onChange={(e) => setRecurringTime(e.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <div>
                <p className="text-sm font-semibold">Permanent</p>
                <p className="text-xs text-muted-foreground">Pas de date de fin</p>
              </div>
              <Switch checked={recurringPermanent} onCheckedChange={setRecurringPermanent} />
            </div>

            {!recurringPermanent && (
              <div>
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={recurringEndDate}
                  onChange={(e) => setRecurringEndDate(e.target.value)}
                  className="mt-1 rounded-xl"
                />
              </div>
            )}

            <Button onClick={handleAddRecurring} className="w-full h-12 rounded-xl text-base font-semibold gap-2">
              <Plus className="w-5 h-5" />
              Ajouter la tâche récurrente
            </Button>

            {/* Existing recurring tasks */}
            {dailyRecurrings.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tâches récurrentes actives</h3>
                <div className="space-y-2">
                  {dailyRecurrings.filter((r) => r.active).map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                      <AlarmClock className="w-4 h-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.time} · {r.permanent ? 'Permanent' : `Fin: ${r.endDate}`}</p>
                      </div>
                      <button onClick={() => deleteDailyRecurring(r.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
