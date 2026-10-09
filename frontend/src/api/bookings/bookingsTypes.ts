export interface Bookings {
  id: number;
  event: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface RegisterResponse {
  message: string;
  registration: Bookings;
}

export interface GetMyRegistrationsParams {
  ordering?: string;
  search?: string;
  page?: number;
}
