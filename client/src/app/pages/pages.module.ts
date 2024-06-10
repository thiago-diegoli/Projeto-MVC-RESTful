import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LayoutModule } from './../layout/layout.module';
import { RouterModule } from '@angular/router';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { HistoricComponent } from './historic/historic.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RequisitionsComponent,
    HistoricComponent
   ],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent
  ]
})

export class PagesModule { }
