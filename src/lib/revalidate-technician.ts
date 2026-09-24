export async function revalidateTechnicianPage(technicianId: string) {
  try {
    await fetch("/api/revalidate/technician", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: technicianId }),
    });
  } catch {}
}
