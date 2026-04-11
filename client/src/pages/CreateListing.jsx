import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageSubmit = (e) => {
    e.preventDefault();

    if (files.length === 0) return;

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("Max 6 images allowed");
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
        setUploading(false);
      })
      .catch(() => {
        setImageUploadError("Upload failed");
        setUploading(false);
      });
  };

  // ---------------- FIREBASE IMAGE ----------------
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = Date.now() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // ---------------- SUBMIT ----------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError("Upload at least 1 image");
      }

      if (+formData.discountPrice > +formData.regularPrice) {
        return setError("Discount must be lower than price");
      }

      setLoading(true);

      const res = await API.post("/api/listing/create", {
        ...formData,
        userRef: currentUser._id,
      });

      navigate(`/listing/${res.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">

          <input id="name" onChange={handleChange} value={formData.name} placeholder="Name" className="border p-3 rounded-lg" />

          <input id="address" onChange={handleChange} value={formData.address} placeholder="Address" className="border p-3 rounded-lg" />

          <textarea id="description" onChange={handleChange} value={formData.description} className="border p-3 rounded-lg" />

          <div className="flex gap-4">
            <input type="checkbox" id="sale" onChange={handleChange} checked={formData.type === "sale"} />
            Sell

            <input type="checkbox" id="rent" onChange={handleChange} checked={formData.type === "rent"} />
            Rent
          </div>

          <input type="number" id="bedrooms" onChange={handleChange} value={formData.bedrooms} />
          <input type="number" id="bathrooms" onChange={handleChange} value={formData.bathrooms} />
          <input type="number" id="regularPrice" onChange={handleChange} value={formData.regularPrice} />

          {formData.offer && (
            <input
              type="number"
              id="discountPrice"
              onChange={handleChange}
              value={formData.discountPrice}
            />
          )}
        </div>

        <div className="flex flex-col flex-1 gap-4">

          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />

          <button type="button" onClick={handleImageSubmit}>
            Upload
          </button>

          {formData.imageUrls.map((url) => (
            <img key={url} src={url} className="h-20" />
          ))}

          <button disabled={loading}>
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {error && <p>{error}</p>}
        </div>
      </form>
    </main>
  );
}