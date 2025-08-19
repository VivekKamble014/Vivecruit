"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  Eye, 
  Copy, 
  Trash2, 
  Edit,
  Plus,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { VivecruitTextLoader, VivecruitSpinner } from '@/components/ui/vivecruit-loader';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AllInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          toast.error('Error loading user data');
          setLoading(false);
          return;
        }
        
        if (!user) {
          console.error('No user found');
          toast.error('Please log in to view your interviews');
          setLoading(false);
          return;
        }
        
        console.log('✅ User authenticated:', user.email);
        setUser(user);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading user data');
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Fetch interviews when user is available
  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const retryFetch = () => {
    if (user?.email) {
      fetchInterviews();
    } else {
      toast.error('Please log in to view your interviews');
    }
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching interviews for user email:', user.email);
      
      // Fetch interviews using userEmail field
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('userEmail', user.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interviews:', error);
        toast.error('Error loading interviews');
        return;
      }

      console.log('Fetched interviews:', data);
      setInterviews(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Loaded ${data.length} interviews successfully`);
      } else {
        toast.info('No interviews found for your account');
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error loading interviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (interviewId) => {
    try {
      setDeletingId(interviewId);
      
      // First, check if the interview belongs to the current user
      const { data: interviewData, error: fetchError } = await supabase
        .from('interviews')
        .select('userEmail')
        .eq('interview_Id', interviewId)
        .single();

      if (fetchError) {
        console.error('Error fetching interview details:', fetchError);
        toast.error('Error fetching interview details');
        return;
      }

      // Check if user owns this interview
      const isOwner = interviewData.userEmail === user.email;

      if (!isOwner) {
        toast.error('You can only delete interviews you created');
        return;
      }
      
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('interview_Id', interviewId);

      if (error) {
        console.error('Error deleting interview:', error);
        toast.error('Error deleting interview');
        return;
      }

      toast.success('Interview deleted successfully');
      fetchInterviews();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting interview');
    } finally {
      setDeletingId(null);
    }
  };

  const copyInterviewLink = (interviewId) => {
    const link = `${window.location.origin}/interview/${interviewId}`;
    navigator.clipboard.writeText(link);
    toast.success('Interview link copied to clipboard!');
  };

  const viewInterviewResults = (interviewId) => {
    window.open(`/interview/${interviewId}/results`, '_blank');
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || interview.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getInterviewTypeColor = (type) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-800 border-blue-200',
      'Behavioral': 'bg-green-100 text-green-800 border-green-200',
      'Experience-Based': 'bg-purple-100 text-purple-800 border-purple-200',
      'Problem Solving': 'bg-orange-100 text-orange-800 border-orange-200',
      'Situational': 'bg-pink-100 text-pink-800 border-pink-200',
      'Theoretical': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Creative Thinking': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Global/International': 'bg-red-100 text-red-800 border-red-200',
      'Language Proficiency': 'bg-teal-100 text-teal-800 border-teal-200',
      'Time Management': 'bg-gray-100 text-gray-800 border-gray-200',
      'Remote Work Skills': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Cognitive Ability': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'AI/Automation Awareness': 'bg-violet-100 text-violet-800 border-violet-200',
      'Networking Skills': 'bg-rose-100 text-rose-800 border-rose-200',
      'Security Awareness': 'bg-amber-100 text-amber-800 border-amber-200',
      'Checklist-Based': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <VivecruitTextLoader size="large" text="Loading your interviews..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view your interviews.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Management</h1>
            <p className="text-gray-600 text-lg">
              Manage and track all your AI-powered interviews
            </p>
          </div>
          <Link href="/dashboard/create-interview">
            <Button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-6 py-3">
              <Plus className="h-5 w-5" />
              Create New Interview
            </Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search interviews by position, description, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-violet-500 focus:ring-violet-500"
                >
                  <option value="all">All Types</option>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Experience-Based">Experience-Based</option>
                  <option value="Problem Solving">Problem Solving</option>
                  <option value="Situational">Situational</option>
                  <option value="Theoretical">Theoretical</option>
                  <option value="Creative Thinking">Creative Thinking</option>
                  <option value="Global/International">Global/International</option>
                  <option value="Language Proficiency">Language Proficiency</option>
                  <option value="Time Management">Time Management</option>
                  <option value="Remote Work Skills">Remote Work Skills</option>
                  <option value="Cognitive Ability">Cognitive Ability</option>
                  <option value="AI/Automation Awareness">AI/Automation Awareness</option>
                  <option value="Networking Skills">Networking Skills</option>
                  <option value="Security Awareness">Security Awareness</option>
                  <option value="Checklist-Based">Checklist-Based</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">Total Interviews</p>
                <p className="text-3xl font-bold">{interviews.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold">
                  {interviews.filter(i => i.status === 'active').length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Activity className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">
                  {interviews.filter(i => i.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold">
                  {interviews.filter(i => {
                    const interviewDate = new Date(i.created_at);
                    const now = new Date();
                    return interviewDate.getMonth() === now.getMonth() && 
                           interviewDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Zap className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interviews Grid/List */}
      {filteredInterviews.length === 0 ? (
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-violet-100 p-6 rounded-full">
                <Calendar className="h-16 w-16 text-violet-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm || filterType !== 'all' ? 'No interviews found' : 'Start Your Interview Journey'}
                </h3>
                <p className="text-gray-600 text-lg mb-6 max-w-md">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : 'Create your first AI-powered interview and revolutionize your hiring process.'
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  {!searchTerm && filterType === 'all' && (
                    <Link href="/dashboard/create-interview">
                      <Button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-6 py-3">
                        <Plus className="h-5 w-5" />
                        Create Your First Interview
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={retryFetch}
                    className="flex items-center gap-2 px-6 py-3"
                  >
                    <Search className="h-5 w-5" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
          "space-y-4"
        }>
          {filteredInterviews.map((interview) => (
            <Card key={interview.interview_Id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {interview.jobPosition}
                      </CardTitle>
                      {getStatusIcon(interview.status)}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getInterviewTypeColor(interview.type)}`}>
                        {interview.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        interview.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        interview.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {interview.status || 'Draft'}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {interview.jobDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{interview.duration || '30'} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(interview.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInterviewLink(interview.interview_Id)}
                    className="flex items-center gap-2 text-violet-600 border-violet-200 hover:bg-violet-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewInterviewResults(interview.interview_Id)}
                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                    Results
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/interview/${interview.interview_Id}`, '_blank')}
                    className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteInterview(interview.interview_Id)}
                    disabled={deletingId === interview.interview_Id}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    {deletingId === interview.interview_Id ? (
                      <VivecruitSpinner size="small" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
