import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './_services/_guards/auth.guard';
import { AddComponent } from './promotions/add/add.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatDialogModule } from '@angular/material/dialog';
import { AddModifierDialogComponent } from './promotions/add/add-modifier-dialog/add-modifier-dialog.component';
import { AddActionDialogComponent } from './promotions/add/add-action-dialog/add-action-dialog.component'; 

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    AddComponent,
    AddModifierDialogComponent,
    AddActionDialogComponent
  ],
  entryComponents: [
    AddModifierDialogComponent,
    AddActionDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '', component: HomeComponent, pathMatch: 'full',
        data: {
          forLoggedIn: false
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'promotions',
        children: [
          {
            path: '', component: CounterComponent,
            data: {
              forLoggedIn: true
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'add', component: AddComponent,
            data: {
              forLoggedIn: true
            },
            canActivate: [AuthGuard]
          }
        ]
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ], { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    NgbModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('authToken');
        },
        allowedDomains: ['localhost:61782']//,
        //blacklistedRoutes: ['localhost:5000/authentication']
      }
    }),
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
