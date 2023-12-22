"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const data = {
  "candidates": { "Dummy1": 0, "Dummy2": 9, "Dummy3": 199 }
};


const Admin = () => {
  const [candCountInfo, setCandCountInfo] = useState(data.candidates);

  useEffect(() => {
    axios.get('http://localhost:4000/count')
      .then(response => {
        console.log("Response from server:");
        console.log(response.data);
        setCandCountInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching count:', error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      {/* cards for each candidate */}
      <div className="flex flex-row">
        {Object.keys(candCountInfo).map((candidate, index) => (
          <div key={index} className="flex flex-col items-center justify-center bg-gray-900 text-white m-4 p-4 rounded-md">
            <p className="text-2xl font-bold">{candidate}</p>
            <div>
              <p className="text-xl text-gray-400 italic">Number of votes:</p>
              <p className="text-xl italic">{candCountInfo[candidate]}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href='audit' className="mt-4 hover:bg-blue-500  text-white rounded-md p-4 bg-teal-800">Audit Election</Link>
    </div>
  );
};

export default Admin;