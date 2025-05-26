'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, BookOpen, User, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:bg-gray-100"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>View and manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{profile.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education Level</p>
                    <p className="mt-1 text-sm text-gray-900">{profile.education_level || 'Not set'}</p>
                  </div>
                  {profile.stream && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stream</p>
                      <p className="mt-1 text-sm text-gray-900">{profile.stream}</p>
                    </div>
                  )}
                  {profile.goal && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Goal</p>
                      <p className="mt-1 text-sm text-gray-900">{profile.goal}</p>
                    </div>
                  )}
                  {profile.specialization && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Specialization</p>
                      <p className="mt-1 text-sm text-gray-900">{profile.specialization}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Quick Actions */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/materials')}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  View Study Materials
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/profile')}
                >
                  <User className="h-5 w-5 mr-2" />
                  Update Profile
                </Button>
                {profile.education_level === '12th' && (
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/foundation')}
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Foundation Program
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Course Completion</span>
                      <span className="text-sm font-medium text-gray-700">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Assignments</span>
                      <span className="text-sm font-medium text-gray-700">2/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Quizzes</span>
                      <span className="text-sm font-medium text-gray-700">1/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
