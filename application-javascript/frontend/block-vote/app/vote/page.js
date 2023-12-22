"use client"
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'
// pages/voting.js

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

const Voting = () => {
  const [candidates, setCandidates] = useState(dummy_data.candidates);
  const router = useRouter();
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

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleConfirmVote = () => {
    // Perform the vote action here
    var data = JSON.stringify({
      "voterID": user.name,
      "candidateName": selectedCandidate.name
    });

    var config = {
      method: 'post',
      url: 'http://localhost:4000/vote',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log(`Voted for ${selectedCandidate.name}`);
        if (response.data == "Transaction has been submitted.") {
          alert("Vote successful!");
          router.push('/');
        }
        else if (response.data.startsWith("Transaction failed")) {
          alert("Vote failed! You have already voted.");
          router.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
      });


    // Reset the selected candidate
    setSelectedCandidate(null);
  };

  return (
    <>
      {user && (
        <div className="min-h-screen flex flex-row items-center justify-center bg-gray-900 text-white">
          {!selectedCandidate && (
            <div className='flex flex-col justify-center items-center'>
              <h1 className="text-4xl font-bold">Vote for your candidate of choice</h1>
              <ul>
                {candidates.map((candidate, index) => (
                  <li key={index}>
                    {candidate.name}
                    <button className='my-5 hover:cursor-pointer hover:underline bg-green-600 p-1 mx-3 rounded-lg' onClick={() => handleVote(candidate)}>Vote</button>
                  </li>
                ))}
              </ul>
            </div>)}

          {selectedCandidate && (
            <div className={`modal z-50 fixed inset-0 flex flex-col items-center justify-center ${selectedCandidate ? 'active' : ''}`}>
              <p>{user.name}, are you sure you want to vote for {selectedCandidate.name}? Remember you can only vote once.</p>
              <button className="hover:text-green-500 hover:underline " onClick={handleConfirmVote}>Yes</button>
              <button className="hover:text-red-500 hover:underline" onClick={() => setSelectedCandidate(null)}>No</button>
            </div>
          )}
        </div>)}
      {!user && (
        <Link href="/api/auth/login" className="mt-4 hover:bg-blue-500  text-white rounded-md p-4 bg-teal-800">
          Authenticate </Link>)}
    </>
  );
};

export default Voting;