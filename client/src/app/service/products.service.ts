// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  getProductsByUserId(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);

    return this.http.get(`${this.apiUrl}/products`, { headers });
  }
}
