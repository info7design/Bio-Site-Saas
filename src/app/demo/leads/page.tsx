const leads = [
  { date: "25/09/2026", name: "Maria Silva", contact: "(11) 98888-0000", source: "site" },
  { date: "23/09/2026", name: "Carla Mendes", contact: "carla@email.com", source: "instagram" },
];

export default function DemoLeadsPage() {
  return (
    <>
      <div className="hello">
        <div>
          <h2>Leads</h2>
          <p>Contatos recebidos pelo formulário.</p>
        </div>
      </div>
      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Contato</th>
              <th>Origem</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i}>
                <td>{l.date}</td>
                <td>{l.name}</td>
                <td>{l.contact}</td>
                <td>{l.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
