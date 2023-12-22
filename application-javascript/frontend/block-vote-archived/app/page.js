import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Block Vote</h1>
      <p className="text-2xl font-bold">Cast your vote on the blockchain</p>
      <p className="text-xl italic ">Powered by Hyperledger Fabric!</p>
      {/* login button */}
      <Link href="/api/auth/login" className="mt-4 hover:text-blue-500 underline text-white rounded-md p-4 bg-teal-800 ">
        Authenticate
      </Link>

    </main >
  )
}
