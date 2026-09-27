# Deploy — linkbio.manifesti.com.br

Este guia sobe o Bio-Site-Saas na VPS **isolado** do outro projeto (SaaS de WhatsApp) que já roda lá: rede Docker própria (`biosite_net`), volume próprio (`biosite_db_data`) e banco Postgres próprio (`biosite-db`), sem nenhuma porta ou serviço compartilhado.

## 1. Preparar o `.env` na VPS
Copie `.env.example` para `.env` dentro da pasta do projeto na VPS e preencha:

```bash
POSTGRES_PASSWORD=<senha-forte-gerada>
DATABASE_URL=postgresql://biosite:<mesma-senha>@biosite-db:5432/biosite?schema=public
SESSION_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://linkbio.manifesti.com.br
NODE_ENV=production
```

## 2. Subir os containers
```bash
docker compose -p biosite build
docker compose -p biosite up -d
```

## 3. Migrar e popular o banco (primeira vez e a cada mudança de schema)
```bash
docker compose -p biosite exec biosite-app npx prisma db push
docker compose -p biosite exec biosite-app npx tsx prisma/seed.ts
```

## 4. Reverse proxy (Nginx) para o domínio
Exemplo de bloco de servidor apontando para o container na porta 3000 (rede `biosite_net`; ajuste o `proxy_pass` para o IP/hostname que seu proxy alcança, ex. `biosite-app:3000` se o proxy também estiver na mesma rede Docker, ou `127.0.0.1:<porta-publicada>` caso prefira publicar a porta):

```nginx
server {
    listen 443 ssl http2;
    server_name linkbio.manifesti.com.br;

    ssl_certificate     /etc/letsencrypt/live/linkbio.manifesti.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/linkbio.manifesti.com.br/privkey.pem;

    location / {
        proxy_pass http://biosite-app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Gere o certificado com `certbot --nginx -d linkbio.manifesti.com.br` (ou use Caddy, que faz isso automaticamente).

## 5. DNS
Crie um registro `A` (ou `CNAME`) para `linkbio.manifesti.com.br` apontando para o IP da VPS.

## 6. Verificação
```bash
docker compose -p biosite ps
docker compose -p biosite logs -f biosite-app
curl -I https://linkbio.manifesti.com.br
```

## Isolamento do outro projeto
- Nunca use `docker compose` sem `-p biosite` nesta pasta — evita misturar com a stack do outro SaaS.
- `biosite-db` não publica porta no host; só `biosite-app` acessa, via rede interna `biosite_net`.
- Se o outro projeto também usa Nginx/Caddy no host, basta adicionar este `server {}` como mais um site — nenhuma alteração é necessária na stack existente.
