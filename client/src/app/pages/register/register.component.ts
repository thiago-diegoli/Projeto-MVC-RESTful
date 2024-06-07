import { Component } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';
  errorMessages: string[] = [];
  confirmarSenha: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem. Por favor, verifique.');
      return;
    }
    this.authService.register({ nome: this.nome, email: this.email, senha: this.senha }).subscribe(
      response => {
        this.router.navigate(['/']);
      },
      error => {
        if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
          // Extrair mensagens de erro da resposta HTTP
          this.errorMessages = error.error.errors.map((err: { msg: string })=> err.msg);
        } else {
          this.errorMessages = ['Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde.'];
        }
        console.error('Erro no login:', error);
      }
    );
  }
}
