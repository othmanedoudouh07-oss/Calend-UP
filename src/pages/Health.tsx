import { useState, useMemo } from 'react';
import { useHealthStore } from '@/stores/useHealthStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pill, Check, X, Clock, Trash2, Calendar, Sun, Sunset, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import MedicationStepper from '@/components/health/MedicationStepper';
import IntakeCalendar from '@/components/health/IntakeCalendar';
import type { IntakeStatus, Medication } from '@/types';

type Tab = 'today' | 'treatments' | 'history';

function groupByTime(t: string): 'morning' | 'afternoon' | 'evening' {
  const h = parseInt(t.split(':')[0]);
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

const timeGroupMeta = {
  morning: { label: 'Matin', icon: Sun, emoji: '☀️' },
  afternoon: { label: 'Après-midi', icon: Sunset, emoji: '🌤️' },
  evening: { label: 'Soir', icon: Moon, emoji: '🌙' },
};

export default function Health() {
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('today');

  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const addMedication = useHealthStore((s) => s.addMedication);
  const deleteMedication = useHealthStore((s) => s.deleteMedication);
  const addIntake = useHealthStore((s) => s.addIntake);
  const updateIntake = useHealthStore((s) => s.updateIntake);

  const today = format(new Date(), 'yyyy-MM-dd');
  const activeMeds = medications.filter((m) => m.active);

  const todayStats = useMemo(() => {
    const totalSlots = activeMeds.reduce((s, m) => s + m.times.length, 0);
    const todayIntakes = intakes.filter((i) => i.date === today);
    const taken = todayIntakes.filter((i) => i.status === 'taken').length;
    return { total: totalSlots, taken, pct: totalSlots > 0 ? Math.round((taken / totalSlots) * 100) : 0 };
  }, [activeMeds, intakes, today]);

  // Streak
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const totalSlots = activeMeds.reduce((s, m) => s + m.times.length, 0);
      if (totalSlots === 0) break;
      const taken = intakes.filter((int) => int.date === dateStr && int.status === 'taken').length;
      if (taken >= totalSlots) count++;
      else break;
    }
    return count;
  }, [activeMeds, intakes]);

  const markIntake = (medId: string, time: string, status: IntakeStatus) => {
    const existing = intakes.find((i) => i.medicationId === medId && i.date === today && i.time === time);
    if (existing) {
      updateIntake(existing.id, { status, takenAt: status === 'taken' ? new Date().toISOString() : undefined });
    } else {
      addIntake({
        id: crypto.randomUUID(),
        medicationId: medId, date: today, time, status,
        takenAt: status === 'taken' ? new Date().toISOString() : undefined,
      });
    }
  };

  // Group today's intakes by time of day
  const groupedIntakes = useMemo(() => {
    const groups: Record<string, { med: Medication; time: string }[]> = { morning: [], afternoon: [], evening: [] };
    activeMeds.forEach((med) => {
      med.times.forEach((t) => {
        groups[groupByTime(t)].push({ med, time: t });
      });
    });
    return groups;
  }, [activeMeds]);

  const handleAddMed = (med: Medication) => {
    addMedication(med);
    setAddOpen(false);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'today', label: 'Aujourd\'hui' },
    { key: 'treatments', label: 'Traitements' },
    { key: 'history', label: 'Historique' },
  ];

  return (
    <div className="pb-24 safe-top">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Santé</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Suivi de traitements</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Stats header */}
      <div className="px-5 mb-5">
        <div className="flex gap-3">
          {/* Progress circle */}
          <div className="flex-shrink-0 relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" strokeWidth="6" className="stroke-muted" />
              <circle
                cx="40" cy="40" r="34" fill="none" strokeWidth="6"
                strokeLinecap="round"
                className="stroke-primary transition-all duration-700"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - todayStats.pct / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{todayStats.pct}%</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-card border border-border text-center">
              <p className="text-lg font-bold text-primary">{todayStats.taken}/{todayStats.total}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Prises</p>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border text-center">
              <p className="text-lg font-bold text-primary">{streak}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Jours consécutifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 p-1 rounded-xl bg-card border border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all',
                tab === t.key ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'today' && (
          <motion.div key="today" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 space-y-5">
            {activeMeds.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">💊</p>
                <p className="text-sm text-muted-foreground">Aucun traitement actif</p>
                <button onClick={() => setAddOpen(true)} className="mt-3 text-sm font-semibold text-primary">
                  + Ajouter un traitement
                </button>
              </div>
            ) : (
              (['morning', 'afternoon', 'evening'] as const).map((group) => {
                const items = groupedIntakes[group];
                if (items.length === 0) return null;
                const meta = timeGroupMeta[group];
                return (
                  <div key={group}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{meta.emoji}</span>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{meta.label}</h3>
                    </div>
                    <div className="space-y-2">
                      {items.map(({ med, time: t }) => {
                        const intake = intakes.find(
                          (i) => i.medicationId === med.id && i.date === today && i.time === t
                        );
                        return (
                          <motion.div
                            key={`${med.id}-${t}`}
                            layout
                            className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                          >
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg', med.color || 'bg-red-500')}>
                              {med.icon || '💊'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{med.name}</p>
                              <p className="text-xs text-muted-foreground">{med.dosage} · {t}</p>
                            </div>
                            <div className="flex gap-1.5">
                              {([
                                { st: 'taken' as const, Icon: Check, active: 'bg-green-500 text-white', label: 'Pris' },
                                { st: 'postponed' as const, Icon: Clock, active: 'bg-amber-500 text-white', label: 'Reporté' },
                                { st: 'missed' as const, Icon: X, active: 'bg-red-500 text-white', label: 'Manqué' },
                              ]).map(({ st, Icon, active }) => (
                                <motion.button
                                  key={st}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => markIntake(med.id, t, st)}
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                                    intake?.status === st ? active : 'bg-muted text-muted-foreground'
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {tab === 'treatments' && (
          <motion.div key="treatments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 space-y-3">
            {activeMeds.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🩺</p>
                <p className="text-sm text-muted-foreground">Aucun traitement</p>
              </div>
            ) : (
              activeMeds.map((med) => (
                <motion.div key={med.id} layout className="p-4 rounded-2xl bg-card border border-border">
                  <div className="flex items-start gap-3">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg', med.color || 'bg-red-500')}>
                      {med.icon || '💊'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{med.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{med.dosage} · {
                        { daily: '1x/jour', twice_daily: '2x/jour', three_times: '3x/jour', weekly: '1x/semaine', custom: 'Personnalisé' }[med.frequency]
                      }</p>
                      <p className="text-xs text-muted-foreground">🕐 {med.times.join(', ')}</p>
                      {med.endDate && <p className="text-xs text-muted-foreground">📅 Jusqu'au {med.endDate}</p>}
                      {med.notes && <p className="text-xs text-muted-foreground mt-1 italic">📝 {med.notes}</p>}
                    </div>
                    <button onClick={() => deleteMedication(med.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {tab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5">
            <IntakeCalendar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add medication sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Nouveau traitement</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <MedicationStepper onSubmit={handleAddMed} onClose={() => setAddOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
