import fs from "fs/promises";
import path from "path";

const isServer = typeof window === "undefined";

export async function fetchJson(relativePath) {
  if (isServer) {
    // Server Component / Server Action → اقرأ من الملف مباشرة
    const filePath = path.join(process.cwd(), "public", "api", relativePath);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  }

  // Client Component → fetch عادي من المتصفح
  const res = await fetch(`/api/${relativePath}`);
  if (!res.ok) throw new Error(`Failed to fetch ${relativePath}`);
  return res.json();
}
