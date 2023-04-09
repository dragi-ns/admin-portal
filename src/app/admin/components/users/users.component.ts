import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, map, tap } from 'rxjs';

import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayColumns = ['firstName', 'lastName', 'email', 'password', 'actions'];
  dataSource = new MatTableDataSource<User>();

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.usersService
      .getUsers()
      .pipe(
        map((users) => users.map((user) => ({ ...user, showPassword: false })))
      )
      .subscribe((users) => {
        this.dataSource.data = users;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: user,
    });

    dialogRef.componentInstance.submitted.subscribe((formData) => {
      dialogRef.componentInstance.loading = true;
      if (!user) {
        this.addUser(formData)
          .pipe(finalize(() => (dialogRef.componentInstance.loading = false)))
          .subscribe({
            next: () => {
              dialogRef.close();
              this.showSnackBar('Korisnik uspešno dodat.');
            },
            error: () => {
              this.showSnackBar(
                'Dogodila se greška prilikom dodavanja korisnika.'
              );
            },
          });
      } else {
        this.editUser(user.id!, formData)
          .pipe(finalize(() => (dialogRef.componentInstance.loading = false)))
          .subscribe({
            next: () => {
              dialogRef.close();
              this.showSnackBar('Korisnik uspešno ažuriran.');
            },
            error: () => {
              this.showSnackBar(
                'Dogodila se greška prilikom ažuriranja korisnika.'
              );
            },
          });
      }
    });
  }

  openDeleteDialog(user: User) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message: `korisnika "${user.id} - ${user.firstName} ${user.lastName}"`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user.id!).subscribe({
          next: () => {
            this.showSnackBar('Korisnik uspešno obrisan.');
          },
          error: () => {
            this.showSnackBar(
              'Dogodila se greška prilikom birsanja korisnika.'
            );
          },
        });
      }
    });
  }

  addUser(newUser: User) {
    return this.usersService.addUser(newUser).pipe(
      tap((user: User) => {
        this.dataSource.data = [user, ...this.dataSource.data];
        this.resetSort();
      })
    );
  }

  editUser(id: string, userData: User) {
    return this.usersService.editUser(id, userData).pipe(
      tap((user: User) => {
        this.dataSource.data = this.dataSource.data.map((value) =>
          value.id === id ? user : value
        );
      })
    );
  }

  deleteUser(userId: string) {
    return this.usersService.deleteUser(userId).pipe(
      tap(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (value) => value.id !== userId
        );
      })
    );
  }

  private resetSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  private showSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }
}
