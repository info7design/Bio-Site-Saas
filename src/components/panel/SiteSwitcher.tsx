"use client";

import { useRouter } from "next/navigation";

export default function SiteSwitcher({ sites, activeSiteId }: { sites: { id: string; title: string }[]; activeSiteId: string }) {
  const router = useRouter();

  return (
    <label className="orgsw">
      <span>Site ativo</span>
      <select
        value={activeSiteId}
        onChange={(e) => router.push(`/painel/sites/${e.target.value}/painel`)}
        aria-label="Site ativo"
      >
        {sites.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
    </label>
  );
}
