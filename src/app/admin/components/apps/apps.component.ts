import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { App } from '../../interfaces/app';
import { AppsService } from '../../services/apps.service';

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

  constructor(private appsService: AppsService) {}

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
}
