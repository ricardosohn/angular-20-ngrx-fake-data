import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document: Document = inject(DOCUMENT);

  readonly theme = signal<'light' | 'dark'>('dark');

  constructor() {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? null;
    if (saved) {
      this.theme.set(saved);
    }

    effect(() => {
      const theme = this.theme();
      try {
        localStorage.setItem('theme', theme);
      } catch {}
      this.document.documentElement.setAttribute('data-theme', theme);
    });
  }

  toggle(): void {
    this.theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}
