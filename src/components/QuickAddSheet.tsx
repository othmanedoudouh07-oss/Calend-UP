import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHealthStore } from '@/stores/useHealthStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { format } from 'date-fns';
import { CalendarDays, CheckSquare, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AddType = 'task' | 'event' | 'medication';

interface QuickAddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAddSheet({ open, onOpenChange }: QuickAddSheetProps) {
  const [type, setType] = useState<AddType>('task');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('personal');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [endTime, setEndTime] = useState('');
  const [dosage, setDosage] = useState('');
  const [reminder, setReminder] = useState('15');

  const categories = useSettingsStore((s) => s.categories);
  const addTask = useTaskStore((s) => s.addTask);
  const addEvent = useTaskStore((s) => s.addEvent);
  const addMedication = useHealthStore((s) => s.addMedication);

  const reset = () => {
    setTitle('');
    setCategoryId('personal');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setTime(format(new Date(), 'HH:mm'));
    setEndTime('');
    setDosage('');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    if (type === 'task') {
      addTask({
        id, title, categoryId, date, time, status: 'pending',
        reminderMinutes: parseInt(reminder), createdAt: now,
      });
    } else if (type === 'event') {
      addEvent({
        id, title, categoryId, date, startTime: time, endTime: endTime || time,
        reminderMinutes: parseInt(reminder), createdAt: now,
      });
    } else {
      addMedication({
        id, name: title, dosage, frequency: 'daily', times: [time],
        startDate: date, active: true, createdAt: now,
      });
    }
    reset();
    onOpenChange(false);
  };

  const types: { key: AddType; icon: typeof CheckSquare; label: string }[] = [
    { key: 'task', icon: CheckSquare, label: 'Tâche' },
    { key: 'event', icon: CalendarDays, label: 'Événement' },
    { key: 'medication', icon: Pill, label: 'Médicament' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Ajout rapide</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 py-4">
          {/* Type selector */}
          <div className="flex gap-2">
            {types.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all',
                  type === t.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <Label>{type === 'medication' ? 'Nom du médicament' : 'Titre'}</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'medication' ? 'Ex: Doliprane' : 'Ex: Réunion équipe'}
                className="mt-1"
              />
            </div>

            {type === 'medication' && (
              <div>
                <Label>Posologie</Label>
                <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Ex: 1000mg, 1 comprimé" className="mt-1" />
              </div>
            )}

            {type !== 'medication' && (
              <div>
                <Label>Catégorie</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryId(cat.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                        categoryId === cat.id
                          ? `${cat.color} text-white shadow-md`
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Heure</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" />
              </div>
            </div>

            {type === 'event' && (
              <div>
                <Label>Heure de fin</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1" />
              </div>
            )}

            {type !== 'medication' && (
              <div>
                <Label>Rappel</Label>
                <Select value={reminder} onValueChange={setReminder}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes avant</SelectItem>
                    <SelectItem value="15">15 minutes avant</SelectItem>
                    <SelectItem value="30">30 minutes avant</SelectItem>
                    <SelectItem value="60">1 heure avant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 rounded-xl text-base font-semibold">
            Ajouter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
