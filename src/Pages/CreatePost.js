import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const token = useSelector(state => state.auth.token);
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
 setAlert({ show: true, type: "Success", msg: "Post Created..." });
setCaption('');
setImage(null);
setPreview(null);
setTimeout(() => navigate('/'), 1500);
    } catch (error) {
     setAlert({ show: true, type: "Error", msg: "Failed to Upload Image..." });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
 <div className='m-0 p-0'>
         {alert.show && (
        <div className="alert mb-4 p-2 rounded" style={{ backgroundColor: "#C7B7A3", color: "black" }}>
          {`${alert.type}: ${alert.msg}`}
        </div>
      )}
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-200 flex items-center justify-center px-4 py-8">
   
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-amber-700 mb-6">Create a New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-800"
            />
          </div>

          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            <FiUpload />
            Post
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default CreatePost;
