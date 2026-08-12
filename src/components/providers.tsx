"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AiAssistantUiProvider } from "@/components/ai/ai-assistant-ui";
import { ToastHost } from "@/components/ui/toast-host";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useBookingsStore } from "@/store/useBookingsStore";

/** Ensure zustand persist stores finish rehydrating on the client. */
function StoreHydration() {
  useEffect(() => {
    const finish = () => {
      useBookingStore.getState().setHasHydrated(true);
    };

    const unsub = useBookingStore.persist.onFinishHydration(finish);
    if (useBookingStore.persist.hasHydrated()) finish();

    void useBookingStore.persist.rehydrate();
    void useAuthStore.persist.rehydrate();
    void useBookingsStore.persist.rehydrate();

    return unsub;
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <StoreHydration />
      <AiAssistantUiProvider>
        {children}
        <ToastHost />
      </AiAssistantUiProvider>
    </QueryClientProvider>
  );
}
