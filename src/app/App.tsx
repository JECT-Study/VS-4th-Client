import { setupApiInterceptors } from "@app/config/apiInterceptors";
import { queryClient } from "@app/config/queryClient";
import { router } from "@app/config/router";
import { PushNotificationBridge } from "@base/ui/PushNotificationBridge";
import { Toast } from "@base/ui/Toast";
import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";

setupApiInterceptors();

export function App() {
  return (
    <Sentry.ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider
            router={router}
            InnerWrap={({ children }) => (
              <>
                <PushNotificationBridge />
                {children}
              </>
            )}
          />
          <Toast />
        </QueryClientProvider>
      </HelmetProvider>
    </Sentry.ErrorBoundary>
  );
}
