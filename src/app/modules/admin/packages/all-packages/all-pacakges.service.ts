import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllPacakgesModule } from './all-pacakges.module';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AllPacakgesService {
//  private readonly API_URL = 'assets/data/allPackages.json';
 private readonly API_URL = 'http://localhost:3000/package';
  constructor(private httpClient: HttpClient) {}
  getAllBookingList(): Observable<AllPacakgesModule[]> {
    return this.httpClient.get<AllPacakgesModule[]>(this.API_URL);
  }

  addBookings(booking: AllPacakgesModule) {
    return this.httpClient.post<AllPacakgesModule>(
      this.API_URL + '/addBooking',
      booking
    );
  }

  updateAllBookings(booking: AllPacakgesModule) {
    return this.httpClient.put<AllPacakgesModule>(
      this.API_URL + '/updateBooking',
      booking
    );
  }

  deleteAllBookings(id: number) {
    const urlString: string = this.API_URL + '/deleteBooking' + id;
    return this.httpClient.delete(urlString);
  }
}
