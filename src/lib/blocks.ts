/**
 * Registro de blocos modulares.
 * Para criar um novo bloco: adicione o tipo aqui + um componente em
 * src/components/blocks e registre-o em src/components/blocks/index.tsx.
 * Nenhuma outra parte do sistema precisa mudar.
 */

export const BLOCK_TYPES = [
  "CoverBlock", "StoriesBlock", "ProfileBlock", "BigTitleBlock", "DetailLineBlock",
  "TextBlock", "ButtonBlock", "IconGridBlock", "SocialBlock", "WhatsAppBlock",
  "CatalogBlock", "ServiceBlock", "BookingBlock", "PixBlock", "MapBlock",
  "GalleryBlock", "ImageBlocksBlock", "PhotoStripBlock", "CardsBlock", "VideoBlock",
  "LeadFormBlock", "WifiBlock", "Tour360Block", "QRCodeBlock", "DividerBlock",
  "CarouselBlock", "TestimonialsBlock", "FixedIconBarBlock", "CustomHTMLBlock",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export type BlockAnimation = "none" | "fade" | "slide" | "scale" | "pulse";

export type BlockData = {
  id: string;
  type: BlockType;
  visible: boolean;
  animation?: BlockAnimation;
  props: Record<string, any>;
};

export type BlockMeta = { label: string; icon: string; defaults: Record<string, any> };

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  CoverBlock: { label: "Capa", icon: "Image", defaults: { title: "Seu negócio", subtitle: "", image: "", format: "card", textAlign: "left", height: "media" } },
  StoriesBlock: { label: "Stories", icon: "CircleDot", defaults: { items: [] } },
  ProfileBlock: { label: "Perfil", icon: "User", defaults: { name: "Seu nome", handle: "@usuario", verified: false, headline: "Profissão | Categoria", bio: "Conte em uma frase o que você faz.", location: "", avatar: "", cover: "" } },
  BigTitleBlock: { label: "Título grande", icon: "Heading", defaults: { text: "Título de impacto", align: "left" } },
  DetailLineBlock: { label: "Linha de detalhes", icon: "Info", defaults: { icon: "🟢", text: "Aberto até 23h" } },
  TextBlock: { label: "Texto", icon: "Type", defaults: { title: "", text: "Escreva aqui." } },
  ButtonBlock: { label: "Botões / Links", icon: "MousePointerClick", defaults: { items: [{ id: "b1", title: "Conheça nossos serviços", description: "", url: "https://", emoji: "✨" }] } },
  IconGridBlock: { label: "Grade de ícones", icon: "Grid3x3", defaults: { items: [] } },
  SocialBlock: { label: "Redes sociais", icon: "Share2", defaults: { items: [] } },
  WhatsAppBlock: { label: "WhatsApp", icon: "MessageCircle", defaults: { phone: "", message: "Olá! Vim pelo seu Bio Site e gostaria de saber mais.", label: "Fale comigo no WhatsApp" } },
  CatalogBlock: { label: "Catálogo", icon: "ShoppingBag", defaults: { title: "Catálogo", phone: "", items: [] } },
  ServiceBlock: { label: "Serviços", icon: "Briefcase", defaults: { title: "Serviços", phone: "", items: [] } },
  BookingBlock: { label: "Agendamento", icon: "CalendarClock", defaults: { title: "Agende seu horário", services: [], weekly: [{ weekday: 1, start: "08:00", end: "18:00", breakMin: 0 }] } },
  PixBlock: { label: "PIX", icon: "QrCode", defaults: { key: "", keyType: "aleatoria", receiver: "", city: "", label: "Pagar com PIX" } },
  MapBlock: { label: "Mapa", icon: "MapPin", defaults: { address: "", lat: null, lng: null } },
  GalleryBlock: { label: "Galeria", icon: "Images", defaults: { layout: "grid", items: [] } },
  ImageBlocksBlock: { label: "Blocos com imagem", icon: "LayoutGrid", defaults: { layout: "grid", items: [] } },
  PhotoStripBlock: { label: "Faixa de fotos", icon: "GalleryHorizontalEnd", defaults: { items: [] } },
  CardsBlock: { label: "Cartões", icon: "IdCard", defaults: { items: [] } },
  VideoBlock: { label: "Vídeo", icon: "Video", defaults: { url: "", title: "" } },
  LeadFormBlock: { label: "Formulário de leads", icon: "ClipboardList", defaults: { title: "Fale com a gente", fields: ["name", "phone", "email", "message"], consentText: "Concordo com o uso dos meus dados para contato (LGPD).", button: "Enviar" } },
  WifiBlock: { label: "Wi-Fi", icon: "Wifi", defaults: { ssid: "", password: "", security: "WPA" } },
  Tour360Block: { label: "Tour 360°", icon: "Rotate3d", defaults: { kind: "link", source: "" } },
  QRCodeBlock: { label: "QR Code", icon: "ScanLine", defaults: { fg: "#000000", bg: "#ffffff" } },
  DividerBlock: { label: "Divisor", icon: "Minus", defaults: { style: "line" } },
  CarouselBlock: { label: "Carrossel", icon: "GalleryHorizontal", defaults: { items: [] } },
  TestimonialsBlock: { label: "Depoimentos", icon: "Quote", defaults: { items: [] } },
  FixedIconBarBlock: { label: "Barra de ícones fixa", icon: "Dock", defaults: { items: [] } },
  CustomHTMLBlock: { label: "HTML personalizado", icon: "Code", defaults: { html: "" } },
};

/** Ordem recomendada de conversão (item 41). */
export const RECOMMENDED_ORDER: BlockType[] = [
  "ProfileBlock", "WhatsAppBlock", "ButtonBlock", "CatalogBlock", "ServiceBlock", "TestimonialsBlock",
  "GalleryBlock", "BookingBlock", "MapBlock", "SocialBlock", "PixBlock", "TextBlock",
];

export function newBlock(type: BlockType): BlockData {
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    visible: true,
    animation: "fade",
    props: structuredClone(BLOCK_META[type].defaults),
  };
}
