import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CONSENT_KEY = 'plansmart-gdpr-consent';

export function useGDPRConsent() {
  const [consented, setConsented] = useState(() => localStorage.getItem(CONSENT_KEY) === 'true');

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setConsented(true);
  };

  const revoke = () => {
    localStorage.removeItem(CONSENT_KEY);
    setConsented(false);
  };

  return { consented, accept, revoke };
}

export default function GDPRConsentBanner() {
  const { consented, accept } = useGDPRConsent();
  const navigate = useNavigate();

  if (consented) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-0 right-0 z-50 px-4"
      >
        <div className="max-w-lg mx-auto p-4 rounded-2xl bg-card border border-border shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Protection de vos données</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                PlanSmart stocke vos données uniquement sur votre appareil. Aucune donnée n'est envoyée à un serveur.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => navigate('/privacy')}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center gap-1"
            >
              En savoir plus <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={accept}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              J'accepte
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
