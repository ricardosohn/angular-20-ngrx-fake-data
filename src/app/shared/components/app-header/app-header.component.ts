import { Component, Signal, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <header class="navbar sticky top-0 z-10">
      <div class="navbar-start">
        <span class="font-semibold">{{ titleKey() | translate }}</span>
      </div>
      <div class="navbar-end">
        <div class="btn-group btn-group-rounded btn-group-scrollable mr-2">
          <button class="btn btn-sm" [class.btn-primary]="i18n.lang() === 'pt'" (click)="setLang('pt')">PT</button>
          <button class="btn btn-sm" [class.btn-primary]="i18n.lang() === 'en'" (click)="setLang('en')">EN</button>
        </div>
        <button
          class="btn btn-outline btn-square"
          (click)="themeService.toggle()"
          [attr.title]="themeButtonTitle"
        >
          @if (themeService.theme() === 'light') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5" aria-hidden="true">
              <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1.5a1 1 0 1 1 2 0V21a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V1.5a1 1 0 1 1 2 0V3a1 1 0 0 1-1 1Zm9 9a1 1 0 0 1-1 1h-1.5a1 1 0 1 1 0-2H20a1 1 0 0 1 1 1ZM6.5 12a1 1 0 0 1-1 1H4a1 1 0 0 1 0-2h1.5a1 1 0 0 1 1 1Zm11.66 6.66a1 1 0 0 1-1.41 0l-1.06-1.06a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41ZM8.31 6.81a1 1 0 0 1-1.41 0L5.84 5.75A1 1 0 1 1 7.25 4.34l1.06 1.06a1 1 0 0 1 0 1.41Zm9.9-2.47a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM6.81 17.19a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Z"/>
            </svg>
          }
        </button>
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(TranslationService);

  // Deriva a chave de título a partir da rota ativa (data.titleKey) com fallbacks
  readonly titleKey: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let route = this.route.firstChild;
        while (route?.firstChild) route = route.firstChild;
        const key = route?.snapshot.data?.['titleKey'] as string | undefined;
        return key;
      }),
      map((key) => key ?? 'pageTitleFallback')
    ),
    { initialValue: 'loading' }
  );

  async setLang(lang: 'pt' | 'en'): Promise<void> {
    await this.i18n.load(lang);
  }

  get themeButtonTitle(): string {
    return this.themeService.theme() === 'light'
      ? this.i18n.translate('tooltipToggleDarkMode')
      : this.i18n.translate('tooltipToggleLightMode');
  }
}
