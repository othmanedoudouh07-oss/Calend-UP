import { useSettingsStore } from '@/stores/useSettingsStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHealthStore } from '@/stores/useHealthStore';
import { useRoutineStore } from '@/stores/useRoutineStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { cn } from '@/lib/utils';
import { Moon, Palette, Sun, Bell, BellRing, BellOff, Download, Upload, Trash2, User, ChevronRight, Check, Shield, Eye, FileDown, FileX, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGDPRConsent } from '@/components/GDPRConsentBanner';
import { useHealthConsent } from '@/components/health/HealthDataConsent';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import CategoryEditor from '@/components/settings/CategoryEditor';
import type { ThemeMode, NotificationLevel, ColorfulAccent } from '@/types';

const ACCENT_COLORS: { key: ColorfulAccent; label: string; color: string; ring: string }[] = [
  { key: 'purple', label: 'Violet', color: 'bg-purple-500', ring: 'ring-purple-500' },
  { key: 'blue', label: 'Bleu', color: 'bg-blue-500', ring: 'ring-blue-500' },
  { key: 'pink', label: 'Rose', color: 'bg-pink-500', ring: 'ring-pink-500' },
  { key: 'green', label: 'Vert', color: 'bg-emerald-500', ring: 'ring-emerald-500' },
  { key: 'orange', label: 'Orange', color: 'bg-orange-500', ring: 'ring-orange-500' },
];

export default function SettingsPage() {
  const {
    theme, setTheme, colorfulAccent, setColorfulAccent,
    notificationLevel, setNotificationLevel,
    notificationsEnabled, setNotificationsEnabled,
    morningDigestTime, setMorningDigestTime,
    notifByCategory, setNotifByCategory,
    categories,
  } = useSettingsStore();
  const profile = useProfileStore((s) => s.profile);
  const tasks = useTaskStore((s) => s.tasks);
  const events = useTaskStore((s) => s.events);
  const medications = useHealthStore((s) => s.medications);
  const intakes = useHealthStore((s) => s.intakes);
  const routines = useRoutineStore((s) => s.routines);
  const navigate = useNavigate();
  const gdpr = useGDPRConsent();
  const healthConsent = useHealthConsent();

  const themes: { key: ThemeMode; icon: typeof Moon; label: string; desc: string }[] = [
    { key: 'dark', icon: Moon, label: 'Sombre', desc: 'Thème sombre élégant' },
    { key: 'colorful', icon: Palette, label: 'Coloré', desc: 'Couleurs vives et dynamiques' },
    { key: 'auto', icon: Sun, label: 'Auto', desc: 'Selon l\'heure du jour' },
  ];

  const notifLevels: { key: NotificationLevel; label: string; desc: string; bubbles: number }[] = [
    { key: 'gentle', label: 'Doux', desc: '1 rappel discret', bubbles: 1 },
    { key: 'normal', label: 'Normal', desc: '2 rappels espacés', bubbles: 2 },
    { key: 'strict', label: 'Strict', desc: 'Rappels toutes les 5min', bubbles: 3 },
  ];

  const handleExport = () => {
    const data = JSON.stringify({ tasks, events, medications, intakes, routines, categories }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `plansmart-backup-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
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
        } catch { /* ignore */ }
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
              {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : 'Configurer mon profil'}
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
            { label: 'Tâches', value: tasks.length, color: 'text-blue-500' },
            { label: 'Événements', value: events.length, color: 'text-purple-500' },
            { label: 'Traitements', value: medications.length, color: 'text-red-500' },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-2xl bg-card border border-border text-center">
              <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
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

          {/* Accent color picker for colorful / auto */}
          <AnimatePresence>
            {(theme === 'colorful' || theme === 'auto') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <p className="text-xs text-muted-foreground font-medium mb-2">Couleur d'accent</p>
                <div className="flex gap-3 justify-center">
                  {ACCENT_COLORS.map((ac) => (
                    <motion.button
                      key={ac.key}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setColorfulAccent(ac.key)}
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                        ac.color,
                        colorfulAccent === ac.key ? 'ring-2 ring-offset-2 ring-offset-background scale-110 ' + ac.ring : 'opacity-60 hover:opacity-90'
                      )}
                    >
                      {colorfulAccent === ac.key && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notifications</h2>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          <AnimatePresence>
            {notificationsEnabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                {/* Levels */}
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
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center gap-0.5', notificationLevel === n.key ? 'bg-primary/20' : 'bg-muted')}>
                        {Array.from({ length: n.bubbles }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={notificationLevel === n.key ? { y: [0, -4, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                            className={cn('w-2 h-2 rounded-full', notificationLevel === n.key ? 'bg-primary' : 'bg-muted-foreground/40')}
                          />
                        ))}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold">{n.label}</p>
                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                      </div>
                      {notificationLevel === n.key && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>

                {/* Morning digest */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-base">☀️</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Résumé matinal</p>
                    <p className="text-xs text-muted-foreground">Heure de réception</p>
                  </div>
                  <Input
                    type="time"
                    value={morningDigestTime}
                    onChange={(e) => setMorningDigestTime(e.target.value)}
                    className="w-24 h-9 text-center text-sm"
                  />
                </div>

                {/* Per-category toggles */}
                <div className="p-3.5 rounded-2xl bg-card border border-border space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Par catégorie</p>
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs', cat.color)}>
                        {cat.icon}
                      </div>
                      <span className="text-sm font-medium flex-1">{cat.name}</span>
                      <Switch
                        checked={notifByCategory[cat.id] !== false}
                        onCheckedChange={(v) => setNotifByCategory(cat.id as string, v)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Catégories</h2>
          <CategoryEditor />
        </section>

        {/* Vie privée & RGPD */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Vie privée & RGPD
          </h2>
          <div className="space-y-2">
            {/* Voir mes données */}
            <div className="p-3.5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Mes données</p>
                  <p className="text-xs text-muted-foreground">Résumé de ce qui est stocké</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: 'Tâches', value: tasks.length },
                  { label: 'Événements', value: events.length },
                  { label: 'Traitements', value: medications.length },
                  { label: 'Prises enregistrées', value: intakes.length },
                  { label: 'Routines', value: routines.length },
                  { label: 'Catégories', value: categories.length },
                ].map((d) => (
                  <div key={d.label} className="px-3 py-2 rounded-xl bg-muted/50 text-center">
                    <p className="text-sm font-bold">{d.value}</p>
                    <p className="text-[10px] text-muted-foreground">{d.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Droit à la portabilité */}
            <button onClick={handleExport} className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileDown className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold">Droit à la portabilité</p>
                <p className="text-xs text-muted-foreground">Exporter toutes mes données (JSON)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Importer */}
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

            {/* Droit à l'effacement */}
            <button onClick={handleClearAll} className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-destructive/20 hover:border-destructive/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <FileX className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-destructive">Droit à l'effacement</p>
                <p className="text-xs text-muted-foreground">Supprimer toutes mes données</p>
              </div>
            </button>

            {/* Retirer consentement */}
            <button
              onClick={() => {
                gdpr.revoke();
                healthConsent.revoke();
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold">Retirer mon consentement</p>
                <p className="text-xs text-muted-foreground">Réaffiche les bandeaux de consentement</p>
              </div>
            </button>

            {/* Politique de confidentialité */}
            <button onClick={() => navigate('/privacy')} className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold">Politique de confidentialité</p>
                <p className="text-xs text-muted-foreground">Consulter nos engagements RGPD</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">PlanSmart v1.0</p>
          <p className="text-[10px] text-muted-foreground mt-1">Données stockées localement sur votre appareil</p>
        </div>
      </div>
    </div>
  );
}
