"use client";

import { useEffect } from "react";
import { trackEventAction } from "@/app/[slug]/actions";

export default function ViewTracker({ siteId }: { siteId: string }) {
  useEffect(() => {
    trackEventAction(siteId, "view");
  }, [siteId]);
  return null;
}
