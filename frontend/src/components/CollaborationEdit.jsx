import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import collaborationService from "../backend/collaborations.config";
import projectService from "../backend/projects.config";

function CollaborationEdit() {
  const { userName, collaborationId } = useParams();
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
    const fetchCollaboration = async () => {
      try {
        const res = await collaborationService.getOne(collaborationId);
        const {
          partnerName,
          description,
          startDate,
          endDate,
          relatedProjects,
        } = res.data.data;
        setFormData({
          partnerName,
          description,
          startDate: startDate.split("T")[0],
          endDate: endDate.split("T")[0],
          relatedProjects: relatedProjects.map((proj) => proj._id),
        });
      } catch (error) {
        console.error("Error fetching collaboration details:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await projectService.getAll(userName);
        setProjects(res.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchCollaboration();
    fetchProjects();
  }, [userName, collaborationId]);

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
      await collaborationService.edit(collaborationId, {
        ...formData,
        recepient: userName,
      });
      navigate(`/${userName}`);
    } catch (error) {
      console.error("Error updating collaboration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    alert("Are you sure to delete");
    collaborationService.deleteOne(collaborationId).then(() => {
      navigate(`/${userName}`);
    });
  };
  return (
    <div className="w-full h-[100vh] bg-blue-200 p-10">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Edit Collaboration
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
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
        <button
          onClick={handleDelete}
          className="w-20 mt-4 bg-red-600  text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CollaborationEdit;
