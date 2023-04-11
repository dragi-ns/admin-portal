import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { App } from '../../interfaces/app';
import { AppsService } from '../../services/apps.service';
import { AppDialogComponent } from '../app-dialog/app-dialog.component';

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

  constructor(private appsService: AppsService, private dialog: MatDialog) {}

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
        case 'createdAt':
          return item.createdAt.getTime();
        default:
          //@ts-ignore
          return item[property];
      }
    };
  }

  openAppDialog(app?: App) {
    const dialogRef = this.dialog.open(AppDialogComponent, {
      data: app,
    });
  }
}
