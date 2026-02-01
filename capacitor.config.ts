import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.notesapp',
  appName: 'Notes App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
