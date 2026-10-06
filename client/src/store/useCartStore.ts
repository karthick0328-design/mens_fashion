import { create } from 'zustand';
import { ICart } from '../types';
import { api } from '../services/api';

interface CartState {
  cart: ICart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCart: (cart: ICart | null) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, sku: string, quantity?: number) => Promise<boolean>;
  updateItemQty: (sku: string, quantity: number) => Promise<boolean>;
  removeItem: (sku: string) => Promise<boolean>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set({ isOpen: !get().isOpen }),

  setCart: (cart) => set({ cart }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/cart');
      if (res.data?.success) {
        set({ cart: res.data.data });
      }
    } catch {
      // User might be guest or offline
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, sku, quantity = 1) => {
    try {
      set({ isLoading: true });
      const res = await api.post('/cart/items', { productId, sku, quantity });
      if (res.data?.success) {
        set({ cart: res.data.data, isOpen: true });
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not add item to cart');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItemQty: async (sku, quantity) => {
    try {
      set({ isLoading: true });
      const res = await api.patch(`/cart/items/${sku}`, { quantity });
      if (res.data?.success) {
        set({ cart: res.data.data });
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update quantity');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (sku) => {
    try {
      set({ isLoading: true });
      const res = await api.delete(`/cart/items/${sku}`);
      if (res.data?.success) {
        set({ cart: res.data.data });
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not remove item');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
