import 'leaflet';

declare module 'leaflet' {
  export class CanvasIconLayer extends Layer {
    addTo(map: Map | LayerGroup): this;
    addMarker(marker: Marker, title: string, titleOpt: any): void;
    addMarkers(markers: Array<Marker>, title: string, titleOpt: any): void;
    getBounds(): LatLngBounds;
    redraw(): void;
    clear(): void;
    removeMarker(marker: Marker): void;
  }
  function canvasIconLayer(): CanvasIconLayer;
}
