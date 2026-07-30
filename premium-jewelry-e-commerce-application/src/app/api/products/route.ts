import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, lte, and, isNotNull } from "drizzle-orm";

// Utility to convert Google Drive share links to direct view links
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return "";
  // Check for standard formats:
  // 1. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // 2. https://drive.google.com/open?id=FILE_ID
  // Direct Link format: https://lh3.googleusercontent.com/d/FILE_ID
  
  const driveRegex1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveRegex2 = /[?&]id=([a-zA-Z0-9_-]+)/;
  
  const match1 = url.match(driveRegex1);
  if (match1 && match1[1]) {
    return `https://lh3.googleusercontent.com/d/${match1[1]}`;
  }
  
  const match2 = url.match(driveRegex2);
  if (match2 && match2[1]) {
    return `https://lh3.googleusercontent.com/d/${match2[1]}`;
  }
  
  return url;
}

const DEFAULT_PRODUCTS = [
  {
    nameEn: "Crème de Lumière Necklace",
    nameAr: "قلادة كريم دي لوميير الذهبية",
    descriptionEn: "Exquisite 18k yellow gold pendant with a central solitaire diamond, resting on a soft silk-finish gold chain. Inspired by the radiant morning sun.",
    descriptionAr: "قلادة رائعة من الذهب الأصفر عيار 18 قيراطاً مع ألماسة سوليتير مركزية، مستوحاة من أشعة شمس الصباح المشرقة.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    imageScale: 100,
    categoryEn: "Fine Jewelry",
    categoryAr: "مجوهرات راقية",
    price: 32000,
    oldPrice: 38500,
    timerEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  {
    nameEn: "Timeless Elegance Earrings",
    nameAr: "أقراط الأناقة الخالدة",
    descriptionEn: "Gleaming 18k drop earrings adorned with premium Akoya pearls and cascading micro-pave diamonds.",
    descriptionAr: "أقراط متدلية براقة عيار 18 قيراطاً مزينة بلآلئ أكويا الفاخرة والألماس الصغير المتدلي.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    imageScale: 100,
    categoryEn: "Fine Jewelry",
    categoryAr: "مجوهرات راقية",
    price: 24500,
    oldPrice: null,
    timerEndsAt: null,
  },
  {
    nameEn: "Silk Glow Gold Bracelet",
    nameAr: "سوار توهج الحرير الذهبي",
    descriptionEn: "A magnificent flexible cuff crafted in signature satin-brushed gold, catching the light like liquid silk.",
    descriptionAr: "سوار رائع مرن مصنوع من الذهب المصقول المميز بلمسة الساتان الناعمة، يلمع كالحرير السائل.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
    imageScale: 100,
    categoryEn: "Fine Jewelry",
    categoryAr: "مجوهرات راقية",
    price: 18900,
    oldPrice: 22000,
    timerEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
  },
  {
    nameEn: "Radiance Solitaire Diamond Ring",
    nameAr: "خاتم سوليتير الألماس المشع",
    descriptionEn: "A magnificent round-cut 1.5 carat conflict-free diamond mounted on a sleek, high-polish platinum band.",
    descriptionAr: "خاتم ماسي دائري رائع بوزن 1.5 قيراط مثبت على شريط بلاتيني ناعم ومصقول للغاية.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    imageScale: 100,
    categoryEn: "Fine Jewelry",
    categoryAr: "مجوهرات راقية",
    price: 65000,
    oldPrice: null,
    timerEndsAt: null,
  },
  {
    nameEn: "Golden Cascade Choker",
    nameAr: "تشوكر الشلال الذهبي",
    descriptionEn: "An elegant, contemporary neck-hugging choker featuring cascading yellow-gold links that shimmer upon movement.",
    descriptionAr: "تشوكر أنيق وعصري يلتف حول العنق بتموجات ذهبية تلمع وتتحرك معك بانسيابية.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
    imageScale: 100,
    categoryEn: "Fine Jewelry",
    categoryAr: "مجوهرات راقية",
    price: 43000,
    oldPrice: 49000,
    timerEndsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
  {
    nameEn: "Royal Pearl Drop Earrings",
    nameAr: "أقراط قطرة اللؤلؤ الملكية",
    descriptionEn: "Exquisite drop earrings highlighting flawless South Sea golden pearls suspended from delicate diamond arches.",
    descriptionAr: "أقراط متدلية رائعة تبرز لآلئ بحر الجنوب الذهبية الخالية من العيوب والمعلقة من أقواس ماسية دقيقة.",
    imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=600&q=80",
    imageScale: 100,
    categoryEn: "Fine Jewelry",
    categoryAr: "مجوهرات راقية",
    price: 29000,
    oldPrice: null,
    timerEndsAt: null,
  },
];

export async function GET() {
  try {
    // 1. Check & Revert expired timers
    const now = new Date();
    // Find products whose timer has expired and oldPrice is set
    const expiredProducts = await db.select().from(products).where(
      and(
        isNotNull(products.timerEndsAt),
        lte(products.timerEndsAt, now)
      )
    );

    for (const prod of expiredProducts) {
      if (prod.oldPrice !== null) {
        // Revert to old price, then clear old price & timer
        await db
          .update(products)
          .set({
            price: prod.oldPrice,
            oldPrice: null,
            timerEndsAt: null,
          })
          .where(eq(products.id, prod.id));
      }
    }

    // 2. Fetch all products
    let allProducts = await db.select().from(products).orderBy(products.id);

    // 3. Seed if empty
    if (allProducts.length === 0) {
      for (const item of DEFAULT_PRODUCTS) {
        await db.insert(products).values(item);
      }
      allProducts = await db.select().from(products).orderBy(products.id);
    }

    return NextResponse.json({ success: true, products: allProducts });
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, nameEn, nameAr, descriptionEn, descriptionAr, imageUrl, imageScale, price, oldPrice, timerEndsInMinutes, categoryEn, categoryAr } = body;

    if (action === "create") {
      const inserted = await db.insert(products).values({
        nameEn: nameEn || "New Premium Jewelry",
        nameAr: nameAr || "مجوهرات راقية جديدة",
        descriptionEn: descriptionEn || "Luxury fine jewelry item.",
        descriptionAr: descriptionAr || "مجوهرات فاخرة.",
        imageUrl: imageUrl ? convertGoogleDriveUrl(imageUrl) : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
        imageScale: imageScale || 100,
        categoryEn: categoryEn || "Fine Jewelry",
        categoryAr: categoryAr || "مجوهرات راقية",
        price: Number(price) || 1000,
        oldPrice: oldPrice ? Number(oldPrice) : null,
        timerEndsAt: timerEndsInMinutes ? new Date(Date.now() + Number(timerEndsInMinutes) * 60 * 1000) : null,
      }).returning();

      return NextResponse.json({ success: true, product: inserted[0] });
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Product ID is required for update" }, { status: 400 });
      }

      const updateData: any = {};
      if (nameEn !== undefined) updateData.nameEn = nameEn;
      if (nameAr !== undefined) updateData.nameAr = nameAr;
      if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn;
      if (descriptionAr !== undefined) updateData.descriptionAr = descriptionAr;
      if (imageUrl !== undefined) updateData.imageUrl = convertGoogleDriveUrl(imageUrl);
      if (imageScale !== undefined) updateData.imageScale = Number(imageScale);
      if (categoryEn !== undefined) updateData.categoryEn = categoryEn;
      if (categoryAr !== undefined) updateData.categoryAr = categoryAr;
      
      if (price !== undefined) updateData.price = Number(price);
      if (oldPrice !== undefined) updateData.oldPrice = oldPrice ? Number(oldPrice) : null;
      
      if (timerEndsInMinutes !== undefined) {
        updateData.timerEndsAt = timerEndsInMinutes ? new Date(Date.now() + Number(timerEndsInMinutes) * 60 * 1000) : null;
      } else if (body.clearTimer) {
        updateData.timerEndsAt = null;
      }

      const updated = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      return NextResponse.json({ success: true, product: updated[0] });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Product ID is required for deletion" }, { status: 400 });
      }
      await db.delete(products).where(eq(products.id, id));
      return NextResponse.json({ success: true, message: "Product deleted successfully" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
