import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectService from "../backend/projects.config.js";
import userService from "../backend/auth.config.js";

function ProjectAdd() {
  const { userName } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    technologiesUsed: [],
    teamMembers: [],
    githubLink: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTech, setNewTech] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.description)
      tempErrors.description = "Description is required";
    if (!formData.startDate) tempErrors.startDate = "Start date is required";
    if (!formData.githubLink.match(/^(https?:\/\/)?(www\.)?github\.com\/.+$/))
      tempErrors.githubLink = "Enter a valid GitHub link";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => data.append("images", file));
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => data.append(key, item));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await projectService.create(data);
      navigate(`/${userName}`);
    } catch (error) {
      console.error("Server Error:", error);
      setServerError(
        error.response?.data?.message ||
          "Failed to add project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  items-center p-6 bg-blue-200 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 ">
        Add New Project
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl"
      >
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <label className="block mt-4 mb-2 font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}

        <label className="block mt-4 mb-2 font-semibold">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm">{errors.startDate}</p>
        )}

        <label className="block mt-4 mb-2 font-semibold">GitHub / Drive Link</label>
        <input
          type="url"
          name="githubLink"
          value={formData.githubLink}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.githubLink && (
          <p className="text-red-500 text-sm">{errors.githubLink}</p>
        )}

        <label className="block mt-4 mb-2 font-semibold">Upload images (Max : 10)</label>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        {serverError && (
          <p className="text-red-600 font-semibold mt-3">{serverError}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}

export default ProjectAdd;
