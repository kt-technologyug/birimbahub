import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.birimbahub',
  appName: 'BirimbaHub',
  webDir: 'dist',
  server: {
    url: 'https://2e87f570-4ade-4893-b4f7-e601c02f01cf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
