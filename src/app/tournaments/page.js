import Link from "next/link";
import { getAllTournaments } from "@/services/tournamentService";
import "@/styles/pages/tournaments-listing.css";
import ParallaxBg from "@/components/ui/ParallaxBg";

export const metadata = { title: "البطولات — InstaPadel" };

const STATUS_LABELS = {
  registration: "التسجيل مفتوح",
  ready: "التسجيل اكتمل",
  live: "جارية الآن",
  completed: "انتهت",
};

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();

  return (
    <>
      <section className="listing-hero">
        <div className="container">
          <div className="breadcrumb-ph" data-aos="fade-up">
            <Link href="/">الرئيسية</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <span>البطولات</span>
          </div>
          <h1 data-aos="fade-up">بطولات InstaPadel</h1>
          <p className="results-count">
            <b>{tournaments.length}</b> بطولة
          </p>
        </div>
      </section>

      <section className="courts-section section" id="tournaments">
        <div className="courts-overlay" />
        <div className="container">
          <div className="row g-4">
            {tournaments.map((t) => (
              <div className="col-md-6 col-lg-4" key={t.id} data-aos="fade-up">
                <div className="tournament-list-card">
                  <span className={`tournament-list-badge ${t.status}`}>{STATUS_LABELS[t.status]}</span>
                  <h3>{t.name}</h3>
                  <div className="tournament-list-meta">
                    <span>
                      <i className="fa-solid fa-location-dot" /> {t.venue}
                    </span>
                    <span>
                      <i className="fa-solid fa-calendar-days" /> {new Date(t.date).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                    </span>
                    <span>
                      <i className="fa-solid fa-users"></i> {t.teams.length} / {t.maxTeams} فرق
                    </span>
                  </div>
                  <Link href={`/tournaments/${t.id}`} className="btn btn-accent btn-sm btn-block">
                    التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link href="/tournaments/create" className="btn btn-ghost">
              أنشئ بطولتك <i className="fa-solid fa-arrow-left" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
