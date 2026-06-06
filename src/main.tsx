// import "@/mocks";

import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@app/styles/index.css";
import { App } from "@app/App";
import { initSentry } from "@app/config/sentry";

initSentry();

if ("serviceWorker" in navigator) {
  registerSW({ immediate: true });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
