"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { User, Mail, Calendar, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { VivecruitLoader, VivecruitTextLoader } from '@/components/ui/vivecruit-loader';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          toast.error('Error loading profile');
          return;
        }

        if (!user) {
          router.push('/auth');
          return;
        }

        setUser(user);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <VivecruitTextLoader size="large" text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">
                  {user.app_metadata?.provider === 'google' ? 'Google Account' : 'Email Account'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard')}
            >
              <User className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/settings')}
            >
              <Building className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User ID Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                {user.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Sign In</p>
              <p className="font-medium">
                {user.last_sign_in_at ? 
                  new Date(user.last_sign_in_at).toLocaleString('en-US') : 
                  'Never'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
