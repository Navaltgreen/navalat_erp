import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { queryClient } from "./config/query/queryClient";
import { useAuthStore } from "./store/auth/store";
import AppThemeProvider from "./theme/AppThemeProvider";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

function renderApp() {
  createRoot(rootElement as HTMLElement).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <App />
          </AppThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

function bootstrap() {
  useAuthStore.getState().setAuthReady(true);
  renderApp();
}

bootstrap();
