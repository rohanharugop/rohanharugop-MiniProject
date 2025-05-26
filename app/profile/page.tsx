'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast, Toaster } from 'sonner';

export default function ProfilePage() {
  const { user, profile, updateProfile, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    full_name: '',
    education_level: '',
    stream: '',
    goal: '',
    specialization: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        education_level: profile.education_level || '',
        stream: profile.stream || '',
        goal: profile.goal || '',
        specialization: profile.specialization || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Update Your Profile</CardTitle>
            <CardDescription>
              Keep your information up to date to get the best experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="education_level">Education Level</Label>
                  <Input
                    id="education_level"
                    name="education_level"
                    type="text"
                    value={formData.education_level}
                    onChange={handleChange}
                    placeholder="e.g., 10th, 12th, Graduation"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stream">Stream (Optional)</Label>
                  <Input
                    id="stream"
                    name="stream"
                    type="text"
                    value={formData.stream}
                    onChange={handleChange}
                    placeholder="e.g., Science, Commerce, Arts"
                  />
                </div>

                <div>
                  <Label htmlFor="goal">Goal (Optional)</Label>
                  <Input
                    id="goal"
                    name="goal"
                    type="text"
                    value={formData.goal}
                    onChange={handleChange}
                    placeholder="e.g., IIT JEE, NEET, UPSC"
                  />
                </div>

                <div>
                  <Label htmlFor="specialization">Specialization (Optional)</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science, Medicine, Law"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
