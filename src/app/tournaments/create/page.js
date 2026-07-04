import CreateTournamentWizard from "@/components/tournaments/CreateTournamentWizard";
import { getAllCourts } from "@/services/courtService";

export const metadata = {
  title: "إنشاء بطولة جديدة — InstaPadel",
};

export default async function CreateTournamentPage() {
  const courts = (await getAllCourts()) ?? [];

  async function handleCreateTournament(formData) {
    "use server";
    // TODO: يتبدل بالـ fetch الحقيقي لما الـ API الحقيقي يجهز
    console.log("Tournament data:", formData);
    return { id: "t-temp-" + Date.now() };
  }

  return <CreateTournamentWizard courts={courts} onSubmit={handleCreateTournament} />;
}
