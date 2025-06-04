import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickElsewhere]',
})
export class ClickElsewhereDirective {
  @Output() appClickElsewhere = new EventEmitter<MouseEvent>();
  @Input() includedElements?: ElementRef[] = [];

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Check if the click was outside the element
    const clickOutsideHost = !!targetElement && !this.elementRef.nativeElement.contains(targetElement);

    // If the click was outside the host, ensure it wasn't on any included element
    const clickOutsideIncludedElements = (this.includedElements ?? []).every((elem) => {
      return !!elem && !elem.nativeElement.contains(targetElement);
    });

    if (clickOutsideHost && clickOutsideIncludedElements) {
      this.appClickElsewhere.emit(event);
    }
  }
}
