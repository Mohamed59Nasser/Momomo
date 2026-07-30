import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

export async function GET() {
  try {
    // List all users
    const allUsers = await db.select().from(users).orderBy(users.id);
    return NextResponse.json({ success: true, users: allUsers });
  } catch (error: any) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, email, makeAdmin } = await req.json();

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: "User ID or Email is required" }, { status: 400 });
    }

    const newRole = makeAdmin ? "admin" : "user";
    let updated;

    if (userId) {
      updated = await db
        .update(users)
        .set({ role: newRole })
        .where(eq(users.id, Number(userId)))
        .returning();
    } else {
      updated = await db
        .update(users)
        .set({ role: newRole })
        .where(eq(users.email, email.trim().toLowerCase()))
        .returning();
    }

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated user role to ${newRole}`,
      user: updated[0],
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
