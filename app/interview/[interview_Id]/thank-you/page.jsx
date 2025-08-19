"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Clock, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export default function ThankYouPage() {
  const { interview_Id } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interview_Id) {
      fetchInterviewData();
    }
  }, [interview_Id]);

  const fetchInterviewData = async () => {
    try {
      const { data: interviews, error } = await supabase
        .from('interviews')
        .select('jobPosition, jobDescription, duration, type')
        .eq('interview_Id', interview_Id)
        .single();

      if (error) {
        console.error('Error fetching interview data:', error);
        toast.error('Unable to load interview details.');
      } else {
        setInterviewData(interviews);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Vivecruit Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-xl font-bold text-gray-800">Vivecruit</h1>
            </div>
            <div className="text-sm text-gray-500">
              AI-Powered Recruitment Platform
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Interview Completed Successfully!
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8">
            Thank you for completing your interview with Vivecruit
          </p>

          {/* Interview Details */}
          {interviewData && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Interview Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium text-gray-800">{interviewData.jobPosition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">{interviewData.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-800">{interviewData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Completed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <Clock className="h-8 w-8 text-violet-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">What Happens Next?</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-violet-100 rounded-full p-2 mt-1">
                <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis in Progress</h3>
                <p className="text-gray-600">
                  Our advanced AI system is currently analyzing your interview responses, 
                  evaluating your technical skills, communication abilities, and overall fit for the position.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-violet-100 rounded-full p-2 mt-1">
                <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Comprehensive Review</h3>
                <p className="text-gray-600">
                  Our recruitment team will review the AI-generated feedback along with your 
                  interview performance to make an informed decision.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-violet-100 rounded-full p-2 mt-1">
                <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">You'll Hear From Us Soon</h3>
                <p className="text-gray-600">
                  We will contact you within <span className="font-semibold text-violet-600">3-5 business days</span> 
                  with the results of your interview and next steps in the hiring process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Have Questions?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-violet-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Mail className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
              <p className="text-sm text-gray-600">support@vivecruit.com</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Phone className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Globe className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Website</h3>
              <p className="text-sm text-gray-600">www.vivecruit.com</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Linkedin className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">LinkedIn</h3>
              <p className="text-sm text-gray-600">@vivecruit</p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Thank You for Choosing Vivecruit!
            </h2>
            <p className="text-lg mb-6 opacity-90">
              We appreciate your time and effort in completing this interview. 
              Our team is committed to providing you with a fair and thorough evaluation.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm opacity-75">
              <Clock className="h-4 w-4" />
              <span>Response time: 3-5 business days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/logo.png"
              alt="Vivecruit Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold">Vivecruit</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Vivecruit. All rights reserved. | 
            <a href="#" className="hover:text-white ml-2">Privacy Policy</a> | 
            <a href="#" className="hover:text-white ml-2">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
