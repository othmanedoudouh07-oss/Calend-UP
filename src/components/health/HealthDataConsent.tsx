import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Shield, Heart } from 'lucide-react';

const HEALTH_CONSENT_KEY = 'plansmart-health-consent';

export function useHealthConsent() {
  const [consented, setConsented] = useState(() => localStorage.getItem(HEALTH_CONSENT_KEY) === 'true');

  const accept = () => {
    localStorage.setItem(HEALTH_CONSENT_KEY, 'true');
    setConsented(true);
  };

  const revoke = () => {
    localStorage.removeItem(HEALTH_CONSENT_KEY);
    setConsented(false);
  };

  return { consented, accept, revoke };
}

interface Props {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export default function HealthDataConsent({ open, onAccept, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-2">
            <Heart className="w-7 h-7 text-red-500" />
          </div>
          <DialogTitle>Données de santé</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed mt-2">
            Vous allez renseigner des <strong>données de santé</strong> (article 9 du RGPD — données sensibles).
            <br /><br />
            Ces données restent stockées <strong>uniquement sur votre appareil</strong> et ne sont jamais transmises à un serveur ou à des tiers.
            <br /><br />
            Vous pouvez les supprimer à tout moment depuis les Paramètres.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-2 sm:flex-row">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground bg-muted hover:bg-muted/80 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            J'accepte
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
