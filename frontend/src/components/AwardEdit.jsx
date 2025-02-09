import React, { useState, useEffect } from "react";
import awardService from "../backend/awards.config.js";
import { useNavigate, useParams } from "react-router";
import errorTeller from "../backend/errorTeller.js";

function AwardEdit() {
  const { awardId, userName } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [year, setYear] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAward = async () => {
      try {
        const res = await awardService.getOne(awardId);
        const award = res.data.data;
        setTitle(award.title);
        setOrganization(award.organization);
        setYear(award.year);
      } catch (err) {
        setError(errorTeller(err));
      }
    };
    fetchAward();
  }, [awardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("organization", organization);
    formData.append("year", year);
    if (certificate) {
      formData.append("certificate", certificate);
    }
    try {
      await awardService.edit(awardId, formData);
      navigate(`/${userName}`);
    } catch (err) {
      setLoading(false);
      setError(errorTeller(err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this award?")) return;
    try {
      await awardService.deleteOne(awardId);
      navigate(`/${userName}`);
    } catch (err) {
      setError(errorTeller(err));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Award</h2>
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
          <input
            type="text"
            placeholder="Organization"
            className="w-full p-2 border rounded"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Year"
            className="w-full p-2 border rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
        </form>
        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Delete Award
        </button>
      </div>
    </div>
  );
}

export default AwardEdit;
