import L from 'leaflet';
import markerIconPng from '/marker-icon.png';
import markerShadowPng from '/marker-shadow.png';

const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

export default markerIcon;
