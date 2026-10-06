export interface EditorialSlide {
  image: string;
  collection: string;
  tagline: string;
}

export const authSlides: EditorialSlide[] = [
  {
    image: '/images/auth/login.jpg',
    collection: 'ATELIER SARTORIAL',
    tagline: 'Architectural Modern Tailoring',
  },
  {
    image: '/images/auth/editorial-1.jpg',
    collection: 'AUTUMN / WINTER 2026',
    tagline: 'Pure Double-Faced Camel Cashmere',
  },
  {
    image: '/images/auth/editorial-2.jpg',
    collection: 'BESPOKE SUITING',
    tagline: 'Super 180s Wool & Florentine Silk',
  },
  {
    image: '/images/auth/editorial-3.jpg',
    collection: 'QUIET LUXURY',
    tagline: 'Handcrafted Merino Knitwear',
  },
];

export const registerGroupSlides: EditorialSlide[] = [
  {
    image: '/images/auth/register.jpg',
    collection: 'ATELIER COLLECTIVE',
    tagline: 'The Studio Campaign Lookbook',
  },
  {
    image: '/images/auth/register-group-1.jpg',
    collection: 'PALAZZO EDITORIAL',
    tagline: 'Neoclassical Sartorial Tailoring',
  },
  {
    image: '/images/auth/register-group-2.jpg',
    collection: 'INDUSTRIAL ATELIER',
    tagline: 'Sartorial Overcoats & Cashmere',
  },
  {
    image: '/images/auth/register-group-3.jpg',
    collection: 'OPERA GALA EVENING',
    tagline: 'Bespoke Evening Black-Tie Wardrobe',
  },
];

export const authImages = {
  login: '/images/auth/login.jpg',
  register: '/images/auth/register.jpg',
  slides: authSlides,
  registerSlides: registerGroupSlides,
};

export default authImages;
