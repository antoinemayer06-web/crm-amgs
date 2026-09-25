"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

// Envoie un événement page_view au CRM à chaque changement de route —
// composant client isolé pour que app/layout.tsx reste un Server
// Component.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", pathname);
  }, [pathname]);

  return null;
}
