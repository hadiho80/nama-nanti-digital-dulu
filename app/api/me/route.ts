import { NextResponse } from "next/server";
import { getSessionContext } from "@/app/api/_utils";

export async function GET() {
  const { user, profile } = await getSessionContext();

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    profile
  });
}
