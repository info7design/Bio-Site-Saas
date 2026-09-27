"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingLabel }: { children: React.ReactNode; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="touch-target mt-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
