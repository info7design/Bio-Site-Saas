"use client";

import { useState, useTransition } from "react";
import type { BioSite, Page, SiteBlock } from "@prisma/client";
import { BLOCK_META, BLOCK_TYPES, type BlockType } from "@/lib/blocks";
import { BLOCK_FIELDS, type FieldDef } from "@/lib/block-fields";
import BlockView from "@/components/blocks/BlockView";
import {
  addBlockAction,
  addPageAction,
  deleteBlockAction,
  deletePageAction,
  reorderBlocksAction,
  toggleBlockVisibleAction,
  updateBlockPropsAction,
} from "./actions";

type PageWithBlocks = Page & { blocks: SiteBlock[] };
type SiteWithPages = BioSite & { pages: PageWithBlocks[] };
type MobileTab = "blocks" | "stage" | "inspector";

export default function Editor({ site, maxPages }: { site: SiteWithPages; maxPages: number }) {
  const [pages, setPages] = useState<PageWithBlocks[]>(site.pages);
  const [activePageId, setActivePageId] = useState(site.pages[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(site.pages[0]?.blocks[0]?.id ?? null);
  const [tab, setTab] = useState<MobileTab>("stage");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [, startTransition] = useTransition();

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const blocks = activePage?.blocks ?? [];
  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function updateActivePageBlocks(updater: (blocks: SiteBlock[]) => SiteBlock[]) {
    setPages((prev) => prev.map((p) => (p.id === activePageId ? { ...p, blocks: updater(p.blocks) } : p)));
  }

  function selectAndShowInspector(id: string) {
    setSelectedId(id);
    setTab("inspector");
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
      selectAndShowInspector(created.id);
    });
    setTab("stage");
  }

  function handlePropsChange(blockId: string, props: Record<string, any>) {
    updateActivePageBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, props } : b)));
    startTransition(() => updateBlockPropsAction(site.id, blockId, props));
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

  return (
    <div className="editor" data-tab={tab}>
      <section className="panel l">
        <button type="button" className="btn sm mob-only" onClick={() => setTab("stage")}>
          ← Voltar à prévia
        </button>

        <h3>
          Páginas do site <span>({pages.length}/{maxPages})</span>
        </h3>
        <div className="pages">
          {pages.map((p) => (
            <div key={p.id} className="pg" aria-current={p.id === activePageId}>
              <button type="button" className="nm" onClick={() => handleSelectPage(p.id)}>
                {p.title}
              </button>
              {pages.length > 1 && (
                <button type="button" className="btn ib sm" onClick={() => handleDeletePage(p.id)} aria-label="Excluir página">
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {pages.length < maxPages && (
          <button type="button" className="btn sm" onClick={handleAddPage}>
            + Nova página
          </button>
        )}

        <h3>Adicionar bloco</h3>
        <div className="chips">
          {BLOCK_TYPES.map((type) => (
            <button key={type} type="button" onClick={() => handleAdd(type)}>
              + {BLOCK_META[type].label}
            </button>
          ))}
        </div>

        <h3>Estrutura da página</h3>
        <ul className="layers">
          {blocks.map((b, i) => (
            <li key={b.id} className={`layer ${!b.visible ? "off" : ""}`} aria-selected={selectedId === b.id}>
              <button type="button" className="ic" onClick={() => handleMove(i, -1)} aria-label="Mover para cima">
                ↑
              </button>
              <button type="button" className="ic" onClick={() => handleMove(i, 1)} aria-label="Mover para baixo">
                ↓
              </button>
              <button type="button" className="nm" onClick={() => selectAndShowInspector(b.id)}>
                {BLOCK_META[b.type as BlockType]?.label ?? b.type}
              </button>
              <button type="button" className="ic" onClick={() => handleToggleVisible(b)} title="Mostrar/ocultar">
                {b.visible ? "👁" : "🚫"}
              </button>
              <button type="button" className="ic" onClick={() => handleDelete(b.id)} title="Excluir">
                🗑
              </button>
            </li>
          ))}
        </ul>
        <p className="note">Use as setas para reordenar.</p>
      </section>

      <section className="stage">
        <div className="bar2">
          <div className="seg devseg">
            <button type="button" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>
              Celular
            </button>
            <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>
              Computador
            </button>
          </div>
        </div>
        <div className={`device ${device === "desktop" ? "desktop" : ""}`}>
          <div className="bio">
            <div className="page">
              {blocks.filter((b) => b.visible).map((b) => (
                <div
                  key={b.id}
                  className={`blk mode-edit ${selectedId === b.id ? "sel" : ""}`}
                  onClick={() => selectAndShowInspector(b.id)}
                >
                  <BlockView type={b.type as BlockType} props={b.props as Record<string, any>} />
                </div>
              ))}
              {blocks.length === 0 && <p className="note" style={{ padding: 24, textAlign: "center" }}>Adicione blocos para montar essa página.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="panel r" id="inspector">
        {selected ? (
          <Inspector key={selected.id} block={selected} onChange={(props) => handlePropsChange(selected.id, props)} />
        ) : (
          <p className="note">Selecione um bloco para editar.</p>
        )}
      </section>

      <nav className="etabs" aria-label="Seções do editor">
        {(["blocks", "stage", "inspector"] as MobileTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t}>
            {t === "blocks" ? "Blocos" : t === "stage" ? "Prévia" : "Ajustes"}
          </button>
        ))}
      </nav>
      {selected && tab !== "inspector" && (
        <button type="button" className="editfab" onClick={() => setTab("inspector")}>
          Editar bloco ›
        </button>
      )}
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
    return <p className="note">Este bloco não tem ajustes.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3>{BLOCK_META[block.type as BlockType]?.label}</h3>
      {fields.map((field) => (
        <FieldInput key={field.key} field={field} value={props[field.key]} onChange={(v) => setField(field.key, v)} />
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  if (field.kind === "checkbox") {
    return (
      <label className="fld row">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} style={{ width: "auto" }} />
        <span className="lb">{field.label}</span>
      </label>
    );
  }

  if (field.kind === "select") {
    return (
      <label className="fld">
        <label>{field.label}</label>
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === "textarea") {
    return (
      <label className="fld">
        <label>{field.label}</label>
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} />
      </label>
    );
  }

  if (field.kind === "list") {
    const items: any[] = value ?? [];
    return (
      <div className="fld">
        <label>{field.label}</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, i) => (
            <details key={item.id ?? i} className="item" open>
              <summary>
                <span className="tt">{item.title || item.name || `${field.itemLabel} ${i + 1}`}</span>
              </summary>
              <div>
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
                <div className="acts">
                  <button type="button" className="btn sm" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
                    Remover
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
        <button type="button" className="btn sm" style={{ marginTop: 8 }} onClick={() => onChange([...items, { id: `${Date.now()}` }])}>
          + Adicionar {field.itemLabel.toLowerCase()}
        </button>
      </div>
    );
  }

  return (
    <label className="fld">
      <label>{field.label}</label>
      <input
        type={field.kind === "url" ? "url" : field.kind === "tel" ? "tel" : field.kind === "number" ? "number" : field.kind === "color" ? "color" : field.kind === "date" ? "date" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.kind === "number" ? Number(e.target.value) : e.target.value)}
      />
    </label>
  );
}
