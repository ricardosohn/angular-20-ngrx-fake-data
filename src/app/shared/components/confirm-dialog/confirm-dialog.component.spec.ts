import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, TranslatePipeStub],
    })
      .overrideComponent(ConfirmDialogComponent, {
        set: { imports: [TranslatePipeStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('modalId', 'modal-x');
    fixture.detectChanges();
  });

  function modalCheckbox(): HTMLInputElement | null {
    return fixture.nativeElement.querySelector('#modal-x');
  }

  it('deve abrir e fechar o modal via API', () => {
    // Arrange
    const checkbox = modalCheckbox()!;

    // Act: open
    component.open();
    fixture.detectChanges();
    // Assert
    expect(checkbox.checked).toBe(true);

    // Act: close
    component.close();
    fixture.detectChanges();
    // Assert
    expect(checkbox.checked).toBe(false);
  });

  it('deve emitir confirm e cancel ao clicar', () => {
    // Arrange
    const confirmSpy = jest.fn();
    const cancelSpy = jest.fn();
    component.confirm.subscribe(confirmSpy);
    component.cancel.subscribe(cancelSpy);
    fixture.detectChanges();

    // Act: dispara eventos via clique nos labels
    const el: HTMLElement = fixture.nativeElement;
    const labels = el.querySelectorAll('label');
    const cancelButtons = Array.from(labels).filter((l) => l.textContent?.trim() === 'cancel' || l.className.includes('modal-overlay'));
    const confirmButton = Array.from(labels).find((l) => l.textContent?.trim() === 'confirm');

    // clica em cancel (pode haver múltiplos: overlay e botão)
    cancelButtons.forEach((b) => (b as HTMLLabelElement).click());
    // clica em confirm
    (confirmButton as HTMLLabelElement).click();
    fixture.detectChanges();

    // Assert
    expect(cancelSpy).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalledTimes(1);
  });
});
