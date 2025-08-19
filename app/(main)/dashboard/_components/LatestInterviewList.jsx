"use client";
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/app/provider';

export default function LatestInterviewList() {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        if (!userLoading && user?.email) {
            fetchInterviews();
        } else if (!userLoading && !user?.email) {
            setLoading(false);
        }
    }, [user, userLoading]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            
            if (!user?.email) {
                console.error('No user email found');
                return;
            }

            console.log('Fetching interviews for user email:', user.email);
            
            // First, let's check what interviews exist in the database
            const { data: allInterviews, error: allError } = await supabase
                .from('interviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            console.log('All interviews in database:', allInterviews);
            
            // Fetch interviews using userEmail field
            const { data, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('userEmail', user.email)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error('Error fetching interviews:', error);
                return;
            }

            console.log('✅ Fetched user interviews:', data);
            setInterviewList(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) {
        return (
            <div className='bg-white rounded-lg p-6 shadow-sm'>
                <h2 className='font-bold text-2xl mb-5'>Previously Created Interviews</h2>
                <div className='w-full p-10 flex flex-col gap-3 items-center'>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='bg-white rounded-lg p-6 shadow-sm'>
                <h2 className='font-bold text-2xl mb-5'>Previously Created Interviews</h2>
                <div className='w-full p-10 flex flex-col gap-3 items-center'>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p>Loading interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-lg p-6 shadow-sm'> 
            <h2 className='font-bold text-2xl mb-5'>Previously Created Interviews</h2>
            

            
            {interviewList.length === 0 ? (
                <div className='w-full p-10 flex flex-col gap-3 items-center bg-gray-50 rounded-xl'>
                    <Video className='h-14 w-14 text-primary'/>
                    <h2 className='text-xl font-semibold'>You don't have any interviews created yet!</h2>
                    <p className='text-gray-600 text-center'>Create your first interview to get started</p>
                    <Link href="/dashboard/create-interview">
                        <Button className='p-5 bg-primary text-white hover:bg-primary/90'>
                            + Create New Interview
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className='space-y-4'>
                    {interviewList.map((interview) => (
                        <div key={interview.id} className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'>
                            <div className='flex justify-between items-start'>
                                <div className='flex-1'>
                                    <h3 className='font-semibold text-lg text-gray-900'>
                                        {interview.jobPosition || 'Untitled Interview'}
                                    </h3>
                                    <p className='text-gray-600 text-sm mt-1'>
                                        {interview.jobDescription || 'No description'}
                                    </p>
                                    <div className='flex items-center gap-4 mt-2 text-sm text-gray-500'>
                                        <div className='flex items-center gap-1'>
                                            <Calendar className='h-4 w-4' />
                                            <span>{new Date(interview.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <Clock className='h-4 w-4' />
                                            <span>{interview.duration || '30'} min</span>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <User className='h-4 w-4' />
                                            <span>{interview.type || 'Interview'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => router.push(`/interview/${interview.interview_Id}`)}
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => router.push(`/schedule-interview?interviewId=${interview.interview_Id}`)}
                                    >
                                        Schedule
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {interviewList.length >= 5 && (
                        <div className='text-center pt-4'>
                            <Link href="/all-interviews">
                                <Button variant="outline">View All Interviews</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
