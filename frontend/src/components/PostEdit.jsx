import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import postservice from "../backend/posts.config";
import errorTeller from "../backend/errorTeller.js"
function PostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postservice.getOne(postId);
        setFormData(response.data.data);
        setUserName(response.data.data?.author?.userName);
      } catch (err) {
        setError(errorTeller(err));
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await postservice.edit(postId, {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
      });
      navigate(`/${userName}`);
    } catch (err) {
      setError(errorTeller(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await postservice.deleteOne(postId);
      navigate(`/${userName}`);
    } catch (err) {
      setError(errorTeller(err));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Edit Post
        </h2>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />

          {/* Content */}
          <textarea
            name="content"
            placeholder="Update your content..."
            required
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 h-32"
          />

          {/* Tags Input */}
          <div>
            <input
              type="text"
              placeholder="Press Enter to add tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
            <div className="flex flex-wrap mt-2">
              {formData?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 mb-2 cursor-pointer"
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Submit & Delete Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-2/3 bg-blue-600 mr-3 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-1/3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostEdit;
