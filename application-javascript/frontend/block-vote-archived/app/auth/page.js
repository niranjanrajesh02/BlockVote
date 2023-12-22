"use client"
import React from 'react';

const Auth = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Authentication</h1>
      <p className="text-2xl font-bold">Login to cast your vote</p>
      <p className="text-xl italic ">Powered by Hyperledger Fabric!</p>
      {/* login button */}
      <a href="/api/auth/login" className="mt-4 hover:text-blue-500 underline text-white rounded-md p-4 bg-teal-900 ">
        Authenticate
      </a>
    </div>
  );
};

export default Auth;