import PartnerRequestsListing from "@/components/pages/find-partner/PartnerRequestsListing";
import { getAllPartnerRequests } from "@/services/partnerRequestService";
import { getAllCourts } from "@/services/courtService";

export const metadata = {
  title: "دور على شريك للعب — InstaPadel",
  description: "دور على لاعب بادل يكمل معاك الفريق، أو انشئ طلب وانضم لك ملعب في المنصورة.",
};

export default async function FindPartnerPage() {
  const [requests, courts] = await Promise.all([getAllPartnerRequests(), getAllCourts()]);
  return <PartnerRequestsListing requests={requests} courts={courts} />;
}