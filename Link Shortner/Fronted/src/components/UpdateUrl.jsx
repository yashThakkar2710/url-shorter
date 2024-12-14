import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateUrl = () => {
  
  const [longUrl, setLongUrl] = useState('');
  const [shorturl, setShorturl] = useState('')

  const [newLongUrl, setNewLongUrl] = useState()
  const [showUrl, setshowUrl] = useState(false)
  // const [userId, setUserId] = useState()
  const { userId } = useParams();

  

  const handleUpdate = async (e) => {
    console.log(userId)
    e.preventDefault();
    const response = await axios
      .put(`http://localhost:8000/api/v1/url/update-url/${userId}`, { shortId:shorturl,originalUrl:longUrl },{ withCredentials: true })
      console.log(response.data.data.originalUrl)
      setNewLongUrl(response.data.data.originalUrl)
      setshowUrl(true)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
        <h1 className="text-3xl font-semibold mb-4 text-center">Update URL</h1>
        <form onSubmit={handleUpdate}>
          <input
            // type="url"
            value={
              shorturl
            }
            onChange={(e) => setShorturl(e.target.value)}
            placeholder="Enter short url "
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            // type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter New Long URL"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md"
          >
            Update URL
          </button>
        </form>
      </div>

      {showUrl && <h1 className='font-bold text-lg '>{newLongUrl} </h1>}
    </div>
  );
};

export default UpdateUrl;
