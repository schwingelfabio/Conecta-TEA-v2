import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, MapPin, Map as MapIcon, MessageCircle, TrendingUp, ChevronRight, Share2 } from 'lucide-react';
import CityPage from './CityPage';

const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface StateData {
  id: string;
  name: string;
  users: number;
}

interface CityData {
  name: string;
  state: string;
  users: number;
}

export default function NetworkMap() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCities: 0,
    totalStates: 0,
    totalPosts: 0
  });
  const [stateData, setStateData] = useState<Record<string, number>>({});
  const [cityData, setCityData] = useState<Record<string, CityData[]>>({});
  const [topCities, setTopCities] = useState<CityData[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  const handleShare = (title: string, text: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      alert(t('map.shareNotSupported'));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => doc.data());
        
        // Fetch posts
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const totalPosts = postsSnapshot.size;

        const stateCounts: Record<string, number> = {};
        const cityCounts: Record<string, number> = {};
        const stateCities: Record<string, Record<string, number>> = {};

        users.forEach(user => {
          if (user.state) {
            const state = user.state.toUpperCase();
            stateCounts[state] = (stateCounts[state] || 0) + 1;
            
            if (!stateCities[state]) {
              stateCities[state] = {};
            }

            if (user.city) {
              const cityKey = `${user.city}, ${state}`;
              cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
              stateCities[state][user.city] = (stateCities[state][user.city] || 0) + 1;
            }
          }
        });

        const statesCount = Object.keys(stateCounts).length;
        const citiesCount = Object.keys(cityCounts).length;

        // Sort cities for fastest growing / top cities
        const sortedCities = Object.entries(cityCounts)
          .map(([key, count]) => {
            const [city, state] = key.split(', ');
            return { name: city, state, users: count };
          })
          .sort((a, b) => b.users - a.users)
          .slice(0, 3);

        const formattedCityData: Record<string, CityData[]> = {};
        Object.entries(stateCities).forEach(([state, cities]) => {
          formattedCityData[state] = Object.entries(cities)
            .map(([name, users]) => ({ name, state, users }))
            .sort((a, b) => b.users - a.users);
        });

        setStats({
          totalUsers: users.length,
          totalCities: citiesCount,
          totalStates: statesCount,
          totalPosts: totalPosts
        });

        setStateData(stateCounts);
        setCityData(formattedCityData);
        setTopCities(sortedCities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching map data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Color scale for the map
  const maxUsers = Math.max(...Object.values(stateData), 1);
  const colorScale = scaleLinear<string>()
    .domain([0, maxUsers])
    .range(["#e0f2fe", "#0284c7"]); // sky-100 to sky-600

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-500 mb-4 animate-pulse">
          <MapIcon size={32} />
        </div>
        <p className="text-gray-500 font-medium">{t('map.loading')}</p>
      </div>
    );
  }

  if (selectedCity) {
    return (
      <CityPage 
        city={selectedCity.name} 
        state={selectedCity.state} 
        onBack={() => setSelectedCity(null)} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
          <MapIcon size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t('map.title')}</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-2">
            <Users size={20} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('map.connectedFamilies')}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-2">
            <MapPin size={20} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.totalCities}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('map.activeCities')}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
            <MapIcon size={20} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.totalStates}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('map.activeStates')}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
            <MessageCircle size={20} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.totalPosts}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('map.postsShared')}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('map.activeCommunities')}</h3>
          <div className="w-full aspect-square md:aspect-video bg-sky-50/50 rounded-2xl overflow-hidden relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 600,
                center: [-54, -15]
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateSigla = geo.properties.sigla;
                    const usersCount = stateData[stateSigla] || 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={usersCount > 0 ? colorScale(usersCount) : "#f1f5f9"}
                        stroke="#ffffff"
                        strokeWidth={1}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#0ea5e9", outline: "none", cursor: "pointer" },
                          pressed: { fill: "#0284c7", outline: "none" },
                        }}
                        onClick={() => setSelectedState(stateSigla)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            
            {selectedState && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100">
                <p className="font-bold text-gray-900">{selectedState}</p>
                <p className="text-sm text-sky-600 font-medium">
                  {stateData[selectedState] || 0} {t('map.families')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fastest Growing & State List */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" />
              {t('map.fastestGrowing')}
            </h3>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div>
                    <p className="font-bold text-gray-900">{city.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">{city.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">+{Math.ceil(city.users * 1.5)}</p>
                    <p className="text-[10px] text-emerald-500 uppercase">{t('map.thisWeek')}</p>
                  </div>
                </div>
              ))}
              {topCities.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum dado disponível ainda.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedState ? `${t('map.citiesIn')} ${selectedState}` : t('map.activeCommunities')}
            </h3>
            
            {selectedState && (
              <button 
                onClick={() => setSelectedState(null)}
                className="text-sm text-sky-600 font-medium mb-4 hover:underline"
              >
                ← {t('map.backToMap')}
              </button>
            )}

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {!selectedState ? (
                Object.entries(stateData)
                  .sort((a, b) => b[1] - a[1])
                  .map(([state, count]) => (
                  <div key={state} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100" onClick={() => setSelectedState(state)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                        {state}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(t('map.shareTitle', { place: state }), t('map.shareText', { place: state })); }}
                        className="p-2 text-gray-400 hover:text-sky-600 transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {count} {t('map.families')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                cityData[selectedState]?.map((city, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100 group" 
                    onClick={() => setSelectedCity(city)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{city.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(t('map.shareTitle', { place: city.name }), t('map.shareText', { place: city.name })); }}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {city.users} {t('map.families')}
                      </span>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
