import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DakardyFashions...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dakardyfashions.com" },
    update: {},
    create: {
      name: "Dakardy Admin",
      email: "admin@dakardyfashions.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("Admin user created:", admin.email);

  // Create delivery methods
  const standard = await prisma.deliveryMethod.upsert({
    where: { code: "standard" },
    update: {},
    create: {
      name: "Standard Delivery",
      code: "standard",
      description: "5-7 business days",
      price: 99.0,
      estimatedDays: "5-7",
      isActive: true,
    },
  });

  const express = await prisma.deliveryMethod.upsert({
    where: { code: "express" },
    update: {},
    create: {
      name: "Express Delivery",
      code: "express",
      description: "1-2 business days",
      price: 199.0,
      estimatedDays: "1-2",
      isActive: true,
    },
  });
  console.log("Delivery methods created");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "men" },
      update: {},
      create: { name: "Men", slug: "men", description: "Men's fashion and clothing" },
    }),
    prisma.category.upsert({
      where: { slug: "women" },
      update: {},
      create: { name: "Women", slug: "women", description: "Women's fashion and clothing" },
    }),
    prisma.category.upsert({
      where: { slug: "kids" },
      update: {},
      create: { name: "Kids", slug: "kids", description: "Kids' fashion and clothing" },
    }),
    prisma.category.upsert({
      where: { slug: "shoes" },
      update: {},
      create: { name: "Shoes", slug: "shoes", description: "Footwear for all" },
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      update: {},
      create: { name: "Bags", slug: "bags", description: "Handbags, backpacks and more" },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "Accessories", slug: "accessories", description: "Belts, hats, scarves and more" },
    }),
    prisma.category.upsert({
      where: { slug: "jewelry" },
      update: {},
      create: { name: "Jewelry", slug: "jewelry", description: "Necklaces, earrings, bracelets" },
    }),
  ]);
  console.log("Categories created");

  const [men, women, kids, shoes, bags, accessories, jewelry] = categories;

  // Create sample products
  const products = [
    {
      name: "Classic Fit Blazer",
      slug: "classic-fit-blazer",
      description: "A timeless tailored blazer crafted from premium wool-blend fabric. Perfect for both formal occasions and smart-casual styling.",
      basePrice: 1899.0,
      images: ["/images/products/blazer-1.jpg", "/images/products/blazer-2.jpg"],
      isFeatured: true,
      categoryId: men.id,
      variants: [
        { size: "S", color: "Navy", colorHex: "#1B2A4A", sku: "BLZ-NAV-S", stock: 15, price: 1899.0 },
        { size: "M", color: "Navy", colorHex: "#1B2A4A", sku: "BLZ-NAV-M", stock: 20, price: 1899.0 },
        { size: "L", color: "Navy", colorHex: "#1B2A4A", sku: "BLZ-NAV-L", stock: 18, price: 1899.0 },
        { size: "XL", color: "Navy", colorHex: "#1B2A4A", sku: "BLZ-NAV-XL", stock: 10, price: 1899.0 },
        { size: "M", color: "Charcoal", colorHex: "#36454F", sku: "BLZ-CHA-M", stock: 12, price: 1999.0 },
        { size: "L", color: "Charcoal", colorHex: "#36454F", sku: "BLZ-CHA-L", stock: 14, price: 1999.0 },
      ],
    },
    {
      name: "Slim Fit Chinos",
      slug: "slim-fit-chinos",
      description: "Modern slim-fit chinos in stretch cotton twill. Comfortable and versatile for everyday wear.",
      basePrice: 699.0,
      images: ["/images/products/chinos-1.jpg", "/images/products/chinos-2.jpg"],
      isFeatured: true,
      categoryId: men.id,
      variants: [
        { size: "30", color: "Khaki", colorHex: "#C3B091", sku: "CHN-KHK-30", stock: 25, price: null },
        { size: "32", color: "Khaki", colorHex: "#C3B091", sku: "CHN-KHK-32", stock: 30, price: null },
        { size: "34", color: "Khaki", colorHex: "#C3B091", sku: "CHN-KHK-34", stock: 22, price: null },
        { size: "32", color: "Olive", colorHex: "#556B2F", sku: "CHN-OLV-32", stock: 18, price: null },
        { size: "34", color: "Olive", colorHex: "#556B2F", sku: "CHN-OLV-34", stock: 15, price: null },
      ],
    },
    {
      name: "Linen Summer Dress",
      slug: "linen-summer-dress",
      description: "Effortlessly elegant linen dress with a relaxed fit. Ideal for warm summer days. Features a v-neckline and adjustable waist tie.",
      basePrice: 899.0,
      images: ["/images/products/dress-1.jpg", "/images/products/dress-2.jpg"],
      isFeatured: true,
      categoryId: women.id,
      variants: [
        { size: "XS", color: "White", colorHex: "#FFFFFF", sku: "DRS-WHT-XS", stock: 10, price: null },
        { size: "S", color: "White", colorHex: "#FFFFFF", sku: "DRS-WHT-S", stock: 15, price: null },
        { size: "M", color: "White", colorHex: "#FFFFFF", sku: "DRS-WHT-M", stock: 20, price: null },
        { size: "L", color: "White", colorHex: "#FFFFFF", sku: "DRS-WHT-L", stock: 12, price: null },
        { size: "S", color: "Sage", colorHex: "#B2AC88", sku: "DRS-SGE-S", stock: 8, price: 949.0 },
        { size: "M", color: "Sage", colorHex: "#B2AC88", sku: "DRS-SGE-M", stock: 14, price: 949.0 },
      ],
    },
    {
      name: "Tailored Trousers",
      slug: "tailored-trousers",
      description: "High-waisted tailored trousers with a wide-leg cut. Crafted from a luxurious crepe fabric for a polished look.",
      basePrice: 1099.0,
      images: ["/images/products/trousers-1.jpg", "/images/products/trousers-2.jpg"],
      isFeatured: false,
      categoryId: women.id,
      variants: [
        { size: "XS", color: "Black", colorHex: "#000000", sku: "TRS-BLK-XS", stock: 12, price: null },
        { size: "S", color: "Black", colorHex: "#000000", sku: "TRS-BLK-S", stock: 18, price: null },
        { size: "M", color: "Black", colorHex: "#000000", sku: "TRS-BLK-M", stock: 22, price: null },
        { size: "L", color: "Black", colorHex: "#000000", sku: "TRS-BLK-L", stock: 10, price: null },
      ],
    },
    {
      name: "Printed Cotton Tee",
      slug: "printed-cotton-tee",
      description: "Soft 100% organic cotton t-shirt with a fun graphic print. Pre-shrunk and built to last.",
      basePrice: 349.0,
      images: ["/images/products/tee-1.jpg", "/images/products/tee-2.jpg"],
      isFeatured: false,
      categoryId: kids.id,
      variants: [
        { size: "2-3Y", color: "Yellow", colorHex: "#FFD700", sku: "TEE-YEL-2", stock: 20, price: null },
        { size: "4-5Y", color: "Yellow", colorHex: "#FFD700", sku: "TEE-YEL-4", stock: 25, price: null },
        { size: "6-7Y", color: "Yellow", colorHex: "#FFD700", sku: "TEE-YEL-6", stock: 18, price: null },
        { size: "4-5Y", color: "Sky Blue", colorHex: "#87CEEB", sku: "TEE-SKY-4", stock: 22, price: null },
        { size: "6-7Y", color: "Sky Blue", colorHex: "#87CEEB", sku: "TEE-SKY-6", stock: 15, price: null },
      ],
    },
    {
      name: "Denim Jacket",
      slug: "denim-jacket",
      description: "Classic denim jacket with a modern twist. Features a relaxed fit, chest pockets, and adjustable button cuffs.",
      basePrice: 1299.0,
      images: ["/images/products/jacket-1.jpg", "/images/products/jacket-2.jpg"],
      isFeatured: true,
      categoryId: men.id,
      variants: [
        { size: "S", color: "Light Wash", colorHex: "#5D7B9E", sku: "DJK-LW-S", stock: 10, price: null },
        { size: "M", color: "Light Wash", colorHex: "#5D7B9E", sku: "DJK-LW-M", stock: 15, price: null },
        { size: "L", color: "Light Wash", colorHex: "#5D7B9E", sku: "DJK-LW-L", stock: 20, price: null },
        { size: "XL", color: "Light Wash", colorHex: "#5D7B9E", sku: "DJK-LW-XL", stock: 8, price: null },
      ],
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      description: "Genuine leather crossbody bag with an adjustable strap and multiple compartments. Compact yet spacious enough for daily essentials.",
      basePrice: 799.0,
      images: ["/images/products/bag-1.jpg", "/images/products/bag-2.jpg"],
      isFeatured: true,
      categoryId: bags.id,
      variants: [
        { size: "One Size", color: "Tan", colorHex: "#D2B48C", sku: "BAG-TAN-OS", stock: 25, price: null },
        { size: "One Size", color: "Black", colorHex: "#000000", sku: "BAG-BLK-OS", stock: 20, price: null },
        { size: "One Size", color: "Burgundy", colorHex: "#800020", sku: "BAG-BRG-OS", stock: 12, price: null },
      ],
    },
    {
      name: "Canvas Sneakers",
      slug: "canvas-sneakers",
      description: "Lightweight canvas sneakers with a cushioned sole. A versatile staple for any casual wardrobe.",
      basePrice: 549.0,
      images: ["/images/products/sneakers-1.jpg", "/images/products/sneakers-2.jpg"],
      isFeatured: false,
      categoryId: shoes.id,
      variants: [
        { size: "EU 39", color: "White", colorHex: "#FFFFFF", sku: "SNK-WHT-39", stock: 30, price: null },
        { size: "EU 40", color: "White", colorHex: "#FFFFFF", sku: "SNK-WHT-40", stock: 35, price: null },
        { size: "EU 41", color: "White", colorHex: "#FFFFFF", sku: "SNK-WHT-41", stock: 28, price: null },
        { size: "EU 42", color: "White", colorHex: "#FFFFFF", sku: "SNK-WHT-42", stock: 22, price: null },
        { size: "EU 43", color: "White", colorHex: "#FFFFFF", sku: "SNK-WHT-43", stock: 15, price: null },
        { size: "EU 40", color: "Black", colorHex: "#000000", sku: "SNK-BLK-40", stock: 20, price: null },
        { size: "EU 41", color: "Black", colorHex: "#000000", sku: "SNK-BLK-41", stock: 18, price: null },
        { size: "EU 42", color: "Black", colorHex: "#000000", sku: "SNK-BLK-42", stock: 14, price: null },
      ],
    },
    {
      name: "Leather Loafers",
      slug: "leather-loafers",
      description: "Premium leather loafers with a sleek silhouette. Suitable for both office and weekend wear.",
      basePrice: 1299.0,
      images: ["/images/products/loafers-1.jpg", "/images/products/loafers-2.jpg"],
      isFeatured: true,
      categoryId: shoes.id,
      variants: [
        { size: "EU 39", color: "Brown", colorHex: "#8B4513", sku: "LOF-BRN-39", stock: 8, price: null },
        { size: "EU 40", color: "Brown", colorHex: "#8B4513", sku: "LOF-BRN-40", stock: 12, price: null },
        { size: "EU 41", color: "Brown", colorHex: "#8B4513", sku: "LOF-BRN-41", stock: 15, price: null },
        { size: "EU 42", color: "Brown", colorHex: "#8B4513", sku: "LOF-BRN-42", stock: 10, price: null },
        { size: "EU 40", color: "Black", colorHex: "#000000", sku: "LOF-BLK-40", stock: 10, price: null },
        { size: "EU 41", color: "Black", colorHex: "#000000", sku: "LOF-BLK-41", stock: 12, price: null },
      ],
    },
    {
      name: "Gold Hoop Earrings",
      slug: "gold-hoop-earrings",
      description: "Elegant 18k gold-plated hoop earrings. Lightweight and comfortable for all-day wear.",
      basePrice: 299.0,
      images: ["/images/products/hoops-1.jpg", "/images/products/hoops-2.jpg"],
      isFeatured: false,
      categoryId: jewelry.id,
      variants: [
        { size: "Small", color: "Gold", colorHex: "#FFD700", sku: "HOO-GLD-SM", stock: 50, price: null },
        { size: "Medium", color: "Gold", colorHex: "#FFD700", sku: "HOO-GLD-MD", stock: 40, price: null },
        { size: "Large", color: "Gold", colorHex: "#FFD700", sku: "HOO-GLD-LG", stock: 30, price: null },
      ],
    },
    {
      name: "Silk Scarf",
      slug: "silk-scarf",
      description: "Luxurious 100% silk scarf with a hand-rolled hem. Features an exclusive Dakardy print.",
      basePrice: 449.0,
      images: ["/images/products/scarf-1.jpg", "/images/products/scarf-2.jpg"],
      isFeatured: false,
      categoryId: accessories.id,
      variants: [
        { size: "90x90cm", color: "Multicolor", colorHex: "#C9A84C", sku: "SCF-MC-90", stock: 18, price: null },
        { size: "70x70cm", color: "Multicolor", colorHex: "#C9A84C", sku: "SCF-MC-70", stock: 22, price: null },
      ],
    },
    {
      name: "Leather Belt",
      slug: "leather-belt",
      description: "Genuine leather belt with a brushed metal buckle. A timeless accessory that pairs with any outfit.",
      basePrice: 399.0,
      images: ["/images/products/belt-1.jpg", "/images/products/belt-2.jpg"],
      isFeatured: false,
      categoryId: accessories.id,
      variants: [
        { size: "90cm", color: "Black", colorHex: "#000000", sku: "BLT-BLK-90", stock: 30, price: null },
        { size: "100cm", color: "Black", colorHex: "#000000", sku: "BLT-BLK-100", stock: 35, price: null },
        { size: "90cm", color: "Brown", colorHex: "#8B4513", sku: "BLT-BRN-90", stock: 25, price: null },
        { size: "100cm", color: "Brown", colorHex: "#8B4513", sku: "BLT-BRN-100", stock: 28, price: null },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, ...productFields } = productData;

    const existingProduct = await prisma.product.findUnique({ where: { slug: productFields.slug } });
    if (existingProduct) continue;

    const product = await prisma.product.create({
      data: {
        ...productFields,
        basePrice: productFields.basePrice,
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            sku: v.sku,
            stock: v.stock,
            price: v.price,
          })),
        },
      },
    });
    console.log(`Product created: ${product.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
