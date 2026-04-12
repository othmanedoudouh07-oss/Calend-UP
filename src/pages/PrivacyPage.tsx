import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="pb-24 safe-top">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Politique de confidentialité</h1>
          <p className="text-sm text-muted-foreground mt-0.5">PlanSmart — RGPD</p>
        </div>
      </div>

      <div className="px-5 space-y-6 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-base font-bold mb-2">1. Responsable du traitement</h2>
          <p className="text-muted-foreground">
            PlanSmart est une application de planning personnel. Le responsable du traitement est l'utilisateur lui-même, 
            les données étant stockées exclusivement sur son appareil.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">2. Données collectées</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Profil :</strong> prénom, nom, taille, poids, date de naissance, objectifs sportifs</li>
            <li><strong>Tâches & événements :</strong> titre, description, date, catégorie, priorité</li>
            <li><strong>Routines :</strong> tâches récurrentes programmées</li>
            <li><strong>Santé :</strong> médicaments, dosages, horaires de prise, historique d'observance</li>
            <li><strong>Préférences :</strong> thème, notifications, catégories personnalisées</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">3. Données sensibles (Art. 9 RGPD)</h2>
          <p className="text-muted-foreground">
            Les données de santé (médicaments, prises) sont des données sensibles au sens de l'article 9 du RGPD. 
            Leur traitement repose sur votre <strong>consentement explicite</strong>, recueilli avant toute saisie. 
            Ces données ne quittent jamais votre appareil.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">4. Base légale</h2>
          <p className="text-muted-foreground">
            Le traitement de vos données repose sur votre <strong>consentement</strong> (article 6.1.a du RGPD). 
            Vous pouvez retirer ce consentement à tout moment depuis les Paramètres.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">5. Stockage & sécurité</h2>
          <p className="text-muted-foreground">
            Toutes les données sont stockées <strong>localement</strong> sur votre appareil via le stockage du navigateur (localStorage). 
            <strong> Aucune donnée n'est transmise</strong> à un serveur, un cloud ou un tiers. 
            La sécurité de vos données dépend de la protection de votre appareil (code PIN, mot de passe, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">6. Durée de conservation</h2>
          <p className="text-muted-foreground">
            Vos données sont conservées tant que vous ne les supprimez pas. Vous pouvez les effacer à tout moment 
            depuis Paramètres → Vie privée & RGPD → Droit à l'effacement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">7. Vos droits</h2>
          <p className="text-muted-foreground mb-2">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Droit d'accès :</strong> consulter vos données dans l'application</li>
            <li><strong>Droit de rectification :</strong> modifier vos données à tout moment</li>
            <li><strong>Droit à l'effacement :</strong> supprimer toutes vos données</li>
            <li><strong>Droit à la portabilité :</strong> exporter vos données au format JSON</li>
            <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement depuis les Paramètres</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            Tous ces droits sont exercables directement dans l'application, sans intermédiaire.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">8. Transferts de données</h2>
          <p className="text-muted-foreground">
            Aucun transfert de données n'est effectué. L'application fonctionne entièrement hors ligne. 
            Aucune donnée n'est partagée avec des tiers, des partenaires ou des sous-traitants.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">9. Cookies & traceurs</h2>
          <p className="text-muted-foreground">
            PlanSmart n'utilise aucun cookie, aucun traceur publicitaire, aucun outil d'analyse. 
            Le localStorage est utilisé uniquement pour sauvegarder vos données applicatives.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2">10. Contact</h2>
          <p className="text-muted-foreground">
            Pour toute question relative à la protection de vos données, vous pouvez nous contacter à l'adresse : 
            <strong> contact@plansmart.app</strong>
          </p>
        </section>

        <div className="text-center py-4 text-xs text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
