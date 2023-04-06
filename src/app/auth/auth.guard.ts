import { inject } from "@angular/core";

import { AuthService } from "./auth.service";

export const authGuard = () => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn) {
    return true;
  }

  return '/login';
};
