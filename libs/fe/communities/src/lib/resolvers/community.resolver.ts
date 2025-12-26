import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { map, of } from 'rxjs';
import { CommunitiesApi } from '../services/communities.api';
import { Community } from '@nx-angular-express/shared';

export const communityResolver: ResolveFn<Community | null> = (route: ActivatedRouteSnapshot) => {
  const api = inject(CommunitiesApi);
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }
  return api.get(id).pipe(
    map((res) => res.data ?? null)
  );
};

