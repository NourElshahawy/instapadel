export default function manifest() {
  return {
    name: "PadelGo — حجز ملاعب بادل جو",
    short_name: "PadelGo",
    description: "احجز ملعب بادل في المنصورة أونلاين في ثوانٍ",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1729",
    theme_color: "#3B82F6",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
