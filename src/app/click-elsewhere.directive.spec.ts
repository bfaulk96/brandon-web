import { ElementRef } from '@angular/core';
import { ClickElsewhereDirective } from './click-elsewhere.directive';

describe('ClickElsewhereDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickElsewhereDirective(new ElementRef(document.createElement('div')));
    expect(directive).toBeTruthy();
  });

  it('should emit when clicking outside host and included elements', () => {
    const host = document.createElement('div');
    const included = document.createElement('div');
    const directive = new ClickElsewhereDirective(new ElementRef(host));
    directive.includedElements = [new ElementRef(included)];
    const spy = jasmine.createSpy('emit');
    directive.appClickElsewhere.subscribe(spy);
    directive.onDocumentClick({ target: document.body } as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit when clicking inside included element', () => {
    const host = document.createElement('div');
    const included = document.createElement('div');
    const directive = new ClickElsewhereDirective(new ElementRef(host));
    directive.includedElements = [new ElementRef(included)];
    const spy = jasmine.createSpy('emit');
    directive.appClickElsewhere.subscribe(spy);
    directive.onDocumentClick({ target: included } as MouseEvent);
    expect(spy).not.toHaveBeenCalled();
  });
});
