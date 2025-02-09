import React, { useState } from "react";
import teachingExperienceService from "../backend/teachingExperiences.config.js";
import { useNavigate, useParams } from "react-router";

function TeachingExperienceAdd() {
  const { userName } = useParams();
  const [formData, setFormData] = useState({
    courseName: "",
    institution: "",
    year: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await teachingExperienceService.create(formData);
      setSuccess("Teaching experience added successfully!");
      navigate(`/${userName}`);
    } catch (error) {
      setError("Failed to add teaching experience. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-blue-200 p-5">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Add Teaching Experience
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center mt-2">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Course Name
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Institution
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter institution name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              year of Experience
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of year"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Add Experience
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeachingExperienceAdd;
