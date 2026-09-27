const bookings = [
  { when: "28/09/2026 14:00", service: "Corte feminino", client: "Juliana Alves", status: "CONFIRMED" },
  { when: "28/09/2026 16:00", service: "Coloração", client: "Beatriz Lima", status: "PENDING" },
];

export default function DemoAgendamentosPage() {
  return (
    <>
      <div className="hello">
        <div>
          <h2>Agendamentos</h2>
          <p>Reservas recebidas pelo site.</p>
        </div>
      </div>
      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Serviço</th>
              <th>Cliente</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={i}>
                <td>{b.when}</td>
                <td>{b.service}</td>
                <td>{b.client}</td>
                <td><span className="tag t1">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
