import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  catchError,
  finalize,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data: User[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  displayColumns = ['firstName', 'lastName', 'email', 'password', 'actions'];

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.usersService
            .getPaginatedUsers(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageSize,
              this.paginator.pageIndex + 1
            )
            .pipe(catchError(() => of(null)));
        }),
        map((response) => {
          this.isLoadingResults = false;

          if (response === null) {
            return [];
          }

          // Total number of users, json-server sets a header with X-Total-Count
          this.resultsLength = Number(response.headers.get('X-Total-Count'));
          return response.body!;
        })
      )
      .subscribe((users) => (this.data = users));
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: user,
      autoFocus: '#firstName',
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
        this.data = [user, ...this.data];
      })
    );
  }

  editUser(id: string, userData: User) {
    return this.usersService.editUser(id, userData).pipe(
      tap((user: User) => {
        this.data = this.data.map((value) => (value.id === id ? user : value));
      })
    );
  }

  deleteUser(userId: string) {
    return this.usersService.deleteUser(userId).pipe(
      tap(() => {
        this.data = this.data.filter((value) => value.id !== userId);
      })
    );
  }

  private showSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }
}
