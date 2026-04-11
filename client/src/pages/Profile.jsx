import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess, // ✅ FIX
  updateUserFailure,
  updateUserStart,
  updateUserSuccess, // ✅ FIX (name corrected)
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ---------------- IMAGE UPLOAD ----------------
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ---------------- UPDATE USER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `https://mern-estate-backend-iz4a.onrender.com/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔥 IMPORTANT
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // ---------------- DELETE USER ----------------
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `https://mern-estate-backend-iz4a.onrender.com/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ---------------- SIGN OUT ----------------
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      await fetch(
        "https://mern-estate-backend-iz4a.onrender.com/api/auth/signout",
        {
          credentials: "include",
        }
      );

      dispatch(signOutUserSuccess()); // ✅ FIX
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ---------------- SHOW LISTINGS ----------------
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(
        `https://mern-estate-backend-iz4a.onrender.com/api/user/listings/${currentUser._id}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // ---------------- DELETE LISTING ----------------
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `https://mern-estate-backend-iz4a.onrender.com/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success === false) return;

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />

        <input
          type="text"
          id="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          id="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg">
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg text-center"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>

        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      <button onClick={handleShowListings} className="text-green-700 mt-5">
        Show Listings
      </button>

      {userListings.map((listing) => (
        <div key={listing._id} className="flex justify-between border p-2 mt-2">
          <Link to={`/listing/${listing._id}`}>{listing.name}</Link>

          <div>
            <button
              onClick={() => handleListingDelete(listing._id)}
              className="text-red-700"
            >
              Delete
            </button>

            <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 ml-2">Edit</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}