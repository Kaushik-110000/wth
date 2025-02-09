import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import achievementservice from "../backend/achievements.config";
import more from "../files/more.svg";

function Achievements({ userName }) {
  const [achievements, setAchievements] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await achievementservice.getAll(userName);
        setAchievements(response.data.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userName]);

  const loadMore = () => setVisibleCount((prev) => prev + 4);
  const loadLess = () => setVisibleCount((prev) => Math.max(4, prev - 4));

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl my-1">
      <div
        className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between"
      >
        <h2 className="text-3xl mx-3 m-1 font-semibold text-gray-800">
          Achievements
        </h2>
        {currentUser?.userName === userName && (
          <button
            onClick={() => navigate(`/addAchievement/${userName}`)}
            className="bg-blue-600 m-1 mx-3  hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Achievement
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {achievements.slice(0, visibleCount).map((achievement) => (
          <div
            key={achievement._id}
            className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 relative"
          >
            {currentUser?.userName === userName && (
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() =>
                    navigate(`/editAchievement/${userName}/${achievement._id}`)
                  }
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </div>
            )}
            <h3
              className="text-lg font-bold text-gray-900"
              onClick={() => {
                navigate(`/achievement/${achievement._id}`);
              }}
            >
              {achievement.title} o
            </h3>
            <p
              className="text-gray-600 text-sm mt-1"
              onClick={() => {
                navigate(`/achievement/${achievement._id}`);
              }}
            >
              {achievement.description?.length > 20
                ? achievement.description.substring(0, 20) + "..."
                : achievement.description}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(achievement.date).toLocaleDateString()}
            </p>
            <img
              src={achievement.certificate}
              alt="Certificate"
              className="w-full h-32 object-cover rounded mt-2"
              onClick={() => {
                navigate(`/achievement/${achievement._id}`);
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center space-x-6 mt-6">
        {visibleCount < achievements.length && (
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

      {loading && <p className="text-gray-500 mt-4">Loading achievements...</p>}
    </div>
  );
}

export default Achievements;
