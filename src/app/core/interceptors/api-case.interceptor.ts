import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

const toCamelCase = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(item => toCamelCase(item));
  }

  if (value === null || typeof value !== 'object' || value instanceof Date) {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (result, [key, item]) => {
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[camelKey] = toCamelCase(item);
      return result;
    },
    {} as Record<string, unknown>
  );
};

export const apiCaseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse && event.body) {
        return event.clone({ body: toCamelCase(event.body) });
      }

      return event;
    })
  );
};
