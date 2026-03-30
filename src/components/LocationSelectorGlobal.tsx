import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { locations } from '../lib/locations';
import { ChevronDown, Loader2 } from 'lucide-react';

interface LocationSelectorGlobalProps {
  initialState?: string;
  initialCity?: string;
  initialRegion?: string;
  onChange: (data: { state: string; city: string; region: string; google_result: boolean }) => void;
}

export default function LocationSelectorGlobal({ 
  initialState = '', 
  initialCity = '', 
  initialRegion = '', 
  onChange 
}: LocationSelectorGlobalProps) {
  const { t, i18n } = useTranslation();
  
  const getRegionFromLang = useCallback((lang: string) => {
    if (lang.startsWith('en')) return 'US';
    if (lang.startsWith('es')) return 'LATAM';
    return 'BR';
  }, []);

  const [region, setRegion] = useState(initialRegion || getRegionFromLang(i18n.language));
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  
  // Brazil specific states (IBGE)
  const [brStates, setBrStates] = useState<{ id: string; name: string }[]>([]);
  const [brCities, setBrCities] = useState<{ id: string; name: string }[]>([]);
  const [loadingBr, setLoadingBr] = useState(false);

  const regionData = locations[region as keyof typeof locations];

  // Fetch IBGE States
  useEffect(() => {
    if (region === 'BR') {
      setLoadingBr(true);
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((s: any) => ({ id: s.sigla, name: s.nome }));
          setBrStates(formatted);
        })
        .catch(err => console.error("Error fetching IBGE states:", err))
        .finally(() => setLoadingBr(false));
    }
  }, [region]);

  // Fetch IBGE Cities
  useEffect(() => {
    if (region === 'BR' && selectedState) {
      setLoadingBr(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((c: any) => ({ id: c.nome, name: c.nome }));
          setBrCities(formatted);
        })
        .catch(err => console.error("Error fetching IBGE cities:", err))
        .finally(() => setLoadingBr(false));
    } else {
      setBrCities([]);
    }
  }, [region, selectedState]);

  // Notify parent of changes
  useEffect(() => {
    onChange({ 
      state: selectedState, 
      city: selectedCity, 
      region, 
      google_result: false 
    });
  }, [selectedState, selectedCity, region, onChange]);

  // Reset on language change
  useEffect(() => {
    const newRegion = getRegionFromLang(i18n.language);
    if (newRegion !== region && !initialRegion) {
      setRegion(newRegion);
      setSelectedState('');
      setSelectedCity('');
      setSelectedCountry('');
    }
  }, [i18n.language, getRegionFromLang, region, initialRegion]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Country Selector (LATAM only) */}
        {region === 'LATAM' && 'countries' in regionData && (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              {t('onboarding.selectCountry')}
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white appearance-none transition-all"
                onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(''); setSelectedCity(''); }}
                value={selectedCountry}
              >
                <option value="">{t('onboarding.selectCountry')}</option>
                {[...(regionData as any).countries].sort((a, b) => a.name.localeCompare(b.name)).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              {t('onboarding.stateLabel')}
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white appearance-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                disabled={(region === 'LATAM' && !selectedCountry) || (region === 'BR' && loadingBr && brStates.length === 0)}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }}
                value={selectedState}
              >
                <option value="">{t('onboarding.selectState')}</option>
                {region === 'BR' && brStates.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                {region === 'US' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                {region === 'LATAM' && selectedCountry && 'states' in regionData && !Array.isArray(regionData.states) && [...((regionData.states as any)[selectedCountry] || [])].sort((a, b) => a.name.localeCompare(b.name)).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {region === 'BR' && loadingBr && brStates.length === 0 ? (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-sky-500 animate-spin" size={18} />
              ) : (
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              )}
            </div>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              {t('onboarding.cityLabel')}
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white appearance-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                disabled={!selectedState || (region === 'BR' && loadingBr && brCities.length === 0)}
                onChange={(e) => { setSelectedCity(e.target.value); }}
                value={selectedCity}
              >
                <option value="">{t('onboarding.selectCity')}</option>
                {region === 'BR' && brCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                {region === 'US' && selectedState && 'cities' in regionData && [...((regionData.cities as any)[selectedState] || [])].sort((a, b) => a.localeCompare(b)).map((c: any) => <option key={c} value={c}>{c}</option>)}
                {region === 'LATAM' && selectedState && 'cities' in regionData && [...((regionData.cities as any)[selectedState] || [])].sort((a, b) => a.localeCompare(b)).map((c: any) => <option key={c} value={c}>{c}</option>)}
              </select>
              {region === 'BR' && loadingBr && brCities.length === 0 ? (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-sky-500 animate-spin" size={18} />
              ) : (
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
