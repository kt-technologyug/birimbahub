import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2e87f5704ade4893b4f7e601c02f01cf',
  appName: 'BirimbaHub',
  webDir: 'dist',
  server: {
    // Use the hosted GitHub Pages URL so the native app can load the remote SPA
    url: 'https://kt-technologyug.github.io/birimbahub/',
    // Pages uses HTTPS; cleartext (HTTP) is not required.
    cleartext: false
  }
};

export default config;
