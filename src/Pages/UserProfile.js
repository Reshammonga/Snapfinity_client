import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [profileData, setProfileData] = useState(null);
  const [alert, setAlert] = useState({ status: false, type: '', msg: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
          headers: { Authorization: token },
        });
        setProfileData(res.data);
      } catch (error) {
        setAlert({ status: true, type: 'Error', msg: 'Failed to load profile.' });
      }
    };
    fetchProfile();
  }, [id, token]);

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-200 p-4">
      {alert.status && (
        <div className="max-w-xl mx-auto mb-4 p-3 rounded bg-yellow-100 text-yellow-900 border border-yellow-400 shadow">
          <strong>{alert.type}:</strong> {alert.msg}
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* User Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amber-800">{profileData.user.username}</h2>
          <p className="text-sm text-gray-600">{profileData.user.email}</p>
          <div className="flex gap-6 mt-2 text-sm text-gray-700">
            <span>
              <strong>{profileData.user.followers.length}</strong> Followers
            </span>
            <span>
              <strong>{profileData.user.following.length}</strong> Following
            </span>
          </div>
        </div>

        {/* Posts */}
        <h3 className="text-lg font-semibold mb-2 text-amber-900">Posts</h3>
        {profileData.posts.length === 0 ? (
          <div className="text-gray-500 italic">No posts yet.</div>
        ) : (
          profileData.posts.map((post) => (
            <div
              key={post._id}
              className="mb-5 rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <img
                src={post.imageUrl}
                alt="post"
                className="w-full max-h-96 object-cover"
              />
              <div className="p-3">
                <p className="mb-2 text-gray-800">{post.caption}</p>
                <small className="text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;
