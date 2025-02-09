import React, { useEffect, useState } from "react";
import authservice from "../backend/auth.config";
import { useParams } from "react-router";
import Linkedin from "../files/linkedIn.svg";
import Scholar from "../files/Scholar.svg";
import {
  Achievements,
  Awards,
  Collaborations,
  Conferences,
  Posts,
  Projects,
  TeachingExperiences,
} from "../components";
function MainPage() {
  const { userName } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    authservice.getUser(userName).then((res) => {
      setUser(res.data.data);
    });
  }, [userName]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-200">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200">
      {/* Hero Section */}
      <div className="relative w-full p-4 md:h-64 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 rounded-b-3xl shadow-lg flex flex-col-reverse md:flex-row items-center justify-between px-10 md:px-20">
        {/* Left - User Details */}
        <div className="text-white text-center md:text-left md:w-2/3">
          <p className="text-lg font-medium opacity-80">{user.designation},</p>
          <h1 className="text-4xl font-bold">{user.fullName}</h1>
          <div className="mt-3 space-x-4">
            {user.linkedin && (
              <div className="flex">
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  LinkedIn
                </a>
                <img src={Linkedin} alt="linkedin logo" className="h-6 w-6" />
              </div>
            )}
            {user.googleScholar && (
              <div className="flex">
                <a
                  href={user.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  Google Scholar
                </a>
                <img src={Scholar} alt="linkedin logo" className="h-6 w-6" />
              </div>
            )}
            <div className="flex">
              <a
                href={`http://localhost:5173/${userName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline"
              >
                Recoz
              </a>
            </div>
          </div>
        </div>

        {/* Right - Professor's Full Photo */}
        <div className="flex justify-center md:justify-end md:w-1/3">
          <img
            src={user.avatar}
            alt="Professor"
            className="w-40 h-40 md:w-54 md:h-54 lg:w-60 lg:h-60 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="p-8 bg-blue-200">
        <TeachingExperiences userName={userName} />
        <Posts userName={userName} />
        <Achievements userName={userName} />
        <Awards userName={userName} />
        <Collaborations userName={userName} />
        <Conferences userName={userName} />
        <Projects userName={userName} />
      </div>
    </div>
  );
}

export default MainPage;
