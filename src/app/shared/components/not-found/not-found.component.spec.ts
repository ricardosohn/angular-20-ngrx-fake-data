import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('NotFoundComponent', () => {
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NotFoundComponent, TranslatePipeStub] })
      .overrideComponent(NotFoundComponent, { set: { imports: [TranslatePipeStub] } })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
  });

  it('deve renderizar a mensagem traduzida', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;

    // Act
    const text = el.textContent || '';

    // Assert
    expect(text).toContain('pageNotFound');
  });
});
