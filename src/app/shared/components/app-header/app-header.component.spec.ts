import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHeaderComponent } from './app-header.component';
import { ActivatedRoute, Event as RouterEvent, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';
import { ThemeService } from '../../../core/services/theme.service';

describe('AppHeaderComponent', () => {
  let fixture: ComponentFixture<AppHeaderComponent>;

  // Mocks
  let routerEvents$: Subject<RouterEvent>;
  let i18nMock: {
    lang: () => string;
    translate: (key: string, params?: Record<string, unknown>) => string;
    load: jest.Mock<Promise<void>, [string]>;
  };
  let themeState: 'light' | 'dark';
  let themeServiceMock: { theme: () => 'light' | 'dark'; toggle: jest.Mock<void, []> };

  beforeEach(async () => {
    // Arrange (common): Router e rota aninhada com data.titleKey
  routerEvents$ = new Subject<RouterEvent>();
    const mockRouter: Partial<Router> = {
      events: routerEvents$.asObservable(),
    };

    const deepestRoute: Partial<ActivatedRoute> = {
      firstChild: null,
      snapshot: { data: { titleKey: 'productsPageTitle' } } as unknown as ActivatedRoute['snapshot'],
    };
    const childRoute: Partial<ActivatedRoute> = { firstChild: deepestRoute as ActivatedRoute };
    const rootRoute: Partial<ActivatedRoute> = { firstChild: childRoute as ActivatedRoute };

    // Arrange (common): i18n mock
    i18nMock = {
      lang: () => 'pt',
      translate: (key: string) => `${key}-translated`,
      load: jest.fn(async (_lang: string) => {}),
    };

    // Arrange (common): theme mock como signal-like function
    themeState = 'dark';
    themeServiceMock = {
      theme: () => themeState,
      toggle: jest.fn(() => {
        themeState = themeState === 'light' ? 'dark' : 'light';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: rootRoute },
        { provide: TranslationService, useValue: i18nMock },
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

  fixture = TestBed.createComponent(AppHeaderComponent);
  });

  it('deve exibir o título traduzido da rota ativa', async () => {
    // Arrange
    fixture.detectChanges();

    // Act: emite NavigationEnd para disparar cálculo do titleKey
    routerEvents$.next(new NavigationEnd(1, '/products', '/products'));
    fixture.detectChanges();

    // Assert: verifica que o título traduzido apareceu
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
  const title = el.querySelector('.navbar-start span');
  expect(title?.textContent?.trim()).toBe('productsPageTitle-translated');
  });

  it('deve chamar i18n.load ao alternar idioma', async () => {
    // Arrange
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const btnEn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'EN') as HTMLButtonElement;
    const btnPt = Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'PT') as HTMLButtonElement;

    // Act
    btnEn.click();
    await Promise.resolve();
    // Assert
    expect(i18nMock.load).toHaveBeenCalledWith('en');

    // Act 2: volta para PT
    btnPt.click();
    await Promise.resolve();
    // Assert 2
    expect(i18nMock.load).toHaveBeenCalledWith('pt');
  });
});
