import { useState } from 'react';
import { useHealthStore } from '@/stores/useHealthStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus, Pill, Check, X, Clock, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MedicationFrequency, IntakeStatus } from '@/types';

const freqLabels: Record<MedicationFrequency, string> = {
  daily: '1x/jour',
  twice_daily: '2x/jour',
  three_times: '3x/jour',
  weekly: '1x/semaine',
  custom: 'Personnalisé',
};

export default function Health() {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<MedicationFrequency>('daily');
  const [time, setTime] = useState('08:00');

  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const addMedication = useHealthStore((s) => s.addMedication);
  const deleteMedication = useHealthStore((s) => s.deleteMedication);
  const addIntake = useHealthStore((s) => s.addIntake);
  const updateIntake = useHealthStore((s) => s.updateIntake);

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAdd = () => {
    if (!name.trim()) return;
    const times = frequency === 'twice_daily' ? ['08:00', '20:00'] :
                  frequency === 'three_times' ? ['08:00', '14:00', '20:00'] : [time];
    addMedication({
      id: crypto.randomUUID(),
      name, dosage, frequency, times,
      startDate: today, active: true, createdAt: new Date().toISOString(),
    });
    setName(''); setDosage(''); setAddOpen(false);
  };

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

  const activeMeds = medications.filter((m) => m.active);

  return (
    <div className="pb-24 safe-top">
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

      {/* Today's intakes */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Prises du jour</h2>
        <div className="space-y-3">
          {activeMeds.flatMap((med) =>
            med.times.map((t) => {
              const intake = intakes.find(
                (i) => i.medicationId === med.id && i.date === today && i.time === t
              );
              return (
                <motion.div
                  key={`${med.id}-${t}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} · {t}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => markIntake(med.id, t, 'taken')}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        intake?.status === 'taken' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => markIntake(med.id, t, 'postponed')}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        intake?.status === 'postponed' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => markIntake(med.id, t, 'missed')}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        intake?.status === 'missed' ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
          {activeMeds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">💊</p>
              <p className="text-sm text-muted-foreground">Aucun traitement actif</p>
            </div>
          )}
        </div>
      </div>

      {/* Active treatments */}
      <div className="px-5">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Traitements actifs</h2>
        <div className="space-y-3">
          {activeMeds.map((med) => (
            <div key={med.id} className="p-3 rounded-2xl bg-card border border-border flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{med.name}</p>
                <p className="text-xs text-muted-foreground">{med.dosage} · {freqLabels[med.frequency]}</p>
                <p className="text-xs text-muted-foreground">Horaires: {med.times.join(', ')}</p>
              </div>
              <button onClick={() => deleteMedication(med.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add medication sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Nouveau traitement</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nom du médicament</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Doliprane" className="mt-1" />
            </div>
            <div>
              <Label>Posologie</Label>
              <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Ex: 1000mg" className="mt-1" />
            </div>
            <div>
              <Label>Fréquence</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as MedicationFrequency)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(freqLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {frequency === 'daily' && (
              <div>
                <Label>Heure de prise</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" />
              </div>
            )}
            <Button onClick={handleAdd} className="w-full h-12 rounded-xl text-base font-semibold">
              Ajouter le traitement
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
