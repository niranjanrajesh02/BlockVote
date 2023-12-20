"use client"
import React from "react";
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <p className="text-white text-lg font-bold">{user.name}</p>
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/candidates">
                  <p>Candidates</p>
                </Link>
              </li>
              <li>
                <Link href="/vote">
                  <p>Voting</p>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <p>Admin</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;