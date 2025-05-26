'use client';

import { useState } from 'react';
import StreamSelector from '@/components/stream-selector';
import Checklist from '@/components/checklist';

export default function FoundationPage() {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Foundation Pathway
        </h1>
        {!userId ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Select Your Stream and Goal
            </h2>
            <p className="text-gray-600 mb-6">
              Choose your stream and career goal to get a personalized checklist for your academic journey.
            </p>
            <StreamSelector onUserCreated={setUserId} />
          </div>
        ) : (
          <Checklist userId={userId} />
        )}
      </div>
    </main>
  );
}
