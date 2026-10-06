import mongoose from 'mongoose';

const cmsBannerSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      enum: ['HERO', 'PROMOTIONAL', 'FEATURED_COLLECTION', 'EDITORIAL', 'ANNOUNCEMENT'],
      default: 'HERO',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    ctaText: { type: String, default: 'SHOP COLLECTION' },
    ctaLink: { type: String, default: '/products' },
    badgeText: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const CMSBanner = mongoose.model('CMSBanner', cmsBannerSchema);
