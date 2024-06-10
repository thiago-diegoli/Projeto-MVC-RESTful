import { Component, Input, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css']
})
export class PopoverComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  isVisible = true;

  @Output() visibilityChange = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) {}

  onClickInsidePopover(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClickOutsidePopover(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isVisible = false;
      this.visibilityChange.emit(this.isVisible); // Notificar o componente pai sobre a alteração de visibilidade
    }
  }

  togglePopover(): void {
    this.isVisible = !this.isVisible;
    this.visibilityChange.emit(this.isVisible); // Notificar o componente pai sobre a alteração de visibilidade
  }
}
