import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { City } from 'app/interfaces/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
    
    private apiUrl = 'http://localhost:3000/city';  // Your API endpoint

    constructor(private http: HttpClient) {}
  
     // Fetch all cities
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.apiUrl);
  }

  // Add a new city
  addCity(city: City): Observable<City> {
    return this.http.post<City>(this.apiUrl, city);
  }

  // Delete multiple cities
  deleteCities(cities: City[]): Observable<void> {
    const ids = cities.map(city => city.id); 
    return this.http.delete<void>(`${this.apiUrl}/delete-multiple`, { body: { ids } });
  }

  deleteCity(id: string ): Observable<any> {
    return this.http.delete(`http://localhost:3000/city/${id}`);
  }
  
  
}
