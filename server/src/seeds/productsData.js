// Realistic seed dataset with 80 products matching master prompt specifications

const tshirtImages = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
];

const shirtImages = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80',
];

const jeansImages = [
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80',
];

const trouserImages = [
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80',
];

const watchImages = [
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
];

const shoeImages = [
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
];

const accessoryImages = [
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
];

export const generateProducts = (categoryMap) => {
  const products = [];

  // Helper to generate variants
  const createVariants = (skuPrefix, colors, sizes, price, mrp) => {
    const discountPercentage = Math.round(((mrp - price) / mrp) * 100);
    const variants = [];

    colors.forEach((color, cIdx) => {
      sizes.forEach((size, sIdx) => {
        // Vary stock: some with 25+, a few with low stock (2-3), a rare one with 0
        let stock = 15 + ((cIdx * 5 + sIdx * 3) % 20);
        if (cIdx === 1 && sIdx === 0) stock = 3; // Low stock test
        if (cIdx === 0 && sIdx === sizes.length - 1) stock = 0; // Out of stock test

        const colorCode = color.name.slice(0, 3).toUpperCase();
        variants.push({
          sku: `${skuPrefix}-${colorCode}-${size}`,
          color: {
            name: color.name,
            hex: color.hex,
            images: color.images || [],
          },
          size,
          price,
          mrp,
          discountPercentage,
          stock,
          isAvailable: stock > 0,
        });
      });
    });

    return variants;
  };

  // -------------------------------------------------------------
  // 1. T-SHIRTS (20 Products)
  // -------------------------------------------------------------
  const tshirtBrands = ['AURELIUS', 'FTX', 'Peter England', 'Roadster', 'Van Heusen', 'WROGN', 'U.S. Polo Assn.'];
  const tshirtFits = ['Slim Fit', 'Regular Fit', 'Oversized Fit', 'Athletic Fit'];
  const tshirtNecks = ['Round Neck', 'Polo Collar', 'Crew Neck', 'Henley Neck'];

  for (let i = 1; i <= 20; i++) {
    const brand = tshirtBrands[i % tshirtBrands.length];
    const neck = tshirtNecks[i % tshirtNecks.length];
    const fit = tshirtFits[i % tshirtFits.length];
    const price = 499 + ((i * 73) % 800);
    const mrp = Math.round(price * 1.8);
    const primaryImg = tshirtImages[i % tshirtImages.length];
    const secondaryImg = tshirtImages[(i + 1) % tshirtImages.length];

    const colors = [
      {
        name: 'Onyx Black',
        hex: '#111827',
        images: [primaryImg, secondaryImg, tshirtImages[(i + 2) % tshirtImages.length]],
      },
      {
        name: 'Deep Navy',
        hex: '#1E3A8A',
        images: [secondaryImg, primaryImg],
      },
      {
        name: 'Heather Grey',
        hex: '#9CA3AF',
        images: [tshirtImages[(i + 3) % tshirtImages.length], primaryImg],
      },
    ];

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const title = `${brand} Men's Solid ${fit} ${neck} Casual T-Shirt`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-${fit.toLowerCase().replace(/\s+/g, '-')}-${neck.toLowerCase().replace(/\s+/g, '-')}-tshirt-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['mens-clothing'],
      subCategory: categoryMap['t-shirts'],
      description: `Elevate your everyday wardrobe with the ${brand} luxury cotton ${neck} t-shirt. Tailored in a modern ${fit} from sustainably sourced premium combed cotton with bio-wash finish for superior handfeel and zero shrinkage. Features reinforced neck ribbing and tonal stitching for maximum durability.`,
      images: [primaryImg, secondaryImg, tshirtImages[(i + 2) % tshirtImages.length]],
      colors,
      sizes,
      variants: createVariants(`TSH-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        Fabric: '100% Combed Cotton',
        Fit: fit,
        Pattern: 'Solid',
        Neck: neck,
        Sleeve: 'Short Sleeve',
        Care: 'Machine wash cold with like colors, tumble dry low',
        Occasion: 'Casual / Everyday Luxe',
      },
      rating: {
        average: parseFloat((4.1 + (i % 8) * 0.1).toFixed(1)),
        count: 140 + i * 115,
      },
      tags: ['tshirt', 'cotton', 'casual', 'summer', 'basics', 'crewneck', fit.toLowerCase()],
      isFeatured: i <= 4,
      isActive: true,
    });
  }

  // -------------------------------------------------------------
  // 2. SHIRTS (10 Products)
  // -------------------------------------------------------------
  const shirtBrands = ['AURELIUS', 'Louis Philippe', 'Raymond', 'Blackberrys', 'Allen Solly'];
  const shirtCollars = ['Cutaway Collar', 'Button-Down Collar', 'Mandarin Collar', 'Spread Collar'];

  for (let i = 1; i <= 10; i++) {
    const brand = shirtBrands[i % shirtBrands.length];
    const collar = shirtCollars[i % shirtCollars.length];
    const price = 1199 + ((i * 130) % 1500);
    const mrp = Math.round(price * 1.9);
    const primaryImg = shirtImages[i % shirtImages.length];
    const secondaryImg = shirtImages[(i + 1) % shirtImages.length];

    const colors = [
      { name: 'Pure White', hex: '#FFFFFF', images: [primaryImg, secondaryImg] },
      { name: 'Sky Blue', hex: '#60A5FA', images: [secondaryImg, primaryImg] },
      { name: 'Olive Green', hex: '#3F6212', images: [primaryImg, secondaryImg] },
    ];

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const title = `${brand} Men's Premium Oxford Cotton ${collar} Shirt`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-oxford-${collar.toLowerCase().replace(/\s+/g, '-')}-shirt-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['mens-clothing'],
      subCategory: categoryMap['shirts'],
      description: `Crafted from 100% fine double-ply Egyptian cotton, this ${brand} dress shirt brings unmatched polish to both boardrooms and evening dinners. Features a sharp ${collar}, mother-of-pearl finish buttons, and a tapered silhouette that stays neatly tucked throughout the day.`,
      images: [primaryImg, secondaryImg, shirtImages[(i + 2) % shirtImages.length]],
      colors,
      sizes,
      variants: createVariants(`SHR-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        Fabric: '100% Giza Cotton',
        Fit: 'Slim Fit',
        Pattern: i % 2 === 0 ? 'Solid' : 'Micro Checks',
        Collar: collar,
        Sleeve: 'Full Sleeve with Mitered Cuffs',
        Care: 'Dry Clean or Warm Ironing',
      },
      rating: {
        average: parseFloat((4.2 + (i % 6) * 0.1).toFixed(1)),
        count: 210 + i * 85,
      },
      tags: ['shirt', 'formal', 'cotton', 'business', 'oxford'],
      isFeatured: i <= 2,
      isActive: true,
    });
  }

  // -------------------------------------------------------------
  // 3. JEANS (10 Products)
  // -------------------------------------------------------------
  const jeansBrands = ['Levi’s', 'AURELIUS', 'Wrangler', 'Pepe Jeans', 'Flying Machine'];
  const jeansFits = ['Slim Tapered', 'Skinny Fit', 'Straight Fit', 'Relaxed Fit'];

  for (let i = 1; i <= 10; i++) {
    const brand = jeansBrands[i % jeansBrands.length];
    const fit = jeansFits[i % jeansFits.length];
    const price = 1499 + ((i * 180) % 2000);
    const mrp = Math.round(price * 1.85);
    const primaryImg = jeansImages[i % jeansImages.length];
    const secondaryImg = jeansImages[(i + 1) % jeansImages.length];

    const colors = [
      { name: 'Dark Indigo', hex: '#1E293B', images: [primaryImg, secondaryImg] },
      { name: 'Faded Light Blue', hex: '#93C5FD', images: [secondaryImg, primaryImg] },
      { name: 'Washed Black', hex: '#262626', images: [primaryImg, secondaryImg] },
    ];

    const sizes = ['28', '30', '32', '34', '36', '38'];
    const title = `${brand} Men's 5-Pocket Stretch Selvedge ${fit} Jeans`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-${fit.toLowerCase().replace(/\s+/g, '-')}-jeans-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['mens-clothing'],
      subCategory: categoryMap['jeans'],
      description: `Engineered with 12.5 oz heavy selvedge denim woven with 2% elastane for maximum comfort and freedom of movement. Hand-abraded whiskering and authentic contrast stitching provide a timeless, lived-in aesthetic.`,
      images: [primaryImg, secondaryImg],
      colors,
      sizes,
      variants: createVariants(`JNS-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        Fabric: '98% Cotton, 2% Elastane',
        Fit: fit,
        Rise: 'Mid Rise',
        Stretch: 'Comfort Stretch (2-way)',
        Wash: 'Light Whiskering & Hand Scraping',
        Closure: 'Heavy-duty Brass Zipper Fly',
      },
      rating: {
        average: parseFloat((4.3 + (i % 5) * 0.1).toFixed(1)),
        count: 420 + i * 140,
      },
      tags: ['jeans', 'denim', 'selvedge', 'stretch', fit.toLowerCase()],
      isFeatured: i <= 2,
      isActive: true,
    });
  }

  // -------------------------------------------------------------
  // 4. TROUSERS (10 Products)
  // -------------------------------------------------------------
  const trouserBrands = ['AURELIUS', 'Raymond', 'Blackberrys', 'Van Heusen', 'Arrow'];

  for (let i = 1; i <= 10; i++) {
    const brand = trouserBrands[i % trouserBrands.length];
    const price = 1299 + ((i * 140) % 1800);
    const mrp = Math.round(price * 1.9);
    const primaryImg = trouserImages[i % trouserImages.length];

    const colors = [
      { name: 'Khaki Beige', hex: '#D7BA89', images: [primaryImg] },
      { name: 'Charcoal Grey', hex: '#374151', images: [primaryImg] },
      { name: 'Midnight Navy', hex: '#0F172A', images: [primaryImg] },
    ];

    const sizes = ['30', '32', '34', '36', '38'];
    const title = `${brand} Men's Flat-Front Tailored Formal Chino Trousers`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-tailored-chino-trousers-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['mens-clothing'],
      subCategory: categoryMap['trousers'],
      description: `Cut to a sharp modern slim silhouette, these ${brand} formal chinos are crafted from high-density poly-viscose with a subtle mechanical stretch. Features an interior non-slip shirt grip waistband and deep slash pockets.`,
      images: [primaryImg],
      colors,
      sizes,
      variants: createVariants(`TRS-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        Fabric: '70% Poly, 28% Viscose, 2% Spandex',
        Fit: 'Slim Tailored Fit',
        Style: 'Flat Front',
        Pockets: '2 Front Slant Pockets, 2 Rear Jet Pockets',
        Care: 'Machine Washable / Non-Iron Finish',
      },
      rating: {
        average: parseFloat((4.2 + (i % 5) * 0.1).toFixed(1)),
        count: 180 + i * 90,
      },
      tags: ['trousers', 'chinos', 'formal', 'office', 'slim-fit'],
      isFeatured: i <= 2,
      isActive: true,
    });
  }

  // -------------------------------------------------------------
  // 5. WATCHES (10 Products)
  // -------------------------------------------------------------
  const watchBrands = ['AURELIUS Chrono', 'Fossil', 'Tommy Hilfiger', 'Titan', 'Casio Edifice'];
  const watchTypes = ['Chronograph Watches', 'Analog Watches'];

  for (let i = 1; i <= 10; i++) {
    const brand = watchBrands[i % watchBrands.length];
    const subCatSlug = i % 2 === 0 ? 'chronograph-watches' : 'analog-watches';
    const price = 3499 + ((i * 450) % 5500);
    const mrp = Math.round(price * 1.8);
    const primaryImg = watchImages[i % watchImages.length];
    const secondaryImg = watchImages[(i + 1) % watchImages.length];

    const colors = [
      { name: 'Rose Gold & Black', hex: '#B76E79', images: [primaryImg, secondaryImg] },
      { name: 'Silver & Blue', hex: '#1E40AF', images: [secondaryImg, primaryImg] },
      { name: 'All Matte Black', hex: '#18181B', images: [primaryImg, secondaryImg] },
    ];

    const sizes = ['FREE'];
    const title = `${brand} Men's Luxury Sapphire Stainless Steel Chronograph Watch`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-sapphire-chronograph-watch-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['watches'],
      subCategory: categoryMap[subCatSlug],
      description: `Precision engineering meets high-horology design. Powered by a Japanese quartz movement housed in a surgical-grade 316L stainless steel case. Features a scratch-resistant sapphire crystal lens, luminous hands, and 50-meter water resistance.`,
      images: [primaryImg, secondaryImg, watchImages[(i + 2) % watchImages.length]],
      colors,
      sizes,
      variants: createVariants(`WTC-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        Movement: 'Japanese Precision Quartz',
        'Case Diameter': '42 mm',
        'Case Material': '316L Surgical Stainless Steel',
        'Strap Material': 'Italian Genuine Leather / Steel Mesh',
        'Water Resistance': '50M / 5 ATM',
        Glass: 'Scratch-Proof Sapphire Crystal',
        Warranty: '2 Years Manufacturer Warranty',
      },
      rating: {
        average: parseFloat((4.5 + (i % 4) * 0.1).toFixed(1)),
        count: 510 + i * 230,
      },
      tags: ['watch', 'luxury', 'chronograph', 'leather', 'stainless-steel'],
      isFeatured: i <= 3,
      isActive: true,
    });
  }

  // -------------------------------------------------------------
  // 6. SHOES (10 Products)
  // -------------------------------------------------------------
  const shoeBrands = ['AURELIUS Craft', 'Clarks', 'Puma', 'Woodland', 'Red Tape'];
  const shoeTypes = ['Sneakers', 'Formal Shoes'];

  for (let i = 1; i <= 10; i++) {
    const brand = shoeBrands[i % shoeBrands.length];
    const subCatSlug = i % 2 === 0 ? 'sneakers' : 'formal-shoes';
    const price = 2299 + ((i * 320) % 3500);
    const mrp = Math.round(price * 1.8);
    const primaryImg = shoeImages[i % shoeImages.length];
    const secondaryImg = shoeImages[(i + 1) % shoeImages.length];

    const colors = [
      { name: 'Crisp White', hex: '#FFFFFF', images: [primaryImg, secondaryImg] },
      { name: 'Tan Brown', hex: '#78350F', images: [secondaryImg, primaryImg] },
      { name: 'Midnight Black', hex: '#18181B', images: [primaryImg, secondaryImg] },
    ];

    const sizes = ['38', '40']; // Representing Euro/Indian foot sizes e.g. 7-10 mapped to size array
    const title = `${brand} Handcrafted Full-Grain Leather Men's ${subCatSlug === 'sneakers' ? 'Minimalist Low-Top Sneakers' : 'Oxford Brogue Shoes'}`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-${subCatSlug === 'sneakers' ? 'minimalist-sneakers' : 'oxford-brogues'}-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['footwear'],
      subCategory: categoryMap[subCatSlug],
      description: `Handcrafted from supple full-grain Italian calf leather that moulds to your feet over time. Finished with an ultra-lightweight shock-absorbing EVA rubber outsole and memory foam insole for cloud-like all-day walking comfort.`,
      images: [primaryImg, secondaryImg],
      colors,
      sizes,
      variants: createVariants(`SHOE-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        'Upper Material': 'Full Grain Calfskin Leather',
        'Sole Material': 'Anti-Skid Vibram / EVA Compound',
        Insole: 'Ortholite Memory Cushioning',
        Closure: 'Waxed Cotton Lace-Up',
        'Toe Shape': 'Classic Rounded Toe',
      },
      rating: {
        average: parseFloat((4.4 + (i % 4) * 0.1).toFixed(1)),
        count: 320 + i * 160,
      },
      tags: ['shoes', 'sneakers', 'leather', 'formal', 'casual'],
      isFeatured: i <= 2,
      isActive: true,
    });
  }

  // -------------------------------------------------------------
  // 7. ACCESSORIES (10 Products)
  // -------------------------------------------------------------
  const accessoryBrands = ['AURELIUS Atelier', 'Ray-Ban', 'Tommy Hilfiger', 'Hidesign', 'Fossil'];
  const accessoryTypes = ['Wallets', 'Belts', 'Sunglasses'];

  for (let i = 1; i <= 10; i++) {
    const brand = accessoryBrands[i % accessoryBrands.length];
    const subCatSlug = i % 3 === 0 ? 'wallets' : i % 3 === 1 ? 'belts' : 'sunglasses';
    const price = 899 + ((i * 150) % 2200);
    const mrp = Math.round(price * 1.9);
    const primaryImg = accessoryImages[i % accessoryImages.length];

    const colors = [
      { name: 'Vintage Havana Brown', hex: '#451A03', images: [primaryImg] },
      { name: 'Classic Black', hex: '#000000', images: [primaryImg] },
    ];

    const sizes = ['FREE'];
    const title = `${brand} Premium Men's ${subCatSlug === 'wallets' ? 'RFID Protected Full-Grain Leather Wallet' : subCatSlug === 'belts' ? 'Reversible Italian Leather Formal Belt' : 'Polarized UV400 Wayfarer Sunglasses'}`;
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-mens-${subCatSlug}-${i}`;

    products.push({
      title,
      slug,
      brand,
      category: categoryMap['accessories'],
      subCategory: categoryMap[subCatSlug],
      description: `Exquisitely detailed menswear accessory crafted with heirloom-quality materials. Designed to effortlessly complement any tailored or casual attire with understated sophistication.`,
      images: [primaryImg],
      colors,
      sizes,
      variants: createVariants(`ACC-${i.toString().padStart(3, '0')}`, colors, sizes, price, mrp),
      specifications: {
        Material: subCatSlug === 'sunglasses' ? 'Handcrafted Acetate & UV400 TAC Lens' : 'Vegetable-Tanned Full Grain Leather',
        Hardware: 'Brushed Gunmetal / Solid Brass',
        Packaging: 'Signature Rigid Gift Box Included',
        Warranty: '1 Year Warranty',
      },
      rating: {
        average: parseFloat((4.3 + (i % 6) * 0.1).toFixed(1)),
        count: 270 + i * 110,
      },
      tags: ['accessory', 'leather', 'gift', subCatSlug],
      isFeatured: i <= 2,
      isActive: true,
    });
  }

  return products;
};
