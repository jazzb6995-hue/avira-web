import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding AVIRA database...");

  // Categories
  const cats = [
    { name: "Earrings", slug: "earrings", description: "From delicate studs to statement drops.", sortOrder: 1 },
    { name: "Bracelets", slug: "bracelets", description: "Stacks, bangles, and delicate chains.", sortOrder: 2 },
    { name: "Necklaces", slug: "necklaces", description: "Layering pieces and statement pendants.", sortOrder: 3 },
    { name: "Rings", slug: "rings", description: "Stackable bands and elegant solitaires.", sortOrder: 4 },
    { name: "Sets", slug: "sets", description: "Curated matching sets for effortless styling.", sortOrder: 5 },
  ];

  for (const cat of cats) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, active: true },
    });
  }

  // Tags
  const tags = ["minimal", "statement", "everyday", "gifting", "festive", "office", "casual", "trending"];
  for (const name of tags) {
    await db.tag.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Site settings
  const settings = [
    { key: "site_name", value: "AVIRA" },
    { key: "site_tagline", value: "Little Things. Beautiful You." },
    { key: "free_shipping_threshold", value: "500" },
    { key: "flat_shipping_rate", value: "49" },
    { key: "first_order_discount_pct", value: "10" },
    { key: "whatsapp_number", value: "919XXXXXXXXX" },
  ];

  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // Admin user (change password before production!)
  const { default: bcrypt } = await import("bcryptjs");
  const adminHash = await bcrypt.hash("Admin@Avira2026!", 12);
  await db.adminUser.upsert({
    where: { email: "admin@avira.in" },
    update: {},
    create: {
      email: "admin@avira.in",
      passwordHash: adminHash,
      name: "AVIRA Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
