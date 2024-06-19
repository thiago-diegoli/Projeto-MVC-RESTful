// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  private apiUrl = 'https://projeto-mvc-restful-server.vercel.app/api/products';

  constructor(private http: HttpClient) { }

  getProductsByUserId(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);

    return this.http.get(`${this.apiUrl}/`, { headers });
  }

  updateProduct(productData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);

    return this.http.put(`${this.apiUrl}/`, productData, { headers });
  }

  deleteProduct(id: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getProductsAll(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);

        return this.http.get(`${this.apiUrl}/all`, { headers });
  }

  insertProduct(productData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);

    return this.http.post(`${this.apiUrl}/`, productData, { headers });
  }

  updateStatusProduct(productData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('access-token', `${token}`);
    const id = productData._id
    return this.http.put(`${this.apiUrl}/aprove/${id}`, productData, { headers });
  }
}
