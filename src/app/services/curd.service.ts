import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class CurdService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postData<T>(route: string, data: T): Observable<any> {
    return this.http.post(`${this.apiUrl}/${route}`, data, {
      headers: this.getHeaders()
    });
  }

  getData<T>(route: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${route}`, {
      headers: this.getHeaders()
    });
  }

  updateData<T>(route: string, data: T): Observable<any> {
    return this.http.put(`${this.apiUrl}/${route}`, data, {
      headers: this.getHeaders()
    });
  }

  deleteData(route: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${route}`, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }
}
