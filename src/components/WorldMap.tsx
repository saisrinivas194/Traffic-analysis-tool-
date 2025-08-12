import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

// You can use a public TopoJSON file for world map
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Add a static lookup table for country centroids (ISO code to [lng, lat])
const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  US: [-98.35, 39.50], IN: [78.96, 20.59], CN: [104.19, 35.86], GB: [-3.44, 55.38], DE: [10.45, 51.16],
  FR: [2.21, 46.23], JP: [138.25, 36.20], BR: [-51.93, -14.24], CA: [-106.35, 56.13], AU: [133.78, -25.27],
  RU: [105.32, 61.52], KR: [127.77, 35.91], IT: [12.57, 41.87], ES: [-3.75, 40.46], MX: [-102.55, 23.63],
  // Add more as needed
};

// Add a static lookup for city coordinates (for demo, a few major cities)
const CITY_COORDS: Record<string, Record<string, [number, number]>> = {
  'IN': { 'Mumbai': [72.8777, 19.076], 'Delhi': [77.1025, 28.7041], 'Bangalore': [77.5946, 12.9716] },
  'US': { 'New York': [-74.006, 40.7128], 'Los Angeles': [-118.2437, 34.0522], 'Chicago': [-87.6298, 41.8781], 'San Francisco': [-122.4194, 37.7749] },
  'GB': { 'London': [-0.1276, 51.5074], 'Manchester': [-2.2426, 53.4808], 'Birmingham': [-1.892, 52.4862] },
  'DE': { 'Berlin': [13.405, 52.52], 'Munich': [11.582, 48.1351], 'Hamburg': [9.9937, 53.5511] },
  'CN': {
    'Beijing': [116.4074, 39.9042],
    'Shanghai': [121.4737, 31.2304],
    'Guangzhou': [113.2644, 23.1291],
    'Shenzhen': [114.0579, 22.5431],
    'Chengdu': [104.0665, 30.5728]
  },
  'AU': {
    'Sydney': [151.2093, -33.8688],
    'Melbourne': [144.9631, -37.8136],
    'Brisbane': [153.0251, -27.4698],
    'Perth': [115.8575, -31.9505],
    'Adelaide': [138.6007, -34.9285],
    'Canberra': [149.1300, -35.2809],
    'Gold Coast': [153.4000, -28.0167],
    'Newcastle': [151.7800, -32.9267],
    'Wollongong': [150.8931, -34.4278],
    'Hobart': [147.3272, -42.8821],
    'Darwin': [130.8456, -12.4634]
  },
  'FR': {
    'Paris': [2.3522, 48.8566],
    'Marseille': [5.3698, 43.2965],
    'Lyon': [4.8357, 45.7640],
    'Toulouse': [1.4442, 43.6047],
    'Nice': [7.2620, 43.7102]
  },
  'JP': {
    'Tokyo': [139.6917, 35.6895],
    'Osaka': [135.5023, 34.6937],
    'Yokohama': [139.6380, 35.4437]
  },
  'BR': {
    'Sao Paulo': [-46.6333, -23.5505],
    'Rio de Janeiro': [-43.1729, -22.9068],
    'Brasilia': [-47.9292, -15.7801]
  },
  // Add more as needed
};

const getCountryCentroid = (countryCode: string, availableRegions: { countries: any[] }): [number, number] => {
  // Use static lookup first
  if (COUNTRY_CENTROIDS[countryCode]) return COUNTRY_CENTROIDS[countryCode];
  // Fallback to availableRegions if it has centroids
  if (availableRegions) {
    const country = availableRegions.countries.find((c: any) => c.code === countryCode);
    if (country && country.centroid) return country.centroid;
  }
  return [0, 0];
};

const getCityCoords = (city: string, country: string, availableRegions: { countries: any[] }): [number, number] => {
  if (CITY_COORDS[country] && CITY_COORDS[country][city]) {
    return CITY_COORDS[country][city];
  }
  // Fallback: jitter around country centroid
  const base = getCountryCentroid(country, availableRegions);
  const hash = city.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  return [base[0] + (hash % 5) - 2, base[1] + ((hash >> 2) % 5) - 2];
};

