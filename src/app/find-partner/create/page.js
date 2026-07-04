import CreatePartnerRequestForm from "@/components/pages/find-partner/CreatePartnerRequestForm";
import { getAllCourts } from "@/services/courtService";
import { getCurrentUser } from "@/services/authService";

export const metadata = { title: "إنشاء طلب شريك — InstaPadel" };

export default async function CreatePartnerRequestPage() {
  const [courts, currentUser] = await Promise.all([getAllCourts(), getCurrentUser()]);

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="container">
        <CreatePartnerRequestForm courts={courts} currentUser={currentUser} />
      </div>
    </section>
  );
}
