import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { locations } from '../lib/locations';
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import { Search, MapPin, X, Loader2, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Logic: determine region based on language
  const getRegionFromLang = useCallback((lang: string) => {
    if (lang.startsWith('en')) return 'US';
    if (lang.startsWith('es')) return 'LATAM';
    return 'BR';
  }, []);

  const [region, setRegion] = useState(initialRegion || getRegionFromLang(i18n.language));
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [showGoogleSearch, setShowGoogleSearch] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleResult, setGoogleResult] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const regionData = locations[region as keyof typeof locations];

  const {
    ready,
    value: googleQuery,
    suggestions: { status, data: suggestions },
    setValue: setGoogleQuery,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
    },
    debounce: 300,
  });

  // Notify parent of changes
  useEffect(() => {
    onChange({ 
      state: selectedState, 
      city: selectedCity, 
      region, 
      google_result: googleResult 
    });
  }, [selectedState, selectedCity, region, googleResult, onChange]);

  // Reset on language change
  useEffect(() => {
    const newRegion = getRegionFromLang(i18n.language);
    if (newRegion !== region && !initialRegion) {
      setRegion(newRegion);
      setSelectedState('');
      setSelectedCity('');
      setSelectedCountry('');
      setGoogleResult(false);
    }
  }, [i18n.language, getRegionFromLang, region, initialRegion]);

  const parseAddressComponents = (components: google.maps.GeocoderAddressComponent[]) => {
    let city = '';
    let state = '';
    let countryCode = '';

    components.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (component.types.includes('country')) {
        countryCode = component.short_name;
      }
    });

    return { city, state, countryCode };
  };

  const handleGooglePlaceSelect = async (suggestion: any) => {
    setGoogleQuery(suggestion.description, false);
    clearSuggestions();
    setGoogleLoading(true);
    setErrorMsg('');

    try {
      const results = await getGeocode({ address: suggestion.description });
      const { city, state, countryCode } = parseAddressComponents(results[0].address_components);

      if (city && state) {
        setSelectedCity(city);
        setSelectedState(state);
        setGoogleResult(true);
        setShowGoogleSearch(false);
        
        // Auto-adjust region based on country code
        if (countryCode === 'BR') setRegion('BR');
        else if (countryCode === 'US') setRegion('US');
        else setRegion('LATAM');
      } else {
        setErrorMsg(t('onboarding.noResults'));
      }
    } catch (error) {
      console.error("[LocationSelectorGlobal] Error selecting place:", error);
      setErrorMsg(t('onboarding.saveError'));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Internal Selectors */}
      <div className="space-y-4">
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
                {(regionData as any).countries.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              {t('onboarding.stateLabel')}
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white appearance-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                disabled={region === 'LATAM' && !selectedCountry}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); setGoogleResult(false); }}
                value={selectedState}
              >
                <option value="">{t('onboarding.selectState')}</option>
                {region === 'BR' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                {region === 'US' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                {region === 'LATAM' && selectedCountry && 'states' in regionData && !Array.isArray(regionData.states) && (regionData.states as any)[selectedCountry]?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              {t('onboarding.cityLabel')}
            </label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white appearance-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                disabled={!selectedState}
                onChange={(e) => { setSelectedCity(e.target.value); setGoogleResult(false); }}
                value={selectedCity}
              >
                <option value="">{t('onboarding.selectCity')}</option>
                {selectedState && 'cities' in regionData && (regionData.cities as any)[selectedState]?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Google Search Link */}
      <div className="flex justify-center pt-2">
        <button 
          type="button"
          onClick={() => setShowGoogleSearch(true)}
          className="text-sky-500 font-bold flex items-center gap-2 hover:bg-sky-50 px-4 py-2 rounded-full transition-colors text-sm"
        >
          <Globe size={16} />
          {t('onboarding.searchGoogle')}
        </button>
      </div>

      {/* Google Search Modal */}
      <AnimatePresence>
        {showGoogleSearch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="text-sky-500" size={24} />
                  {t('onboarding.searchGoogle')}
                </h3>
                <button 
                  onClick={() => setShowGoogleSearch(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="relative">
                  <input 
                    value={googleQuery}
                    onChange={(e) => setGoogleQuery(e.target.value)}
                    disabled={!ready || googleLoading}
                    placeholder={t('onboarding.searchPlaceholder')}
                    className="w-full p-4 pl-12 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white transition-all"
                    autoFocus
                  />
                  {googleLoading ? (
                    <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 animate-spin" size={20} />
                  ) : (
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  )}
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                    {errorMsg}
                  </p>
                )}

                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                  {status === "OK" && suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleGooglePlaceSelect(suggestion)}
                      className="w-full p-4 text-left hover:bg-sky-50 rounded-2xl flex items-center gap-3 transition-colors group"
                    >
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                        <MapPin size={18} className="text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{suggestion.structured_formatting.main_text}</p>
                        <p className="text-xs text-gray-500">{suggestion.structured_formatting.secondary_text}</p>
                      </div>
                    </button>
                  ))}

                  {status === "ZERO_RESULTS" && (
                    <div className="py-8 text-center text-gray-500">
                      <p className="font-medium">{t('onboarding.noResults')}</p>
                    </div>
                  )}

                  {!googleQuery && (
                    <div className="py-8 text-center text-gray-400">
                      <p className="text-sm">{t('onboarding.searchPlaceholder')}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 text-center">
                <button 
                  onClick={() => setShowGoogleSearch(false)}
                  className="text-sm font-bold text-gray-500 hover:text-gray-700"
                >
                  {t('onboarding.backToList')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
