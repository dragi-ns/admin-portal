import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs';

import { App } from '../../interfaces/app';
import { AppsService } from '../../services/apps.service';
import { AppDialogComponent } from '../app-dialog/app-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
})
export class AppsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayColumns = ['name', 'technologies', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<App>();

  constructor(
    private appsService: AppsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.appsService.getApps().subscribe((apps) => {
      this.dataSource.data = apps;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'technologies':
          return item.technologies.length;
        default:
          //@ts-ignore
          return item[property];
      }
    };
  }

  openAppDialog(app?: App) {
    const dialogRef = this.dialog.open(AppDialogComponent, {
      data: app,
      autoFocus: '#name',
    });

    dialogRef.componentInstance.submitted.subscribe((formData) => {
      dialogRef.componentInstance.loading = true;
      if (!app) {
        this.addApp(formData)
          .pipe(finalize(() => (dialogRef.componentInstance.loading = false)))
          .subscribe({
            next: () => {
              dialogRef.close();
              this.showSnackBar('Aplikacija uspešno dodata.');
            },
            error: () => {
              this.showSnackBar(
                'Dogodila se greška prilikom dodavanja aplikacije.'
              );
            },
          });
      } else {
        this.editApp(app.id!, formData)
          .pipe(finalize(() => (dialogRef.componentInstance.loading = false)))
          .subscribe({
            next: () => {
              dialogRef.close();
              this.showSnackBar('Aplikacija uspešno ažurirana');
            },
            error: () => {
              this.showSnackBar(
                'Dogodila se greška prilikom ažuriranja aplikacije.'
              );
            },
          });
      }
    });
  }

  openDeleteDialog(app: App) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message: `aplikaciju "${app.id} - ${app.name}"`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteApp(app.id!).subscribe({
          next: () => {
            this.showSnackBar('Aplikacija uspešno obrisana.');
          },
          error: () => {
            this.showSnackBar(
              'Dogodila se greška prilikom birsanja aplikacije.'
            );
          },
        });
      }
    });
  }

  addApp(newApp: App) {
    return this.appsService.addApp(newApp).pipe(
      tap((app: App) => {
        this.dataSource.data = [app, ...this.dataSource.data];
        this.resetSort();
      })
    );
  }

  editApp(id: number, appData: App) {
    return this.appsService.editApp(id, appData).pipe(
      tap((app: App) => {
        this.dataSource.data = this.dataSource.data.map((value) =>
          value.id === id ? app : value
        );
      })
    );
  }

  deleteApp(id: number) {
    return this.appsService.deleteApp(id).pipe(
      tap(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (value) => value.id !== id
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
