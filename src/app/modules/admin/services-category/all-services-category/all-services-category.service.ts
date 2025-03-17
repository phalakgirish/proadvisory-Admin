import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllCategoryModule } from './all-services-category.module';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AllCategoryService {
 private readonly API_URL = 'assets/data/allServicesCategory.json';
  constructor(private httpClient: HttpClient) {}
  getAllBookingList(): Observable<AllCategoryModule[]> {
    return this.httpClient.get<AllCategoryModule[]>(this.API_URL);
  }

  addBookings(booking: AllCategoryModule) {
    return this.httpClient.post<AllCategoryModule>(
      this.API_URL + '/addBooking',
      booking
    );
  }

  updateAllBookings(booking: AllCategoryModule) {
    return this.httpClient.put<AllCategoryModule>(
      this.API_URL + '/updateBooking',
      booking
    );
  }

  deleteAllBookings(id: number) {
    const urlString: string = this.API_URL + '/deleteBooking' + id;
    return this.httpClient.delete(urlString);
  }
}
