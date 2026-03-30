import { 
  US_STATES, 
  US_CITIES, 
  LATAM_COUNTRIES, 
  LATAM_STATES, 
  LATAM_CITIES 
} from '../constants/locationData';

export const locations = {
  BR: {
    name: 'Brasil',
    states: [], // Will be fetched from IBGE
    cities: {}  // Will be fetched from IBGE
  },
  US: {
    name: 'United States',
    states: US_STATES,
    cities: US_CITIES
  },
  LATAM: {
    name: 'LATAM',
    countries: LATAM_COUNTRIES,
    states: LATAM_STATES,
    cities: LATAM_CITIES
  }
};
