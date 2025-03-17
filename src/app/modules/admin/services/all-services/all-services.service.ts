import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllServiceModule } from './all-services.module';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AllServicesService {
 private readonly API_URL = 'assets/data/allServices.json';
  constructor(private httpClient: HttpClient) {}
  getAllBookingList(): Observable<AllServiceModule[]> {
    return this.httpClient.get<AllServiceModule[]>(this.API_URL);
  }

  addBookings(booking: AllServiceModule) {
    return this.httpClient.post<AllServiceModule>(
      this.API_URL + '/addBooking',
      booking
    );
  }

  updateAllBookings(booking: AllServiceModule) {
    return this.httpClient.put<AllServiceModule>(
      this.API_URL + '/updateBooking',
      booking
    );
  }

  deleteAllBookings(id: number) {
    const urlString: string = this.API_URL + '/deleteBooking' + id;
    return this.httpClient.delete(urlString);
  }
}
