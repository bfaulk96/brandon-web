import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appClickElsewhere]'
})
export class ClickElsewhereDirective {
  @Output() appClickElsewhere = new EventEmitter<MouseEvent>();
  @Input() includedElements?: ElementRef[] = [];

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Check if the click was outside the element
    const doesNotContainElement = targetElement && !this.elementRef.nativeElement.contains(targetElement);

    // Check if the click was outside the included elements
    //  shortcutting so we don't look through array if we don't need to
    const doesNotContainIncludedElements = !doesNotContainElement || this.includedElements.every((elem) => {
      return elem && !this.elementRef.nativeElement.contains(elem);
    });

    if (doesNotContainElement && doesNotContainIncludedElements) {
      this.appClickElsewhere.emit(event);
    }
  }
}
