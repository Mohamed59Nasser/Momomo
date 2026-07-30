import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { usernameOrEmail, password } = await req.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ success: false, error: "Please enter both credentials." }, { status: 400 });
    }

    const trimmedInput = usernameOrEmail.trim();
    const trimmedPass = password.trim();

    // Check special admin credentials
    const isAdminCredentials = 
      (trimmedInput === "Mohamed Nasser" || trimmedInput === "mohamed@aurelia.com" || trimmedInput === "admin@aurelia.com") && 
      trimmedPass === "Mohamed59*";

    if (isAdminCredentials) {
      // Find or create admin user in PostgreSQL
      let adminUser = await db
        .select()
        .from(users)
        .where(or(eq(users.name, "Mohamed Nasser"), eq(users.email, "mohamed@aurelia.com")))
        .then(res => res[0]);

      if (!adminUser) {
        const inserted = await db
          .insert(users)
          .values({
            name: "Mohamed Nasser",
            email: "mohamed@aurelia.com",
            password: "Mohamed59*",
            phone: "01159055625",
            address: "Zamalek, Cairo, Egypt",
            locationCoords: "30.0596,31.2241",
            isVerified: true,
            role: "admin",
          })
          .returning();
        adminUser = inserted[0];
      } else if (adminUser.role !== "admin") {
        // Enforce admin role if it's him
        await db.update(users).set({ role: "admin", isVerified: true }).where(eq(users.id, adminUser.id));
        adminUser.role = "admin";
        adminUser.isVerified = true;
      }

      return NextResponse.json({
        success: true,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.phone,
          address: adminUser.address,
          locationCoords: adminUser.locationCoords,
          isVerified: adminUser.isVerified,
          role: adminUser.role,
        },
      });
    }

    // Normal User Login
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, trimmedInput), eq(users.name, trimmedInput)))
      .then(res => res[0]);

    if (!existingUser) {
      return NextResponse.json({ success: false, error: "User not found. Please register." }, { status: 404 });
    }

    if (existingUser.password !== trimmedPass) {
      return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        address: existingUser.address,
        locationCoords: existingUser.locationCoords,
        isVerified: existingUser.isVerified,
        role: existingUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error in login API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
