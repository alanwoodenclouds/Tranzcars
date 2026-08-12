"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AiAssistantUiProvider } from "@/components/ai/ai-assistant-ui";
import { ToastHost } from "@/components/ui/toast-host";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <AiAssistantUiProvider>
        {children}
        <ToastHost />
      </AiAssistantUiProvider>
    </QueryClientProvider>
  );
}
