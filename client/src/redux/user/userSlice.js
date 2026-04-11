import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  error: null,
  loading: false,

  initialLoading: true, // 👈 keep this
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ---------------- LOGIN ----------------
    signInStart: (state) => {
      state.loading = true;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---------------- UPDATE ----------------
    updateUserStart: (state) => {
      state.loading = true;
    },

    updateuserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---------------- DELETE ----------------
    deleteUserStart: (state) => {
      state.loading = true;
    },

    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("user");
    },

    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---------------- SIGN OUT ----------------
    signOutUserStart: (state) => {
      state.loading = true;
    },

    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("user");
    },

    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---------------- IMPORTANT FIX ----------------
    setInitialLoading: (state, action) => {
      state.initialLoading = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,

  updateUserStart,
  updateuserSuccess,
  updateUserFailure,

  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,

  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,

  setInitialLoading, // 👈 ADD THIS
} = userSlice.actions;

export default userSlice.reducer;