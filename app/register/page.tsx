'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    education_level: '12th',
    stream: 'Science',
    goal: 'Engineering',
    specialization: 'CS',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (currentStep === 1) {
      if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signUp({
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
        education_level: formData.education_level,
        stream: formData.stream,
        goal: formData.goal,
        specialization: formData.specialization,
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const educationLevels = [
    { value: '10th', label: '10th Pass' },
    { value: '12th', label: '12th Pass' },
    { value: 'undergrad', label: 'Undergraduate' },
    { value: 'grad', label: 'Graduate' },
  ];

  const streams = [
    { value: 'Science', label: 'Science' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Arts', label: 'Arts' },
  ];

  const goals = {
    Science: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Pure Sciences', label: 'Pure Sciences' },
    ],
    Commerce: [
      { value: 'Bachelor of Commerce', label: 'Bachelor of Commerce' },
      { value: 'Business Administration', label: 'Business Administration' },
    ],
    Arts: [
      { value: 'Law', label: 'Law' },
      { value: 'History', label: 'History' },
    ],
  };

  const specializations = {
    'Science_Engineering': [
      { value: 'CS', label: 'Computer Science' },
      { value: 'EE', label: 'Electrical Engineering' },
    ],
    'Science_Pure Sciences': [
      { value: 'General', label: 'General' },
    ],
    'Commerce_Bachelor of Commerce': [
      { value: 'General', label: 'General' },
    ],
    'Commerce_Business Administration': [
      { value: 'General', label: 'General' },
    ],
    'Arts_Law': [
      { value: 'General', label: 'General' },
    ],
    'Arts_History': [
      { value: 'General', label: 'General' },
    ],
  };

  const getSpecializations = () => {
    const key = `${formData.stream}_${formData.goal}`;
    return specializations[key as keyof typeof specializations] || [];
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {currentStep === 1 ? 'Step 1: Personal Information' : 'Step 2: Educational Details'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 py-8 px-6 shadow-xl rounded-lg sm:px-10">
          <form onSubmit={currentStep === 1 ? handleNext : handleSubmit} className="space-y-6">
            {currentStep === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="education_level" className="block text-sm font-medium text-gray-300">
                      Education Level <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="education_level"
                        name="education_level"
                        required
                        value={formData.education_level}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {educationLevels.map((level) => (
                          <option key={level.value} value={level.value} className="bg-gray-800">
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="stream" className="block text-sm font-medium text-gray-300">
                      Stream <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="stream"
                        name="stream"
                        required
                        value={formData.stream}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {streams.map((stream) => (
                          <option key={stream.value} value={stream.value} className="bg-gray-800">
                            {stream.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-300">
                      Career Goal <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="goal"
                        name="goal"
                        required
                        value={formData.goal}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {goals[formData.stream as keyof typeof goals]?.map((goal) => (
                          <option key={goal.value} value={goal.value} className="bg-gray-800">
                            {goal.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-300">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="specialization"
                        name="specialization"
                        required
                        value={formData.specialization}
                        onChange={handleChange}
                        className="bg-gray-700 text-white appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {getSpecializations().map((spec) => (
                          <option key={spec.value} value={spec.value} className="bg-gray-800">
                            {spec.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6">
              {currentStep === 1 ? (
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Already have an account? Sign in
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Back
                </button>
              )}
              
              <div className="flex items-center">
                {currentStep === 1 ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Next'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
