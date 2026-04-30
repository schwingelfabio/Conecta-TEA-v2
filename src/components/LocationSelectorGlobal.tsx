import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const [region, setRegion] = useState(initialRegion);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  
  // Notify parent of changes
  useEffect(() => {
    onChange({ 
      state: selectedState, 
      city: selectedCity, 
      region, 
      google_result: false 
    });
  }, [selectedState, selectedCity, region, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Country Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
            País {t('onboarding.selectCountry')}
          </label>
          <div className="relative">
            <input 
              type="text"
              placeholder="Escreva o nome do país..."
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white transition-all"
              onChange={(e) => setRegion(e.target.value)}
              value={region}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              Estado {t('onboarding.stateLabel')}
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Escreva o nome do estado..."
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white transition-all"
                onChange={(e) => setSelectedState(e.target.value)}
                value={selectedState}
              />
            </div>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
              Cidade {t('onboarding.cityLabel')}
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Escreva o nome da cidade..."
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white transition-all"
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
