export interface GetRideProps {
  origin: string;
  destination: string;
  customer_id: string;
}

export interface ConfirmRideProps {
  customer_id: string;
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

export interface ListRideProps {
  customer_id: string;
  driver_id?: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  driverID: number | null;
}
