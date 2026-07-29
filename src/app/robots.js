export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/owner", "/api"],
    },
    sitemap: "https://instapadel.tech/sitemap.xml",
  };
}
