export const locations = {
  BR: {
    name: 'Brasil',
    states: [
      { id: 'SP', name: 'São Paulo' },
      { id: 'RJ', name: 'Rio de Janeiro' },
      { id: 'MG', name: 'Minas Gerais' },
    ],
    cities: {
      SP: [{ id: 'sp-1', name: 'São Paulo' }, { id: 'sp-2', name: 'Campinas' }],
      RJ: [{ id: 'rj-1', name: 'Rio de Janeiro' }],
      MG: [{ id: 'mg-1', name: 'Belo Horizonte' }],
    }
  },
  US: {
    name: 'United States',
    states: [
      { id: 'CA', name: 'California' },
      { id: 'TX', name: 'Texas' },
      { id: 'FL', name: 'Florida' },
    ],
    cities: {
      CA: [{ id: 'ca-1', name: 'Los Angeles' }, { id: 'ca-2', name: 'San Francisco' }],
      TX: [{ id: 'tx-1', name: 'Austin' }],
      FL: [{ id: 'fl-1', name: 'Miami' }],
    }
  },
  LATAM: {
    name: 'LATAM',
    countries: [
      { id: 'AR', name: 'Argentina' },
      { id: 'MX', name: 'Mexico' },
      { id: 'CO', name: 'Colombia' },
    ],
    states: {
      AR: [{ id: 'ar-ba', name: 'Buenos Aires' }, { id: 'ar-co', name: 'Córdoba' }],
      MX: [{ id: 'mx-cdmx', name: 'CDMX' }, { id: 'mx-jal', name: 'Jalisco' }],
      CO: [{ id: 'co-ant', name: 'Antioquia' }],
    },
    cities: {
      'ar-ba': [{ id: 'ar-ba-1', name: 'Buenos Aires' }],
      'ar-co': [{ id: 'ar-co-1', name: 'Córdoba' }],
      'mx-cdmx': [{ id: 'mx-cdmx-1', name: 'Mexico City' }],
      'mx-jal': [{ id: 'mx-jal-1', name: 'Guadalajara' }],
      'co-ant': [{ id: 'co-ant-1', name: 'Medellín' }],
    }
  }
};
