import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-client',
  templateUrl: './header-client.component.html',
  styleUrl: './header-client.component.css'
})
export class HeaderClientComponent {
  constructor(private router: Router) { }

  fazerLogout() {
    localStorage.removeItem('access_token');

    this.router.navigate(['/']);
  }
}
