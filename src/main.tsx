import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import './i18n';
import App from './App.tsx';
import './index.css';
import { initMonitoring } from './lib/monitoring.ts';

// Initialize Mordomo TEA IA Frontend Monitoring
initMonitoring();

// Load Google Maps JS API for Places Autocomplete
if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  document.head.appendChild(script);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Carregando...</div>}>
      <App />
    </Suspense>
  </StrictMode>,
);
