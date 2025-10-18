import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type Dictionary = Record<string, string>;
const LANG_STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);

  // Language code atual, padrão em 'pt'. Persiste em localstore para manter entre reloads
  private readonly langSignal = signal<string>(this.readPersistedLang() ?? 'pt');
  readonly lang: Signal<string> = this.langSignal.asReadonly();

  // Cache das traduções carregadas
  private readonly cache = new Map<string, Dictionary>();

  // Indica se o dicionário do idioma atual já está carregado
  readonly ready = computed(() => this.cache.has(this.lang()));

  private readPersistedLang(): string | null {
    return localStorage.getItem(LANG_STORAGE_KEY);
  }

  private persistLang(lang: string): void {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }

  async load(lang: string): Promise<void> {
    if (this.cache.has(lang)) {
      this.setLang(lang);
      return;
    }
    const dict = await firstValueFrom(this.http.get<Dictionary>(`/i18n/${lang}.json`));
    this.cache.set(lang, dict ?? {});
    this.setLang(lang);
  }

  setLang(lang: string): void {
    if (this.langSignal() !== lang) {
      this.langSignal.set(lang);
      this.persistLang(lang);
    }
  }

  // Busca direta por chave. Retorna a própria chave quando ausente.
  translate(key: string, params?: Record<string, string | number>): string {
    const dict = this.cache.get(this.langSignal()) ?? {};
    const value = dict[key];

    if (!value) {
      return key;
    }

    return params ? this.interpolate(value, params) : value;
  }

  private interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, k) => `${params[k] ?? ''}`);
  }
}
