import Link from "next/link";
import { getAllTournaments } from "@/services/tournamentService";
import ListingHero from "@/components/shared/ListingHero";
import TournamentsListing from "@/components/tournaments/TournamentsListing";


export const metadata = {
  title: "البطولات — InstaPadel",
  description: "اكتشف بطولات البادل في المنصورة، سجّل فريقك أو تابع نتائج البطولات الجارية والمنتهية.",
};

const STATUS_LABELS = {
  registration: "التسجيل مفتوح",
  ready: "التسجيل اكتمل",
  live: "جارية الآن",
  completed: "انتهت",
};

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();
 
  return <TournamentsListing tournaments={tournaments} />;
}
 
