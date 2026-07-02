import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface Trip {
  id: number;
  vehicleNumber: string;
  origin: string;
  destination: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  driverId: number | null;
  driver?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TripHistory {
  id: number;
  tripId: number;
  oldStatus: string;
  newStatus: string;
  changedById: number;
  changedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private readonly API_URL = 'http://localhost:3000/trips';
  private readonly HISTORY_URL = 'http://localhost:3000/trip-history';
  private readonly USERS_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.API_URL);
  }

  getDriverTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}/driver/my-trips`);
  }

  createTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(this.API_URL, trip);
  }

  updateTrip(id: number, updates: Partial<Trip>): Observable<Trip> {
    return this.http.patch<Trip>(`${this.API_URL}/${id}`, updates);
  }

  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getTripHistory(tripId: number): Observable<TripHistory[]> {
    return this.http.get<TripHistory[]>(`${this.HISTORY_URL}/${tripId}`);
  }

  getDrivers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.USERS_URL}/drivers`);
  }
}
