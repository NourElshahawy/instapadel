import CreatePartnerRequestForm from "@/components/pages/find-partner/CreatePartnerRequestForm";
import { getAllCourts } from "@/services/courtService";
import { getCurrentUser } from "@/services/authService";
import ParallaxBg from "@/components/ui/ParallaxBg";

export const metadata = { title: "إنشاء طلب شريك — InstaPadel" };

export default async function CreatePartnerRequestPage() {
  const [courts, currentUser] = await Promise.all([getAllCourts(), getCurrentUser()]);

  return (
    <section className="new-section section" style={{ paddingTop: 140 }}>
      <ParallaxBg image="/assets/imgs/courts-bg.png" />
      <div>
        <CreatePartnerRequestForm courts={courts} currentUser={currentUser} />
      </div>
    </section>
  );
}
