import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to StudAid</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Your personalized career path guide to academic and professional success
        </p>
        <div className="space-y-4">
          <Link 
            href="/details"
            className="block w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Get Started
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Let's help you find your perfect career path
          </p>
        </div>
      </div>
    </main>
  );
}
