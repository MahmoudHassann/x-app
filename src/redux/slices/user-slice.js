import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../dependencies/instanceAxios";
import { notifySuccess } from "../../dependencies/Notification";
import { jwtDecode } from "jwt-decode";

const initialState = {
  currentUser: null,
};

export const signUp = createAsyncThunk(
  "userSlice/signUp",
  async (userData, thunkAPI) => {
    try {
      const response = await Api.post("auth/signup", userData);
    } catch (error) {
      console.log(error);
    }
  }
);
export const signIn = createAsyncThunk(
  "userSlice/signIn",
  async (userData, thunkAPI) => {
    try {
      const response = await Api.post("auth/signin", userData);
      console.log(response.data, "response");
      response.data.status === "success" && notifySuccess("logged in success");
      return response.data.token;
    } catch (error) {}
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      const token = action.payload;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      state.currentUser = decodedToken;
      console.log(decodedToken, "decodedToken");
      console.log(state.currentUser, "currentUser in state redux");
    });
  },
});

export default userSlice.reducer;
