import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import awardService from "../backend/awards.config.js";
import more from "../files/more.svg";

function Awards({ userName }) {
  const [awards, setAwards] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const res = await awardService.getAll(userName);
        setAwards(res.data.data);
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [userName]);

  const loadMore = () => setVisibleCount((prev) => prev + 4);
  const loadLess = () => setVisibleCount((prev) => Math.max(4, prev - 4));

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl my-1">
     <div className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between">

        <h2 className="text-3xl mx-3 m-1 font-semibold text-gray-800">Awards</h2>
        {currentUser?.userName === userName && (
          <button
            onClick={() => navigate(`/addAward/${userName}`)}
            className="bg-blue-600 m-1 mx-3 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Award
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {awards.slice(0, visibleCount).map((award) => (
          <div
            key={award._id}
            className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 relative"
          >
            {currentUser?.userName === userName && (
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() =>
                    navigate(`/editAward/${userName}/${award._id}`)
                  }
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900">{award.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{award.organization}</p>
            <p className="text-xs text-gray-400 mt-2">{award.year}</p>
            {award.certificate && (
              <img
                src={award.certificate}
                alt="Award Certificate"
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center space-x-6 mt-6">
        {visibleCount < awards.length && (
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

      {loading && <p className="text-gray-500 mt-4">Loading awards...</p>}
    </div>
  );
}

export default Awards;
