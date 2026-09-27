const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL সেট করা নেই। প্রজেক্টের রুটে .env.local ফাইলে এটা যোগ করো।",
  );
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ""),
  siteUrl: siteUrl.replace(/\/+$/, ""),
} as const;
