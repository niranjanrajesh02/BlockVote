"use client"
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }


  useEffect(() => {
    if (!user) {
      return;
    }
    let data = JSON.stringify({
      "userName": user.name
    });
    let config = {
      method: 'post',
      url: 'http://localhost:4000/register',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("Error registering voter" + error);
      });
  }, [user]);


  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Block Vote</h1>
      <p className="text-2xl font-bold">Cast your vote on the blockchain</p>
      <p className="text-xl italic ">Powered by Hyperledger Fabric!</p>
      {user ? (
        <div className='flex flex-col mt-5 justify-center'>
          <p className="text-lg">Welcome, {user.name}!</p>
          <div className='flex mt-5'>
            <Link href="api/auth/logout" className="mt-4  text-red-500 rounded-md p-4 hover:underline ">
              Logout
            </Link>
          </div>
          <div>
            <Link href="candidates" className="mt-4  text-white rounded-md p-4 hover:underline ">
              View Candidates
            </Link>
          </div>
          <div>
            <Link href="vote" className="mt-4  text-white rounded-md p-4 hover:underline ">
              Cast your vote!
            </Link>
          </div>
          <div>
            <Link href="admin" className="mt-4  text-white rounded-md p-4 hover:underline ">
              Admin Dashboard
            </Link>
          </div>

        </div>
      ) : (
        <Link href="/api/auth/login" className="mt-4 hover:bg-blue-500  text-white rounded-md p-4 bg-teal-800">
          Authenticate
        </Link>
      )}
    </main>
  );
}
