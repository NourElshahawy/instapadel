// app/tournaments/create/page.js
// مثال بسيط لطريقة الاستخدام — عدّل المسارات حسب بنية مشروعك

import CreateTournamentWizard from "@/components/tournaments/CreateTournamentWizard";
import { getAllCourts } from "@/services/courtService";

export const metadata = {
  title: "إنشاء بطولة جديدة — InstaPadel",
};

export default async function CreateTournamentPage() {
  const courts = (await getAllCourts()) ?? [];

  async function handleCreateTournament(data) {
    const tournament = await createTournament(data);
    return tournament;
  }

  return <CreateTournamentWizard courts={courts} />;
}
