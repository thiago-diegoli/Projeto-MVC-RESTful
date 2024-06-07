import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderClientComponent } from './header-client/header-client.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeaderClientComponent
   ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HeaderClientComponent
  ]
})

export class LayoutModule { }
