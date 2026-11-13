export type DeliveryStatus =
  | "Aguardando aprovação"
  | "Em revisão"
  | "Aprovado"
  | "Alteração solicitada";

export type DeliveryDecision = {
  kind: "approved" | "change-requested";
  actor: string;
  decidedAt: string;
  comment?: string;
};

export type DeliveryVersion = {
  id: string;
  label: string;
  status: DeliveryStatus;
  publishedAt: string;
  decision?: DeliveryDecision;
};

export type Delivery = {
  id: number;
  title: string;
  stage: string;
  room: string;
  updated: string;
  type: "image" | "document";
  author: string;
  note: string;
  versions: DeliveryVersion[];
};

export function currentVersion(delivery: Delivery): DeliveryVersion {
  return delivery.versions[delivery.versions.length - 1];
}
