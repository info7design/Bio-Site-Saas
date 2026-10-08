# Manifesti — instalar o banco de dados na HostGator (cPanel)

Testei toda essa API localmente (registro, login, criar site, salvar, publicar,
leads, agendamentos) antes de te mandar — funciona de ponta a ponta. Agora é só
seguir os passos abaixo dentro do seu cPanel.

## 1. Criar o banco de dados MySQL

1. Entre no **cPanel** da HostGator.
2. Vá em **Bancos de Dados MySQL®**.
3. Em "Criar um Novo Banco de Dados", digite `manifesti` e clique em **Criar**.
   - O nome final vai ficar algo como `seuusuario_manifesti` (a HostGator
     sempre prefixa com seu usuário — **anote esse nome completo**).
4. Mais abaixo, em "MySQL Users → Add New User", crie um usuário (ex: `manifesti`)
   com uma **senha forte** (use o gerador de senha do próprio cPanel).
   - O usuário final também fica `seuusuario_manifesti` — **anote usuário e senha**.
5. Em "Add User to Database", selecione o usuário e o banco que você criou,
   clique em **Add**, e na tela seguinte marque **ALL PRIVILEGES** → **Make Changes**.

Agora você tem 3 informações importantes: **nome do banco**, **usuário** e **senha**.
O host quase sempre é `localhost`.

## 2. Importar as tabelas (schema.sql)

1. No cPanel, abra **phpMyAdmin**.
2. No menu da esquerda, clique no banco `seuusuario_manifesti`.
3. Clique na aba **Importar** (Import).
4. Clique em "Escolher arquivo" e selecione o `schema.sql` que te enviei.
5. Clique em **Executar/Go**. Deve aparecer "Importação finalizada com sucesso".
6. Confira: devem aparecer 6 tabelas — `users`, `sites`, `leads`, `orders`,
   `bookings`, `analytics_events`.

## 3. Subir os arquivos da API

1. No cPanel, abra o **Gerenciador de Arquivos** (File Manager).
2. Entre em `public_html` (é onde fica o site principal, manifesti.com.br).
3. Crie uma pasta chamada `api`.
4. Entre nela e faça upload de **todos** os arquivos da pasta `api/` que te
   enviei: `db.php`, `auth.php`, `sites.php`, `leads.php`, `orders.php`,
   `bookings.php`, `events.php`, `.htaccess`, e `config.sample.php`.
   - Se o upload for um `.zip`, use o botão **Extract** depois de subir.

## 4. Configurar as credenciais do banco

1. Dentro de `public_html/api`, **duplique** o arquivo `config.sample.php`
   (botão direito → Copy, ou Duplicate) e renomeie a cópia para `config.php`.
2. Clique em `config.php` → **Edit** (editor de código do próprio cPanel).
3. Preencha com os dados do passo 1:
   ```php
   return [
     'db_host' => 'localhost',
     'db_name' => 'seuusuario_manifesti',
     'db_user' => 'seuusuario_manifesti',
     'db_pass' => 'A_SENHA_QUE_VOCE_CRIOU',
     'app_url' => 'https://manifesti.com.br',
   ];
   ```
4. Salve.

**Importante**: o `.htaccess` que te enviei já bloqueia o acesso direto a
`config.php` e `config.sample.php` pelo navegador — não precisa fazer nada
extra ali, só confirme que o arquivo `.htaccess` também foi enviado para
dentro da pasta `api`.

## 5. Checar a versão do PHP

1. No cPanel, procure **MultiPHP Manager** (ou "Selecionar versão do PHP").
2. Confirme que o domínio `manifesti.com.br` está usando **PHP 8.0 ou mais
   recente** (o código usa recursos modernos como `declare(strict_types=1)`).
3. Se estiver em uma versão mais antiga, troque por lá mesmo — é só um clique.

## 6. Testar se está tudo funcionando

Abra no navegador (ou me avise que eu testo remotamente):

```
https://manifesti.com.br/api/auth.php?action=login
```

Isso deve devolver um JSON de erro `{"error":"Faça login novamente..."}` —
**isso é bom sinal**, significa que o PHP e o banco estão respondendo.
Se aparecer uma tela de erro branca ou "500", algo no `config.php` está
errado (nome do banco, usuário ou senha).

Teste de verdade, criando uma conta:

```bash
curl -X POST "https://manifesti.com.br/api/auth.php?action=register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Seu Nome","email":"voce@email.com","password":"umasenha123"}'
```

Deve voltar algo como `{"user":{...},"api_key":"..."}`. Se voltar isso,
o banco está 100% funcional.

## 7. Importar o módulo de cobrança (assinaturas)

1. No **phpMyAdmin**, importe também o `schema_billing.sql` (mesmo processo
   do passo 2) — ele adiciona as tabelas `subscriptions` e `payment_events`,
   e novas colunas em `users`.

## 8. Criar conta no Asaas e pegar a chave de API

1. Crie (ou acesse) sua conta em **asaas.com**.
2. Pra testar sem cobrar de verdade primeiro, use o **sandbox**:
   entre em sandbox.asaas.com com os mesmos dados de login.
