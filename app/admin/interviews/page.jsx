"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Calendar,
  User,
  Briefcase,
  Clock,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode') === 'true';
    setDarkMode(savedDarkMode);
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setInterviews(data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', interviewId);

      if (error) {
        throw error;
      }

      toast.success('Interview deleted successfully');
      fetchInterviews();
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview');
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.jobPosition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || interview.type === filterType;
    const matchesUser = !filterUser || interview.userEmail === filterUser;
    const matchesDate = !filterDate || new Date(interview.created_at).toDateString() === new Date(filterDate).toDateString();
    
    return matchesSearch && matchesType && matchesUser && matchesDate;
  });

  const exportInterviews = () => {
    const csvContent = [
      ['Job Position', 'Type', 'Duration', 'User Email', 'Questions Count', 'Created At'],
      ...filteredInterviews.map(interview => [
        interview.jobPosition || 'N/A',
        interview.type || 'N/A',
        interview.duration || 'N/A',
        interview.userEmail || 'N/A',
        interview.questionList?.length || 0,
        new Date(interview.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interviews.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewInterviewDetails = (interview) => {
    setSelectedInterview(interview);
    setShowDetails(true);
  };

  const getUniqueUsers = () => {
    const users = interviews.map(interview => interview.userEmail).filter(Boolean);
    return [...new Set(users)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Interviews Management</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Manage all interviews created by users.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportInterviews} className={`flex items-center space-x-2 ${
            darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search interviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Types</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Users</option>
                {getUniqueUsers().map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Table */}
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FileText className="h-5 w-5" />
            <span>Interviews ({filteredInterviews.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Position</th>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Type</th>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Duration</th>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User</th>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Questions</th>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Created</th>
                  <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {interview.jobPosition || 'Untitled Interview'}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-xs`}>
                            {interview.jobDescription || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        interview.type === 'Technical' ? 'bg-blue-100 text-blue-800' :
                        interview.type === 'Behavioral' ? 'bg-green-100 text-green-800' :
                        interview.type === 'Mixed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interview.type || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {interview.duration || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {interview.userEmail || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {interview.questionList?.length || 0} questions
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(interview.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewInterviewDetails(interview)}
                          className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteInterview(interview.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInterviews.length === 0 && (
            <div className="text-center py-8">
              <FileText className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No interviews found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interview Details Modal */}
      {showDetails && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Interview Details
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(false)}
                  className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Job Position</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{selectedInterview.jobPosition}</p>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Interview Type</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{selectedInterview.type}</p>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Duration</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{selectedInterview.duration}</p>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Created By</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{selectedInterview.userEmail}</p>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Job Description</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap`}>
                    {selectedInterview.jobDescription}
                  </p>
                </div>

                {/* Questions */}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Questions ({selectedInterview.questionList?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedInterview.questionList?.map((question, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Question {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            question.type === 'Technical' ? 'bg-blue-100 text-blue-800' :
                            question.type === 'Behavioral' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {question.type}
                          </span>
                        </div>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{question.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
