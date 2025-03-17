import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllPropertyService {
  private readonly API_URL = 'http://localhost:3000/package';
  
  constructor(private httpClient: HttpClient) {}
  
  getAllBookingList(): Observable<any[]> {  // Return any type as per your backend response
    return this.httpClient.get<any[]>(this.API_URL);
  }

  addBookings(booking: any) {
    return this.httpClient.post<any>(this.API_URL + '/addBooking', booking);
  }

  updateAllBookings(booking: any) {
    return this.httpClient.put<any>(this.API_URL + '/updateBooking', booking);
  }

  deleteAllBookings(id: number) {
    const urlString: string = this.API_URL + '/deleteBooking' + id;
    return this.httpClient.delete(urlString);
  }
}
