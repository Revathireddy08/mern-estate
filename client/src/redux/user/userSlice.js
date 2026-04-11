import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
  loading: false,
  initialLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
    },

    deleteUserSuccess: (state) => {
      state.currentUser = null;
      localStorage.removeItem("user");
    },

    signOutUserSuccess: (state) => {
      state.currentUser = null;
      localStorage.removeItem("user");
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserSuccess,
  deleteUserSuccess,
  signOutUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;