import React, { useEffect, useState } from "react";
import achievementservice from "../backend/achievements.config.js";
import { useNavigate, useParams } from "react-router";
import errorTeller from "../backend/errorTeller.js";

function AchievementEdit() {
  const { achievementId, userName } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const res = await achievementservice.getOne(achievementId);
        const { title, description, date, certificate } = res.data.data;
        setTitle(title);
        setDescription(description.trim(10));
        setDate(date.split("T")[0]); // Format date for input
      } catch (err) {
        setError(errorTeller(err));
      }
    };
    fetchAchievement();
  }, [achievementId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    if (certificate) formData.append("certificate", certificate);
    try {
      await achievementservice.edit(achievementId, formData);
      navigate(`/${userName}`);
    } catch (err) {
      setLoading(false);
      setError(errorTeller(err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await achievementservice.deleteOne(achievementId);
      window.location.reload();
      navigate(`/${userName}`);
    } catch (err) {
      setError(errorTeller(err));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Edit Achievement
        </h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={(e) => setCertificate(e.target.files[0])}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {!loading ? "Update" : "Updating..."}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 text-xs rounded-2xl hover:bg-red-700 float-right h-10 w-30 transition"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default AchievementEdit;
