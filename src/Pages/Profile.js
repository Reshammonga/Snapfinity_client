import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserList from "./UserList";
import { AiOutlineDelete } from "react-icons/ai";

function Profile() {
  const token = useSelector((state) => state.auth.token);
  const [profile, setProfile] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const defaultAvatar = "/Pics/default-Avtar.png";
const reduxUser = useSelector(state=>state.auth.user);

useEffect(() => {
 const fetchProfile=async()=>{
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`,{
      headers:{
        Authorization : `Bearer ${token}`
      }
     
    })
     setProfile(res.data);
  } catch (error) {
    setAlert({show:true,type:"Error",msg:"Failed to fetch Profile..."})
  }
 }
 fetchProfile();
}, [token,reduxUser?.following]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        setAlert({
          show: true,
          type: "Error",
          msg: "Failed to fetch profile",
        });
      }
    };
    fetchProfile();
  }, [token]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const handleDelete= async (postId)=>{
    const confirmDelete= window.confirm("Do you really want to delete this post?");
    if(!confirmDelete) return;
    try{
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`,{
        headers:{Authorization:`Bearer ${token}`},
      });
      const res=await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`,{
              headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setAlert({show:true,type:"Success",msg : "Post deleted Successfully.."});
    }catch(error){
          setAlert({
      show: true,
      type: "Error",
      msg: "Failed to delete the post.",
    });

    }
  }



  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-200 min-h-screen px-4 py-6 sm:p-8">
      {alert.show && (
        <div className="bg-amber-200 text-black px-4 py-2 mb-4 rounded shadow">
          {`${alert.type}: ${alert.msg}`}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Profile and Posts */}
        <div className="lg:w-3/5 w-full space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
            <img
              src={profile?.user?.avatar || defaultAvatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <h2 className="text-2xl font-bold text-amber-800">
                Hey, {profile?.user?.username}
              </h2>
              <p className="text-gray-600">{profile?.user?.email}</p>
              <div className="flex gap-4 mt-2 text-sm text-grey-700">
                <span><strong>{profile.user.followers.length}</strong> Followers</span>
                 <span><strong>{profile.user.following.length}</strong> Following</span>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-3">
              Your Snapshots
            </h2>

            {profile?.posts?.length === 0 ? (
              <div className="flex flex-col items-center text-center p-6">
                <img
                  src="/Pics/nopost.png"
                  alt="No post"
                  className="w-102 h-auto object-contain mb-4"
                />

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow p-3 transition hover:shadow-lg relative"
                  >
     

                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-60 object-cover rounded mb-2"
                    />
                    <p className="text-gray-800">{post.caption}</p>
                    <small className="text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </small>
                                 <button
  onClick={() => handleDelete(post._id)}
  className="absolute bottom-2 right-2 bg-amber-100 text-amber-600 p-1 rounded hover:bg-amber-200 transition"
  title="Delete Post"
>
  <AiOutlineDelete size={20} />

</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-2/5 w-full">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-bold  text-amber-700 mb-3">
              Discover People
            </h2>
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
