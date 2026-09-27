const templates = [
  { name: "Moderno", color: "#5b4bff", category: "Geral" },
  { name: "Minimalista", color: "#111827", category: "Geral" },
  { name: "Restaurante", color: "#e11d48", category: "Cardápio" },
];

export default function DemoTemplatesPage() {
  return (
    <>
      <div className="tplhead">
        <div>
          <h2>Templates</h2>
          <p className="note">Escolha um estilo — cores e fontes aplicam na hora.</p>
        </div>
      </div>
      <div className="tplgrid">
        {templates.map((t) => (
          <div key={t.name} className="tplcard">
            <div className="thumb" style={{ background: t.color }} />
            <h4>
              {t.name}
              <span className="tag">{t.category}</span>
            </h4>
            <div className="row">
              <button type="button" className="btn sm primary" disabled>
                Usar este template
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
