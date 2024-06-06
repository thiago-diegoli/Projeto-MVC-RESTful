import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LayoutModule } from './../layout/layout.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
   ],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent
  ]
})

export class PagesModule { }
