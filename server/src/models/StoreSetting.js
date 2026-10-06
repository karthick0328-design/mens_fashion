import mongoose from 'mongoose';

const storeSettingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'AURELIUS ATELIER HOMME' },
    tagline: { type: String, default: 'High-End Luxury Menswear & Fine Accessories' },
    contactEmail: { type: String, default: 'concierge@aurelius.com' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: '402 High Street Phoenix, Lower Parel, Mumbai, Maharashtra 400013' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    taxPercentage: { type: Number, default: 12 },
    taxNumber: { type: String, default: '27AABCA1234F1Z5' },
    maintenanceMode: { type: Boolean, default: false },
    allowGuestCheckout: { type: Boolean, default: true },
    orderPrefix: { type: String, default: 'AUR-' },
    enable2FA: { type: Boolean, default: false },
    rolesConfig: {
      type: Array,
      default: [
        {
          role: 'SUPER_ADMIN',
          description: 'Full unconstrained system authority',
          permissions: ['ALL'],
        },
        {
          role: 'ADMIN',
          description: 'Catalog, orders, customers, marketing & reviews access',
          permissions: ['PRODUCTS', 'ORDERS', 'CUSTOMERS', 'MARKETING', 'REVIEWS', 'REPORTS'],
        },
        {
          role: 'MANAGER',
          description: 'Catalog editing, order fulfillment and live stock control',
          permissions: ['PRODUCTS', 'ORDERS', 'INVENTORY'],
        },
        {
          role: 'STAFF',
          description: 'Order processing and customer support viewing',
          permissions: ['ORDERS', 'CUSTOMERS_VIEW'],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const StoreSetting = mongoose.model('StoreSetting', storeSettingSchema);
