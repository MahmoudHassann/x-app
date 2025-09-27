import { createSlice } from "@reduxjs/toolkit";
const getInitialNavOpenState = () => {
  const storedNavOpen = localStorage.getItem("navOpen");
  return storedNavOpen ? JSON.parse(storedNavOpen) : true;
};
const initialState = {
  navOpen: getInitialNavOpenState(),
  mainLoading: false,
};

const layoutSlice = createSlice({
  initialState,
  name: "layoutSlice",
  reducers: {
    navOpen(state, action) {
      state.navOpen = action.payload;
      localStorage.setItem("navOpen", JSON.stringify(action.payload));
    },
    mainLoading(state, action) {
      state.mainLoading = action.payload;
    },
  },
});
export const { navOpen, mainLoading } = layoutSlice.actions;
export default layoutSlice.reducer;
