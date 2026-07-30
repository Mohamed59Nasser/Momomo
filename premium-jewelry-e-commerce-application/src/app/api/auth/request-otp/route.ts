import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, whatsappOtps } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { phone, userId } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required." }, { status: 400 });
    }

    const normalizedPhone = phone.trim();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await db.insert(whatsappOtps).values({
      phone: normalizedPhone,
      otp: otp,
    });

    if (userId) {
      // Set user as unverified for the new phone number
      await db.update(users).set({
        phone: normalizedPhone,
        isVerified: false,
      }).where(eq(users.id, Number(userId)));
    }

    // Mock/Placeholder log
    const senderNumber = "01159055625";
    console.log(`
=========================================
WHATSAPP OTP TRIGGER (PHONE UPDATE/RESEND)
Sender: ${senderNumber}
Recipient: ${normalizedPhone}
Message: "Your AURÉLIA verification code is: ${otp}."
=========================================
    `);

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent to your WhatsApp.",
      phone: normalizedPhone,
      otp: otp,
    });
  } catch (error: any) {
    console.error("Error in request-otp API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
