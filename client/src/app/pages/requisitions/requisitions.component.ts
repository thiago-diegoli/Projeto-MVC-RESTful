import { Component } from '@angular/core';

@Component({
  selector: 'app-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrl: './requisitions.component.css'
})
export class RequisitionsComponent {
  mostrarPesquisaBec = false;

  onTipoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mostrarPesquisaBec = selectElement.value === 'não-sei';
  }
}
