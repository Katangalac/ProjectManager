import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <App />
        </StrictMode>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </PrimeReactProvider>
  </TooltipProvider>
);
