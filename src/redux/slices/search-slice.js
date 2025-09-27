import { createSlice } from "@reduxjs/toolkit";
import products from "../../json/products";
const initialState = {
  searchQuery: "",
  searchProducts: [],
  products,
};
const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.searchProducts = state.products.filter((product) =>
        product.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
});

export const { setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