3. No menu, vá em **Integrações → Chave de API** (ou "Configurações →
   Integrações") e copie a chave.
4. Abra `public_html/api/config.php` (o que você já criou no passo 4) e
   preencha:
   ```php
   'asaas_env'     => 'sandbox',        // troque pra 'production' quando for cobrar de verdade
   'asaas_api_key' => 'SUA_CHAVE_AQUI',
   'asaas_webhook_token' => 'invente-um-codigo-secreto-aqui',
   ```

## 9. Configurar o webhook do Asaas

O Asaas precisa avisar seu sistema quando alguém paga. No painel do Asaas:

1. Vá em **Integrações → Webhooks** → **Novo Webhook**.
2. URL: `https://manifesti.com.br/api/billing.php?action=webhook`
3. Eventos: marque pelo menos `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`,
   `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `SUBSCRIPTION_DELETED`.
4. Em "Token de acesso" (ou "Authentication Token"), cole **o mesmo valor**
   que você colocou em `asaas_webhook_token` no `config.php`.
5. Salve e ative o webhook.

## 10. Subir as páginas de cadastro/login/planos

1. No Gerenciador de Arquivos, dentro de `public_html`, faça upload dos
   arquivos da pasta `public/` que te enviei: `auth.css`, `criar-conta.html`,
   `entrar.html`, `planos.html`.
   - Ficam acessíveis em `manifesti.com.br/criar-conta.html`,
     `manifesti.com.br/entrar.html` e `manifesti.com.br/planos.html`.
2. Teste o fluxo completo: criar conta → escolhe um plano pago → clica em
   "Continuar" → abre a página de pagamento do Asaas num link novo → paga
   com o cartão → o webhook
   libera o plano automaticamente.

## O que esse módulo de cobrança já faz

- **Cadastro e login reais**, com senha criptografada (bcrypt) e uma chave
  de API por usuário (guardada no navegador, enviada em todo pedido).
- **Seleção de plano** (Grátis ou Pro — todos os blocos do editor já vêm
  liberados em qualquer plano; o Pro libera mais páginas, todos os
  templates e tira a marca d'água) com CPF/CNPJ pedido só na hora de
  assinar (não trava o cadastro inicial).
- **Cobrança recorrente mensal** via Asaas — o cliente paga só com cartão
  de crédito na própria página do Asaas (nós nunca tocamos no número do
  cartão, então não há nenhuma exigência de PCI do seu lado).
- **Liberação automática do plano** assim que o pagamento é confirmado
  (webhook), e **downgrade automático pra Grátis** se a cobrança atrasar,
  for cancelada ou estornada.
- Testei a parte de confirmação/atraso do webhook de ponta a ponta antes
  de te mandar (simulando os eventos do Asaas) — funcionou exatamente como
  esperado.

## 11. Link de edição rápida (sem painel admin)

Agora cada site tem um **link de edição** próprio: você gera um link (ex.:
`manifesti.com.br/editar.html?t=xxxxx`) e manda pro seu cliente final. Ele
pode editar o rascunho do próprio site e publicar, sem nunca ver seu painel
nem os outros sites da sua conta — exatamente como o botão "editar sem
acessar o painel" de outras plataformas do mercado.

- `POST /api/sites.php?id=<id>&action=edit_link` (autenticado, no seu
  dashboard) gera ou renova esse link.
- O link funciona sozinho, sem `Authorization: Bearer`, e só dá acesso ao
  rascunho/publicação **daquele site específico**.
- A página `public/editar.html` (editor simplificado) ainda é o próximo
  passo de frontend — a API já está pronta e testada para ela.

## 11. Planos, conta master, site público e uploads (atualização)

**Planos**: Grátis (1 site, 1 página, blocos básicos, marca d'água) · Pro R$ 12,90
(1 site, 1 página, todos os blocos, sem marca d'água) · Premium R$ 34,90
(até 10 sites, 3 páginas em cada) · Master (sem limites, nunca cobrada).
Os limites são conferidos **no servidor** (`api/db.php`), não só na tela.

1. **Banco já criado antes?** No phpMyAdmin, rode uma vez o arquivo
   `schema_update_planos.sql`. (Banco novo: `schema.sql` e `schema_billing.sql`
   já vêm atualizados.)
2. **Conta master**: no `api/config.php`, preencha `'master_emails' => ['seu-email@...']`
   (use `config.sample.php` como modelo). Quem entrar ou criar conta com esse
   e-mail vira Master automaticamente.
3. **Site público** (`manifesti.com.br/nome-do-site`): suba o `index.html` do
   app em `public_html` e, junto dele, o arquivo `public/.htaccess`
   (se já existir um `.htaccess` lá, apenas acrescente as linhas dele).
4. **Uploads de imagem/áudio/vídeo**: suba a pasta `uploads/` (com o `.htaccess`
   dela, que impede executar código ali) para `public_html/uploads`, com
   permissão 755. O limite por arquivo é 5 MB (foto), 15 MB (música), 30 MB
   (vídeo); se o seu plano de hospedagem tiver `upload_max_filesize` menor,
   esse é o limite que vale (ajustável no cPanel → "Select PHP Version → Options").

## O que esse backend já faz

- **Contas**: cadastro/login com senha (hash seguro) + chave de API por usuário.
- **Sites**: criar, salvar rascunho, publicar (separa o que está em edição do
  que está no ar), ler versão pública por slug (`manifesti.com.br/<slug>`).
- **Leads**: formulário do site grava direto no banco; dono vê no painel.
- **Pedidos** (bloco Cardápio): grava pedido com itens, tipo (entrega/retirada)
  e total; dono muda status (novo → em preparo → pronto).
- **Agendamentos**: mostra horários livres de verdade (consultando o banco,
  não mais mockado) e impede duplo agendamento no mesmo horário.
- **Eventos**: visitas e cliques, para alimentar os gráficos do dashboard.

## Como o editor se liga a isso

O editor (`index.html`) já fala com estes endpoints: login/cadastro real,
salvar e publicar de verdade, leads/pedidos/agendamentos no painel, upload
de arquivos, checkout do Asaas e a página pública por slug. Sem conta, ele
continua funcionando como demonstração local. O seletor "Site ativo" lista os sites da conta e tem "+ Novo site" (respeitando o limite do plano). Ainda não tem: sincronizar horários de
agendamento já ocupados na página pública (o servidor já recusa duplo
agendamento).
