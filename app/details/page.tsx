'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DetailsPage() {
  const router = useRouter();
  const [educationLevel, setEducationLevel] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!educationLevel) {
      setError('Please select your education level');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call or processing
    setTimeout(() => {
      if (educationLevel === '12th') {
        router.push('/foundation');
      } else {
        // Handle other education levels if needed
        router.push('/coming-soon');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h1>
          <p className="text-gray-600">Help us personalize your experience</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
              What is your current education level?
            </label>
            <select
              id="education"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Select your education level</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="undergrad">Undergraduate</option>
              <option value="grad">Graduate</option>
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
