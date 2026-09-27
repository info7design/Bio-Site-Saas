const kpis = [
  { label: "Visitas (14 dias)", value: 812 },
  { label: "Cliques e interações", value: 341 },
  { label: "Leads", value: 27 },
  { label: "Agendamentos", value: 14 },
  { label: "Conversão", value: "32.6%" },
];

const sources = [
  { label: "Instagram", value: 412 },
  { label: "WhatsApp", value: 268 },
  { label: "Google", value: 190 },
  { label: "Direto", value: 96 },
];

const buttons = [
  { label: "WhatsApp", value: 100 },
  { label: "Catálogo", value: 73 },
  { label: "Agendamento", value: 32 },
];

export default function DemoDashboardPage() {
  const maxSource = Math.max(...sources.map((s) => s.value));
  const maxButton = Math.max(...buttons.map((b) => b.value));

  return (
    <>
      <div className="hello">
        <div>
          <h2>Bom dia, Visitante</h2>
          <p>Veja como está o desempenho de Salão da Ana (demonstração).</p>
        </div>
      </div>

      <div className="grid kpis">
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <span>{k.label}</span>
            <b>{k.value}</b>
          </div>
        ))}
      </div>

      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Origem dos visitantes</h3>
          <div className="bars">
            {sources.map((s) => (
              <div key={s.label} className="bar">
                <span>{s.label}</span>
                <div>
                  <i style={{ width: `${(s.value / maxSource) * 100}%` }} />
                </div>
                <span>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Botões mais acessados</h3>
          <div className="bars">
            {buttons.map((b) => (
              <div key={b.label} className="bar">
                <span>{b.label}</span>
                <div>
                  <i style={{ width: `${(b.value / maxButton) * 100}%` }} />
                </div>
                <span>{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid three" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Atividade recente</h3>
          <ul className="feed">
            <li><span className="fi">LD</span><span>Novo lead: Paula Menezes</span><small>hoje</small></li>
            <li><span className="fi">PD</span><span>Novo pedido: Rafael Dias</span><small>hoje</small></li>
            <li><span className="fi">AG</span><span>Agendamento confirmado</span><small>ontem</small></li>
          </ul>
        </div>
      </div>
    </>
  );
}
