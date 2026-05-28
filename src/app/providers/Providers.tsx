"use client";

import { useState, Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import Layout from "../layouts/Layout";
import { Toaster } from "../shadcn/components/ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          {isAdmin ? children : <Layout>{children}</Layout>}
        </Suspense>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
