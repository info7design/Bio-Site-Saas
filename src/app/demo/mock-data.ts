import { newBlock, type BlockType } from "@/lib/blocks";

export type DemoBlock = { id: string; type: BlockType; visible: boolean; props: Record<string, any> };

function block(type: BlockType, props: Record<string, any>): DemoBlock {
  const b = newBlock(type);
  return { id: b.id, type, visible: true, props: { ...b.props, ...props } };
}

export function mockBlocks(): DemoBlock[] {
  return [
    block("ProfileBlock", {
      name: "Salão da Ana",
      headline: "Cabelo & Estética",
      bio: "Agende seu horário ou peça pelo WhatsApp ✨",
      avatar: "",
    }),
    block("WhatsAppBlock", { phone: "11999999999", label: "Fale comigo no WhatsApp" }),
    block("ButtonBlock", {
      items: [
        { id: "b1", title: "Ver serviços", url: "https://", emoji: "💇" },
        { id: "b2", title: "Como chegar", url: "https://", emoji: "📍" },
      ],
    }),
    block("CatalogBlock", {
      title: "Cardápio",
      phone: "11999999999",
      items: [
        { name: "Corte feminino", description: "Lavagem + corte", priceCents: 8000, available: true },
        { name: "Escova", description: "", priceCents: 6000, available: true },
        { name: "Coloração", description: "Consulta prévia", priceCents: 15000, available: true },
      ],
    }),
    block("PixBlock", { key: "11999999999", keyType: "telefone", receiver: "Ana Souza", city: "São Paulo", label: "Pagar com PIX" }),
  ];
}
