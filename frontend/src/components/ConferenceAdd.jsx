import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import conferenceService from "../backend/conferences.config.js";

function ConferenceAdd() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    description: "",
    presentationLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await conferenceService.create({
        ...formData,
        recepient: userName, // Attach user as recipient
      });

      if (response.status === 200) {
        navigate(`/${userName}`);
      }
    } catch (err) {
      setError("Failed to add conference. Please try again.");
      console.error("Error adding conference:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-200 w-full h-[100vh] p-10">
      <div className="max-w-96 mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Add Conference</h2>
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Conference Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Presentation Link (Optional)
            </label>
            <input
              type="url"
              name="presentationLink"
              value={formData.presentationLink}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Conference"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConferenceAdd;
