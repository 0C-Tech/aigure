import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../pages/user/user.service';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUserInfo().pipe(
    map((user) => {
      const isLoggedIn = !!user.email;
      if (!isLoggedIn) {
        // Redirect to the login page
        return router.parseUrl('/user/login');
      }
      return true;
    })
  );

};
