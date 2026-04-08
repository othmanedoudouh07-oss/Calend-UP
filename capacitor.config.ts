import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.13b4b6f889c04eb7aebfe9535258988c',
  appName: 'PlanSmart',
  webDir: 'dist',
  server: {
    url: 'https://13b4b6f8-89c0-4eb7-aebf-e9535258988c.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#7C3AED',
    },
  },
};

export default config;
