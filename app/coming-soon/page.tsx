import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Coming Soon!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          We're currently working on this section. Please check back later!
        </p>
        <div className="space-y-4">
          <Link 
            href="/welcome"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
