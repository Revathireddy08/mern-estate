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
    // -------- SIGN IN --------
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

    // -------- UPDATE USER --------
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // -------- DELETE USER --------
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

    // -------- SIGN OUT --------
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

    // -------- INITIAL LOAD --------
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
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  setInitialLoading,
} = userSlice.actions;

export default userSlice.reducer;