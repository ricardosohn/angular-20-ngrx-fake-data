import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingOverlayComponent } from './loading-overlay.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('LoadingOverlayComponent', () => {
  let fixture: ComponentFixture<LoadingOverlayComponent>;
  let component: LoadingOverlayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingOverlayComponent, TranslatePipeStub],
    })
      .overrideComponent(LoadingOverlayComponent, {
        set: { imports: [TranslatePipeStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoadingOverlayComponent);
    component = fixture.componentInstance;
  });

  it('deve exibir overlay quando loading=true', () => {
    // Arrange
    fixture.componentRef.setInput('loading', true);

    // Act
    fixture.detectChanges();

    // Assert
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.alert')).toBeTruthy();
    expect(el.textContent).toContain('loading');
  });

  it('não deve exibir overlay quando loading=false', () => {
    // Arrange
    fixture.componentRef.setInput('loading', false);

    // Act
    fixture.detectChanges();

    // Assert
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.alert')).toBeFalsy();
  });
});
