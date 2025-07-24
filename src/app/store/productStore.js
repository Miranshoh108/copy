// store/productStore.js
import { create } from "zustand";

const useProductStore = create((set) => ({
  currentProduct: null,
  setCurrentProduct: (product) => set({ currentProduct: product }),
}));

export default useProductStore;
