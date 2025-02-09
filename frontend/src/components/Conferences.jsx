import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import conferenceService from "../backend/conferences.config.js";
 
function Conferences({ userName }) {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);
  console.log(currentUser, userName);
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);
        const response = await conferenceService.getAll(userName);
        setConferences(response.data.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [userName]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 ">
     <div className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between">

        <h2 className="text-3xl mx-3 m-1 font-semibold text-gray-800">Conferences</h2>
        {currentUser?.userName === userName && (
          <button
            onClick={() => navigate(`/addConference/${userName}`)}
            className="bg-blue-600 m-1 mx-3 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Conference
          </button>
        )}
      </div>

      {/* Conference Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {loading ? (
          <p className="text-gray-500">Loading conferences...</p>
        ) : conferences.length === 0 ? (
          <p className="text-gray-500">No conferences found.</p>
        ) : (
          conferences.map((conf) => (
            <div
              key={conf._id}
              className="bg-white shadow-lg rounded-lg p-5 transition-transform hover:scale-105 relative"
            >
              <h3 className="text-lg font-bold text-gray-900">{conf.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                <strong>Location:</strong> {conf.location}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Date:</strong>{" "}
                {new Date(conf.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {conf.description.length > 20
                  ? conf.description.substring(0, 20) + "..."
                  : conf.description}
              </p>

              {conf.presentationLink && (
                <a
                  href={conf.presentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm block mt-2 hover:underline"
                >
                  View Presentation
                </a>
              )}

              {/* Buttons */}

              {currentUser?.userName === userName && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      conferenceService.deleteOne(conf._id);
                      window.location.reload();
                    }}
                    className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Conferences;
