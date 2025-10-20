# Fake Store — Angular 20 + NgRx (CRUD)

Aplicação web que demonstra um CRUD completo de produtos consumindo a Fake Store API.
O foco é qualidade de implementação: arquitetura, estado assíncrono, formulários reativos, i18n, UX (toasts/loading) e testes unitários.

## Stack e decisões

- Angular 20 (foco principal em componentes standalone e signals), TypeScript 5.9
- NgRx 20 (Store, Effects, Entity) — estado por feature, fornecido na rota de forma lazy
- Jest — testes unitários AAA
- RippleUI — Framework de UI baseado no TailwindCSS. UI simples para modais e layout
- Runtime i18n (service + pipe) com dicionários `public/i18n/{pt,en}.json`
- Http Interceptor para tratamento de erros com toasts

## Arquitetura (visão geral)

- src/app
  - core: interceptors, services compartilhados (tema, tradução)
  - shared: componentes reutilizáveis (header, sidebar, toaster, overlay, confirm)
  - features/products: páginas, componentes, store (actions/reducer/effects/selectors), services

Padrões adotados:
- Standalone Components + provideState/provideEffects por rota
- Facade (`ProductVM`) expondo sinais de estado e ações
- EntityAdapter para coleção de produtos
- Formulários reativos com validação e input de imagem (data URL)

## Fluxos do CRUD

- Listagem: tabela com busca local (signal + computed)
- Criação: modal com `ProductForm` (validações), máscara monetária (ngx-mask)
- Edição: reuso do mesmo `ProductForm` com `initial` e emissão de changes parciais
- Exclusão: diálogo de confirmação + toast de sucesso/erro

## Integração com a Fake Store API

- Base: https://fakestoreapi.com/
- Serviço: `ProductApiService` (GET/POST/PUT/DELETE)
- Efeitos: disparam chamadas e resultam em ações de sucesso/erro
- Interceptor: mapeia status HTTP para mensagens internacionalizadas (ex.: 404 → error404)

## i18n em runtime

- `TranslationService` carrega JSONs em `public/i18n` via HttpClient e expõe `translate()`
- `TranslatePipe` (impuro) reexecuta quando a linguagem muda
- Chaves usadas em templates (ex.: `'newProduct' | translate`)

## UX: Loading e Toasts

- LoadingOverlay: componente desacoplado via `[loading]` booleano
- ToastService + Toaster: sucesso/erro/warning/info com timeout; erro tem padrão 5s

## Testes unitários

- Runner: Jest (sem Karma)
- Padrão: Arrange → Act → Assert, com comentários nos specs
- Cobertura:
  - Interceptor de erros (mapeamentos de status)
  - Products Page (init, editar/criar, remover, busca)
  - Product Form/Modal (envio, reset, update)
  - Shared (ConfirmDialog, LoadingOverlay, Toaster, NotFound, AppSidebar)
  - Serviços (ToastService)

Como rodar
- Instalar deps: pnpm i (ou npm i)
- Servir: npm start → http://localhost:4200
- Testes: npm test (ou npm run test:watch / test:coverage)

## Como rodar localmente

1) Instale dependências
	- pnpm i
2) Rode a aplicação
	- pnpm start
3) Testes
	- pnpm test

Obs.: Projeto usa Jest; não há Karma/Protractor.

## Boas práticas aplicadas

- Angular moderno (standalone, Signals, provideState/Efeitos por rota)
- NgRx com Entity e facade simplificando o binding em componentes
- Seletores protegidos para evitar acesso a feature state antes do registro de rota
- Componentes compartilháveis e desacoplados (Overlay, Confirm, Toaster)
- Interceptor genérico para erros HTTP + i18n
- Testes AAA com dublês de dependências, sem zona

## Considerações e trade-offs

- Busca local (client-side) por simplicidade; poderia ser delegada à API/servidor
- Overlay local na página de produtos; alternativa: slice de UI global (NgRx) para busy global
- Upload de imagem via Data URL para simplificar a demo; em produção, recomendável storage externo

## Mapeamento aos critérios do desafio

- Estrutura e organização: pastas por domínios (core/shared/features), componentes standalone, NgRx por feature
- Angular moderno e boas práticas: Signals, provideState/Efeitos, interceptors, forms reativos
- Reuso e manutenibilidade: componentes compartilhados e VM (facade), EntityAdapter, serviços
- Estado assíncrono + API: NgRx Effects + ProductApiService + interceptors (erros)
- Formulários reativos + validações + erros: ProductForm com validações e dinâmica de imagem
- Testes unitários: Jest, AAA, ampla cobertura em features e shared

## Scripts úteis

- Desenvolver: `pnpm start`
- Testes: `pnpm test` | `pnpm run test:watch` | `pnpm run test:coverage`
- Build: `pnpm run build`

