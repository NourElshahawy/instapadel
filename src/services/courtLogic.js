export function buildNextSevenDays() {
  const days = [];
  const dowNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربع", "الخميس", "الجمعة", "السبت"];
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      dow: dowNames[d.getDay()],
      dom: String(d.getDate()),
      month: monthNames[d.getMonth()],
    });
  }
  return days;
}

export function buildDefaultSlots(basePrice) {
  const hours = ["12:00 م", "1:00 م", "2:00 م", "3:00 م", "4:00 م", "5:00 م", "6:00 م", "7:00 م", "8:00 م", "9:00 م", "10:00 م", "11:00 م"];
  return hours.map((start, i) => ({
    start,
    end: hours[i + 1] || "12:00 ص",
    price: basePrice,
    status: "available",
  }));
}