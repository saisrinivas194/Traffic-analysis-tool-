declare module 'react-simple-maps' {
  import { ComponentType, ReactNode } from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
    };
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => ReactNode;
  }

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onClick?: (geography: any) => void;
    onMouseEnter?: (geography: any) => void;
    onMouseLeave?: (geography: any) => void;
    className?: string;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: React.CSSProperties;
    className?: string;
  }

  export interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    curve?: number;
    children?: ReactNode;
    connectorProps?: any;
    className?: string;
  }

  export interface ZoomableGroupProps {
    children?: ReactNode;
    zoom?: number;
    center?: [number, number];
    onMoveStart?: (coordinates: [number, number]) => void;
    onMoveEnd?: (coordinates: [number, number]) => void;
    onMove?: (coordinates: [number, number]) => void;
    className?: string;
    style?: React.CSSProperties;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Annotation: ComponentType<AnnotationProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
}
