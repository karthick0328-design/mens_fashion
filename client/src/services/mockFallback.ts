import { ICategory } from '../types';

export const INITIAL_CATEGORIES: ICategory[] = [
  {
    _id: 'cat-tailoring-01',
    name: 'Bespoke Tailoring',
    slug: 'bespoke-tailoring',
    description: 'Masterfully structured wool suits, double-breasted blazers, and sartorial jackets.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    sortOrder: 1,
    isActive: true,
    productCount: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cat-shirts-02',
    name: 'Shirts & Evening Wear',
    slug: 'shirts-evening-wear',
    description: 'Crisp poplin dress shirts, tuxedo shirts, and Egyptian cotton essentials.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    sortOrder: 2,
    isActive: true,
    productCount: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cat-horology-03',
    name: 'Horology & Timepieces',
    slug: 'watches',
    description: 'Swiss-movement chronographs, automatic tourbillons, and heirloom dress watches.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    sortOrder: 3,
    isActive: true,
    productCount: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cat-footwear-04',
    name: 'Footwear & Brogues',
    slug: 'footwear',
    description: 'Handcrafted Goodyear-welted oxfords, Chelsea boots, and suede loafers.',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800',
    sortOrder: 4,
    isActive: true,
    productCount: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cat-accessories-05',
    name: 'Leather Goods & Ties',
    slug: 'accessories',
    description: 'Full-grain calfskin briefcases, silk jacquard neckties, and cufflink sets.',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
    sortOrder: 5,
    isActive: true,
    productCount: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cat-knitwear-06',
    name: 'Cashmere & Knitwear',
    slug: 'cashmere-knitwear',
    description: 'Grade-A Mongolian cashmere sweaters, merino rollnecks, and cardigans.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    sortOrder: 6,
    isActive: true,
    productCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_COLLECTIONS = [
  {
    id: 'col-aw26',
    tag: 'RUNWAY EDITORIAL',
    name: 'Autumn / Winter 2026 Collection',
    status: 'ACTIVE RUNWAY',
    description: 'Uncompromising Italian silhouettes rendered in heavy double-faced cashmere and virgin wool.',
    curatedDate: 'AUTUMN 2026',
    itemCount: 32,
  },
  {
    id: 'col-blacktie',
    tag: 'SOIREE CAPSULE',
    name: 'Black Tie & Midnight Gala',
    status: 'FEATURED',
    description: 'Bespoke silk faille lapels, grosgrain piping, and evening chronographs for black-tie affairs.',
    curatedDate: 'PERENNIAL',
    itemCount: 18,
  },
  {
    id: 'col-heritage',
    tag: 'HOROLOGY ARCHIVE',
    name: 'Atelier Horology Grand Complications',
    status: 'LIMITED RELEASE',
    description: 'Individually numbered timepieces with sapphire crystal backs and guilloché dials.',
    curatedDate: 'LIMITED EDITION',
    itemCount: 8,
  },
];

export const getMockCategories = (): ICategory[] => {
  try {
    const stored = localStorage.getItem('aurelius_mock_categories');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // Ignore error
  }
  return INITIAL_CATEGORIES;
};

export const saveMockCategory = (categoryData: Partial<ICategory>): ICategory => {
  const categories = getMockCategories();
  const newCat: ICategory = {
    _id: categoryData._id || 'cat-' + Date.now(),
    name: categoryData.name || 'New Department',
    slug: (categoryData.name || 'new').toLowerCase().replace(/[^a-z0-9]/g, '-'),
    description: categoryData.description || '',
    image: categoryData.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    parentCategory: categoryData.parentCategory || undefined,
    sortOrder: Number(categoryData.sortOrder) || 0,
    isActive: true,
    productCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newCat, ...categories];
  localStorage.setItem('aurelius_mock_categories', JSON.stringify(updated));
  return newCat;
};

export const updateMockCategory = (id: string, updates: Partial<ICategory>): ICategory => {
  const categories = getMockCategories();
  const index = categories.findIndex((c) => c._id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem('aurelius_mock_categories', JSON.stringify(categories));
    return categories[index];
  }
  return { ...INITIAL_CATEGORIES[0], ...updates };
};

export const deleteMockCategory = (id: string): void => {
  const categories = getMockCategories().filter((c) => c._id !== id);
  localStorage.setItem('aurelius_mock_categories', JSON.stringify(categories));
};

export const getMockDashboard = () => ({
  kpis: {
    totalRevenue: {
      value: 2485000,
      formatted: '₹24,85,000',
      change: '+18.4%',
      isPositive: true,
      comparison: 'vs last month',
    },
    totalOrders: {
      value: 428,
      formatted: '428',
      change: '+12.6%',
      isPositive: true,
      comparison: 'vs last month',
    },
    totalCustomers: {
      value: 1840,
      formatted: '1,840',
      change: '+8.2%',
      isPositive: true,
      comparison: 'vs last month',
    },
    activeProducts: {
      value: 80,
      formatted: '80',
      change: '100% in stock',
      isPositive: true,
      comparison: 'across 7 categories',
    },
  },
  salesChart: [
    { label: 'Day 1-5', revenue: 320000, orders: 58, aov: 5500 },
    { label: 'Day 6-10', revenue: 410000, orders: 72, aov: 5690 },
    { label: 'Day 11-15', revenue: 380000, orders: 64, aov: 5930 },
    { label: 'Day 16-20', revenue: 460000, orders: 81, aov: 5670 },
    { label: 'Day 21-25', revenue: 520000, orders: 92, aov: 5650 },
    { label: 'Day 26-30', revenue: 395000, orders: 61, aov: 6470 },
  ],
  recentOrders: [
    {
      id: 'AUR-82910',
      customer: 'Karthick Ramanathan',
      items: 'Cashmere Overcoat, Silk Tie',
      total: 24900,
      status: 'DELIVERED',
      date: 'Today, 2:45 PM',
    },
    {
      id: 'AUR-82909',
      customer: 'Vikramaditya S.',
      items: 'Swiss Automatic Chronograph',
      total: 48500,
      status: 'SHIPPED',
      date: 'Today, 11:20 AM',
    },
    {
      id: 'AUR-82908',
      customer: 'Alexander Wright',
      items: 'Goodyear Oxford Shoes',
      total: 16800,
      status: 'PROCESSING',
      date: 'Yesterday',
    },
  ],
  lowStockItems: [
    { sku: 'AUR-S-BLK-M', name: 'Pima Cotton Crew Neck', stock: 2, threshold: 5 },
    { sku: 'AUR-W-GLD-42', name: 'Heritage Tourbillon Chrono', stock: 1, threshold: 3 },
  ],
});

export const getMockProducts = () => [
  {
    _id: 'prod-01',
    title: 'Double-Breasted Wool Atelier Blazer',
    slug: 'double-breasted-wool-atelier-blazer',
    price: 34500,
    mrp: 42000,
    category: { _id: 'cat-tailoring-01', name: 'Bespoke Tailoring' },
    brand: 'AURELIUS ATELIER',
    rating: 4.9,
    ratingCount: 38,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    stock: 14,
    status: 'ACTIVE',
  },
  {
    _id: 'prod-02',
    title: 'Pure Mongolian Cashmere Rollneck',
    slug: 'pure-mongolian-cashmere-rollneck',
    price: 18900,
    mrp: 24000,
    category: { _id: 'cat-knitwear-06', name: 'Cashmere & Knitwear' },
    brand: 'AURELIUS ATELIER',
    rating: 4.8,
    ratingCount: 52,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
    stock: 22,
    status: 'ACTIVE',
  },
  {
    _id: 'prod-03',
    title: 'Heritage Automatic Chronograph Watch',
    slug: 'heritage-automatic-chronograph-watch',
    price: 58000,
    mrp: 72000,
    category: { _id: 'cat-horology-03', name: 'Horology & Timepieces' },
    brand: 'AURELIUS HOROLOGY',
    rating: 5.0,
    ratingCount: 24,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    stock: 5,
    status: 'ACTIVE',
  },
  {
    _id: 'prod-04',
    title: 'Goodyear Welted Calfskin Oxford Shoes',
    slug: 'goodyear-welted-calfskin-oxford-shoes',
    price: 26500,
    mrp: 32000,
    category: { _id: 'cat-footwear-04', name: 'Footwear & Brogues' },
    brand: 'AURELIUS CORDWAINER',
    rating: 4.9,
    ratingCount: 41,
    images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800'],
    stock: 18,
    status: 'ACTIVE',
  },
];

export const getMockInventory = () => [
  {
    sku: 'AUR-BLZ-NVY-40',
    title: 'Double-Breasted Wool Atelier Blazer',
    color: 'Midnight Navy',
    size: '40',
    stock: 6,
    threshold: 4,
    status: 'HEALTHY',
    price: 34500,
  },
  {
    sku: 'AUR-CSH-BLK-M',
    title: 'Pure Mongolian Cashmere Rollneck',
    color: 'Onyx Black',
    size: 'M',
    stock: 2,
    threshold: 5,
    status: 'LOW_STOCK',
    price: 18900,
  },
  {
    sku: 'AUR-HOR-SLV-42',
    title: 'Heritage Automatic Chronograph Watch',
    color: 'Sunburst Silver',
    size: '42mm',
    stock: 3,
    threshold: 3,
    status: 'LOW_STOCK',
    price: 58000,
  },
  {
    sku: 'AUR-OXF-BRN-42',
    title: 'Goodyear Welted Calfskin Oxford Shoes',
    color: 'Cognac Brown',
    size: 'UK 9',
    stock: 8,
    threshold: 4,
    status: 'HEALTHY',
    price: 26500,
  },
];

export const getMockOrders = () => [
  {
    _id: 'ord-01',
    orderNumber: 'AUR-82910',
    customer: { name: 'Karthick Ramanathan', email: 'customer@aurelius.com' },
    totalAmount: 24900,
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    createdAt: new Date().toISOString(),
    itemCount: 2,
  },
  {
    _id: 'ord-02',
    orderNumber: 'AUR-82909',
    customer: { name: 'Vikramaditya S.', email: 'vikram@example.com' },
    totalAmount: 48500,
    orderStatus: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    createdAt: new Date().toISOString(),
    itemCount: 1,
  },
  {
    _id: 'ord-03',
    orderNumber: 'AUR-82908',
    customer: { name: 'Alexander Wright', email: 'alex@example.com' },
    totalAmount: 16800,
    orderStatus: 'PROCESSING',
    paymentStatus: 'PENDING',
    paymentMethod: 'COD',
    createdAt: new Date().toISOString(),
    itemCount: 1,
  },
];

export const getMockCustomers = () => [
  {
    _id: 'cust-01',
    name: 'Karthick Ramanathan',
    email: 'customer@aurelius.com',
    phone: '+91 98840 12345',
    ordersCount: 6,
    totalSpent: 142500,
    tier: 'PLATINUM ATELIER',
    joinedDate: 'Jan 2026',
  },
  {
    _id: 'cust-02',
    name: 'Vikramaditya S.',
    email: 'vikram@example.com',
    phone: '+91 98201 54321',
    ordersCount: 3,
    totalSpent: 98000,
    tier: 'GOLD ELITE',
    joinedDate: 'Feb 2026',
  },
];

