import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { AppsComponent } from './components/apps/apps.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'apps',
        component: AppsComponent
      },
      {
        path: '',
        redirectTo: '/users',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
