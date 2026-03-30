export const US_STATES = [
  { id: 'Alabama', name: 'Alabama' },
  { id: 'Alaska', name: 'Alaska' },
  { id: 'Arizona', name: 'Arizona' },
  { id: 'Arkansas', name: 'Arkansas' },
  { id: 'California', name: 'California' },
  { id: 'Colorado', name: 'Colorado' },
  { id: 'Connecticut', name: 'Connecticut' },
  { id: 'Delaware', name: 'Delaware' },
  { id: 'Florida', name: 'Florida' },
  { id: 'Georgia', name: 'Georgia' },
  { id: 'Hawaii', name: 'Hawaii' },
  { id: 'Idaho', name: 'Idaho' },
  { id: 'Illinois', name: 'Illinois' },
  { id: 'Indiana', name: 'Indiana' },
  { id: 'Iowa', name: 'Iowa' },
  { id: 'Kansas', name: 'Kansas' },
  { id: 'Kentucky', name: 'Kentucky' },
  { id: 'Louisiana', name: 'Louisiana' },
  { id: 'Maine', name: 'Maine' },
  { id: 'Maryland', name: 'Maryland' },
  { id: 'Massachusetts', name: 'Massachusetts' },
  { id: 'Michigan', name: 'Michigan' },
  { id: 'Minnesota', name: 'Minnesota' },
  { id: 'Mississippi', name: 'Mississippi' },
  { id: 'Missouri', name: 'Missouri' },
  { id: 'Montana', name: 'Montana' },
  { id: 'Nebraska', name: 'Nebraska' },
  { id: 'Nevada', name: 'Nevada' },
  { id: 'New Hampshire', name: 'New Hampshire' },
  { id: 'New Jersey', name: 'New Jersey' },
  { id: 'New Mexico', name: 'New Mexico' },
  { id: 'New York', name: 'New York' },
  { id: 'North Carolina', name: 'North Carolina' },
  { id: 'North Dakota', name: 'North Dakota' },
  { id: 'Ohio', name: 'Ohio' },
  { id: 'Oklahoma', name: 'Oklahoma' },
  { id: 'Oregon', name: 'Oregon' },
  { id: 'Pennsylvania', name: 'Pennsylvania' },
  { id: 'Rhode Island', name: 'Rhode Island' },
  { id: 'South Carolina', name: 'South Carolina' },
  { id: 'South Dakota', name: 'South Dakota' },
  { id: 'Tennessee', name: 'Tennessee' },
  { id: 'Texas', name: 'Texas' },
  { id: 'Utah', name: 'Utah' },
  { id: 'Vermont', name: 'Vermont' },
  { id: 'Virginia', name: 'Virginia' },
  { id: 'Washington', name: 'Washington' },
  { id: 'West Virginia', name: 'West Virginia' },
  { id: 'Wisconsin', name: 'Wisconsin' },
  { id: 'Wyoming', name: 'Wyoming' }
];

export const US_CITIES: Record<string, string[]> = {
  'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'],
  'Alaska': ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
  'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'],
  'California': ['Los Angeles', 'San Diego', 'San Francisco', 'Sacramento', 'San Jose', 'Fresno', 'Oakland', 'Long Beach', 'Anaheim'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder'],
  'Connecticut': ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury'],
  'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'St. Petersburg', 'Tallahassee', 'Hialeah'],
  'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
  'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Pearl City', 'Waipahu'],
  'Idaho': ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'],
  'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Springfield', 'Naperville'],
  'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'],
  'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
  'Kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe'],
  'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'],
  'Maine': ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'],
  'Maryland': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Annapolis'],
  'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'],
  'Minnesota': ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington'],
  'Mississippi': ['Jackson', 'Gulfport', 'Southaven', 'Biloxi', 'Hattiesburg'],
  'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'],
  'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'],
  'Nebraska': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
  'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Dover', 'Rochester'],
  'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison'],
  'New Mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond'],
  'Oregon': ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
  'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'],
  'South Carolina': ['Columbia', 'Charleston', 'North Charleston', 'Greenville', 'Spartanburg'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
  'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi'],
  'Utah': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'],
  'Vermont': ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'],
  'Virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  'West Virginia': ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
  'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
  'Wyoming': ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs']
};

export const LATAM_COUNTRIES = [
  { id: 'MX', name: 'México' },
  { id: 'AR', name: 'Argentina' },
  { id: 'CO', name: 'Colombia' },
  { id: 'ES', name: 'España' },
  { id: 'CL', name: 'Chile' },
  { id: 'PE', name: 'Perú' },
  { id: 'VE', name: 'Venezuela' },
  { id: 'EC', name: 'Ecuador' },
  { id: 'BO', name: 'Bolivia' },
  { id: 'PY', name: 'Paraguay' },
  { id: 'UY', name: 'Uruguay' },
  { id: 'CR', name: 'Costa Rica' },
  { id: 'PA', name: 'Panamá' },
  { id: 'GT', name: 'Guatemala' },
  { id: 'DO', name: 'República Dominicana' }
];

