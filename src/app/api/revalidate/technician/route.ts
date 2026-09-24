import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { revalidated: false, message: "id missing" },
      { status: 400 },
    );
  }

  revalidatePath(`/technicians/${id}`);
  return NextResponse.json({ revalidated: true });
}
