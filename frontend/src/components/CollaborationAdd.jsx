import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import collaborationService from "../backend/collaborations.config";
import projectService from "../backend/projects.config";

function CollaborationAdd() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    partnerName: "",
    description: "",
    startDate: "",
    endDate: "",
    relatedProjects: [],
  });
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getAll(userName);
        console.log(res.data.data);
        setProjects(res.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [userName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, relatedProjects: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await collaborationService.create({ ...formData, recepient: userName });
      navigate(`/${userName}`);
    } catch (error) {
      console.error("Error adding collaboration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-blue-200 p-10">
      <div className="max-w-lg mx-auto  bg-white p-6 rounded-lg shadow-lg ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Collaboration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleChange}
            placeholder="Partner Name"
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="relatedProjects"
            multiple
            value={formData.relatedProjects}
            onChange={handleProjectChange}
            className="w-full p-2 border rounded"
          >
            {projects.map((project) => (
              <option
                key={project._id}
                value={project._id}
                className="border my-0.5 border-blue-300 rounded-xl flex justify-center items-center "
              >
                {project.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CollaborationAdd;
