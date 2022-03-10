import 'leaflet';

export interface MarkerTitleStyle {
  font?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface MarkerTitleOpt {
  normal: MarkerTitleStyle;
  hover?: MarkerTitleStyle;
  active?: MarkerTitleStyle;
}

declare module 'leaflet' {
  export class CanvasIconLayer extends Layer {
    addTo(map: Map | LayerGroup): this;
    addMarker(marker: Marker, title: string, titleOpt: MarkerTitleOpt, additional?: any): void;
    addMarkers(markers: Array<Marker>, title: string, titleOpt: MarkerTitleOpt, additional?: any): void;
    getBounds(): LatLngBounds;
    redraw(): void;
    clear(): void;
    clearLayers() : void;
    removeMarker(marker: Marker): void;
    addOnClickListener: (eventHandler: (listener: any, ret: any) => void) => void;
    addOnHoverListener: (eventHandler: (listener: any, ret: any) => void) => void;
  }
  function canvasIconLayer(): CanvasIconLayer;
}
