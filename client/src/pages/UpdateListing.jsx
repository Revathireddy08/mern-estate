import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function UpdateListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [loading, setLoading] = useState(false);

  // ---------------- FETCH LISTING ----------------
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/api/listing/get/${listingId}`);
      setFormData(res.data);
    };

    fetchData();
  }, [listingId]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
      return;
    }

    if (type === "checkbox") {
      setFormData({ ...formData, [id]: checked });
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.put(`/api/listing/update/${listingId}`, formData);

      navigate(`/listing/${listingId}`);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">

      <h1 className="text-3xl text-center my-7">Update Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          id="address"
          value={formData.address}
          onChange={handleChange}
          className="border p-3"
        />

        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          id="regularPrice"
          value={formData.regularPrice}
          onChange={handleChange}
          type="number"
          className="border p-3"
        />

        {formData.offer && (
          <input
            id="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            type="number"
            className="border p-3"
          />
        )}

        <button disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>

      </form>
    </main>
  );
}