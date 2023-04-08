import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs';

import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayColumns = ['firstName', 'lastName', 'email', 'password', 'actions'];
  dataSource = new MatTableDataSource<User>();

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getUsers()
      .pipe(map((users) => users.map((user) => ({...user, showPassword: false}))))
      .subscribe((users) => {
        this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addUser() {
    console.log('Add user');
  }

  editUser(user: User) {
    console.log(`Edit user: ${user.id} - ${user.email}`);
  }

  deleteUser(user: User) {
    console.log(`Delete user: ${user.id} - ${user.email}`);
  }
}
