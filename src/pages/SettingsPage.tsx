import { useSettingsStore } from '@/stores/useSettingsStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHealthStore } from '@/stores/useHealthStore';
import { useRoutineStore } from '@/stores/useRoutineStore';
import { cn } from '@/lib/utils';
import { Moon, Palette, Sun, Bell, BellRing, BellOff, Download, Upload, Trash2 } from 'lucide-react';
import type { ThemeMode, NotificationLevel } from '@/types';

export default function SettingsPage() {
  const { theme, setTheme, notificationLevel, setNotificationLevel, categories } = useSettingsStore();
  const tasks = useTaskStore((s) => s.tasks);
  const events = useTaskStore((s) => s.events);
  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const routines = useRoutineStore((s) => s.routines);

  const themes: { key: ThemeMode; icon: typeof Moon; label: string }[] = [
    { key: 'dark', icon: Moon, label: 'Sombre' },
    { key: 'colorful', icon: Palette, label: 'Coloré' },
    { key: 'auto', icon: Sun, label: 'Auto' },
  ];

  const notifLevels: { key: NotificationLevel; icon: typeof Bell; label: string; desc: string }[] = [
    { key: 'gentle', icon: BellOff, label: 'Doux', desc: '1 rappel' },
    { key: 'normal', icon: Bell, label: 'Normal', desc: '2 rappels' },
    { key: 'strict', icon: BellRing, label: 'Strict', desc: 'Re-rappels toutes les 5min' },
  ];

  const handleExport = () => {
    const data = JSON.stringify({ tasks, events, medications, intakes, routines, categories }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plansmart-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (data.tasks) useTaskStore.setState({ tasks: data.tasks, events: data.events || [] });
          if (data.medications) useHealthStore.setState({ medications: data.medications, intakes: data.intakes || [] });
          if (data.routines) useRoutineStore.setState({ routines: data.routines });
          if (data.categories) useSettingsStore.setState({ categories: data.categories });
        } catch { /* ignore bad file */ }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm('Supprimer toutes les données ? Cette action est irréversible.')) {
      useTaskStore.setState({ tasks: [], events: [] });
      useHealthStore.setState({ medications: [], intakes: [] });
      useRoutineStore.setState({ routines: [] });
    }
  };

  return (
    <div className="pb-24 safe-top">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Theme */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Thème</h2>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border',
                  theme === t.key
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-card border-border text-muted-foreground'
                )}
              >
                <t.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notifications</h2>
          <div className="space-y-2">
            {notifLevels.map((n) => (
              <button
                key={n.key}
                onClick={() => setNotificationLevel(n.key)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-2xl transition-all border',
                  notificationLevel === n.key
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'bg-card border-border text-muted-foreground'
                )}
              >
                <n.icon className={cn('w-5 h-5', notificationLevel === n.key && 'text-primary')} />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Catégories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat.id} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white', cat.color)}>
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>
        </section>

        {/* Data */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Données</h2>
          <div className="space-y-2">
            <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
              <Download className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Exporter (JSON)</span>
            </button>
            <button onClick={handleImport} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
              <Upload className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Importer</span>
            </button>
            <button onClick={handleClearAll} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-destructive/30">
              <Trash2 className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">Supprimer toutes les données</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
