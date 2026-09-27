import type { BlockType } from "@/lib/blocks";

export type FieldDef =
  | { key: string; label: string; kind: "text" | "textarea" | "url" | "tel" | "color" | "number" | "date" }
  | { key: string; label: string; kind: "checkbox" }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; kind: "list"; itemLabel: string; itemFields: FieldDef[] };

/** Campos de edição por tipo de bloco. Dirige o formulário genérico do inspetor. */
export const BLOCK_FIELDS: Record<BlockType, FieldDef[]> = {
  CoverBlock: [
    { key: "title", label: "Título", kind: "text" },
    { key: "subtitle", label: "Subtítulo", kind: "text" },
    { key: "badge", label: "Selo (ex.: Vagas em outubro)", kind: "text" },
    { key: "image", label: "URL da imagem de fundo", kind: "url" },
    {
      key: "format",
      label: "Formato",
      kind: "select",
      options: [
        { value: "card", label: "Cartão" },
        { value: "fullscreen", label: "Tela cheia" },
        { value: "arc", label: "Arco" },
        { value: "wave", label: "Onda" },
        { value: "diagonal", label: "Diagonal" },
        { value: "organic", label: "Orgânico" },
      ],
    },
    {
      key: "textAlign",
      label: "Alinhamento do texto",
      kind: "select",
      options: [
        { value: "left", label: "Esquerda" },
        { value: "center", label: "Centro" },
      ],
    },
    {
      key: "height",
      label: "Altura",
      kind: "select",
      options: [
        { value: "baixa", label: "Baixa" },
        { value: "media", label: "Média" },
        { value: "alta", label: "Alta" },
      ],
    },
  ],
  StoriesBlock: [
    {
      key: "items",
      label: "Stories",
      kind: "list",
      itemLabel: "Story",
      itemFields: [
        { key: "title", label: "Título", kind: "text" },
        { key: "image", label: "URL da imagem", kind: "url" },
      ],
    },
  ],
  ProfileBlock: [
    { key: "name", label: "Nome", kind: "text" },
    { key: "handle", label: "@usuário", kind: "text" },
    { key: "headline", label: "Profissão / categoria", kind: "text" },
    { key: "bio", label: "Bio", kind: "textarea" },
    { key: "location", label: "Localização", kind: "text" },
    { key: "avatar", label: "URL da foto de perfil", kind: "url" },
    { key: "cover", label: "URL da capa", kind: "url" },
  ],
  BigTitleBlock: [
    { key: "text", label: "Título", kind: "text" },
    {
      key: "align",
      label: "Alinhamento",
      kind: "select",
      options: [
        { value: "left", label: "Esquerda" },
        { value: "center", label: "Centro" },
      ],
    },
  ],
  DetailLineBlock: [
    { key: "icon", label: "Ícone/emoji", kind: "text" },
    { key: "text", label: "Texto", kind: "text" },
  ],
  TextBlock: [
    { key: "title", label: "Título", kind: "text" },
    { key: "text", label: "Texto", kind: "textarea" },
  ],
  ButtonBlock: [
    {
      key: "items",
      label: "Botões",
      kind: "list",
      itemLabel: "Botão",
      itemFields: [
        { key: "title", label: "Título", kind: "text" },
        { key: "description", label: "Descrição", kind: "text" },
        { key: "url", label: "Link", kind: "url" },
        { key: "emoji", label: "Emoji", kind: "text" },
        {
          key: "style",
          label: "Estilo do botão",
          kind: "select",
          options: [
            { value: "solid", label: "Sólido" },
            { value: "soft", label: "Suave" },
            { value: "outline", label: "Contorno" },
            { value: "glass", label: "Vidro" },
            { value: "pill", label: "Pílula" },
            { value: "gradient", label: "Degradê" },
            { value: "lift", label: "Elevado" },
            { value: "line", label: "Linha" },
            { value: "neu", label: "Relevo" },
            { value: "brutal", label: "Contorno grosso" },
            { value: "gold", label: "Dourado" },
            { value: "arrow", label: "Seta" },
            { value: "bar", label: "Faixa" },
            { value: "block", label: "Bloco" },
            { value: "tile", label: "Ícone quadrado" },
            { value: "minimal", label: "Fino" },
            { value: "neon", label: "Neon" },
          ],
        },
        {
          key: "size",
          label: "Tamanho",
          kind: "select",
          options: [
            { value: "s", label: "Pequeno" },
            { value: "m", label: "Normal" },
            { value: "l", label: "Grande" },
            { value: "xl", label: "Extra grande" },
          ],
        },
      ],
    },
  ],
  IconGridBlock: [
    {
      key: "items",
      label: "Ícones",
      kind: "list",
      itemLabel: "Ícone",
      itemFields: [
        { key: "icon", label: "Emoji/ícone", kind: "text" },
        { key: "label", label: "Rótulo", kind: "text" },
        { key: "url", label: "Link", kind: "url" },
      ],
    },
  ],
  SocialBlock: [
    {
      key: "items",
      label: "Redes sociais",
      kind: "list",
      itemLabel: "Rede",
      itemFields: [
        { key: "network", label: "Rede (instagram, tiktok...)", kind: "text" },
        { key: "url", label: "Link", kind: "url" },
      ],
    },
  ],
  WhatsAppBlock: [
    { key: "phone", label: "Telefone (com DDD)", kind: "tel" },
    { key: "message", label: "Mensagem inicial", kind: "textarea" },
    { key: "label", label: "Texto do botão", kind: "text" },
  ],
  CatalogBlock: [
    { key: "title", label: "Título", kind: "text" },
    { key: "phone", label: "WhatsApp para pedidos", kind: "tel" },
    {
      key: "items",
      label: "Itens do cardápio",
      kind: "list",
      itemLabel: "Item",
      itemFields: [
        { key: "name", label: "Nome", kind: "text" },
        { key: "description", label: "Descrição", kind: "text" },
        { key: "priceCents", label: "Preço (centavos)", kind: "number" },
        { key: "imageId", label: "URL da imagem", kind: "url" },
        { key: "available", label: "Disponível", kind: "checkbox" },
      ],
    },
  ],
  ServiceBlock: [
    { key: "title", label: "Título", kind: "text" },
    { key: "phone", label: "WhatsApp", kind: "tel" },
    {
      key: "items",
      label: "Serviços",
      kind: "list",
      itemLabel: "Serviço",
      itemFields: [
        { key: "name", label: "Nome", kind: "text" },
        { key: "description", label: "Descrição", kind: "text" },
        { key: "priceCents", label: "Preço (centavos)", kind: "number" },
        { key: "durationMin", label: "Duração (min)", kind: "number" },
      ],
    },
  ],
  BookingBlock: [
    { key: "title", label: "Título", kind: "text" },
  ],
  PixBlock: [
    { key: "key", label: "Chave PIX", kind: "text" },
    {
      key: "keyType",
      label: "Tipo de chave",
      kind: "select",
      options: [
        { value: "aleatoria", label: "Aleatória" },
        { value: "cpf", label: "CPF" },
        { value: "cnpj", label: "CNPJ" },
        { value: "email", label: "E-mail" },
        { value: "telefone", label: "Telefone" },
      ],
    },
    { key: "receiver", label: "Nome do recebedor", kind: "text" },
    { key: "city", label: "Cidade", kind: "text" },
    { key: "label", label: "Texto do botão", kind: "text" },
  ],
  MapBlock: [
    { key: "address", label: "Endereço", kind: "text" },
  ],
  GalleryBlock: [
    {
      key: "items",
      label: "Fotos",
      kind: "list",
      itemLabel: "Foto",
      itemFields: [{ key: "url", label: "URL da imagem", kind: "url" }],
    },
  ],
  ImageBlocksBlock: [
    {
      key: "layout",
      label: "Layout",
      kind: "select",
      options: [
        { value: "grid", label: "Grade" },
        { value: "list", label: "Lista" },
        { value: "mosaic", label: "Mosaico" },
      ],
    },
    {
      key: "items",
      label: "Imagens",
      kind: "list",
      itemLabel: "Imagem",
      itemFields: [
        { key: "url", label: "URL da imagem", kind: "url" },
        { key: "caption", label: "Legenda", kind: "text" },
      ],
    },
  ],
  PhotoStripBlock: [
    {
      key: "items",
      label: "Fotos",
      kind: "list",
      itemLabel: "Foto",
      itemFields: [{ key: "url", label: "URL da imagem", kind: "url" }],
    },
  ],
  CardsBlock: [
    {
      key: "items",
      label: "Cartões",
      kind: "list",
      itemLabel: "Cartão",
      itemFields: [
        { key: "title", label: "Título", kind: "text" },
        { key: "text", label: "Texto", kind: "textarea" },
        { key: "image", label: "URL da imagem", kind: "url" },
        { key: "url", label: "Link", kind: "url" },
      ],
    },
  ],
  VideoBlock: [
    { key: "title", label: "Título", kind: "text" },
    { key: "url", label: "URL do vídeo (YouTube/MP4)", kind: "url" },
  ],
  LeadFormBlock: [
    { key: "title", label: "Título", kind: "text" },
    { key: "consentText", label: "Texto de consentimento (LGPD)", kind: "textarea" },
    { key: "button", label: "Texto do botão", kind: "text" },
  ],
  WifiBlock: [
    { key: "ssid", label: "Nome da rede (SSID)", kind: "text" },
    { key: "password", label: "Senha", kind: "text" },
    {
      key: "security",
      label: "Segurança",
      kind: "select",
      options: [
        { value: "WPA", label: "WPA/WPA2" },
        { value: "WEP", label: "WEP" },
        { value: "nopass", label: "Sem senha" },
      ],
    },
  ],
  Tour360Block: [
    { key: "source", label: "Link do tour 360°", kind: "url" },
  ],
  QRCodeBlock: [
    { key: "fg", label: "Cor do QR", kind: "color" },
    { key: "bg", label: "Cor de fundo", kind: "color" },
  ],
  DividerBlock: [],
  CarouselBlock: [
    {
      key: "items",
      label: "Slides",
      kind: "list",
      itemLabel: "Slide",
      itemFields: [{ key: "url", label: "URL da imagem", kind: "url" }],
    },
  ],
  TestimonialsBlock: [
    {
      key: "items",
      label: "Depoimentos",
      kind: "list",
      itemLabel: "Depoimento",
      itemFields: [
        { key: "name", label: "Nome", kind: "text" },
        { key: "text", label: "Depoimento", kind: "textarea" },
      ],
    },
  ],
  FixedIconBarBlock: [
    {
      key: "items",
      label: "Ícones fixos",
      kind: "list",
      itemLabel: "Ícone",
      itemFields: [
        { key: "icon", label: "Emoji/ícone", kind: "text" },
        { key: "url", label: "Link", kind: "url" },
      ],
    },
  ],
  CustomHTMLBlock: [{ key: "html", label: "HTML personalizado", kind: "textarea" }],
};
