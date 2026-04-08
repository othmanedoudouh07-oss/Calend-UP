import { Calendar, CheckSquare, Heart, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Calendar, label: 'Planning' },
  { path: '/tasks', icon: CheckSquare, label: 'Tâches' },
  { path: '/health', icon: Heart, label: 'Santé' },
  { path: '/settings', icon: Settings, label: 'Paramètres' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-4 py-2 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
