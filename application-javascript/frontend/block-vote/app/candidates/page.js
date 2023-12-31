"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const dummy_data = {
  "candidates": [
    {
      "name": "dummy1",
      "info": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Ex cupiditate delectus temporibus eos voluptatibus reprehenderit maiores deleniti debitis repellendus laboriosam"
    },
    {
      "name": "dummy2",
      "info": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Ex cupiditate delectus temporibus eos voluptatibus reprehenderit maiores deleniti debitis repellendus laboriosam"
    },
    {
      "name": "dummy3",
      "info": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Ex cupiditate delectus temporibus eos voluptatibus reprehenderit maiores deleniti debitis repellendus laboriosam"
    }
  ]
}


const Candidates = () => {
  const [candidates, setCandidates] = useState(dummy_data.candidates);

  useEffect(() => {
    axios.get('http://localhost:4000/candidates')
      .then(response => {
        console.log("Response from server:");
        console.log(response.data);
        setCandidates(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  return (
    <div className="min-h-screen max-w-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Meet your Candidates</h1>
      {/* cards for each candidate */}
      <div className="flex flex-row w-full justify-center items-center">
        {candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col items-center justify-center h-96 border border-gray-200 flex-none w-1/4 bg-gray-900 text-white m-4 p-4 rounded-md">
            <p className="text-2xl font-bold">{candidate.name}</p>
            <div>
              <p className="text-xl text-gray-400 italic">Bio:</p>
              <p className="text-xl italic">{candidate.info}</p>
            </div>
            <Link href="/vote" className="mt-2 text-blue-500 underline">
              Vote!
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidates;