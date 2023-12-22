import Link from 'next/link';

const data = {
  "candidates": [
    {
      "name": "Nishtha Das",
      "info": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Ex cupiditate delectus temporibus eos voluptatibus reprehenderit maiores deleniti debitis repellendus laboriosam"
    },
    {
      "name": "Adit Dhawan",
      "info": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Ex cupiditate delectus temporibus eos voluptatibus reprehenderit maiores deleniti debitis repellendus laboriosam"
    },
    {
      "name": "Chanchal Bajoria",
      "info": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Ex cupiditate delectus temporibus eos voluptatibus reprehenderit maiores deleniti debitis repellendus laboriosam"
    }
  ]
}

const Candidates = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Meet your Candidates</h1>
      {/* cards for each candidate */}
      <div className="flex flex-row">
        {data.candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col items-center justify-center bg-gray-900 text-white m-4 p-4 rounded-md">
            <p className="text-2xl font-bold">{candidate.name}</p>
            <div>
              <p className="text-xl text-gray-400 italic">Bio:</p>
              <p className="text-xl italic">{candidate.info}</p>
            </div>
            <Link href="/vote" className="text-blue-500 underline">
              Vote!
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidates;