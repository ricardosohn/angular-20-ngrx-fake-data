import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  template: `<span id="out">{{ 'key' | translate:{ name: 'Ricardo' } }}</span>`
})
class HostComponent {}

describe('TranslatePipe', () => {
  let fixture: ComponentFixture<HostComponent>;
  let i18nMock: { translate: (key: string, params?: Record<string, any>) => string };

  beforeEach(async () => {
    // Arrange
    i18nMock = {
      translate: (key: string, params?: Record<string, any>) => {
        const name = params?.['name'] ?? '';
        return `${key}-translated-${name}`;
      }
    };

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: TranslationService, useValue: i18nMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
  });

  it('deve traduzir usando o serviço e interpolar parâmetros', () => {
    // Arrange
    fixture.detectChanges();

    // Act
    const el = fixture.nativeElement as HTMLElement;
    const span = el.querySelector('#out')!;

    // Assert
    expect(span.textContent?.trim()).toBe('key-translated-Ricardo');
  });
});
