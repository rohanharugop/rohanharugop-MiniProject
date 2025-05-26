'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  email: string;
  name?: string | null;
  full_name?: string; // For backward compatibility with existing code
  age?: number | null;
  gender?: string | null;
  education_status?: string | null;
  education_level?: string | null; // For backward compatibility
  stream?: string | null;
  goal?: string; // Not in database, kept for type compatibility
  specialization?: string; // Not in database, kept for type compatibility
  created_at?: string;
  updated_at?: string;
};

type AuthContextType = {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    email: string;
    password: string;
    full_name: string;
    education_level: string;
    stream: string;
    goal: string;
    specialization: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast.error('Error loading your session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Map database fields to our UserProfile type
      const profileData: UserProfile = {
        ...data,
        full_name: data.name, // Map name to full_name for backward compatibility
        education_level: data.education_status, // Map education_status to education_level
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      setLoading(true);
      
      // Map the profile data to match the database schema
      const dbProfileData: Record<string, any> = { ...profileData };
      
      // Map full_name to name for the database
      if ('full_name' in profileData) {
        dbProfileData.name = profileData.full_name;
        delete dbProfileData.full_name;
      }
      
      // Map education_level to education_status for the database
      if ('education_level' in profileData) {
        dbProfileData.education_status = profileData.education_level;
        delete dbProfileData.education_level;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(dbProfileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Map the response back to our UserProfile type
      const updatedProfile: UserProfile = {
        ...data,
        full_name: data.name,
        education_level: data.education_status,
      };
      
      setProfile(updatedProfile);
      toast.success('Profile updated successfully!');
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Signed in successfully!');
      // The actual redirect is handled by the middleware
      // The middleware will redirect to the dashboard or the originally requested page
      
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    full_name: string;
    education_level: string;
    stream: string;
    goal: string;
    specialization: string;
  }) => {
    try {
      setLoading(true);
      console.log('Starting signup process for:', userData.email);
      
      // First, check if we can connect to Supabase
      console.log('Supabase client initialized, attempting to sign up...');
      
      // Create user in auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: userData.full_name,
          },
        },
      });

      console.log('Auth response:', { authData, signUpError });

      if (signUpError) {
        console.error('Signup error details:', {
          message: signUpError.message,
          status: signUpError.status,
          name: signUpError.name,
        });
        throw signUpError;
      }
      
      if (!authData.user) {
        console.error('No user returned from signup');
        throw new Error('User creation failed: No user data returned');
      }

      console.log('Auth successful, creating profile...');

      // Create profile in database
      const profileData = {
        id: authData.user.id,
        name: userData.full_name,
        email: userData.email, // Make sure to include email in the profile
        education_status: userData.education_level,
        stream: userData.stream,
        // For fields not in our form, we'll set default values
        age: null,
        gender: null,
      };

      console.log('Profile data to be inserted:', profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      console.log('Profile creation response:', { profileResult, profileError });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Update local state
      const userProfile: UserProfile = {
        id: authData.user.id,
        email: userData.email,
        name: userData.full_name,
        full_name: userData.full_name,
        education_status: userData.education_level,
        education_level: userData.education_level,
        stream: userData.stream,
        goal: userData.goal,
        specialization: userData.specialization,
      };

      setProfile(userProfile);
      console.log('Profile created and state updated, redirecting...');
      
      // Don't redirect to dashboard immediately as email confirmation might be required
      // Instead, show a success message and let the user know to check their email
      toast.success('Account created successfully! Please check your email to confirm your account.');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: unknown) {
      // Type guard to check if error is an instance of Error
      const errorMessage = (error as Error)?.message || 'An unknown error occurred';
      const errorName = (error as Error)?.name || 'Error';
      const errorStack = (error as Error)?.stack;
      
      console.error('Error in signUp:', {
        name: errorName,
        message: errorMessage,
        stack: errorStack,
      });
      
      let userFriendlyMessage = 'Failed to create account. ';
      
      if (errorMessage.includes('already registered')) {
        userFriendlyMessage += 'This email is already registered. Please try logging in instead.';
      } else if (errorMessage.includes('password')) {
        userFriendlyMessage += 'Invalid password. Please ensure it meets the requirements.';
      } else {
        userFriendlyMessage += errorMessage;
      }
      
      toast.error(userFriendlyMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
