import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Block Vote</h1>
      <p className="text-2xl font-bold">Cast your vote on the blockchain</p>
      {/* <Image src="/blockchain.png" alt="Blockchain" width="200" height="200" /> */}
      {/* Login */}
      <Link href="/auth">
        <a className="mt-4 text-blue-500 underline">Go to Auth Page</a>
      </Link>

    </main >
  )
}
