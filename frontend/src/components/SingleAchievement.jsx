import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import achievementservice from "../backend/achievements.config";

function SingleAchievement() {
  const { achievementId } = useParams();
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    achievementservice.getOne(achievementId).then((res) => {
      setAchievement(res.data.data);
    });
  }, [achievementId]);

  if (!achievement) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-200">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200 p-6 flex justify-center items-center">
      <div className="bg-white p-6 rounded-3xl shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-800">
          {achievement.title}
        </h1>
        <p className="text-gray-600 mt-2">
          {new Date(achievement.date).toDateString()}
        </p>
        <img
          src={achievement.certificate}
          alt="Achievement Certificate"
          className="mt-4 w-full h-64 object-cover rounded-lg border-2 border-blue-400"
        />
        <p className="text-gray-700 mt-4 text-lg">{achievement.description}</p>
      </div>
    </div>
  );
}

export default SingleAchievement;
