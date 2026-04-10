import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Pill, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { MedicationFrequency, Medication } from '@/types';

const freqLabels: Record<MedicationFrequency, string> = {
  daily: '1x/jour',
  twice_daily: '2x/jour',
  three_times: '3x/jour',
  weekly: '1x/semaine',
  custom: 'Personnalisé',
};

const MED_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500',
];
const MED_ICONS = ['💊', '💉', '🩹', '🧴', '💧', '🌿', '🩺', '🫁'];

interface Props {
  onSubmit: (med: Medication) => void;
  onClose: () => void;
}

export default function MedicationStepper({ onSubmit, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<MedicationFrequency>('daily');
  const [time, setTime] = useState('08:00');
  const [time2, setTime2] = useState('20:00');
  const [time3, setTime3] = useState('14:00');
  const [indefinite, setIndefinite] = useState(true);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('bg-red-500');
  const [icon, setIcon] = useState('💊');

  const today = new Date().toISOString().split('T')[0];

  const getTimes = (): string[] => {
    if (frequency === 'twice_daily') return [time, time2].sort();
    if (frequency === 'three_times') return [time, time3, time2].sort();
    return [time];
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      id: crypto.randomUUID(),
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times: getTimes(),
      startDate: today,
      endDate: indefinite ? undefined : endDate || undefined,
      notes: notes.trim() || undefined,
      color,
      icon,
      active: true,
      createdAt: new Date().toISOString(),
    });
  };

  const canNext = step === 0 ? name.trim().length > 0 : true;

  const steps = [
    // Step 1: Name + Dosage + Icon/Color
    <motion.div key="s0" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
      <div>
        <Label>Nom du médicament</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Doliprane" className="mt-1.5 h-11" autoFocus />
      </div>
      <div>
        <Label>Posologie</Label>
        <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Ex: 1000mg, 2 comprimés" className="mt-1.5 h-11" />
      </div>
      <div>
        <Label>Icône & Couleur</Label>
        <div className="mt-2 flex gap-4">
          <div className="flex flex-wrap gap-1.5">
            {MED_ICONS.map((i) => (
              <button key={i} onClick={() => setIcon(i)} className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all', icon === i ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted')}>
                {i}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 content-start">
            {MED_COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={cn('w-7 h-7 rounded-full transition-all', c, color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'opacity-60')} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>,

    // Step 2: Frequency + Times
    <motion.div key="s1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
      <div>
        <Label>Fréquence</Label>
        <Select value={frequency} onValueChange={(v) => setFrequency(v as MedicationFrequency)}>
          <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(freqLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{frequency === 'daily' || frequency === 'weekly' ? 'Heure de prise' : 'Matin'}</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 h-11" />
        </div>
        {(frequency === 'twice_daily' || frequency === 'three_times') && (
          <div>
            <Label>Soir</Label>
            <Input type="time" value={time2} onChange={(e) => setTime2(e.target.value)} className="mt-1.5 h-11" />
          </div>
        )}
        {frequency === 'three_times' && (
          <div>
            <Label>Midi</Label>
            <Input type="time" value={time3} onChange={(e) => setTime3(e.target.value)} className="mt-1.5 h-11" />
          </div>
        )}
      </div>
    </motion.div>,

    // Step 3: Duration + Notes + Preview
    <motion.div key="s2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Durée indéterminée</Label>
        <Switch checked={indefinite} onCheckedChange={setIndefinite} />
      </div>
      {!indefinite && (
        <div>
          <Label>Date de fin</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1.5 h-11" min={today} />
        </div>
      )}
      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: À prendre pendant le repas" className="mt-1.5 min-h-[80px]" />
      </div>

      {/* Preview */}
      <div className="p-3 rounded-2xl bg-muted/50 border border-border">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Aperçu</p>
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg', color)}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{name || 'Médicament'}</p>
            <p className="text-xs text-muted-foreground">{dosage || 'Dosage'} · {freqLabels[frequency]}</p>
            <p className="text-xs text-muted-foreground">Horaires: {getTimes().join(', ')}</p>
          </div>
        </div>
      </div>
    </motion.div>,
  ];

  return (
    <div className="space-y-5">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step === s ? 'bg-primary text-primary-foreground scale-110' : step > s ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {step > s ? <Check className="w-4 h-4" /> : s + 1}
            </div>
            {s < 2 && <div className={cn('w-8 h-0.5 rounded-full', step > s ? 'bg-primary' : 'bg-muted')} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>

      <div className="flex gap-2">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-11 rounded-xl">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
        )}
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext} className="flex-1 h-11 rounded-xl">
            Suivant <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1 h-11 rounded-xl">
            <Pill className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        )}
      </div>
    </div>
  );
}
