import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import postservice from "../backend/posts.config";

function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    postservice.getOne(postId).then((res) => {
      setPost(res.data.data);
    });
  }, [postId]);

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-200">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blue-900">{post.title}</h1>
        <p className="text-gray-600 mt-2">
          By <span className="font-medium">{post.author.userName}</span>
        </p>
        <p className="text-gray-500 text-sm">
          {new Date(post.datePosted).toLocaleDateString()}
        </p>

        <div className="mt-4 text-gray-800 leading-relaxed">{post.content}</div>

        <div className="mt-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mr-2"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
