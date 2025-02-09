import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import postservice from "../backend/posts.config";
import more from "../files/more.svg";
import { useNavigate } from "react-router";
function Posts(userName) {
  console.log(userName);
  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // Show 4 posts initially
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData); // Get logged-in user
  console.log(currentUser);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postservice.getAll(userName);
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userName]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4); // Load 4 more posts
  };

  const loadLess = () => {
    setVisibleCount((prev) => Math.max(4, prev - 4)); // Load 4 less, minimum 4
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-sm">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">All Posts</h2>
        {/* Show Add Post button if logged-in user matches userName */}
        {currentUser?.userName === userName.userName && (
          <button
            onClick={() => {
              navigate(`/addPost/${userName.userName}`);
            }} // Empty function
            className="bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Post
          </button>
        )}
      </div>

      {/* Posts Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {posts.slice(0, visibleCount).map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 relative"
          >
            <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {post.content.length > 100
                ? post.content.substring(0, 100) + "..."
                : post.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(post.datePosted).toLocaleDateString()}
            </p>

            {/* Edit Button - Only visible if the logged-in user owns the posts */}
            {currentUser?.userName === userName.userName && (
              <button
                id={post._id}
                onClick={(e) => {
                  navigate(`/editPost/${e.currentTarget.id}`);
                }} // Empty function
                className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Load More & Load Less Buttons */}
      <div className="flex w-full justify-center space-x-6 mt-6">
        {visibleCount < posts.length && (
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

      {/* Loading Indicator */}
      {loading && <p className="text-gray-500 mt-4">Loading posts...</p>}
    </div>
  );
}

export default Posts;
