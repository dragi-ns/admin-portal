import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import { srLatn } from 'date-fns/locale';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd/LL/yyyy',
  },
  display: {
    dateInput: 'dd/LL/yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'dd/LL/yyyy',
    monthYearA11yLabel: 'LLLL yyyy',
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    AdminModule,
    MatDateFnsModule,
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: srLatn,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
