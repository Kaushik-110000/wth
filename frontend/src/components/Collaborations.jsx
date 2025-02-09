import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import collaborationService from "../backend/collaborations.config";
import more from "../files/more.svg";

function Collaborations() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        setLoading(true);
        const response = await collaborationService.getAll(userName);
        setCollaborations(response.data.data);
      } catch (error) {
        console.error("Error fetching collaborations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, [userName]);

  const loadMore = () => setVisibleCount((prev) => prev + 4);
  const loadLess = () => setVisibleCount((prev) => Math.max(4, prev - 4));

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-sm">
     <div className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between">

        <h2 className="text-3xl m-1 mx-3 font-semibold text-gray-800">Collaborations</h2>
        {currentUser?.userName === userName && (
          <button
            onClick={() => navigate(`/addCollaboration/${userName}`)}
            className="bg-blue-600 m-1 mx-3 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Collaboration
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {collaborations.slice(0, visibleCount).map((collab) => (
          <div
            key={collab._id}
            className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 relative"
          >
            {currentUser?.userName === userName && (
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() =>
                    navigate(`/editCollaboration/${userName}/${collab._id}`)
                  }
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900">
              {collab.partnerName}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {collab.description?.length > 20
                ? collab.description.substring(0, 20) + "..."
                : collab.description}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(collab.startDate).toLocaleDateString()} -{" "}
              {new Date(collab.endDate).toLocaleDateString()}
            </p>

            {collab.relatedProjects.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-700">Projects:</p>
                <ul className="list-disc pl-4 text-xs text-gray-500">
                  {collab.relatedProjects.map((proj) => (
                    <li key={proj._id}>{proj.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center space-x-6 mt-6">
        {visibleCount < collaborations.length && (
          <div
            onClick={loadMore}
            className="w-20 flex flex-col items-center justify-center cursor-pointer"
          >
            <img src={more} alt="See more" className="h-10 w-10 mt-2" />
            <p className="text-blue-800 text-center">More</p>
          </div>
        )}
        {visibleCount > 4 && (
          <div
            onClick={loadLess}
            className="w-20 flex flex-col items-center justify-center cursor-pointer"
          >
            <img
              src={more}
              alt="See less"
              className="h-10 w-10 rotate-180 mt-2"
            />
            <p className="text-blue-800 text-center">Less</p>
          </div>
        )}
      </div>

      {loading && (
        <p className="text-gray-500 mt-4">Loading collaborations...</p>
      )}
    </div>
  );
}

export default Collaborations;
