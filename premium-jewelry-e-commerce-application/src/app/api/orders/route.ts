import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, Number(userId)))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, items, totalPrice, address, locationCoords } = await req.json();

    if (!userId || !items || !totalPrice || !address) {
      return NextResponse.json({ success: false, error: "Missing required order details." }, { status: 400 });
    }

    const inserted = await db
      .insert(orders)
      .values({
        userId: Number(userId),
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalPrice: Number(totalPrice),
        address: address.trim(),
        locationCoords: locationCoords ? locationCoords.trim() : null,
        shippingAgent: "Egypt Post (البريد المصري)",
        status: "Processing",
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: inserted[0],
    });
  } catch (error: any) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
