"use client";

import { useTransition } from "react";
import { applyTemplateAction } from "./actions";

export default function ApplyTemplateButton({ siteId, templateId }: { siteId: string; templateId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn sm primary"
      disabled={pending}
      onClick={() => startTransition(() => applyTemplateAction(siteId, templateId))}
    >
      {pending ? "Aplicando..." : "Usar este template"}
    </button>
  );
}
