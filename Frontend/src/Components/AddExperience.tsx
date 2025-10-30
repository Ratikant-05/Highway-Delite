import React, { useState } from "react";
import axios from "axios";

interface ExperienceForm {
  title: string;
  location: string;
  content: string;
  price: number;
  about: string;
  image: File | null;
}

const AddExperience: React.FC = () => {
  const [formData, setFormData] = useState<ExperienceForm>({
    title: "",
    location: "",
    content: "",
    price: 0,
    about: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle text field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setMessage("Please select an image before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // prepare FormData
      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("content", formData.content);
      data.append("price", formData.price.toString());
      data.append("about", formData.about);
      data.append("image", formData.image);

      const res = await axios.post("https://highway-delite-wppr.onrender.com/api/addExperiences", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage(res.data.message || "Experience created successfully!");
      setFormData({
        title: "",
        location: "",
        content: "",
        price: 0,
        about: "",
        image: null,
      });
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error creating experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Add New Experience</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "1rem" }}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>About:</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Uploading..." : "Add Experience"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: message.includes("Error") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddExperience;
