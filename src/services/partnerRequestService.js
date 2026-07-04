import { fetchJson } from "./api";

export async function getAllPartnerRequests() {
  return fetchJson("partner-requests.json");
}

export async function getPartnerRequestById(id) {
  const requests = await getAllPartnerRequests();
  return requests.find((r) => r.id === id) || null;
}

// TODO: الدوال دي محتاجة تتحول لـ POST/PATCH حقيقية على الباك إند
// export async function createPartnerRequest(data) { ... }
// export async function joinPartnerRequest(requestId, player) { ... }
// export async function respondToJoinRequest(requestId, playerId, accept) { ... }
