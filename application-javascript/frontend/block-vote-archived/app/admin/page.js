const data = {
  "candidates": [
    {
      "name": "Nishtha Das",
      "votes": 0
    },
    {
      "name": "Adit Dhawan",
      "votes": 43
    },
    {
      "name": "Chanchal Bajoria",
      "votes": 12
    }
  ]
};



const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      {/* cards for each candidate */}
      <div className="flex flex-row">
        {data.candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col items-center justify-center bg-gray-900 text-white m-4 p-4 rounded-md">
            <p className="text-2xl font-bold">{candidate.name}</p>
            <div>
              <p className="text-xl text-gray-400 italic">Bio:</p>
              <p className="text-xl italic">{candidate.votes}</p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;