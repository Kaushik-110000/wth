import React, { useEffect, useState } from "react";
import projectService from "../backend/projects.config.js";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
function Projects({ userName }) {
  const [loadProjects, setLoadProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAll(userName); // Replace with actual username
        setProjects(response.data.data);
        setLoadProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleQueryChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setQuery(searchText);

    if (searchText.trim() === "") {
      setProjects(loadProjects);
    } else {
      setProjects(
        loadProjects.filter(
          (project) =>
            project.title.toLowerCase().includes(searchText) ||
            project.description.toLowerCase().includes(searchText)
        )
      );
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-2xl my-1">
      <div
        className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between"
      >
        <h2 className="text-3xl m-1 mx-3 font-semibold text-gray-800 mb-6 text-center">
          Projects / Papers
        </h2>
        {currentUser?.userName === userName && (<button
          onClick={() => {
            navigate(`/addProjects/${userName}`);
          }}
          className=" bg-blue-600 m-1 mx-3 mb-2 text-white px-3 py-2  w-30 rounded"
        >
          Add Project
        </button>)}
      </div>
      <input
        type="text"
        value={query}
        placeholder="Search Something"
        onChange={handleQueryChange}
        className="mb-6 p-2 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-xl shadow-md relative hover:scale-105"
            >
              <h3
                className="text-xl font-semibold text-gray-800"
                onClick={() => {
                  navigate(`/project/${project._id}`);
                }}
              >
                {project.title}
              </h3>
              <p
                className="text-gray-600 mt-2"
                onClick={() => {
                  navigate(`/project/${project._id}`);
                }}
              >
                {project.description}
              </p>

              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  <strong>Start Date:</strong>{" "}
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
                {project.endDate && (
                  <p className="text-sm text-gray-500">
                    <strong>End Date:</strong>{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {project.technologiesUsed && (
                <div
                  className="mt-3"
                  onClick={() => {
                    navigate(`/project/${project._id}`);
                  }}
                >
                  <p className="font-medium text-gray-700">
                    Technologies Used:
                  </p>
                  <p className="text-sm text-gray-500">
                    {project.technologiesUsed.join(", ")}
                  </p>
                </div>
              )}

              <div
                className="mt-4"
                onClick={() => {
                  navigate(`/project/${project._id}`);
                }}
              >
                <p className="font-medium text-gray-700">Team Members:</p>
                <div className="flex space-x-2 mt-2">
                  {project.teamMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center space-x-2"
                    >
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-8 h-8 rounded-full border"
                      />
                      <span className="text-sm text-gray-700">
                        {member.fullName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-blue-600 hover:underline"
                >
                  View on GitHub
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full col-span-3">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Projects;
