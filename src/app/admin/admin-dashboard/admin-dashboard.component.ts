import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(public router: Router) {
  }
}
