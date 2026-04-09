import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTaskStore, type DailyRecurring } from '@/stores/useTaskStore';
import { useHealthStore } from '@/stores/useHealthStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils';
import { Sparkles, AlarmClock, Plus, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { QuickAddSheet } from '@/components/QuickAddSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { WeekStrip } from '@/components/planning/WeekStrip';
import { DayProgress } from '@/components/planning/DayProgress';
import { TimelineItem } from '@/components/planning/TimelineItem';
import { EmptyDay } from '@/components/planning/EmptyDay';

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

  // Task counts per day for week strip dots
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    days.forEach((day) => {
      const ds = format(day, 'yyyy-MM-dd');
      counts[ds] = tasks.filter((t) => t.date === ds).length + events.filter((e) => e.date === ds).length;
    });
    return counts;
  }, [tasks, events, days]);

  const dayTasks = useMemo(() => tasks.filter((t) => t.date === dayStr), [tasks, dayStr]);
  const dayEvents = useMemo(() => events.filter((e) => e.date === dayStr), [events, dayStr]);

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
      const intake = intakes.find((i) => i.medicationId === m.id && i.date === dayStr);
      return { ...m, intake };
    });
  }, [medications, intakes, dayStr]);

  const getCategoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon || '📌';

  // Progress
  const totalItems = dayTasks.length + activeDailyRecurrings.length;
  const completedItems = dayTasks.filter((t) => t.status === 'completed').length;
  const pendingItems = totalItems - completedItems;

  // Suggestions
  const weekday = selectedDay.getDay();
  const suggestions = useMemo(() => {
    const dayCounts: Record<string, number> = {};
    tasks.forEach((t) => {
      const d = new Date(t.date).getDay();
      if (d === weekday) dayCounts[t.title] = (dayCounts[t.title] || 0) + 1;
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

  const hasItems = dayTasks.length > 0 || dayEvents.length > 0 || dayMeds.length > 0 || activeDailyRecurrings.length > 0;
  let timelineIndex = 0;

  return (
    <div className="pb-24 safe-top">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Planning</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(weekStart, "'Semaine du' d MMMM", { locale: fr })}
          </p>
        </div>
        <button
          onClick={() => setRecurringOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
        >
          <AlarmClock className="w-3.5 h-3.5" />
          Récurrent
        </button>
      </div>

      {/* Week strip */}
      <WeekStrip
        days={days}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrev={() => setWeekOffset((o) => o - 1)}
        onNext={() => setWeekOffset((o) => o + 1)}
        onToday={() => { setWeekOffset(0); setSelectedDay(new Date()); }}
        taskCounts={taskCounts}
      />

      {/* Day progress */}
      <DayProgress total={totalItems} completed={completedItems} pending={pendingItems} />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mx-5 mt-4 p-3 rounded-2xl bg-accent/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-primary">Suggestions du jour</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <span key={s} className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="px-5 mt-5 space-y-2">
        {hasItems && (
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {format(selectedDay, 'EEEE d MMMM', { locale: fr })}
          </p>
        )}

        <AnimatePresence mode="popLayout">
          {activeDailyRecurrings.map((r) => (
            <TimelineItem
              key={`rec-${r.id}`}
              type="recurring"
              title={r.title}
              subtitle={r.permanent ? '♾️ Permanent' : `Jusqu'au ${r.endDate}`}
              time={r.time}
              categoryIcon={getCategoryIcon(r.categoryId)}
              badge="Quotidien"
              index={timelineIndex++}
            />
          ))}

          {dayMeds.map((med) =>
            med.times.map((t) => (
              <TimelineItem
                key={`med-${med.id}-${t}`}
                type="medication"
                title={med.name}
                subtitle={`${med.dosage} · ${t}`}
                time={t}
                status={med.intake?.status === 'taken' ? 'taken' : med.intake?.status === 'missed' ? 'missed' : 'pending'}
                index={timelineIndex++}
              />
            ))
          )}

          {dayEvents.map((event) => (
            <TimelineItem
              key={event.id}
              type="event"
              title={event.title}
              subtitle={`${event.startTime} - ${event.endTime}`}
              time={event.startTime}
              categoryIcon={getCategoryIcon(event.categoryId)}
              index={timelineIndex++}
            />
          ))}

          {dayTasks.map((task) => (
            <TimelineItem
              key={task.id}
              type="task"
              title={task.title}
              subtitle={task.time || 'Pas d\'heure définie'}
              time={task.time}
              status={task.status as 'pending' | 'completed' | 'postponed'}
              categoryIcon={getCategoryIcon(task.categoryId)}
              index={timelineIndex++}
            />
          ))}
        </AnimatePresence>

        {!hasItems && <EmptyDay onAdd={() => setQuickAddOpen(true)} />}
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
