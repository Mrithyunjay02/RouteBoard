import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './auth.service';

export interface Trip {
  id: number;
  vehicleNumber: string;
  origin: string;
  destination: string;
  scheduledStart: string;
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
  private readonly API_URL = 'https://routeboard.onrender.com/trips';
  private readonly HISTORY_URL = 'https://routeboard.onrender.com/history';
  private readonly USERS_URL = 'https://routeboard.onrender.com/users';

  constructor(private http: HttpClient) {}

  getAllTrips(driverId?: number | null): Observable<Trip[]> {
    let params = {};
    if (driverId) {
      params = { driverId: driverId.toString() };
    }
    return this.http.get<Trip[]>(this.API_URL, { params });
  }

  getDriverTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.API_URL);
  }

  createTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(this.API_URL, trip);
  }

  updateTrip(id: number, updates: Partial<Trip>): Observable<Trip> {
    return this.http.patch<Trip>(`${this.API_URL}/${id}`, updates);
  }



  getTripHistory(tripId: number): Observable<TripHistory[]> {
    return this.http.get<any[]>(`${this.HISTORY_URL}/${tripId}`).pipe(
      map(res => res.map(item => ({
        id: item.id,
        tripId: item.tripId,
        oldStatus: item.previousStatus,
        newStatus: item.newStatus,
        changedById: item.changedBy,
        changedAt: item.timestamp
      })))
    );
  }

  getDrivers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.USERS_URL}/drivers`);
  }
}
