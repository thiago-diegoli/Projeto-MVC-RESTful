// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:4000/api/logins';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, senha: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }
  register(credentials: { nome: string, email: string, senha: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/cadastro', credentials);
  }
}
