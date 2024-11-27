export interface EstimateValueForm {
  origin: string;
  destination: string;
  customer_id: string;
}

export interface EstimateValueResProps {
  destination: {
    latitude: number;
    longitude: number;
  };
  origin: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: Driver[];
  routeResponse: RouteResponse;
}

interface RouteResponse {
  routes: Route[];
}

interface Route {
  legs: Leg[];
}

interface Leg {
  distanceMeters: number;
  duration: string;
  startLocation: Location;
  endLocation: Location;
  polyline: Polyline;
}

interface Polyline {
  encodedPolyline: string;
}

interface Location {
  latLng: LatLng;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  reviews: Review[];
  value: number;
}

interface Review {
  rating: number;
  comment: string;
}

export interface TravelHistoryProps {
  customer_id: string;
  rides: RideProps[];
}

export interface RideProps {
  id: number;
  date: Date;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}
