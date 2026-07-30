import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, whatsappOtps } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    // Normalizing inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Check if user already exists and is verified
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, normalizedEmail), eq(users.phone, normalizedPhone)))
      .then(res => res[0]);

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ 
        success: false, 
        error: "An account with this email or phone number is already registered and verified. Please login instead." 
      }, { status: 400 });
    }

    let userId: number;
    let dbUser = existingUser;

    if (!dbUser) {
      // Create unverified user
      const inserted = await db.insert(users).values({
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        phone: normalizedPhone,
        isVerified: false,
        role: "user",
      }).returning();
      dbUser = inserted[0];
      userId = inserted[0].id;
    } else {
      // Update unverified user details in case they re-registered
      await db.update(users).set({
        name: name.trim(),
        password: password,
        phone: normalizedPhone,
      }).where(eq(users.id, dbUser.id));
      userId = dbUser.id;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await db.insert(whatsappOtps).values({
      phone: normalizedPhone,
      otp: otp,
    });

    // Mock/Placeholder API call for UltraMsg or Twilio from "01159055625"
    const senderNumber = "01159055625";
    console.log(`
=========================================
WHATSAPP OTP SIMULATION
Sender: ${senderNumber}
Recipient: ${normalizedPhone}
Message: "Your AURÉLIA verification code is: ${otp}. Do not share this OTP."
API Placeholder details: 
- Service: UltraMsg / Twilio
- Request Payload: { sender: "${senderNumber}", to: "${normalizedPhone}", body: "Your AURÉLIA verification code is: ${otp}" }
=========================================
    `);

    // We can also simulate calling an actual external API using fetch if configured, 
    // but we use this robust logging structure to guarantee it doesn't crash on network.
    
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully via WhatsApp placeholder.",
      userId: userId,
      phone: normalizedPhone,
      otp: otp, // Returning OTP directly for beautiful simulation and smooth testing!
    });
  } catch (error: any) {
    console.error("Error in register API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
