import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Review } from '../models/Review.js';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { categoriesData } from './categoriesData.js';
import { generateProducts } from './productsData.js';
import { USER_ROLES, DISCOUNT_TYPES } from '../constants/index.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // 1. Seed Users (Admin + Demo Customer)
    console.log('[Seed] Seeding Users...');
    const adminUser = new User({
      name: 'Aurelius Executive',
      email: 'admin@example.com',
      passwordHash: 'Admin@123', // Will be hashed by pre-save hook
      phone: '+91 98765 43210',
      role: USER_ROLES.SUPER_ADMIN || USER_ROLES.ADMIN,
      addresses: [
        {
          name: 'Aurelius Headquarters',
          phone: '+91 98765 43210',
          addressLine1: '402, High Street Phoenix',
          addressLine2: 'Senapati Bapat Marg, Lower Parel',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400013',
          country: 'India',
          isDefault: true,
        },
      ],
    });
    await adminUser.save();

    const customerUser = new User({
      name: 'Karthick Ramanathan',
      email: 'customer@aurelius.com',
      passwordHash: 'Customer@123456', // Will be hashed by pre-save hook
      phone: '+91 98840 12345',
      role: USER_ROLES.CUSTOMER,
      addresses: [
        {
          name: 'Karthick Ramanathan',
          phone: '+91 98840 12345',
          addressLine1: 'Villa 12, Palm Meadows Boulevard',
          addressLine2: 'Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560066',
          country: 'India',
          isDefault: true,
        },
        {
          name: 'Karthick (Office)',
          phone: '+91 98840 12345',
          addressLine1: 'Level 5, Prestige Tech Cloud Park',
          addressLine2: 'Hebbal',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560024',
          country: 'India',
          isDefault: false,
        },
      ],
    });
    await customerUser.save();
    console.log('[Seed] Users seeded successfully.');

    // 2. Seed Categories (Parent categories first, then subcategories)
    console.log('[Seed] Seeding Categories...');
    const categoryMap = {};

    // First insert top-level categories
    const topCategories = categoriesData.filter((c) => !c.parentSlug);
    for (const cat of topCategories) {
      const created = await Category.create({
        name: cat.name,
        slug: cat.slug,
        parentCategory: null,
        image: cat.image,
        description: cat.description,
        sortOrder: cat.sortOrder,
      });
      categoryMap[cat.slug] = created._id;
    }

    // Now insert subcategories linking parent ids
    const subCategories = categoriesData.filter((c) => c.parentSlug);
    for (const sub of subCategories) {
      const created = await Category.create({
        name: sub.name,
        slug: sub.slug,
        parentCategory: categoryMap[sub.parentSlug],
        image: sub.image,
        description: sub.description,
        sortOrder: sub.sortOrder,
      });
      categoryMap[sub.slug] = created._id;
    }
    console.log(`[Seed] Seeded ${Object.keys(categoryMap).length} categories.`);

    // 3. Seed Products (80 full products with complete variant matrices)
    console.log('[Seed] Generating and seeding 80 products with variants...');
    const productsData = generateProducts(categoryMap);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Inserted ${createdProducts.length} products successfully.`);

    // 4. Seed Coupons
    console.log('[Seed] Seeding Coupons...');
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        discountType: DISCOUNT_TYPES.PERCENTAGE,
        discountValue: 10,
        minOrderAmount: 999,
        maxDiscount: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 5000,
        isActive: true,
      },
      {
        code: 'FASHION20',
        discountType: DISCOUNT_TYPES.PERCENTAGE,
        discountValue: 20,
        minOrderAmount: 1999,
        maxDiscount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 2000,
        isActive: true,
      },
      {
        code: 'LUXE500',
        discountType: DISCOUNT_TYPES.FIXED,
        discountValue: 500,
        minOrderAmount: 2999,
        maxDiscount: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        isActive: true,
      },
    ]);
    console.log('[Seed] Seeded 3 active coupons.');

    // 5. Seed Reviews for first few products
    console.log('[Seed] Seeding initial customer reviews...');
    const sampleReviews = [
      {
        productId: createdProducts[0]._id,
        userId: customerUser._id,
        rating: 5,
        title: 'Exceptional drape and superior fabric quality!',
        comment: 'The cotton handfeel is definitely up there with luxury designer brands. Zero shrinkage after three washes. Will buy more colors.',
        images: [createdProducts[0].images[0]],
        verifiedPurchase: true,
        likes: 18,
      },
      {
        productId: createdProducts[0]._id,
        userId: customerUser._id,
        rating: 4,
        title: 'Great fit, true to size',
        comment: 'Looks sharp paired under a casual blazer. Slightly snug on shoulders, so consider sizing up if you prefer an oversized look.',
        images: [],
        verifiedPurchase: true,
        likes: 6,
      },
      {
        productId: createdProducts[1]._id,
        userId: customerUser._id,
        rating: 5,
        title: 'Crisp oxford weave, highly recommend',
        comment: 'Mother-of-pearl buttons are gorgeous. Stays crisp all day long.',
        images: [createdProducts[1].images[0]],
        verifiedPurchase: true,
        likes: 12,
      },
    ];
    await Review.insertMany(sampleReviews);
    console.log('[Seed] Seeded initial reviews.');

    console.log('\n========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Email:    admin@example.com');
    console.log('Admin Password: Admin@123');
    console.log('Customer Email: customer@aurelius.com');
    console.log('Customer Pass:  Customer@123456');
    console.log('Products Count: ' + createdProducts.length);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
