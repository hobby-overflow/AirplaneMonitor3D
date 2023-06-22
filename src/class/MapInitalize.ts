import mapboxgl from 'mapbox-gl';
import TOKEN from './Token';

const satellite = 'mapbox://styles/mapbox/satellite-v9';
const satellite_streets = 'mapbox://styles/mapbox/satellite-streets-v11';

let Config: Config;

export const MapInitialize = () => {
  window.api.send('read_config', null);
  window.api.on('read_config', (arg: string) => {
    if (arg != null) {
      Config = JSON.parse(arg) as Config;
    }
  });

  // TOKEN is not use?
  const mapCenter = new mapboxgl.LngLat(141.6769, 42.7831);
  const map = new mapboxgl.Map({
    container: document.getElementById('mapContainer') as HTMLElement,
    center: mapCenter,
    pitch: 60,
    zoom: 16,
    antialias: true,
    style: satellite,
    accessToken: TOKEN
  });
  return map;
};

export default MapInitialize;
