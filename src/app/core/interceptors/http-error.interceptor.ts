import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';
import { TranslationService } from '../services/translation.service';
import { catchError, throwError } from 'rxjs';

function mapStatusToKey(status?: number): string {
  switch (status) {
    case 0: return 'networkError';
    case 400: return 'error400';
    case 401: return 'error401';
    case 403: return 'error403';
    case 404: return 'error404';
    case 409: return 'error409';
    case 413: return 'error413';
    case 422: return 'error422';
    case 500: return 'error500';
    case 502: return 'error502';
    case 503: return 'error503';
    default: return 'genericError';
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const i18n = inject(TranslationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const key = mapStatusToKey(err.status);
      const message = i18n.translate(key);
      toast.error(message);
      return throwError(() => err);
    })
  );
};
