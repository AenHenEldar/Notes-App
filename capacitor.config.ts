import type { CapacitorConfig } from '@capacitor/cli';

// Set CAPACITOR_LIVE_RELOAD=http://YOUR_IP:5173 to load from dev server
// Use your machine's IP (run `ipconfig` on Windows). Emulator: use 10.0.2.2
const liveReloadUrl = process.env.CAPACITOR_LIVE_RELOAD;

const config: CapacitorConfig = {
  appId: 'com.notesapp',
  appName: 'Notes App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    ...(liveReloadUrl && {
      url: liveReloadUrl,
      cleartext: true,
    }),
  },
};

export default config;
