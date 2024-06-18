// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { Router } from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  errorMessage: string = '';
  rememberLogin: boolean = false;

  constructor(private authService: AuthService, private router: Router, private titleService:Title) {
    this.titleService.setTitle("Login");
  }

  ngOnInit() {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { email, senha } = JSON.parse(savedCredentials);
      this.email = email;
      this.senha = senha;
      this.rememberLogin = true;
    }
  }

  onSubmit() {
    this.authService.login({ email: this.email, senha: this.senha }).subscribe(
      response => {
        localStorage.setItem('access_token', response.access_token);
        if (this.rememberLogin) {
          localStorage.setItem('savedCredentials', JSON.stringify({ email: this.email, senha: this.senha }));
        } else {
          localStorage.removeItem('savedCredentials');
        }
        if (response.cargo === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/requisitions']);
        }
      },
      error => {
        this.errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        console.error('Erro no login:', error);
      }
    );
  }
}
