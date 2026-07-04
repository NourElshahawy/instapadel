import { notFound } from "next/navigation";
import PartnerRequestDetail from "@/components/pages/find-partner/PartnerRequestDetail";
import { getPartnerRequestById } from "@/services/partnerRequestService";
import { getCurrentUser } from "@/services/authService";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const request = await getPartnerRequestById(id);
  return { title: request ? `${request.courtName} — طلب شريك` : "طلب غير موجود" };
}

export default async function PartnerRequestPage({ params }) {
  const { id } = await params;
  const [request, currentUser] = await Promise.all([getPartnerRequestById(id), getCurrentUser()]);
  if (!request) notFound();

  return <PartnerRequestDetail initialRequest={request} currentUser={currentUser} />;
}
