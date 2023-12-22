"use client"
import { useState, useEffect } from "react";
import axios from "axios";


const dummy_voters = [
  {
    voterID: "1",
    voted_for: "Joe Biden",
  },
  {
    voterID: "2",
    voted_for: "Narendra Modi",
  },
  {
    voterID: "3",
    voted_for: "Donald Trump",
  },
];

const VoterCards = () => {
  const [voters, setVoters] = useState(dummy_voters);
  useEffect(() => {
    axios.get('http://localhost:4000/audit')
      .then(response => {
        console.log("Response from server:");
        console.log(response.data);
        setVoters(response.data);
      })
      .catch(error => {
        console.error('Error fetching audit request:', error);
      });
  }, []);
  return (
    <>
      <h1 className="text-4xl font-bold">Election Audit</h1>
      <div className="flex flex-wrap w-screen justify-center">
        {voters.map((voter) => (
          <div
            key={voter.voterID}
            className="border border-black rounded-md p-4 m-4 text-center"
          >
            <h3 className="text-xl font-bold">Voter ID: {voter.voterID}</h3>
            <p className="text-lg">Voted for: {voter.voted_for}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default VoterCards;
