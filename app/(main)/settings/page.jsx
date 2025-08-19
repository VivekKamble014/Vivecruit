"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mail, 
  Key, 
  Trash2,
  Save,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Download,
  Upload,
  Settings as SettingsIcon
} from 'lucide-react';
import { VivecruitTextLoader } from '@/components/ui/vivecruit-loader';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    interviewReminders: true,
    resultsReady: true
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    timezone: 'UTC'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          toast.error('Error loading user data');
          return;
        }
        setUser(user);
        
        // Load user preferences from localStorage
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        
        // Apply dark mode
        if (savedDarkMode) {
          document.documentElement.classList.add('dark');
        }
        
        // Load profile data
        if (user) {
          setProfile({
            firstName: user.user_metadata?.firstName || '',
            lastName: user.user_metadata?.lastName || '',
            company: user.user_metadata?.company || '',
            phone: user.user_metadata?.phone || '',
            timezone: user.user_metadata?.timezone || 'UTC'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`Dark mode ${newDarkMode ? 'enabled' : 'disabled'}`);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          company: profile.company,
          phone: profile.phone,
          timezone: profile.timezone
        }
      });

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Error updating profile');
        return;
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (password.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        password: password.new
      });

      if (error) {
        console.error('Error changing password:', error);
        toast.error('Error changing password');
        return;
      }

      toast.success('Password changed successfully');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const data = {
      user: user,
      profile: profile,
      notifications: notifications,
      settings: {
        darkMode: darkMode
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vivecruit-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        console.error('Error deleting account:', error);
        toast.error('Error deleting account');
        return;
      }

      toast.success('Account deleted successfully');
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting account');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <VivecruitTextLoader size="large" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-violet-600" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      placeholder="Enter your first name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      placeholder="Enter your last name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <Input
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      placeholder="Enter your company name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="Enter your phone number"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="CST">Central Time</option>
                    <option value="MST">Mountain Time</option>
                  </select>
                </div>
                <Button 
                  onClick={saveProfile} 
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {saving ? <VivecruitTextLoader size="small" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Key className="h-5 w-5 text-violet-600" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password.current}
                      onChange={(e) => setPassword({...password, current: e.target.value})}
                      placeholder="Enter current password"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={password.new}
                      onChange={(e) => setPassword({...password, new: e.target.value})}
                      placeholder="Enter new password"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({...password, confirm: e.target.value})}
                      placeholder="Confirm new password"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <Button 
                  onClick={changePassword} 
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {saving ? <VivecruitTextLoader size="small" /> : <Key className="h-4 w-4 mr-2" />}
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="h-5 w-5 text-violet-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({...notifications, [key]: !value})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Appearance */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-violet-600" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-violet-600"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6">
                      {darkMode ? <Moon className="h-3 w-3 text-violet-600" /> : <Sun className="h-3 w-3 text-violet-600" />}
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-violet-600" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={exportData}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={deleteAccount}
                    disabled={saving}
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  >
                    {saving ? <VivecruitTextLoader size="small" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
