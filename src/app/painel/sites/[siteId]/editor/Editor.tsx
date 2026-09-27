"use client";

import { useRef, useState, useTransition } from "react";
import type { BioSite, Page, SiteBlock, SiteTheme } from "@prisma/client";
import { BLOCK_META, BLOCK_TYPES, type BlockType } from "@/lib/blocks";
import { BLOCK_FIELDS, type FieldDef } from "@/lib/block-fields";
import BlockView from "@/components/blocks/BlockView";
import {
  addBlockAction,
  addPageAction,
  deleteBlockAction,
  deletePageAction,
  publishSiteAction,
  renamePageAction,
  reorderBlocksAction,
  toggleBlockVisibleAction,
  updateBlockPropsAction,
} from "./actions";
import SiteSettings from "./SiteSettings";

type PageWithBlocks = Page & { blocks: SiteBlock[] };
type SiteWithPages = BioSite & { pages: PageWithBlocks[]; theme: SiteTheme | null };
type MobileTab = "blocks" | "preview" | "settings";

export default function Editor({ site, maxPages }: { site: SiteWithPages; maxPages: number }) {
  const [pages, setPages] = useState<PageWithBlocks[]>(site.pages);
  const [activePageId, setActivePageId] = useState(site.pages[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(site.pages[0]?.blocks[0]?.id ?? null);
  const [tab, setTab] = useState<MobileTab>("preview");
  const [published, setPublished] = useState(site.published);
  const [, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const blocks = activePage?.blocks ?? [];
  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function updateActivePageBlocks(updater: (blocks: SiteBlock[]) => SiteBlock[]) {
    setPages((prev) => prev.map((p) => (p.id === activePageId ? { ...p, blocks: updater(p.blocks) } : p)));
  }

  function selectAndShowSettings(id: string) {
    setSelectedId(id);
    setTab("settings");
  }

  function handleSelectPage(pageId: string) {
    setActivePageId(pageId);
    setSelectedId(null);
  }

  function handleAddPage() {
    const title = window.prompt("Nome da nova página", "Nova página");
    if (!title) return;
    startTransition(async () => {
      try {
        const created = await addPageAction(site.id, title);
        setPages((prev) => [...prev, { ...created, blocks: [] }]);
        setActivePageId(created.id);
      } catch (e: any) {
        alert(e.message ?? "Não foi possível criar a página");
      }
    });
  }

  function handleRenamePage(pageId: string) {
    const current = pages.find((p) => p.id === pageId);
    const title = window.prompt("Novo nome da página", current?.title);
    if (!title) return;
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, title } : p)));
    startTransition(() => renamePageAction(site.id, pageId, title));
  }

  function handleDeletePage(pageId: string) {
    if (pages.length <= 1) return;
    if (!window.confirm("Excluir esta página e todos os blocos dela?")) return;
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    if (activePageId === pageId) setActivePageId(pages.find((p) => p.id !== pageId)?.id ?? "");
    startTransition(() => deletePageAction(site.id, pageId));
  }

  function handleAdd(type: BlockType) {
    startTransition(async () => {
      const created = await addBlockAction(site.id, activePageId, type);
      updateActivePageBlocks((prev) => [...prev, created]);
      selectAndShowSettings(created.id);
    });
  }

  function handlePropsChange(blockId: string, props: Record<string, any>) {
    updateActivePageBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, props } : b)));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      startTransition(() => updateBlockPropsAction(site.id, blockId, props));
    }, 400);
  }

  function handleToggleVisible(block: SiteBlock) {
    const visible = !block.visible;
    updateActivePageBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, visible } : b)));
    startTransition(() => toggleBlockVisibleAction(site.id, block.id, visible));
  }

  function handleDelete(blockId: string) {
    updateActivePageBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedId === blockId) setSelectedId(null);
    startTransition(() => deleteBlockAction(site.id, blockId));
  }

  function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    updateActivePageBlocks(() => next);
    startTransition(() => reorderBlocksAction(site.id, next.map((b) => b.id)));
  }

  function handlePublishToggle() {
    const next = !published;
    setPublished(next);
    startTransition(() => publishSiteAction(site.id, next));
  }

  return (
    <div className="flex h-[calc(100dvh-56px)] flex-col lg:h-dvh">
      <header className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 lg:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{site.title}</p>
          <p className="truncate text-xs text-slate-400">linkbio.manifesti.com.br/{site.slug}</p>
        </div>
        <span className={`hidden rounded-full px-2 py-1 text-xs font-medium sm:inline ${published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {published ? "Publicado" : "Rascunho"}
        </span>
        <SiteSettings
          siteId={site.id}
          title={site.title}
          seoTitle={site.seoTitle ?? ""}
          seoDesc={site.seoDesc ?? ""}
          primary={(site.theme?.tokens as any)?.primary ?? "#5b6cff"}
        />
        <button
          type="button"
          onClick={handlePublishToggle}
          className="touch-target rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          {published ? "Despublicar" : "Publicar"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className={`w-full flex-shrink-0 overflow-y-auto border-r border-slate-100 bg-white p-3 lg:block lg:w-72 ${tab === "blocks" ? "block" : "hidden"}`}>
          <PagesPanel
            pages={pages}
            activePageId={activePageId}
            maxPages={maxPages}
            onSelect={handleSelectPage}
            onAdd={handleAddPage}
            onRename={handleRenamePage}
            onDelete={handleDeletePage}
          />
          <BlocksPanel blocks={blocks} selectedId={selectedId} onAdd={handleAdd} onSelect={selectAndShowSettings} onToggle={handleToggleVisible} onDelete={handleDelete} onMove={handleMove} />
        </section>

        <section className={`flex-1 overflow-y-auto bg-slate-100 p-4 lg:block ${tab === "preview" ? "block" : "hidden"}`}>
          {pages.length > 1 && (
            <div className="mx-auto mb-3 flex max-w-sm flex-wrap justify-center gap-1.5">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPage(p.id)}
                  className={`touch-target rounded-full px-3 py-1.5 text-xs font-medium ${p.id === activePageId ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}
          <div className="mx-auto flex max-w-sm flex-col gap-3 rounded-[2rem] border-8 border-slate-900 bg-white p-3 shadow-xl">
            {blocks.filter((b) => b.visible).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => selectAndShowSettings(b.id)}
                className={`rounded-xl text-left ring-offset-2 transition ${selectedId === b.id ? "ring-2 ring-violet-500" : ""}`}
              >
                <BlockView type={b.type as BlockType} props={b.props as Record<string, any>} />
              </button>
            ))}
            {blocks.length === 0 && <p className="p-6 text-center text-sm text-slate-400">Adicione blocos para montar essa página.</p>}
          </div>
        </section>

        <section className={`w-full flex-shrink-0 overflow-y-auto border-l border-slate-100 bg-white p-4 lg:block lg:w-80 ${tab === "settings" ? "block" : "hidden"}`}>
          {selected ? (
            <Inspector key={selected.id} block={selected} onChange={(props) => handlePropsChange(selected.id, props)} />
          ) : (
            <p className="text-sm text-slate-400">Selecione um bloco para editar.</p>
          )}
        </section>
      </div>

      <nav className="safe-bottom grid grid-cols-3 border-t border-slate-200 bg-white lg:hidden">
        {(["blocks", "preview", "settings"] as MobileTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`touch-target py-3 text-xs font-semibold ${tab === t ? "text-violet-700" : "text-slate-400"}`}
          >
            {t === "blocks" ? "Blocos" : t === "preview" ? "Prévia" : "Ajustes"}
          </button>
        ))}
      </nav>
    </div>
  );
}

