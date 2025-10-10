import { configureStore } from "@reduxjs/toolkit";
import layoutSlice from "./slices/layout-slice";
import userSlice from "./slices/user-slice";
import cartSlice from "./slices/cart-slice";
import filterReducer from "./slices/filter-slice";
import searchSlice from "./slices/search-slice";
import commonReducer  from "./slices/common-slice";

const store = configureStore({
  reducer: {
    layout: layoutSlice,
    user: userSlice,
    cart: cartSlice,
    filters: filterReducer,
    search: searchSlice,
     common: commonReducer,
  },
});

export default store;
