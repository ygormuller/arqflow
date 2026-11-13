import type { Delivery, DeliveryStatus } from "./model";

export type DeliveryAction =
  | { type: "approve"; deliveryId: number; versionId: string; actor: string; decidedAt: string }
  | { type: "request-change"; deliveryId: number; versionId: string; actor: string; decidedAt: string; comment: string }
  | { type: "publish-version"; deliveryId: number; publishedAt: string };

export type DeliveryState = { deliveries: Delivery[] };

export function deliveryReducer(state: DeliveryState, action: DeliveryAction): DeliveryState {
  const delivery = state.deliveries.find(item => item.id === action.deliveryId);
  if (!delivery) return state;

  if (action.type === "publish-version") {
    const latest = delivery.versions[delivery.versions.length - 1];
    if (!latest || latest.status !== "Alteração solicitada") return state;
    const latestNumber = Number(latest.label.match(/\d+/)?.[0] ?? delivery.versions.length);
    const nextNumber = latestNumber + 1;
    const nextVersion = {
      id: `${delivery.id}-v${nextNumber}`,
      label: `v${String(nextNumber).padStart(2, "0")}`,
      status: "Aguardando aprovação" as DeliveryStatus,
      publishedAt: action.publishedAt,
    };
    return {
      deliveries: state.deliveries.map(item => item.id === delivery.id
        ? { ...item, updated: "Agora", versions: [...item.versions, nextVersion] }
        : item),
    };
  }

  const version = delivery.versions.find(item => item.id === action.versionId);
  if (!version || version.status !== "Aguardando aprovação") return state;
  if (action.type === "request-change" && !action.comment.trim()) return state;

  const approved = action.type === "approve";
  return {
    deliveries: state.deliveries.map(item => item.id !== delivery.id ? item : {
      ...item,
      versions: item.versions.map(itemVersion => itemVersion.id !== version.id ? itemVersion : {
        ...itemVersion,
        status: approved ? "Aprovado" : "Alteração solicitada",
        decision: {
          kind: action.type === "approve" ? "approved" : "change-requested",
          actor: action.actor,
          decidedAt: action.decidedAt,
          ...(action.type === "request-change" ? { comment: action.comment.trim() } : {}),
        },
      }),
    }),
  };
}
