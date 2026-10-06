import { create } from 'zustand';
import { api } from '../services/api';

interface WishlistState {
  wishlistIds: string[];
  isLoading: boolean;
  setWishlistIds: (ids: string[]) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: [],
  isLoading: false,

  setWishlistIds: (ids) => set({ wishlistIds: ids }),

  isInWishlist: (productId) => get().wishlistIds.includes(productId),

  toggleWishlist: async (productId) => {
    try {
      const current = get().wishlistIds;
      const exists = current.includes(productId);

      // Optimistic update
      set({
        wishlistIds: exists
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      });

      const res = await api.post(`/wishlist/toggle/${productId}`);
      if (res.data?.success) {
        set({ wishlistIds: res.data.data.wishlist || [] });
        return true;
      }
      return false;
    } catch (err: any) {
      // Revert if unauthorized or failed
      if (err.response?.status === 401) {
        alert('Please log in to save items to your wishlist.');
      }
      return false;
    }
  },
}));