export const LATAM_STATES: Record<string, { id: string, name: string }[]> = {
  'MX': [
    { id: 'CDMX', name: 'Ciudad de México' },
    { id: 'JAL', name: 'Jalisco' },
    { id: 'NL', name: 'Nuevo León' },
    { id: 'MEX', name: 'Estado de México' },
    { id: 'PUE', name: 'Puebla' },
    { id: 'VER', name: 'Veracruz' },
    { id: 'GUA', name: 'Guanajuato' }
  ],
  'AR': [
    { id: 'BUE', name: 'Buenos Aires' },
    { id: 'CBA', name: 'Córdoba' },
    { id: 'MDZ', name: 'Mendoza' },
    { id: 'SFE', name: 'Santa Fe' }
  ],
  'CO': [
    { id: 'DC', name: 'Bogotá' },
    { id: 'ANT', name: 'Antioquia' },
    { id: 'VAC', name: 'Valle del Cauca' },
    { id: 'ATL', name: 'Atlántico' }
  ],
  'ES': [
    { id: 'MAD', name: 'Madrid' },
    { id: 'CAT', name: 'Cataluña' },
    { id: 'AND', name: 'Andalucía' },
    { id: 'VAL_ES', name: 'Valencia' }
  ],
  'CL': [
    { id: 'RM', name: 'Región Metropolitana' },
    { id: 'VAL', name: 'Valparaíso' },
    { id: 'BIO', name: 'Biobío' }
  ],
  'PE': [
    { id: 'LIM', name: 'Lima' },
    { id: 'ARE', name: 'Arequipa' },
    { id: 'CUS', name: 'Cusco' }
  ],
  'VE': [
    { id: 'DC_VE', name: 'Distrito Capital' },
    { id: 'MIR', name: 'Miranda' },
    { id: 'ZUL', name: 'Zulia' }
  ],
  'EC': [
    { id: 'PIC', name: 'Pichincha' },
    { id: 'GUA_EC', name: 'Guayas' }
  ],
  'BO': [
    { id: 'LPB', name: 'La Paz' },
    { id: 'SCZ', name: 'Santa Cruz' }
  ],
  'PY': [
    { id: 'ASU', name: 'Asunción' },
    { id: 'CEN', name: 'Central' }
  ],
  'UY': [
    { id: 'MVD', name: 'Montevideo' }
  ],
  'CR': [
    { id: 'SJ', name: 'San José' }
  ],
  'PA': [
    { id: 'PAN', name: 'Panamá' }
  ],
  'GT': [
    { id: 'GUA_GT', name: 'Guatemala' }
  ],
  'DO': [
    { id: 'DN', name: 'Distrito Nacional' }
  ]
};

export const LATAM_CITIES: Record<string, string[]> = {
  'CDMX': ['Ciudad de México'],
  'JAL': ['Guadalajara'],
  'NL': ['Monterrey'],
  'MEX': ['Toluca'],
  'PUE': ['Puebla'],
  'VER': ['Veracruz'],
  'GUA': ['León'],
  'BUE': ['Buenos Aires', 'La Plata'],
  'CBA': ['Córdoba'],
  'MDZ': ['Mendoza'],
  'SFE': ['Rosario'],
  'DC': ['Bogotá'],
  'ANT': ['Medellín'],
  'VAC': ['Cali'],
  'ATL': ['Barranquilla'],
  'MAD': ['Madrid'],
  'CAT': ['Barcelona'],
  'AND': ['Sevilla', 'Málaga'],
  'VAL_ES': ['Valencia'],
  'RM': ['Santiago'],
  'VAL': ['Valparaíso', 'Viña del Mar'],
  'BIO': ['Concepción'],
  'LIM': ['Lima'],
  'ARE': ['Arequipa'],
  'CUS': ['Cusco'],
  'DC_VE': ['Caracas'],
  'MIR': ['Caracas'],
  'ZUL': ['Maracaibo'],
  'PIC': ['Quito'],
  'GUA_EC': ['Guayaquil'],
  'LPB': ['La Paz'],
  'SCZ': ['Santa Cruz de la Sierra'],
  'ASU': ['Asunción'],
  'CEN': ['Ciudad del Este'],
  'MVD': ['Montevideo', 'Punta del Este'],
  'SJ': ['San José'],
  'PAN': ['Ciudad de Panamá'],
  'GUA_GT': ['Ciudad de Guatemala'],
  'DN': ['Santo Domingo']
};
