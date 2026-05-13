import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const women = await prisma.category.upsert({
    where: { slug: 'women' },
    create: { name: 'Women', slug: 'women', sortOrder: 1 },
    update: {},
  })
  const men = await prisma.category.upsert({
    where: { slug: 'men' },
    create: { name: 'Men', slug: 'men', sortOrder: 2 },
    update: {},
  })
  await prisma.category.upsert({
    where: { slug: 'women-ethnic' },
    create: { name: 'Ethnic Wear', slug: 'women-ethnic', parentId: women.id },
    update: {},
  })
  await prisma.category.upsert({
    where: { slug: 'men-formals' },
    create: { name: 'Formals', slug: 'men-formals', parentId: men.id },
    update: {},
  })

  // Seed brands
  const brands = [
    { name: 'Vero Moda', slug: 'vero-moda' },
    { name: 'Allen Solly', slug: 'allen-solly' },
    { name: 'AND', slug: 'and' },
    { name: 'W', slug: 'w' },
    { name: 'Van Heusen', slug: 'van-heusen' },
  ]
  for (const b of brands) {
    await prisma.brand.upsert({ where: { slug: b.slug }, create: b, update: {} })
  }

  // Seed FC tier rules
  const tierRules = [
    { tier: 'classic', minSpend: 0, pointsRate: 1 },
    { tier: 'silver', minSpend: 10000, pointsRate: 2 },
    { tier: 'gold', minSpend: 30000, pointsRate: 3 },
    { tier: 'platinum', minSpend: 75000, pointsRate: 5 },
  ]
  for (const rule of tierRules) {
    await prisma.fCTierRule.upsert({ where: { tier: rule.tier }, create: rule, update: rule })
  }

  // Seed sample products
  const veroModa = await prisma.brand.findUnique({ where: { slug: 'vero-moda' } })
  const womenCat = await prisma.category.findUnique({ where: { slug: 'women' } })

  if (veroModa && womenCat) {
    const product = await prisma.product.upsert({
      where: { slug: 'vero-moda-floral-kurti-001' },
      create: {
        name: 'Floral Print Straight Kurti',
        slug: 'vero-moda-floral-kurti-001',
        description: 'Beautiful floral print straight kurti perfect for casual outings.',
        brandId: veroModa.id,
        categoryId: womenCat.id,
        mrp: 2499,
        sellingPrice: 1799,
        thumbnailUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4545?w=400',
        tags: JSON.stringify(['kurti', 'ethnic', 'floral', 'casual']),
        status: 'active',
        isFeatured: true,
      },
      update: {},
    })

    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    for (const size of sizes) {
      await prisma.productVariant.upsert({
        where: { sku: `VM-FLORAL-${size}` },
        create: { productId: product.id, sku: `VM-FLORAL-${size}`, size, colour: 'Blue', stock: 25, status: 'healthy' },
        update: {},
      })
    }
  }

  // Seed a demo banner
  await prisma.banner.upsert({
    where: { id: 'demo-banner-1' },
    create: {
      id: 'demo-banner-1',
      name: 'End of Season Sale',
      page: 'homepage',
      position: 'hero_carousel',
      desktopImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      mobileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      headline: 'End of Season Sale — Up to 60% Off',
      ctaLabel: 'Shop Now',
      ctaUrl: '/sale',
      startDate: new Date(),
      evergreen: true,
      priority: 1,
      status: 'active',
    },
    update: {},
  })

  // Seed demo coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME200' },
    create: {
      code: 'WELCOME200',
      type: 'flat',
      value: 200,
      minOrderValue: 999,
      usageLimit: 1000,
      userLimit: 1,
      startDate: new Date(),
      expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      applicableTo: 'new_users',
      status: 'active',
    },
    update: {},
  })

  console.log('✅ Seed complete')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
