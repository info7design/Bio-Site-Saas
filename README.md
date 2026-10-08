# Bio Estúdio — plataforma de Bio Sites / Mini Sites

Conteúdo deste pacote

- `prototype/index.html`: mockup navegável (abra direto no navegador). Editor de 3 painéis, dashboard, leads, agendamentos, 64 templates (60 gerais + 4 editoriais em destaque no plano Pro) (incluindo estilos de cartão digital), cardápio com pedido no WhatsApp e página de vendas, capa em foto/vídeo, texto animado, stories, botões (17 estilos), biblioteca de ícones, fundos e molduras, QR Code real, redes com links, botão para mover módulos, botões e cartões personalizáveis, até 3 páginas por site. Todos os dados são de exemplo e nada é salvo ao recarregar.
- `prisma/schema.prisma`: banco multi-tenant (PostgreSQL) com todas as entidades da especificação.
- `src/lib/`: lógica base já testada em isolamento.
  - `pix.ts`: gerador de PIX copia e cola (CRC16 conferido).
  - `availability.ts`: cálculo de horários livres do agendamento.
  - `whatsapp.ts`: link do WhatsApp com mensagem e QR de Wi-Fi.
  - `blocks.ts`: registro dos blocos modulares.
- `docs/especificacao.txt`: a especificação original.
- `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`: base do projeto Next.js.

Próximos passos

1. `npm install` (precisa de acesso ao registro npm).
2. Criar `.env` com `DATABASE_URL` do PostgreSQL e rodar `npx prisma db push`.
3. Migrar a interface do `prototype/index.html` para componentes Next.js em `src/app` e `src/components`.

Hospedagem em caminho do mesmo domínio (ex.: `manifesti.com.br/site`): as páginas públicas usam a rota `/[slug]`, então funcionam no mesmo domínio sem configuração extra.

Observação: `themes.ts` (presets antigos) não está incluído; os temas atuais estão dentro do `prototype/index.html`.


Código-fonte do protótipo: `src-proto/` (style.css, body.html, core.js, icons.js, qr.js, tpl.js, tpl2.js, boot.js). Para regenerar `prototype/index.html`, rode `python3 src-proto/build.py`.

Marca usada no protótipo: Manifesti.

## Responsivo e celular
- Barra lateral recolhível: botão de menu no topo (desktop lembra a escolha; no celular vira gaveta com fundo escurecido, fecha com Esc ou toque fora).
- Editor no celular com abas fixas embaixo: Blocos, Prévia e Ajustes. Tocar num módulo abre os ajustes; botão flutuante "Editar bloco".
- Alvos de toque de 44px, campos com 16px (sem zoom no iOS), tabelas com rolagem interna. Testado em 360, 768, 1024 e 1440 px.

## Planos
Grátis (1 site, 1 página, só links e redes sociais, templates básicos), Pro R$ 97,90, Premium R$ 197,90 (destaque), Scale R$ 297,90 e Whitelabel (em breve). No painel, o seletor "Testar plano" na barra lateral aplica os limites do plano na hora. Valores de exemplo.

## Mais controles por módulo (v8)
- Velocidade da animação de texto (Lenta/Normal/Rápida) nos blocos Capa, Título grande e Texto, para letreiro, digitação, palavras alternadas e subida por letra.
- Escurecer foto por item nos blocos Cartões, Blocos com imagem, Stories, Catálogo e Serviços; e por bloco inteiro em Faixas de fotos, Galeria e Carrossel.
- Galeria com número de colunas ajustável (2, 3 ou 4).
