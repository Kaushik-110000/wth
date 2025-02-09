import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import teachingExperienceService from "../backend/teachingExperiences.config.js";
import { useNavigate } from "react-router";

function TeachingExperiences({ userName }) {
  console.log("tt", userName);
  const [teachingExperiences, setTeachingExperiences] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Fetch logged-in user ID from Redux
  const currentUser = useSelector((state) => state.auth.userData);
  const userId = currentUser?._id; // Extracting user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await teachingExperienceService.getAll(userName);
        if (response.data && response.data.status) {
          setTeachingExperiences(response.data.data);
        } else {
          setError("No teaching experiences.");
        }
      } catch (err) {
        setError("No data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  console.log(userName, currentUser);
  const handleDelete = async (id) => {
    try {
      await teachingExperienceService.deleteOne(id);
      setTeachingExperiences(
        teachingExperiences.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete experience", err);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-2xl my-1 shadow-md">
      <div
        className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between"
      >
        <h2 className="text-3xl m-1  mx-3 font-semibold text-gray-800">
          My, Teaching Experiences !
        </h2>

        {/* Show Add button only if the logged-in user is the recipient */}
        {userName === currentUser?.userName && (
          <button
            onClick={() => {
              navigate(`/addExperience/${userName}`);
            }}
            className="bg-blue-600 m-1 mx-3 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Experience
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {teachingExperiences.length === 0 ? (
        <p className="text-center text-gray-500">
          No teaching experiences found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
          {teachingExperiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 relative"
            >
              <h3 className="text-lg font-bold text-gray-900">
                {exp.courseName}
              </h3>
              <p className="text-gray-600 text-sm">{exp.institution}</p>
              <p className="text-xs text-gray-400 mt-2">Years: {exp.year}</p>

              {/* Show Delete button only if the logged-in user is the recipient */}
              {teachingExperiences[0].recepient === userId && (
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeachingExperiences;
