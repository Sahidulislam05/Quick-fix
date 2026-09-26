export async function revalidatePublicPages() {
  try {
    await fetch("/api/revalidate/public", { method: "POST" });
  } catch {}
}
