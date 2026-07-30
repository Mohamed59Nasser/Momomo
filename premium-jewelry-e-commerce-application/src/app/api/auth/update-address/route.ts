import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId, address, locationCoords, phone } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (address !== undefined) updateData.address = address.trim();
    if (locationCoords !== undefined) updateData.locationCoords = locationCoords.trim();
    if (phone !== undefined) updateData.phone = phone.trim();

    const updatedUsers = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, Number(userId)))
      .returning();

    if (updatedUsers.length === 0) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Address and delivery settings updated successfully.",
      user: {
        id: updatedUsers[0].id,
        name: updatedUsers[0].name,
        email: updatedUsers[0].email,
        phone: updatedUsers[0].phone,
        address: updatedUsers[0].address,
        locationCoords: updatedUsers[0].locationCoords,
        isVerified: updatedUsers[0].isVerified,
        role: updatedUsers[0].role,
      },
    });
  } catch (error: any) {
    console.error("Error in update-address API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
