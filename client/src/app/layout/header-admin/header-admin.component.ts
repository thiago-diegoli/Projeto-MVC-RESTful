import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  constructor(private router: Router) { }

  fazerLogout() {
    localStorage.removeItem('access_token');

    this.router.navigate(['/']);
  }
}
