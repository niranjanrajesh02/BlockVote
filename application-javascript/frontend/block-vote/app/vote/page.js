"use client"
import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
// pages/voting.js
const data = {
  "candidates": [
    { "name": "Nishtha Das", "votes": 0 },
    { "name": "Adit Dhawan", "votes": 43 },
    { "name": "Chanchal Bajoria", "votes": 12 }
  ]
}


const Voting = () => {
  const [candidates, setCandidates] = useState(data);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleConfirmVote = () => {
    // Perform the vote action here
    console.log(`Voted for ${selectedCandidate.name}`);
    // Reset the selected candidate
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen flex flex-row items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Voting for your candidate of choice</h1>
      <ul>
        {data.candidates.map((candidate, index) => (
          <li key={index}>
            {candidate.name}
            <button onClick={() => handleVote(candidate)}>Vote</button>
          </li>
        ))}
      </ul>

      {selectedCandidate && (
        <div className={`modal z-50 fixed inset-0 flex flex-col items-center justify-center ${selectedCandidate ? 'active' : ''}`}>
          <p>{user.name}, are you sure you want to vote for {selectedCandidate.name}? Remember you can only vote once.</p>
          <button onClick={handleConfirmVote}>Yes</button>
          <button onClick={() => setSelectedCandidate(null)}>No</button>
        </div>
      )}
    </div>
  );
};

export default Voting;