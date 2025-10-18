import { Component, Signal, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly i18n = inject(TranslationService);

  // Deriva a chave de título a partir da rota ativa (data.titleKey) com fallbacks
  readonly titleKey: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
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

  get themeButtonText(): string {
    return this.themeService.theme() === 'light'
      ? this.i18n.translate('tooltipToggleDarkMode')
      : this.i18n.translate('tooltipToggleLightMode');
  }
}
