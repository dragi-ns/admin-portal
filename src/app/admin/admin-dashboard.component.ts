import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  nav = [
    {
      path: '/users',
      title: 'Korisnici'
    },
    {
      path: '/apps',
      title: 'Aplikacije'
    }
  ];

  constructor(private authService: AuthService, public router: Router) {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