interface WorldMapProps {
  selectedCountry: string;
  selectedCity: string;
  regionWiseAnalytics: any;
  availableRegions: any;
}

const WorldMap = ({ selectedCountry, selectedCity, regionWiseAnalytics, availableRegions }: WorldMapProps) => {
  // Get country-level data
  const countryData = regionWiseAnalytics?.top_countries || [];
  // Get city-level data if a country is selected
  const cityData = selectedCountry && regionWiseAnalytics?.top_cities
    ? regionWiseAnalytics.top_cities.filter((city: any) => city.country_code === selectedCountry)
    : [];

  // If both country and city are selected, find that city
  const selectedCityData = selectedCountry && selectedCity && cityData.length
    ? cityData.find((city: any) => city.city === selectedCity)
    : null;

  // Get zoom/center
  const [zoomState, setZoom] = useState(selectedCountry ? 3 : 1);
  let center: [number, number] = [0, 20];
  let zoom = zoomState;
  if (selectedCountry && availableRegions) {
    if (selectedCityData) {
      center = getCityCoords(selectedCityData.city, selectedCountry, availableRegions);
      zoom = 6;
    } else {
      const centroid = getCountryCentroid(selectedCountry, availableRegions);
      if (centroid && centroid[0] && centroid[1]) {
        center = centroid;
        zoom = 3;
      }
    }
  }

  const handleZoomIn = () => setZoom((z: number) => Math.min(z + 1, 8));
  const handleZoomOut = () => setZoom((z: number) => Math.max(z - 1, 1));

  return (
    <div className="w-full h-64 md:h-96 relative">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2 bg-white rounded shadow p-1">
        <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center text-lg font-bold text-blue-700 hover:bg-blue-100 rounded">+</button>
        <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center text-lg font-bold text-blue-700 hover:bg-blue-100 rounded">-</button>
      </div>
      <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: '100%', height: '100%' }}>
        <ZoomableGroup
          center={center}
          zoom={zoom}
          onMoveEnd={({ zoom: z }: { zoom: number }) => setZoom(z)}
          disablePanning
          disableZoom
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E0E7FF"
                  stroke="#94A3B8"
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#6366F1', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {/* City marker if both country and city are selected */}
          {selectedCountry && selectedCity && selectedCityData && (
            <Marker
              key={selectedCityData.city}
              coordinates={getCityCoords(selectedCityData.city, selectedCountry, availableRegions)}
            >
              {/* SVG blue pin icon */}
              <g className="animate-bounce" style={{ transformOrigin: 'center bottom' }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#2563EB" stroke="#fff" strokeWidth={1.5}/>
                <circle cx="12" cy="9" r="3" fill="#fff"/>
              </g>
              <title>{`City: ${selectedCityData.city}\nPageviews: ${selectedCityData.pageviews}`}</title>
            </Marker>
          )}
          {/* City markers if only country is selected */}
          {selectedCountry && !selectedCity && cityData.map((city: any) => (
            <Marker
              key={city.city}
              coordinates={getCityCoords(city.city, selectedCountry, availableRegions)}
            >
              <circle r={6} fill="#F59E42" stroke="#fff" strokeWidth={2} />
              <title>{`City: ${city.city}\nPageviews: ${city.pageviews}`}</title>
            </Marker>
          ))}
          {/* Country markers if no country is selected */}
          {!selectedCountry && countryData.map((country: any) => (
            <Marker
              key={country.country_code}
              coordinates={getCountryCentroid(country.country_code, availableRegions)}
            >
              <circle r={8} fill="#2563EB" stroke="#fff" strokeWidth={2} />
              <title>{`Country: ${country.country_name}\nPageviews: ${country.pageviews}`}</title>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap; 