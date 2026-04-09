import { useSettingsStore } from '@/stores/useSettingsStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHealthStore } from '@/stores/useHealthStore';
import { useRoutineStore } from '@/stores/useRoutineStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { cn } from '@/lib/utils';
import { Moon, Palette, Sun, Bell, BellRing, BellOff, Download, Upload, Trash2, User, ChevronRight, Shield, Info, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ThemeMode, NotificationLevel } from '@/types';

export default function SettingsPage() {
  const { theme, setTheme, notificationLevel, setNotificationLevel, categories } = useSettingsStore();
  const profile = useProfileStore((s) => s.profile);
  const tasks = useTaskStore((s) => s.tasks);
  const events = useTaskStore((s) => s.events);
  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const routines = useRoutineStore((s) => s.routines);
  const navigate = useNavigate();

  const themes: { key: ThemeMode; icon: typeof Moon; label: string; desc: string }[] = [
    { key: 'dark', icon: Moon, label: 'Sombre', desc: 'Thème sombre élégant' },
    { key: 'colorful', icon: Palette, label: 'Coloré', desc: 'Couleurs vives et dynamiques' },
    { key: 'auto', icon: Sun, label: 'Auto', desc: 'Selon l\'heure du jour' },
  ];

  const notifLevels: { key: NotificationLevel; icon: typeof Bell; label: string; desc: string }[] = [
    { key: 'gentle', icon: BellOff, label: 'Doux', desc: '1 rappel discret' },
    { key: 'normal', icon: Bell, label: 'Normal', desc: '2 rappels espacés' },
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

  const statsCount = tasks.length + events.length + medications.length;

  return (
    <div className="pb-24 safe-top">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Personnalisez votre expérience</p>
      </div>

      <div className="px-5 space-y-6">
        {/* Profile card */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/profile')}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 flex items-center gap-4 text-left"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold truncate">
              {profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : 'Configurer mon profil'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profile.height > 0 ? `${profile.height}cm · ${profile.weight}kg` : 'Taille, poids, objectifs sport...'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Tâches', value: tasks.length, color: 'bg-blue-500/10 text-blue-500' },
            { label: 'Événements', value: events.length, color: 'bg-purple-500/10 text-purple-500' },
            { label: 'Traitements', value: medications.length, color: 'bg-red-500/10 text-red-500' },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-2xl bg-card border border-border text-center">
              <p className={cn('text-2xl font-bold', stat.color.split(' ')[1])}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Theme */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Apparence</h2>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border',
                  theme === t.key
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                )}
              >
                <t.icon className="w-6 h-6" />
                <span className="text-xs font-bold">{t.label}</span>
                <span className={cn('text-[9px]', theme === t.key ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{t.desc}</span>
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
                  'w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border',
                  notificationLevel === n.key
                    ? 'bg-primary/10 border-primary text-foreground shadow-sm'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  notificationLevel === n.key ? 'bg-primary/20' : 'bg-muted'
                )}>
                  <n.icon className={cn('w-5 h-5', notificationLevel === n.key && 'text-primary')} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                {notificationLevel === n.key && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Catégories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat.id} className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-sm', cat.color)}>
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>
        </section>

        {/* Data */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Données</h2>
          <div className="space-y-2">
            <button onClick={handleExport} className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold">Exporter</p>
                <p className="text-xs text-muted-foreground">Sauvegarde JSON · {statsCount} éléments</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={handleImport} className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold">Importer</p>
                <p className="text-xs text-muted-foreground">Restaurer une sauvegarde</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={handleClearAll} className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-destructive/20 hover:border-destructive/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-destructive">Tout supprimer</p>
                <p className="text-xs text-muted-foreground">Action irréversible</p>
              </div>
            </button>
          </div>
        </section>

        {/* App info */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">PlanSmart v1.0</p>
          <p className="text-[10px] text-muted-foreground mt-1">Données stockées localement sur votre appareil</p>
        </div>
      </div>
    </div>
  );
}
