// import "@/mocks";

import { registerSW } from "virtual:pwa-register";
import { initServiceWorkerRegistration } from "@base/push/serviceWorker";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@app/styles/index.css";
import { App } from "@app/App";
import { initSentry } from "@app/config/sentry";

initSentry();

initServiceWorkerRegistration(registerSW);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
