import CourtsListing from "@/_pages/courts/CourtsListing";
import { getAllCourts } from "@/services/courtService";

export const metadata = {
  title: "ملاعب وكورتات البادل في المنصورة | PadelGo",
  description: "قارن كل ملاعب وكورتات البادل في المنصورة، الأسعار، والمواعيد المتاحة فورًا. دور على أقرب نادي بادل من موقعك واحجز في ثوانٍ.",
  keywords: ["ملاعب البادل", "كورت بادل المنصورة", "نادي بادل المنصورة", "Padel Club Mansoura", "Padel Court Near Me"],
};

export default async function CourtsPage({ searchParams }) {
  const sp = await searchParams;
  const courts = await getAllCourts({ date: sp.date });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courts.map((court, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsActivityLocation",
        name: court.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: court.location,
          addressLocality: "المنصورة",
          addressCountry: "EG",
        },
        url: `https://instapadel.tech/booking/${court.slug}`,
        image: court.image?.startsWith("http") ? court.image : `https://instapadel.tech${court.image}`,
        ...(court.rating > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: court.rating,
            bestRating: 5,
          },
        }),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CourtsListing courts={courts} searchFilters={{ date: sp.date }} />
    </>
  );
}
