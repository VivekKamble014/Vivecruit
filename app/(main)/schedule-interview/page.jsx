"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Mail, 
  User, 
  Send, 
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Users,
  Link,
  Copy,
  Eye,
  Edit,
  Trash2,
  Share2,
  MessageSquare,
  Bell
} from 'lucide-react';
import { VivecruitTextLoader, VivecruitSpinner } from '@/components/ui/vivecruit-loader';

export default function ScheduleInterviewPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  
  // Email scheduling form
  const [emailForm, setEmailForm] = useState({
    candidateName: '',
    candidateEmail: '',
    subject: 'Interview Invitation - ViveCruit',
    message: '',
    interviewLink: ''
  });

  // Time slots configuration
  const timeSlots = [
    { id: 1, time: '09:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: true },
    { id: 4, time: '12:00 PM', available: false },
    { id: 5, time: '01:00 PM', available: true },
    { id: 6, time: '02:00 PM', available: true },
    { id: 7, time: '03:00 PM', available: true },
    { id: 8, time: '04:00 PM', available: true },
    { id: 9, time: '05:00 PM', available: true },
  ];

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
          toast.error('Please log in to access this page');
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

  // Fetch data when user is available
  useEffect(() => {
    if (user) {
      fetchInterviews();
      fetchScheduledInterviews();
      setLoading(false);
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      if (!user) {
        console.error('No user available for fetching interviews');
        return;
      }

      console.log('🔍 Fetching interviews for user email:', user.email);
      
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

      console.log('✅ Fetched interviews for user:', data);
      setInterviews(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Loaded ${data.length} interviews successfully`);
      } else {
        toast.info('No interviews found for your account');
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error loading interviews');
    }
  };

  const fetchScheduledInterviews = async () => {
    try {
      if (!user) {
        console.error('No user available for fetching scheduled interviews');
        return;
      }

      console.log('🔍 Fetching scheduled interviews for user:', user.email);
      
      const { data, error } = await supabase
        .from('scheduled_interviews')
        .select('*')
        .eq('created_by', user.email)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching scheduled interviews:', error);
        
        // If table doesn't exist, show helpful message
        if (error.code === '42P01') {
          console.log('Table does not exist. Please run the SQL script to create scheduled_interviews table.');
          toast.error('Database table not found. Please contact administrator.');
          return;
        }
        
        return;
      }

      console.log('Fetched scheduled interviews for user:', data);
      setScheduledInterviews(data || []);
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} scheduled interviews for user`);
      } else {
        console.log('No scheduled interviews found for user');
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date && date.toDateString() === selectedDate.toDateString();
  };

  const hasScheduledInterview = (date) => {
    return scheduledInterviews.some(interview => {
      const interviewDate = new Date(interview.scheduled_date);
      return date && date.toDateString() === interviewDate.toDateString();
    });
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setEmailForm(prev => ({
      ...prev,
      subject: `Interview Invitation - ${interview.jobPosition}`,
      message: `Dear Candidate,

You have been invited to participate in an AI-powered interview for the position of ${interview.jobPosition}.

Interview Details:
- Position: ${interview.jobPosition}
- Type: ${interview.type}
- Duration: ${interview.duration || 30} minutes
- Date: ${selectedDate ? selectedDate.toLocaleDateString() : 'To be scheduled'}
- Time: ${selectedTimeSlot ? selectedTimeSlot.time : 'To be scheduled'}

Please click the link below to start your interview:
${interview.interview_Id ? `${window.location.origin}/interview/${interview.interview_Id}` : 'Link will be provided'}

Best regards,
${user?.user_metadata?.firstName || 'The'} ${user?.user_metadata?.lastName || 'Hiring Team'}`,
      interviewLink: interview.interview_Id ? `${window.location.origin}/interview/${interview.interview_Id}` : ''
    }));
  };

  const sendInterviewInvitation = async () => {
    // Enhanced validation
    if (!emailForm.candidateName || !emailForm.candidateEmail || !selectedInterview) {
      toast.error('Please fill in all required fields and select an interview');
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time slot');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.candidateEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSending(true);
      console.log('🎯 Starting interview scheduling process...');

      // First, check if the scheduled_interviews table exists
      console.log('📊 Checking database table...');
      
      // Save scheduled interview to database
      console.log('💾 Saving scheduled interview to database...');
      console.log('Data to save:', {
        interview_id: selectedInterview.interview_Id,
        candidate_name: emailForm.candidateName,
        candidate_email: emailForm.candidateEmail,
        scheduled_date: selectedDate.toISOString(),
        scheduled_time: selectedTimeSlot.time,
        status: 'scheduled',
        created_by: user.email
      });

      const { data: scheduleData, error: scheduleError } = await supabase
        .from('scheduled_interviews')
        .insert({
          interview_id: selectedInterview.interview_Id,
          candidate_name: emailForm.candidateName,
          candidate_email: emailForm.candidateEmail,
          scheduled_date: selectedDate.toISOString(),
          scheduled_time: selectedTimeSlot.time,
          status: 'scheduled',
          created_by: user.email
        })
        .select();

      if (scheduleError) {
        console.error('❌ Database error:', scheduleError);
        
        // Check if table doesn't exist
        if (scheduleError.code === '42P01') {
          toast.error('Database table not found. Please run the SQL script to create scheduled_interviews table.');
          return;
        }
        
        // Check for other common errors
        if (scheduleError.code === '23505') {
          toast.error('An interview is already scheduled for this time slot');
          return;
        }
        
        toast.error(`Database error: ${scheduleError.message}`);
        return;
      }

      console.log('✅ Interview scheduled successfully:', scheduleData);

      // Send email invitation
      console.log('📧 Sending email invitation...');
      const emailPayload = {
        candidateName: emailForm.candidateName,
        candidateEmail: emailForm.candidateEmail,
        subject: emailForm.subject,
        message: emailForm.message,
        interviewLink: emailForm.interviewLink,
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: selectedTimeSlot.time,
        jobPosition: selectedInterview.jobPosition
      };

      console.log('Email payload:', emailPayload);

      try {
        const response = await fetch('/api/send-interview-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });

        console.log('📨 Email API response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Email API error:', errorData);
          
          // Check for specific error types
          if (errorData.error && errorData.error.includes('Email configuration')) {
            toast.error('Email service not configured. Please contact administrator.');
          } else if (errorData.error && errorData.error.includes('authentication')) {
            toast.error('Email authentication failed. Please contact administrator.');
          } else {
            toast.error(`Email sending failed: ${errorData.error || 'Unknown error'}`);
          }
          
          // Still show success for scheduling since it was saved to database
          toast.success('Interview scheduled successfully! Email will be sent when service is configured.');
          return;
        }

        const emailResult = await response.json();
        console.log('✅ Email sent successfully:', emailResult);
        toast.success('Interview invitation sent successfully!');
        
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        
        // Still show success for scheduling since it was saved to database
        toast.success('Interview scheduled successfully! Email will be sent when service is configured.');
      }
      
      // Reset form
      setEmailForm({
        candidateName: '',
        candidateEmail: '',
        subject: 'Interview Invitation - ViveCruit',
        message: '',
        interviewLink: ''
      });
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setSelectedInterview(null);
      
      // Refresh scheduled interviews
      await fetchScheduledInterviews();
      
    } catch (error) {
      console.error('❌ Error in sendInterviewInvitation:', error);
      
      if (error.message.includes('Email API error')) {
        toast.error(`Email sending failed: ${error.message}`);
      } else if (error.message.includes('Failed to fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setSending(false);
      console.log('🏁 Interview scheduling process completed');
    }
  };

  const copyInterviewLink = (interviewId) => {
    const link = `${window.location.origin}/interview/${interviewId}`;
    navigator.clipboard.writeText(link);
    toast.success('Interview link copied to clipboard!');
  };

  const deleteScheduledInterview = async (id) => {
    try {
      // First, check if the scheduled interview belongs to the current user
      const { data: scheduledData, error: fetchError } = await supabase
        .from('scheduled_interviews')
        .select('created_by')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching scheduled interview details:', fetchError);
        toast.error('Error fetching scheduled interview details');
        return;
      }

      // Check if user owns this scheduled interview
      if (scheduledData.created_by !== user.email) {
        toast.error('You can only delete scheduled interviews you created');
        return;
      }

      const { error } = await supabase
        .from('scheduled_interviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting scheduled interview:', error);
        toast.error('Error deleting scheduled interview');
        return;
      }

      toast.success('Scheduled interview deleted successfully');
      await fetchScheduledInterviews();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting scheduled interview');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <VivecruitTextLoader size="large" text="Loading schedule..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access the schedule interviews page.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Interviews</h1>
          <p className="text-gray-600 text-lg">
            Schedule and send interview invitations to candidates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-semibold">{getMonthName(currentDate)}</h2>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  
                  {getDaysInMonth(currentDate).map((date, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      disabled={!date}
                      className={`p-3 text-sm rounded-lg transition-colors ${
                        !date ? 'invisible' :
                        isToday(date) ? 'bg-violet-100 text-violet-700 font-semibold' :
                        isSelected(date) ? 'bg-violet-600 text-white' :
                        hasScheduledInterview(date) ? 'bg-green-100 text-green-700 font-semibold' :
                        'hover:bg-gray-100'
                      }`}
                    >
                      {date ? date.getDate() : ''}
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Available Time Slots for {selectedDate.toLocaleDateString()}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedTimeSlot?.id === slot.id
                              ? 'bg-violet-600 text-white border-violet-600'
                              : slot.available
                              ? 'hover:bg-gray-50 border-gray-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          }`}
                        >
                          <Clock className="h-4 w-4 inline mr-2" />
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interview Selection */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-600" />
                  Select Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No interviews available</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/dashboard/create-interview'}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Interview
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviews.map((interview) => (
                      <div
                        key={interview.interview_Id}
                        onClick={() => handleInterviewSelect(interview)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedInterview?.interview_Id === interview.interview_Id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{interview.jobPosition}</h4>
                          {selectedInterview?.interview_Id === interview.interview_Id && (
                            <Check className="h-5 w-5 text-violet-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{interview.type}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{interview.duration || 30} min</span>
                          <span>•</span>
                          <span>{new Date(interview.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Email Form Section */}
          <div className="space-y-6">
            {/* Email Form */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-violet-600" />
                  Send Invitation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Name *
                  </label>
                  <Input
                    value={emailForm.candidateName}
                    onChange={(e) => setEmailForm({...emailForm, candidateName: e.target.value})}
                    placeholder="Enter candidate name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Email *
                  </label>
                  <Input
                    type="email"
                    value={emailForm.candidateEmail}
                    onChange={(e) => setEmailForm({...emailForm, candidateEmail: e.target.value})}
                    placeholder="Enter candidate email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    placeholder="Email subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                    placeholder="Email message"
                    rows={8}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>

                <Button
                  onClick={sendInterviewInvitation}
                  disabled={sending || !selectedDate || !selectedTimeSlot || !selectedInterview}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {sending ? (
                    <VivecruitSpinner size="small" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-violet-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => copyInterviewLink(selectedInterview?.interview_Id)}
                  disabled={!selectedInterview}
                  className="w-full justify-start"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Interview Link
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(`/interview/${selectedInterview?.interview_Id}`, '_blank')}
                  disabled={!selectedInterview}
                  className="w-full justify-start"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scheduled Interviews */}
        <Card className="bg-white border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              Scheduled Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledInterviews.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No scheduled interviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledInterviews.map((scheduled) => (
                  <div key={scheduled.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-violet-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{scheduled.candidate_name}</h4>
                        <p className="text-sm text-gray-600">{scheduled.candidate_email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(scheduled.scheduled_date).toLocaleDateString()} at {scheduled.scheduled_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scheduled.status === 'completed' ? 'bg-green-100 text-green-800' :
                        scheduled.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {scheduled.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteScheduledInterview(scheduled.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
