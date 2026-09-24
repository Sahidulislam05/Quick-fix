const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL সেট করা নেই।");
}

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ""),
} as const;
