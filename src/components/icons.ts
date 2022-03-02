import L from 'leaflet';

export const icon = (data: { html?: string; iconAnchor?: L.Point; iconUrl?: string; className?: string; iconSize?: L.Point }) => {
  return L.divIcon(data);
};

export const MapIcon = {
  default: {
    html: '<div>114514</div>',
    className: '',
    iconSize: L.point(50, 50),
    iconUrl: '',
  },
};
