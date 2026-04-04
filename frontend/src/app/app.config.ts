import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import { MessageService } from "primeng/api";
import Aura from "@primeuix/themes/aura";

import { routes } from "./app.routes";
import { accessTokenInterceptor } from "./interceptors/access-token.interceptor";
import { unauthorizedInterceptor } from "./interceptors/unauthorized.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([accessTokenInterceptor, unauthorizedInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark'
        }
      },
    }),
    MessageService,
  ],
};
