import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share, Plus, Smartphone, CheckCircle2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function detectPlatform(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error iOS Safari proprietary
    window.navigator.standalone === true
  );
}

export default function InstallPage() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="pb-24 safe-top min-h-screen">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Installer PlanSmart</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Comme une vraie app, sur votre écran d'accueil</p>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border border-primary/20 flex items-center gap-4"
        >
          <img src="/app-icon.png" alt="PlanSmart" width={72} height={72} className="w-18 h-18 rounded-2xl shadow-xl shadow-primary/30" />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold">PlanSmart</p>
            <p className="text-xs text-muted-foreground">Hors-ligne · Notifications · Plein écran</p>
          </div>
        </motion.div>

        {installed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-bold">PlanSmart est installée 🎉</p>
              <p className="text-xs text-muted-foreground mt-0.5">Vous utilisez l'app en mode autonome.</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Android / Desktop : prompt natif si dispo */}
            {platform !== 'ios' && deferredPrompt && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleInstall}
                className="w-full p-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              >
                <Download className="w-5 h-5" />
                Installer maintenant
              </motion.button>
            )}

            {/* iOS instructions */}
            {platform === 'ios' && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Sur iPhone / iPad
                </h2>
                <ol className="space-y-3">
                  {[
                    { icon: Share, text: 'Touchez le bouton Partager dans Safari (en bas de l\'écran)' },
                    { icon: Plus, text: 'Faites défiler et choisissez "Sur l\'écran d\'accueil"' },
                    { icon: CheckCircle2, text: 'Touchez "Ajouter" en haut à droite. Voilà !' },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex items-center gap-2 flex-1 pt-1">
                        <step.icon className="w-4 h-4 text-primary shrink-0" />
                        <p className="text-sm leading-relaxed">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Android fallback instructions */}
            {platform === 'android' && !deferredPrompt && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Sur Android
                </h2>
                <ol className="space-y-3">
                  {[
                    'Ouvrez le menu de votre navigateur (les trois points en haut à droite)',
                    'Choisissez "Installer l\'application" ou "Ajouter à l\'écran d\'accueil"',
                    'Confirmez. L\'icône PlanSmart apparaît sur votre écran d\'accueil.',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Desktop fallback */}
            {platform === 'desktop' && !deferredPrompt && (
              <div className="p-4 rounded-2xl bg-card border border-border text-sm text-muted-foreground">
                Ouvrez ce lien sur votre téléphone (Safari sur iPhone, Chrome sur Android) pour installer PlanSmart sur votre écran d'accueil.
              </div>
            )}
          </>
        )}

        {/* Avantages */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pourquoi installer ?</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '⚡', title: 'Démarrage rapide', desc: 'Lancement instantané' },
              { emoji: '📵', title: 'Hors-ligne', desc: 'Tout marche sans réseau' },
              { emoji: '🔔', title: 'Rappels', desc: 'Notifications natives' },
              { emoji: '🔒', title: 'Vos données', desc: 'Restent sur l\'appareil' },
            ].map((b) => (
              <div key={b.title} className="p-3 rounded-2xl bg-card border border-border">
                <p className="text-2xl mb-1">{b.emoji}</p>
                <p className="text-sm font-bold">{b.title}</p>
                <p className="text-[11px] text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
