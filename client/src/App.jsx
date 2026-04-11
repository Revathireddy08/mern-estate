import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInSuccess, setInitialLoading } from "./redux/user/userSlice";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          "https://mern-estate-backend-iz4a.onrender.com/api/auth/me",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data?.success && data?.user) {
          dispatch(signInSuccess(data.user));

          // 🔥 FIX: keep sync with refresh
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.log("Auth check failed:", err);
        localStorage.removeItem("user");
      } finally {
        dispatch(setInitialLoading(false));
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}