import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderClientComponent } from './header-client/header-client.component';
import { RouterModule } from '@angular/router';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeaderClientComponent,
    PopoverComponent
   ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HeaderClientComponent,
    PopoverComponent
  ]
})

export class LayoutModule { }