function PagesPanel({
  pages,
  activePageId,
  maxPages,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: {
  pages: PageWithBlocks[];
  activePageId: string;
  maxPages: number;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold uppercase text-slate-400">
        Páginas do site ({pages.length}/{maxPages})
      </h3>
      <div className="mt-2 flex flex-col gap-1.5">
        {pages.map((p) => (
          <div key={p.id} className={`flex items-center gap-1 rounded-xl border px-2 py-1.5 ${p.id === activePageId ? "border-violet-300 bg-violet-50" : "border-slate-100"}`}>
            <button type="button" onClick={() => onSelect(p.id)} className="flex-1 truncate text-left text-sm font-medium">
              {p.title}
            </button>
            <button type="button" onClick={() => onRename(p.id)} className="touch-target text-xs text-slate-400" title="Renomear">✎</button>
            {pages.length > 1 && (
              <button type="button" onClick={() => onDelete(p.id)} className="touch-target text-xs text-red-400" title="Excluir página">🗑</button>
            )}
          </div>
        ))}
      </div>
      {pages.length < maxPages && (
        <button type="button" onClick={onAdd} className="touch-target mt-2 w-full rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500">
          + Nova página
        </button>
      )}
    </div>
  );
}

function BlocksPanel({
  blocks,
  selectedId,
  onAdd,
  onSelect,
  onToggle,
  onDelete,
  onMove,
}: {
  blocks: SiteBlock[];
  selectedId: string | null;
  onAdd: (type: BlockType) => void;
  onSelect: (id: string) => void;
  onToggle: (block: SiteBlock) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-slate-400">Adicionar bloco</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {BLOCK_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onAdd(type)}
            className="touch-target rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            + {BLOCK_META[type].label}
          </button>
        ))}
      </div>

      <h3 className="mt-5 text-xs font-semibold uppercase text-slate-400">Estrutura da página</h3>
      <ul className="mt-2 flex flex-col gap-1.5">
        {blocks.map((b, i) => (
          <li
            key={b.id}
            className={`flex items-center gap-1 rounded-xl border px-2 py-2 ${selectedId === b.id ? "border-violet-300 bg-violet-50" : "border-slate-100"}`}
          >
            <div className="flex flex-col">
              <button type="button" onClick={() => onMove(i, -1)} className="touch-target h-5 text-slate-400" aria-label="Mover para cima">▲</button>
              <button type="button" onClick={() => onMove(i, 1)} className="touch-target h-5 text-slate-400" aria-label="Mover para baixo">▼</button>
            </div>
            <button type="button" onClick={() => onSelect(b.id)} className="flex-1 truncate text-left text-sm font-medium">
              {BLOCK_META[b.type as BlockType]?.label ?? b.type}
            </button>
            <button type="button" onClick={() => onToggle(b)} className="touch-target text-xs text-slate-400" title="Mostrar/ocultar">
              {b.visible ? "👁" : "🚫"}
            </button>
            <button type="button" onClick={() => onDelete(b.id)} className="touch-target text-xs text-red-400" title="Excluir">
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Inspector({ block, onChange }: { block: SiteBlock; onChange: (props: Record<string, any>) => void }) {
  const fields = BLOCK_FIELDS[block.type as BlockType] ?? [];
  const props = (block.props as Record<string, any>) ?? {};

  function setField(key: string, value: any) {
    onChange({ ...props, [key]: value });
  }

  if (fields.length === 0) {
    return <p className="text-sm text-slate-400">Este bloco não tem ajustes.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">{BLOCK_META[block.type as BlockType]?.label}</h3>
      {fields.map((field) => (
        <FieldInput key={field.key} field={field} value={props[field.key]} onChange={(v) => setField(field.key, v)} />
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  if (field.kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />
        {field.label}
      </label>
    );
  }

  if (field.kind === "select") {
    return (
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        {field.label}
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === "textarea") {
    return (
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        {field.label}
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
    );
  }

  if (field.kind === "list") {
    const items: any[] = value ?? [];
    return (
      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">{field.label}</p>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={item.id ?? i} className="rounded-xl border border-slate-200 p-2.5">
              <div className="flex flex-col gap-2">
                {field.itemFields.map((sub) => (
                  <FieldInput
                    key={sub.key}
                    field={sub}
                    value={item[sub.key]}
                    onChange={(v) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="touch-target mt-2 text-xs font-medium text-red-500"
              >
                Remover {field.itemLabel.toLowerCase()}
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, { id: `${Date.now()}` }])}
          className="touch-target mt-2 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500"
        >
          + Adicionar {field.itemLabel.toLowerCase()}
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
      {field.label}
      <input
        type={field.kind === "url" ? "url" : field.kind === "tel" ? "tel" : field.kind === "number" ? "number" : field.kind === "color" ? "color" : field.kind === "date" ? "date" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.kind === "number" ? Number(e.target.value) : e.target.value)}
        className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm"
      />
    </label>
  );
}
