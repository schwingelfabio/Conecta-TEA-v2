import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { locations } from '../lib/locations';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Search, MapPin, ArrowLeft } from 'lucide-react';

interface LocationSelectorProps {
  initialState?: string;
  initialCity?: string;
  initialRegion?: string;
  onChange: (data: { state: string; city: string; region: string; google_result: boolean }) => void;
}

export default function LocationSelector({ initialState = '', initialCity = '', initialRegion = '', onChange }: LocationSelectorProps) {
  const { t, i18n } = useTranslation();
  const defaultRegion = i18n.language === 'en' ? 'US' : i18n.language === 'es' ? 'LATAM' : 'BR';
  const [region, setRegion] = useState(initialRegion || defaultRegion);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [isGoogleSearch, setIsGoogleSearch] = useState(false);
  const [isGoogleResult, setIsGoogleResult] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const regionData = locations[region as keyof typeof locations];

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
    },
    debounce: 300,
  });

  useEffect(() => {
    onChange({ state: selectedState, city: selectedCity, region, google_result: isGoogleResult });
  }, [selectedState, selectedCity, region, isGoogleResult]);

  // Update region when language changes if not manually set
  useEffect(() => {
    if (!initialRegion) {
      setRegion(defaultRegion);
    }
  }, [defaultRegion, initialRegion]);

  const handleSelectGoogle = async (suggestion: any) => {
    setValue(suggestion.description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: suggestion.description });
      const addressComponents = results[0].address_components;
      let city = '';
      let state = '';
      let countryCode = '';

      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        } else if (component.types.includes('country')) {
          countryCode = component.short_name;
        }
      });

      if (city && state) {
        setSelectedCity(city);
        setSelectedState(state);
        setIsGoogleResult(true);
        setIsGoogleSearch(false);
        
        // Auto-adjust region
        if (countryCode === 'BR') setRegion('BR');
        else if (countryCode === 'US') setRegion('US');
        else setRegion('LATAM');
      } else {
        setErrorMsg(t('onboarding.noResults'));
      }
    } catch (error) {
      console.error("[LocationSelector] Error selecting Google place:", error);
      setErrorMsg(t('onboarding.saveError'));
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {errorMsg}
        </div>
      )}

      {!isGoogleSearch ? (
        <>
          {region === 'LATAM' && 'countries' in regionData && (
            <select 
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(''); setSelectedCity(''); }}
              value={selectedCountry}
            >
              <option value="">{t('onboarding.selectCountry')}</option>
              {(regionData as any).countries.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">{t('onboarding.stateLabel')}</label>
            <select 
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              disabled={region === 'LATAM' && !selectedCountry}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); setIsGoogleResult(false); }}
              value={selectedState}
            >
              <option value="">{t('onboarding.selectState')}</option>
              {region === 'BR' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              {region === 'US' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              {region === 'LATAM' && selectedCountry && 'states' in regionData && !Array.isArray(regionData.states) && (regionData.states as any)[selectedCountry]?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">{t('onboarding.cityLabel')}</label>
            <select 
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              disabled={!selectedState}
              onChange={(e) => { setSelectedCity(e.target.value); setIsGoogleResult(false); }}
              value={selectedCity}
            >
              <option value="">{t('onboarding.selectCity')}</option>
              {selectedState && 'cities' in regionData && (regionData.cities as any)[selectedState]?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 mb-2">{t('onboarding.cantFind')}</p>
            <button 
              type="button"
              onClick={() => setIsGoogleSearch(true)}
              className="text-sky-500 font-bold flex items-center justify-center gap-2 mx-auto hover:underline text-sm"
            >
              <Search size={16} />
              {t('onboarding.searchGoogle')}
            </button>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            type="button"
            onClick={() => setIsGoogleSearch(false)}
            className="flex items-center gap-2 text-gray-500 mb-4 hover:text-gray-700 text-sm"
          >
            <ArrowLeft size={16} />
            {t('onboarding.backToList')}
          </button>
          
          <div className="relative">
            <input 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
              placeholder={t('onboarding.searchPlaceholder')}
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {status === "OK" && (
            <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white max-h-60 overflow-y-auto">
              {data.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSelectGoogle(suggestion)}
                  className="w-full p-4 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                >
                  <MapPin size={18} className="text-sky-500 shrink-0" />
                  <span className="text-sm text-gray-700">{suggestion.description}</span>
                </button>
              ))}
            </div>
          )}
          
          {status === "ZERO_RESULTS" && (
            <p className="mt-2 text-sm text-gray-500 text-center">{t('onboarding.noResults')}</p>
          )}
        </div>
      )}
    </div>
  );
}
