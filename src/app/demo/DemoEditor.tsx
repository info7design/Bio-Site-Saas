"use client";

import { useState } from "react";
import { BLOCK_META, BLOCK_TYPES, newBlock, type BlockType } from "@/lib/blocks";
import { BLOCK_FIELDS, type FieldDef } from "@/lib/block-fields";
import BlockView from "@/components/blocks/BlockView";
import type { DemoBlock } from "./mock-data";

type MobileTab = "blocks" | "preview" | "settings";

export default function DemoEditor({ initialBlocks }: { initialBlocks: DemoBlock[] }) {
  const [blocks, setBlocks] = useState<DemoBlock[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(initialBlocks[0]?.id ?? null);
  const [tab, setTab] = useState<MobileTab>("preview");
  const [published, setPublished] = useState(true);

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function select(id: string) {
    setSelectedId(id);
    setTab("settings");
  }

  function handleAdd(type: BlockType) {
    const b = newBlock(type);
    const demo: DemoBlock = { id: b.id, type, visible: true, props: b.props };
    setBlocks((prev) => [...prev, demo]);
    select(demo.id);
  }

  function handleProps(id: string, props: Record<string, any>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, props } : b)));
  }

  function handleToggle(id: string) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  }

  function handleDelete(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-2 border-b border-slate-200 bg-white py-2 pl-12 pr-3 lg:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Salão da Ana (demonstração)</p>
          <p className="truncate text-xs text-slate-400">linkbio.manifesti.com.br/salao-da-ana</p>
        </div>
        <span className={`hidden rounded-full px-2 py-1 text-xs font-medium sm:inline ${published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {published ? "Publicado" : "Rascunho"}
        </span>
        <button
          type="button"
          onClick={() => setPublished((p) => !p)}
          className="touch-target rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          {published ? "Despublicar" : "Publicar"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className={`w-full flex-shrink-0 overflow-y-auto border-r border-slate-100 bg-white p-3 lg:block lg:w-72 ${tab === "blocks" ? "block" : "hidden"}`}>
          <h3 className="text-xs font-semibold uppercase text-slate-400">Adicionar bloco</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAdd(type)}
                className="touch-target rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                + {BLOCK_META[type].label}
              </button>
            ))}
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase text-slate-400">Estrutura da página</h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {blocks.map((b, i) => (
              <li key={b.id} className={`flex items-center gap-1 rounded-xl border px-2 py-2 ${selectedId === b.id ? "border-violet-300 bg-violet-50" : "border-slate-100"}`}>
                <div className="flex flex-col">
                  <button type="button" onClick={() => handleMove(i, -1)} className="touch-target h-5 text-slate-400" aria-label="Mover para cima">▲</button>
                  <button type="button" onClick={() => handleMove(i, 1)} className="touch-target h-5 text-slate-400" aria-label="Mover para baixo">▼</button>
                </div>
                <button type="button" onClick={() => select(b.id)} className="flex-1 truncate text-left text-sm font-medium">
                  {BLOCK_META[b.type].label}
                </button>
                <button type="button" onClick={() => handleToggle(b.id)} className="touch-target text-xs text-slate-400">{b.visible ? "👁" : "🚫"}</button>
                <button type="button" onClick={() => handleDelete(b.id)} className="touch-target text-xs text-red-400">🗑</button>
              </li>
            ))}
          </ul>
        </section>

        <section className={`flex-1 overflow-y-auto bg-slate-100 p-4 lg:block ${tab === "preview" ? "block" : "hidden"}`}>
          <div className="mx-auto flex max-w-sm flex-col gap-3 rounded-[2rem] border-8 border-slate-900 bg-white p-3 shadow-xl">
            {blocks.filter((b) => b.visible).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => select(b.id)}
                className={`rounded-xl text-left ring-offset-2 transition ${selectedId === b.id ? "ring-2 ring-violet-500" : ""}`}
              >
                <BlockView type={b.type} props={b.props} />
              </button>
            ))}
          </div>
        </section>

        <section className={`w-full flex-shrink-0 overflow-y-auto border-l border-slate-100 bg-white p-4 lg:block lg:w-80 ${tab === "settings" ? "block" : "hidden"}`}>
          {selected ? (
            <Inspector key={selected.id} block={selected} onChange={(props) => handleProps(selected.id, props)} />
          ) : (
            <p className="text-sm text-slate-400">Selecione um bloco para editar.</p>
          )}
        </section>
      </div>

      <nav className="safe-bottom grid grid-cols-3 border-t border-slate-200 bg-white lg:hidden">
        {(["blocks", "preview", "settings"] as MobileTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`touch-target py-3 text-xs font-semibold ${tab === t ? "text-violet-700" : "text-slate-400"}`}>
            {t === "blocks" ? "Blocos" : t === "preview" ? "Prévia" : "Ajustes"}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Inspector({ block, onChange }: { block: DemoBlock; onChange: (props: Record<string, any>) => void }) {
  const fields = BLOCK_FIELDS[block.type] ?? [];
  const props = block.props;

  function setField(key: string, value: any) {
    onChange({ ...props, [key]: value });
  }

  if (fields.length === 0) return <p className="text-sm text-slate-400">Este bloco não tem ajustes.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">{BLOCK_META[block.type].label}</h3>
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
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm">
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
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
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
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="touch-target mt-2 text-xs font-medium text-red-500">
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
