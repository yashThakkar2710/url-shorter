import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Shorten = () => {
  const [url, seturl] = useState("")
  const [shorturl, setshorturl] = useState("")
  const [generated, setGenerated] = useState(false)
  const [allurls, setAllurls] = useState([])
  const [userId, setuserId] = useState()
  const [setshowUrls, setSetshowUrls] = useState(false)

  const navigate = useNavigate()
  const generate = async(e) => {
         e.preventDefault();

         if(!url){
            alert("Enter Your url")
         }
         try {
             const response =await axios.post(
             "http://localhost:8000/api/v1/url/saveurl",{originalUrl:url},{ withCredentials: true }
            )
            setshorturl(response.data.data.shortId)
            setGenerated(true)
            setuserId(response.data.data.user)
            console.log(response.data.data.user)
            console.log(response)
            console.log(userId)
        } catch (error) {
            console.log("something went wrong",error)

         }
         seturl("")
  }
const showUrl =async (e)=>{
    e.preventDefault()
    try {
        const response =await axios.get(
        `http://localhost:8000/api/v1/url/user-urls/${userId}`,{ withCredentials: true }
       )
       console.log(response)
       const data =response.data.data
       console.log(data)
       data.map((obj)=>console.log(obj.originalUrl))
       
       
       const urls= data.map(item=>item.originalUrl)
       setAllurls(urls)
       console.log(allurls)
       setshowUrls(true)
       
   } catch (error) {
       console.log("something went wrong",error)

    }
}

const updateUrl=()=>{
    navigate(`/update/${userId}`)
}

  return (
      <div className='mx-auto max-w-lg bg-purple-100 my-16 p-8 rounded-lg flex flex-col gap-4'>
          <h1 className='font-bold text-2xl'>Generate your short URLs</h1>
          <div className='flex flex-col gap-2'>
              <input type="text"
                  value={url}
                  className='px-4 py-2 focus:outline-purple-600 rounded-md'
                  placeholder='Enter your URL'
                  onChange={e => { seturl(e.target.value) }} />

              
              <button onClick={generate} className='bg-purple-500 rounded-lg shadow-lg p-3 py-1 my-3 font-bold text-white'>Generate</button>
              <button onClick={showUrl} className='bg-purple-500 rounded-lg shadow-lg p-3 py-1 my-3 font-bold text-white'>All Url</button>
              <button onClick={updateUrl} className='bg-purple-500 rounded-lg shadow-lg p-3 py-1 my-3 font-bold text-white'>update the url</button>
          </div>

          {generated && <> <span className='font-bold text-lg'>{`www.${shorturl}.com`} </span><code><Link target="_blank" href={generated}>{generated}</Link> 
              </code></>}

                {showUrl && <h1 className='font-bold text-lg '>your all urls </h1>}
            {showUrl  && allurls.map((url)=>
             <>
               <span key={url} className='font-thin text-lg'>{url} </span>
             </>
            )}
      </div>
  )
}

export default Shorten