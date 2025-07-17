import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';

function UserList() {
  const token = useSelector((state) => state.auth.token);
  const reduxUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setAlert({ show: true, type: 'Error', msg: 'Failed to load users' });
      } finally {
        setLoading(false);
      }
    };

    if (token && reduxUser?._id) {
      fetchUsers();
    }
  }, [token, reduxUser?._id]);

  const handleFollow = async (targetId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${targetId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await dispatch(fetchCurrentUser());

      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Redux user update failed');
      }

    } catch (error) {
      console.error(error);
      setAlert({ show: true, type: 'Error', msg: 'Follow/Unfollow Failed.' });
    }
  };

  if (!reduxUser || loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const filteredUsers=users.filter((user)=>
  user._id!==reduxUser?._id && user.username.toLowerCase().includes(search.toLowerCase()));
  
  return (
  <div className="max-w-xl mx-auto p-4">
    {alert.show && (
      <div
        className="alert mb-4 p-2 rounded"
        style={{ backgroundColor: '#C7B7A3', color: 'black' }}
      >
        {`${alert.type}: ${alert.msg}`}
      </div>
    )}

    <input
      type="text"
      placeholder="Search users..."
      value={search}
      onChange={(e) => setsearch(e.target.value)}
      className="mb-4 w-full p-2 border rounded"
    />

    {filteredUsers.map((user) => {
      const isFollowing = reduxUser.following?.includes(user._id);

      return (
        <div
          key={user._id}
          className="flex items-center justify-between border-b py-2"
        >
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || '/Pics/default-Avtar.png'}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <Link
              to={`/user/${user._id}`}
              className="font-semibold hover:underline"
            >
              {user.username}
            </Link>
          </div>

          <button
            onClick={() => handleFollow(user._id)}
            className="text-sm px-3 py-1 border rounded bg-amber-100 hover:bg-amber-200"
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      );
    })}
  </div>
);

}

export default UserList;
