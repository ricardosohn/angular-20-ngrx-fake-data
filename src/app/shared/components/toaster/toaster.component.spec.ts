import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToasterComponent } from './toaster.component';
import { ToastService, Toast } from '../../services/toast.service';
import { signal, Signal } from '@angular/core';

describe('ToasterComponent', () => {
  let fixture: ComponentFixture<ToasterComponent>;
  let component: ToasterComponent;

  const toastList: Toast[] = [
    { id: 1, type: 'success', message: 'ok', timeout: 0 },
    { id: 2, type: 'error', message: 'fail', timeout: 0 },
    { id: 3, type: 'warning', message: 'warn', timeout: 0 },
    { id: 4, type: 'info', message: 'info', timeout: 0 },
  ];

  const toastSignal = signal<Toast[]>(toastList);
  const toastServiceMock: Partial<ToastService> = {
    toasts: toastSignal as unknown as ToastService['toasts'],
    dismiss: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToasterComponent],
      providers: [{ provide: ToastService, useValue: toastServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;

    // No monkeypatching needed; toasts() will return toastList via signal

    fixture.detectChanges();
  });

  it('deve renderizar toasts e mapear classes por tipo', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;

    // Act
    const alerts = Array.from(el.querySelectorAll('.alert')) as HTMLElement[];

    // Assert
    expect(alerts.length).toBe(4);
    expect(alerts.some(a => a.className.includes('alert-success'))).toBe(true);
    expect(alerts.some(a => a.className.includes('alert-error'))).toBe(true);
    expect(alerts.some(a => a.className.includes('alert-warning'))).toBe(true);
    // info falls to default
    expect(alerts.some(a => a.className.includes('alert-info'))).toBe(true);
  });

  it('deve chamar dismiss ao clicar no botão de fechar', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;
    const closeButtons = Array.from(el.querySelectorAll('button')) as HTMLButtonElement[];

    // Act
    // Clica no primeiro toast
    closeButtons[0].click();

    // Assert
    expect(toastServiceMock.dismiss).toHaveBeenCalledWith(1);
  });
});
