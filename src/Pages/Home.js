import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart, AiOutlineUser, AiOutlinePlusCircle, AiOutlineLogout } from 'react-icons/ai';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { logout } from '../features/auth/authSlice';

function Home() {
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        alert('Failed to fetch posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  const handleLike = async (postId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e, postId) => {
    e.preventDefault();
    const text = comments[postId];
    if (!text) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
      setComments({ ...comments, [postId]: '' });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarButtons = () => (
    <div className="flex flex-col space-y-4 p-4">
      <button
        onClick={() => navigate('/profile')}
        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded"
      > My Page </button>
      <button
        onClick={() => navigate('/createpost')}
        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded"
      > Create Post </button>
      <button
        onClick={handleLogout}
        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded"
      > Logout</button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-amber-50 to-amber-200 relative pb-20 md:pb-0">
      {/* Sidebar for large screens */}
      <div className="hidden md:block w-[250px] bg-white shadow">
        <SidebarButtons />
      </div>

      {/* Posts Section */}
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-bold font-serif text-center text-amber-800 mb-4">Spotlight</h2>
        {loading ? (
          <Skeleton count={3} height={300} />
        ) : (
          Array.isArray(posts) && posts
            .filter(post => post && post._id && post.author)
            .map(post => {
              const isLiked = user?._id && Array.isArray(post.likes) && post.likes.map(String).includes(user._id);

              return (
                <div key={post._id} className="bg-white shadow rounded p-4 mb-6">
                  <Link className="font-semibold hover:font-bold" to={`/user/${post.author._id}`}>
                    {post.author.username}
                  </Link>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="post"
                      className="w-full h-[300px] object-cover rounded my-3"
                    />
                  )}
                  <p>{post.caption}</p>
                  <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</div>

                  {/* Likes */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className="mt-2 flex items-center text-red-500 gap-2"
                  >
                    {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                    <span>{post.likes?.length || 0}</span>
                  </button>

                  {/* Comment Input */}
                  <form className="mt-3 flex gap-2" onSubmit={(e) => handleComment(e, post._id)}>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Write a comment..."
                      value={comments[post._id] || ''}
                      onChange={(e) =>
                        setComments({ ...comments, [post._id]: e.target.value })
                      }
                    />
                    <button type="submit" className="text-blue-600 font-medium">Post</button>
                  </form>

                  {/* Comments */}
                  <div className="mt-3 space-y-1">
                    {Array.isArray(post.comments) && post.comments.map((comment, index) => (
                      <p key={index} className="text-sm">
                        <strong>{comment.user?.username || 'User'}</strong>: {comment.text}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Floating Bottom Nav (Mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center p-2 md:hidden z-50">
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-amber-700">
          <AiOutlineUser size={24} />
          <span className="text-xs">My Page</span>
        </button>
        <button onClick={() => navigate('/createpost')} className="flex flex-col items-center text-amber-700">
          <AiOutlinePlusCircle size={24} />
          <span className="text-xs">Post</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center text-amber-700">
          <AiOutlineLogout size={24} />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Home;
