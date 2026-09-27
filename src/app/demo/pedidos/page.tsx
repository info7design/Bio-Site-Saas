const orders = [
  { date: "26/09/2026 14:20", items: "2x Corte feminino, 1x Escova", total: "R$ 220,00" },
  { date: "24/09/2026 10:05", items: "1x Coloração", total: "R$ 150,00" },
];

export default function DemoPedidosPage() {
  return (
    <>
      <div className="hello">
        <div>
          <h2>Pedidos do cardápio</h2>
          <p>Pedidos enviados pelos clientes pelo WhatsApp.</p>
        </div>
      </div>
      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Itens</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i}>
                <td>{o.date}</td>
                <td>{o.items}</td>
                <td>{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
