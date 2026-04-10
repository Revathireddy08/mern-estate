import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);

      await signOut(auth);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      // ✅ correct axios request
      const res = await fetch(
  "https://mern-estate-backend-iz4a.onrender.com/api/auth/google",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
    }),
    credentials: "include",
  }
);

const data = await res.json(); // ✅ REQUIRED
      console.log("Backend response:", data);

      dispatch(
        signInSuccess({
          _id: data._id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
        })
      );

      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-50"
    >
      Continue with Google
    </button>
  );
}