import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import projectService from "../backend/projects.config.js";

function SingleProject() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    projectService.getOne(projectId).then((res) => {
      setProject(res.data.data);
    });
  }, [projectId]);

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-200">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blue-900">{project.title}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>

        <p className="text-gray-500 mt-2">
          <span className="font-medium">Duration:</span>{" "}
          {new Date(project.startDate).toLocaleDateString()} -{" "}
          {new Date(project.endDate).toLocaleDateString()}
        </p>

        {project.technologiesUsed && (
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Technologies Used:</span>{" "}
            {project.technologiesUsed.join(", ")}
          </p>
        )}

        {project.githubLink && (
          <p className="mt-2">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub Repository / Drive Link
            </a>
          </p>
        )}

        {project.media?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-gray-700">Project Media:</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {project.media.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Project Media ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleProject;
