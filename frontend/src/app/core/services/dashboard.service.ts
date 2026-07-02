import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.API_URL);
  }
}
