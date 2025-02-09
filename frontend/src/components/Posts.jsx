import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import postservice from "../backend/posts.config";
import more from "../files/more.svg";
import { useNavigate } from "react-router";
function Posts(userName) {
  console.log(userName);
  const [posts, setPosts] = useState([]);
  const [loadposts, setLoadposts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // Show 4 posts initially
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData); // Get logged-in user
  console.log(currentUser);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postservice.getAll(userName);
        setPosts(response.data.data);
        setLoadposts(response.data.data);
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

  const handleQueryChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setQuery(searchText);

    if (searchText.trim() === "") {
      setPosts(loadposts);
    } else {
      setPosts(
        loadposts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchText) ||
            post.content.toLowerCase().includes(searchText)
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center rounded-2xl my-1 p-4 bg-gray-100">
      {/* Header */}
      <div
        className="flex flex-wrap items-center w-full max-w-6xl mb-6 
  justify-center md:justify-between"
      >
        <h2 className="text-3xl m-1 mx-3 font-semibold text-gray-800">
          My, writings !
        </h2>
        {currentUser?.userName === userName.userName && (
          <button
            onClick={() => {
              navigate(`/addPost/${userName.userName}`);
            }} // Empty function
            className="bg-blue-600 m-1 mx-3 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Add Post
          </button>
        )}
      </div>
      <input
        type="text"
        value={query}
        placeholder="Search Something"
        onChange={handleQueryChange}
        className="mb-6 p-2 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Posts Container */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
          {posts.slice(0, visibleCount).map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 relative"
            >
              <h3
                className="text-lg font-bold text-gray-900"
                onClick={() => {
                  navigate(`/post/${post._id}`);
                }}
              >
                {post.title}
              </h3>
              <p
                className="text-gray-600 text-sm mt-1"
                onClick={() => {
                  navigate(`/post/${post._id}`);
                }}
              >
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
      ) : (
        <p className="text-center text-gray-500 w-full col-span-3">
          No posts found.
        </p>
      )}
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
