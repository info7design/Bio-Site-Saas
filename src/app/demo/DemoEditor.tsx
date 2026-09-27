"use client";

import { useState } from "react";
import { BLOCK_META, BLOCK_TYPES, newBlock, type BlockType } from "@/lib/blocks";
import { BLOCK_FIELDS, type FieldDef } from "@/lib/block-fields";
import BlockView from "@/components/blocks/BlockView";
import type { DemoBlock } from "./mock-data";

type MobileTab = "blocks" | "stage" | "inspector";

export default function DemoEditor({ initialBlocks }: { initialBlocks: DemoBlock[] }) {
  const [blocks, setBlocks] = useState<DemoBlock[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(initialBlocks[0]?.id ?? null);
  const [tab, setTab] = useState<MobileTab>("stage");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  const themeVars = {
    "--bg": "#faf9f5",
    "--text": "#15151a",
    "--muted": "color-mix(in srgb, var(--text) 55%, transparent)",
    "--primary": "#5b4bff",
    "--secondary": "color-mix(in srgb, var(--primary) 14%, white)",
    "--btn-bg": "#5b4bff",
    "--btn-text": "#ffffff",
    "--radius": "16px",
    "--shadow": "0 10px 24px -12px rgba(0,0,0,.35)",
    "--hf": "inherit",
    "--gap": "16px",
    "--fs": "15px",
    "--av": "92px",
  } as React.CSSProperties;

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function select(id: string) {
    setSelectedId(id);
    setTab("inspector");
  }

  function handleAdd(type: BlockType) {
    const b = newBlock(type);
    const demo: DemoBlock = { id: b.id, type, visible: true, props: b.props };
    setBlocks((prev) => [...prev, demo]);
    select(demo.id);
    setTab("stage");
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
    <div className="editor" data-tab={tab}>
      <section className="panel l">
        <button type="button" className="btn sm mob-only" onClick={() => setTab("stage")}>
          ← Voltar à prévia
        </button>

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
              <button type="button" className="ic" onClick={() => handleMove(i, -1)} aria-label="Mover para cima">↑</button>
              <button type="button" className="ic" onClick={() => handleMove(i, 1)} aria-label="Mover para baixo">↓</button>
              <button type="button" className="nm" onClick={() => select(b.id)}>{BLOCK_META[b.type].label}</button>
              <button type="button" className="ic" onClick={() => handleToggle(b.id)}>{b.visible ? "👁" : "🚫"}</button>
              <button type="button" className="ic" onClick={() => handleDelete(b.id)}>🗑</button>
            </li>
          ))}
        </ul>
        <p className="note">Use as setas para reordenar.</p>
      </section>

      <section className="stage">
        <div className="bar2">
          <div className="seg devseg">
            <button type="button" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Celular</button>
            <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Computador</button>
          </div>
        </div>
        <div className={`device ${device === "desktop" ? "desktop" : ""}`}>
          <div className="bio" style={themeVars}>
            <div className="page">
              {blocks.filter((b) => b.visible).map((b) => (
                <div key={b.id} className={`blk mode-edit ${selectedId === b.id ? "sel" : ""}`} onClick={() => select(b.id)}>
                  <BlockView type={b.type} props={b.props} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="panel r">
        {selected ? (
          <Inspector key={selected.id} block={selected} onChange={(props) => handleProps(selected.id, props)} />
        ) : (
          <p className="note">Selecione um bloco para editar.</p>
        )}
      </section>

      <nav className="etabs">
        {(["blocks", "stage", "inspector"] as MobileTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t}>
            {t === "blocks" ? "Blocos" : t === "stage" ? "Prévia" : "Ajustes"}
          </button>
        ))}
      </nav>
      {selected && tab !== "inspector" && (
        <button type="button" className="editfab" onClick={() => setTab("inspector")}>Editar bloco ›</button>
      )}
    </div>
  );
}

function Inspector({ block, onChange }: { block: DemoBlock; onChange: (props: Record<string, any>) => void }) {
  const fields = BLOCK_FIELDS[block.type] ?? [];
  const props = block.props;

  function setField(key: string, value: any) {
    onChange({ ...props, [key]: value });
  }

  if (fields.length === 0) return <p className="note">Este bloco não tem ajustes.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3>{BLOCK_META[block.type].label}</h3>
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
          {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
              <summary><span className="tt">{item.title || item.name || `${field.itemLabel} ${i + 1}`}</span></summary>
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
                  <button type="button" className="btn sm" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remover</button>
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
