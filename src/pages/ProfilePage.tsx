import { useState } from 'react';
import { useProfileStore, type SportGoal, type ActivityLevel, type Gender } from '@/stores/useProfileStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ruler, Weight, Heart, Dumbbell, Target, ChevronRight, Save, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const goalLabels: Record<SportGoal, { label: string; emoji: string; desc: string }> = {
  lose_weight: { label: 'Perdre du poids', emoji: '🔥', desc: 'Déficit calorique + cardio' },
  gain_weight: { label: 'Prendre du poids', emoji: '💪', desc: 'Surplus calorique + force' },
  maintain: { label: 'Maintenir', emoji: '⚖️', desc: 'Garder la forme actuelle' },
  endurance: { label: 'Endurance', emoji: '🏃', desc: 'Améliorer le cardio' },
  muscle: { label: 'Musculation', emoji: '🏋️', desc: 'Gagner en muscle' },
  flexibility: { label: 'Souplesse', emoji: '🧘', desc: 'Yoga, stretching' },
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: 'Sédentaire',
  light: 'Légèrement actif',
  moderate: 'Modérément actif',
  active: 'Actif',
  very_active: 'Très actif',
};

const genderOptions: { key: Gender; label: string; emoji: string }[] = [
  { key: 'male', label: 'Homme', emoji: '♂️' },
  { key: 'female', label: 'Femme', emoji: '♀️' },
  { key: 'other', label: 'Autre', emoji: '⚧️' },
];

const activities = ['Course', 'Musculation', 'Natation', 'Vélo', 'Yoga', 'Football', 'Basketball', 'Tennis', 'Boxe', 'Danse', 'Randonnée', 'HIIT'];

export default function ProfilePage() {
  const { profile, updateProfile, updateSport, setSportEnabled } = useProfileStore();
  const navigate = useNavigate();
  const [showSaved, setShowSaved] = useState(false);

  const bmi = profile.height > 0 && profile.weight > 0
    ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : null;

  const bmiCategory = bmi
    ? parseFloat(bmi) < 18.5 ? 'Insuffisant' :
      parseFloat(bmi) < 25 ? 'Normal' :
      parseFloat(bmi) < 30 ? 'Surpoids' : 'Obésité'
    : null;

  const bmiColor = bmiCategory === 'Normal' ? 'text-green-500' :
    bmiCategory === 'Insuffisant' ? 'text-amber-500' :
    bmiCategory === 'Surpoids' ? 'text-amber-500' : 'text-red-500';

  const handleSave = () => {
    toast.success('Profil sauvegardé !');
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const toggleActivity = (act: string) => {
    const current = profile.sport.preferredActivities;
    updateSport({
      preferredActivities: current.includes(act)
        ? current.filter((a) => a !== act)
        : [...current, act],
    });
  };

  return (
    <div className="pb-24 safe-top">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Données personnelles & sport</p>
        </div>
        <button
          onClick={() => navigate('/health')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium"
        >
          <Heart className="w-4 h-4" />
          Santé
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="px-5 space-y-6">
        {/* Personal info */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Informations personnelles
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Prénom</Label>
              <Input
                value={profile.firstName}
                onChange={(e) => updateProfile({ firstName: e.target.value })}
                placeholder="Jean"
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs">Nom</Label>
              <Input
                value={profile.lastName}
                onChange={(e) => updateProfile({ lastName: e.target.value })}
                placeholder="Dupont"
                className="mt-1 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Date de naissance</Label>
            <Input
              type="date"
              value={profile.birthDate}
              onChange={(e) => updateProfile({ birthDate: e.target.value })}
              className="mt-1 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs">Genre</Label>
            <div className="flex gap-2 mt-1">
              {genderOptions.map((g) => (
                <button
                  key={g.key}
                  onClick={() => updateProfile({ gender: g.key })}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all border',
                    profile.gender === g.key
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card border-border text-muted-foreground'
                  )}
                >
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Body metrics */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Ruler className="w-4 h-4" /> Mensurations
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Taille (cm)</Label>
              <Input
                type="number"
                value={profile.height || ''}
                onChange={(e) => updateProfile({ height: Number(e.target.value) })}
                placeholder="175"
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs">Poids (kg)</Label>
              <Input
                type="number"
                value={profile.weight || ''}
                onChange={(e) => updateProfile({ weight: Number(e.target.value) })}
                placeholder="70"
                className="mt-1 rounded-xl"
              />
            </div>
          </div>
          {bmi && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-card border border-border flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">IMC : <span className={bmiColor}>{bmi}</span></p>
                <p className={cn('text-xs font-medium', bmiColor)}>{bmiCategory}</p>
              </div>
            </motion.div>
          )}
        </section>

        {/* Sport toggle */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4" /> Option Sport
            </h2>
            <Switch
              checked={profile.sportEnabled}
              onCheckedChange={setSportEnabled}
            />
          </div>

          <AnimatePresence>
            {profile.sportEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Goal */}
                <div>
                  <Label className="text-xs flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Objectif
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(goalLabels).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => updateSport({ goal: key as SportGoal })}
                        className={cn(
                          'flex items-start gap-2 p-3 rounded-xl text-left transition-all border',
                          profile.sport.goal === key
                            ? 'bg-primary/10 border-primary text-foreground'
                            : 'bg-card border-border text-muted-foreground'
                        )}
                      >
                        <span className="text-lg">{val.emoji}</span>
                        <div>
                          <p className="text-xs font-semibold">{val.label}</p>
                          <p className="text-[10px] text-muted-foreground">{val.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target weight */}
                {(profile.sport.goal === 'lose_weight' || profile.sport.goal === 'gain_weight') && (
                  <div>
                    <Label className="text-xs">Poids cible (kg)</Label>
                    <Input
                      type="number"
                      value={profile.sport.targetWeight || ''}
                      onChange={(e) => updateSport({ targetWeight: Number(e.target.value) })}
                      placeholder={profile.sport.goal === 'lose_weight' ? '65' : '80'}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                )}

                {/* Frequency */}
                <div>
                  <Label className="text-xs">Fréquence (séances/semaine)</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateSport({ frequency: n })}
                        className={cn(
                          'w-10 h-10 rounded-xl text-sm font-bold transition-all border',
                          profile.sport.frequency === n
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-card border-border text-muted-foreground'
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity level */}
                <div>
                  <Label className="text-xs">Niveau d'activité</Label>
                  <div className="space-y-1.5 mt-2">
                    {Object.entries(activityLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => updateSport({ activityLevel: key as ActivityLevel })}
                        className={cn(
                          'w-full p-2.5 rounded-xl text-sm text-left font-medium transition-all border',
                          profile.sport.activityLevel === key
                            ? 'bg-primary/10 border-primary text-foreground'
                            : 'bg-card border-border text-muted-foreground'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred activities */}
                <div>
                  <Label className="text-xs">Activités préférées</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activities.map((act) => (
                      <button
                        key={act}
                        onClick={() => toggleActivity(act)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                          profile.sport.preferredActivities.includes(act)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border text-muted-foreground'
                        )}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Save */}
        <Button onClick={handleSave} className="w-full h-12 rounded-xl text-base font-semibold gap-2">
          <Save className="w-5 h-5" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
