import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToasterComponent } from './toaster.component';
import { ToastService, Toast } from '../../services/toast.service';

describe('ToasterComponent', () => {
  let fixture: ComponentFixture<ToasterComponent>;
  let component: ToasterComponent;

  const toastList: Toast[] = [
    { id: 1, type: 'success', message: 'ok', timeout: 0 },
    { id: 2, type: 'error', message: 'fail', timeout: 0 },
    { id: 3, type: 'warning', message: 'warn', timeout: 0 },
    { id: 4, type: 'info', message: 'info', timeout: 0 },
  ];

  const toastServiceMock: Partial<ToastService> = {
    toasts: { value: toastList, asReadonly: () => ({} as any), set: jest.fn(), update: jest.fn() } as any,
    dismiss: jest.fn(),
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToasterComponent],
      providers: [{ provide: ToastService, useValue: toastServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;

    // Arrange: override the signal read method to return our list
    (toastServiceMock.toasts as any) = {
      asReadonly: () => ({}),
      // Called by template via @for
      // Provide a fn property that returns current array
    } as any;
    // monkeypatch a method used by template iteration
    (component.toast.toasts as any) = (() => toastList) as any;

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
