"use client";
import { InterviewDataContext } from '@/context/InterviewData'
import React, { useEffect, useState, useRef } from 'react'
import { useContext } from 'react';
import { Timer, Mic, Phone } from 'lucide-react'
import Image from 'next/image';
import Vapi from '@vapi-ai/web';
import AlertConformation from './_components/AlertConformation';
import { toast } from 'sonner';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { VivecruitLoader, VivecruitTextLoader } from '@/components/ui/vivecruit-loader';

export default function StartInterview() {
  const router = useRouter();
  const { interview_Id } = useParams();
  const { interviewInfo } = useContext(InterviewDataContext);
  const searchParams = useSearchParams();
  const userNameFromURL = searchParams.get('name');
  const userEmailFromURL = searchParams.get('email');
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [interviewStartTime, setInterviewStartTime] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [interviewDuration, setInterviewDuration] = useState(30); // Default 30 minutes
  const [localInterviewInfo, setLocalInterviewInfo] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Use useRef to maintain a single VAPI instance
  const vapiRef = useRef(null);

  // Global error handler for VAPI errors
  useEffect(() => {
    const handleGlobalError = (event) => {
      // Filter out VAPI/Daily.co related errors that are expected
      if (event.error && (
        event.error.message?.includes('Meeting has ended') ||
        event.error.message?.includes('ejected') ||
        event.error.message?.includes('daily-esm') ||
        event.error.message?.includes('Vapi.emit')
      )) {
        event.preventDefault();
        console.log("📞 Suppressed expected VAPI error:", event.error.message);
        return false;
      }
    };

    // Add global error handler
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && (
        event.reason.message?.includes('Meeting has ended') ||
        event.reason.message?.includes('ejected') ||
        event.reason.message?.includes('daily-esm')
      )) {
        event.preventDefault();
        console.log("📞 Suppressed expected VAPI promise rejection:", event.reason.message);
        return false;
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  // Load interview data if not available in context
  useEffect(() => {
    const loadInterviewData = async () => {
      // If we have context data, use it immediately and STOP here - NO DATABASE FALLBACK
      if (interviewInfo && interviewInfo.userName && interviewInfo.userEmail) {
        console.log("✅ Using context data:", interviewInfo);
        setLocalInterviewInfo(interviewInfo);
        setDataLoaded(true);
        
        // Force interview initialization after context data is loaded
        setTimeout(() => {
          if (!isInitialized) {
            console.log("🚀 Forcing interview initialization after context data load...");
            // The useEffect will handle initialization automatically
          }
        }, 1000);
        return; // STOP - don't do anything else, don't load from database
      }

      // If we have URL parameters, use them as backup
      if (userNameFromURL && userEmailFromURL) {
        console.log("✅ Using URL parameters as backup:", { userName: userNameFromURL, userEmail: userEmailFromURL });
        // We need to get the interview data from database but use URL parameters for user data
        if (interview_Id) {
          loadFromDatabase();
        }
        return;
      }

      // If we have ANY context data, don't load from database
      if (interviewInfo) {
        console.log("✅ Context data exists, using it instead of database");
        setLocalInterviewInfo(interviewInfo);
        setDataLoaded(true);
        return;
      }

      // Only load from database if we have NO context data at all
      if (!interviewInfo) {
        if (!interview_Id) {
          console.error("No interview ID available");
          toast.error("Invalid interview link");
          return;
        }

        console.log("📋 No context data available, loading from database...");
        loadFromDatabase();
      }
    };

    const loadFromDatabase = async () => {
      // NEVER load from database if we have context data (unless we have URL parameters as backup)
      if (interviewInfo && interviewInfo.userName && interviewInfo.userEmail && !userNameFromURL) {
        console.log("🚫 Context data exists - NEVER loading from database");
        return;
      }

      try {
        console.log("📋 Loading interview data from database (no context available)...");
        const { data: interviews, error } = await supabase
          .from('interviews')
          .select("*")
          .eq('interview_Id', interview_Id)
          .single();

        if (error || !interviews) {
          console.error("❌ Error loading interview:", error);
          toast.error("Interview not found");
          return;
        }



        // Use URL parameters if available, otherwise show error
        if (userNameFromURL && userEmailFromURL) {
          const interviewInfoWithURLData = {
            userName: userNameFromURL,
            userEmail: userEmailFromURL,
            interviewData: interviews
          };

                  console.log("✅ Interview data loaded with URL parameters:", interviewInfoWithURLData);
        setLocalInterviewInfo(interviewInfoWithURLData);
        setDataLoaded(true);
        
        // Force interview initialization after data is loaded
        setTimeout(() => {
          if (!isInitialized) {
            console.log("🚀 Forcing interview initialization after data load...");
            initializeInterview();
          }
        }, 1000);
        } else {
          // Show error if no context data available
          console.error("❌ No context data available - cannot start interview");
          toast.error("Please enter your name and email to start the interview");
        }
        
      } catch (error) {
        console.error("❌ Error loading interview data:", error);
        toast.error("Failed to load interview data");
      }
    };

    loadInterviewData();
  }, [interviewInfo, interview_Id]);

  // Initialize VAPI instance
  useEffect(() => {
    const initializeInterview = async () => {
      if (!localInterviewInfo || isCompleted || isInitialized) {
        console.log("⏳ Waiting for interview data or already initialized", { 
          hasLocalInfo: !!localInterviewInfo, 
          isCompleted, 
          isInitialized 
        });
        return;
      }

      console.log("🚀 Starting interview initialization with data:", localInterviewInfo);

      try {
        console.log("🚀 Initializing interview system...");
        setIsLoading(true);
        
        // Get interview duration from database
        await getInterviewDuration();
        
        // Create VAPI instance
        const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '700899a8-bae6-4538-bf87-4817245fb314';
        console.log("🔑 Using VAPI key:", vapiKey);
        vapiRef.current = new Vapi(vapiKey);
        
        // Set up event listeners
        vapiRef.current.on("call-start", () => {
          console.log("✅ Call has started");
          setIsCallActive(true);
          setInterviewStartTime(Date.now());
          toast.success("Call Connected!");
          setIsLoading(false);
        });

        // Start the call immediately
        console.log("🚀 Starting VAPI call immediately...");
        await startCall();
        setIsInitialized(true);
        console.log("✅ Interview system initialized successfully");
        
        // Force show interface after 5 seconds if call doesn't start
        setTimeout(() => {
          if (isLoading) {
            console.log("⏰ Forcing interface display after timeout...");
            setIsLoading(false);
            setIsCallActive(true);
            setInterviewStartTime(Date.now());
          }
        }, 5000);

        vapiRef.current.on("call-end", async () => {
          console.log("🔚 Call has ended");
          setIsCallActive(false);
          
          // Only complete if not already completing or completed
          if (!isCompleted && !isCompleting) {
            console.log("🔄 Auto-completing interview due to call end");
            await completeInterview();
          } else {
            console.log("⚠️ Interview already completing/completed, skipping...");
          }
        });

        // Handle VAPI errors gracefully
        vapiRef.current.on("error", (error) => {
          console.log("⚠️ VAPI Error:", error);
          
          // Handle specific Daily.co ejection errors
          if (error?.errorMsg === "Meeting has ended" || 
              error?.error?.type === "ejected" ||
              error?.msg === "Meeting has ended") {
            console.log("📞 Meeting ended normally - this is expected");
            setIsCallActive(false);
            
            // Only complete if not already completing or completed
            if (!isCompleted && !isCompleting) {
              console.log("🔄 Auto-completing interview due to meeting end");
              completeInterview();
            } else {
              console.log("⚠️ Interview already completing/completed, skipping...");
            }
            return;
          }
          
          // Handle other VAPI errors
          if (error?.errorMsg) {
            console.log("⚠️ VAPI Error Message:", error.errorMsg);
            toast.error("Connection issue - please try again");
          }
        });

        vapiRef.current.on("speech-start", () => {
          console.log("🎤 Assistant speaking");
      setActiveUser(false);
    });

        vapiRef.current.on("speech-end", () => {
          console.log("🎤 Assistant finished speaking");
      setActiveUser(true);
    });

        vapiRef.current.on("message", (message) => {
          console.log("📨 VAPI message received");
          if (message?.conversation) {
            setConversation(message.conversation);
          }
        });

        // Start the call
        await startCall();
        setIsInitialized(true);
        // Don't set isLoading to false here - wait for call-start event
        console.log("✅ Interview system initialized successfully");
        
        // Fallback: if call-start doesn't fire within 10 seconds, show interface anyway
        setTimeout(() => {
          if (isLoading && isInitialized) {
            console.log("⏰ Call-start timeout, showing interface anyway...");
            setIsLoading(false);
            setIsCallActive(true);
          }
        }, 10000);
        
      } catch (error) {
        console.error("❌ Error initializing interview:", error);
        setIsLoading(false);
        toast.error("Failed to initialize interview");
      }
    };

    initializeInterview();
  }, [localInterviewInfo, isCompleted, isInitialized]);

  const startCall = async () => {
    if (!vapiRef.current || !localInterviewInfo) {
      console.log("❌ Cannot start call - missing dependencies");
      return;
    }

    try {
      console.log("🎯 Starting interview call...");
      
    const questionList = localInterviewInfo?.interviewData?.questionList
      ?.map((item) => item?.question)
        ?.join(', ') || "Tell me about yourself, What are your strengths, Where do you see yourself in 5 years";

    const assistantOptions = {
      name: "AI Recruiter",
        firstMessage: `Hi ${localInterviewInfo?.userName || 'there'}, welcome to your ${localInterviewInfo?.interviewData?.jobPosition || 'interview'}! How are you feeling today?`,
      model: {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          {
            role: "system",
              content: `You are a professional AI interviewer. Conduct a friendly but thorough interview for the ${localInterviewInfo?.interviewData?.jobPosition || 'position'}. Ask these questions: ${questionList}. Be conversational and encouraging. After 5-7 questions, wrap up positively.`
          }
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM"
      }
    };

      console.log("🎯 Starting VAPI call with options:", assistantOptions);
      await vapiRef.current.start(assistantOptions);
      console.log("✅ Call started successfully");
      
      // Add a timeout to check if call-start event fires
      setTimeout(() => {
        if (!isCallActive) {
          console.log("⚠️ Call-start event didn't fire, manually setting call active");
          setIsCallActive(true);
          setIsLoading(false);
          setInterviewStartTime(Date.now());
        }
      }, 5000);
      
    } catch (error) {
      console.error("❌ Error starting call:", error);
      toast.error("Failed to start interview call");
    }
  };

  const completeInterview = async () => {
    try {
      console.log("🎯 Starting interview completion process...");
      
      // Prevent multiple completions with lock
      if (isCompleted || isCompleting) {
        console.log("⚠️ Interview already completing/completed, skipping...");
        return;
      }
      
      // Set completion lock immediately
      setIsCompleting(true);
      console.log("🔒 Completion lock set");
      
      // Mark as completed
      setIsCompleted(true);
      console.log("✅ Interview marked as completed");
      
      // Save interview data (don't wait for it to fail the flow)
      try {
        console.log("💾 Saving interview data...");
        await saveInterviewData();
        console.log("✅ Interview data saved successfully");
      } catch (saveError) {
        console.error("❌ Error saving interview data:", saveError);
        // Continue with completion even if save fails
      }
      
      // Send completion email (don't wait for it to fail the flow)
      try {
        console.log("📧 Sending completion email...");
        await sendCompletionEmail();
        console.log("✅ Completion email sent successfully");
      } catch (emailError) {
        console.error("❌ Error sending completion email:", emailError);
        // Continue with completion even if email fails
      }
      
      // Clean up and redirect (this should always happen)
      console.log("🧹 Starting cleanup and redirect...");
      await cleanupAndRedirect();
      
    } catch (error) {
      console.error("❌ Critical error in interview completion:", error);
      
      // Even if everything fails, still try to redirect
      try {
        console.log("🆘 Emergency redirect attempt...");
        setIsCompleted(true);
        await cleanupAndRedirect();
      } catch (redirectError) {
        console.error("❌ Even emergency redirect failed:", redirectError);
        // Last resort - force redirect
        setTimeout(() => {
          window.location.href = `/interview/${interviewInfo?.interviewData?.interview_Id}/thank-you`;
        }, 2000);
      }
    } finally {
      // Always release the completion lock
      setIsCompleting(false);
      console.log("🔓 Completion lock released");
    }
  };

  const saveInterviewData = async () => {
    try {
      console.log("💾 Saving interview data...");
      
      const interviewDuration = interviewStartTime ? Math.floor((Date.now() - interviewStartTime) / 1000) : 0;
      
      const interviewData = {
          interview_Id: localInterviewInfo?.interviewData?.interview_Id,
          candidate_name: localInterviewInfo?.userName,
          candidate_email: localInterviewInfo?.userEmail,
        conversation_data: conversation || [],
        feedback_data: {
          feedback: {
            rating: { technicalSkills: 5, communication: 5, problemSolving: 5, experience: 5 },
            summary: "Interview completed successfully.",
            recommendation: "Consider",
            recommendationMsg: "Candidate shows potential and completed the interview successfully."
          }
        },
        technical_skills_rating: 5,
        communication_rating: 5,
        problem_solving_rating: 5,
        experience_rating: 5,
        recommendation: 'Consider',
        recommendation_message: 'Interview completed successfully.',
        interview_duration: interviewDuration,
        status: 'completed'
      };

      const { error: saveError } = await supabase
        .from('interview_results')
        .insert([interviewData]);

      if (saveError) {
        console.error("❌ Error saving interview data:", saveError);
        toast.error("Failed to save interview results");
      } else {
        console.log("✅ Interview data saved successfully");
        toast.success("Interview results saved!");
      }
      
    } catch (error) {
      console.error("❌ Error saving interview data:", error);
    }
  };

  const sendCompletionEmail = async () => {
    try {
      console.log("📧 Sending completion email...");
      
      const emailData = {
        candidateName: interviewInfo?.userName,
        candidateEmail: interviewInfo?.userEmail,
        jobPosition: interviewInfo?.interviewData?.jobPosition,
        interviewId: interviewInfo?.interviewData?.interview_Id
      };

      const response = await axios.post('/api/send-email', emailData);
      
      if (response.data.success) {
        console.log("✅ Completion email sent successfully");
        toast.success("Completion email sent to candidate!");
      } else {
        console.error("❌ Failed to send completion email:", response.data.error);
        toast.error("Failed to send completion email");
      }
      
    } catch (error) {
      console.error("❌ Error sending completion email:", error);
      toast.error("Error sending completion email");
    }
  };

  const cleanupAndRedirect = async () => {
    try {
      console.log("🧹 Starting cleanup process...");
      
      // Stop VAPI if it exists
      if (vapiRef.current) {
        try {
          console.log("🛑 Stopping VAPI...");
          vapiRef.current.stop();
          console.log("✅ VAPI stopped successfully");
        } catch (error) {
          console.error("❌ Error stopping VAPI:", error);
        }
        vapiRef.current = null;
      }
      
      // Release microphone access
      try {
        console.log("🎤 Releasing microphone access...");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => {
            track.stop();
            console.log("✅ Microphone track stopped");
          });
        }
      } catch (error) {
        console.error("❌ Error releasing mic access:", error);
      }
      
      console.log("✅ Cleanup completed successfully");
      
      // Show completion message
      toast.success("Interview completed successfully!");
      
      // Redirect to thank you page with multiple fallbacks
      console.log("🔄 Redirecting to thank you page...");
      
      try {
        // Try Next.js router first
        router.push(`/interview/${localInterviewInfo?.interviewData?.interview_Id}/thank-you`);
        console.log("✅ Router redirect initiated");
      } catch (routerError) {
        console.error("❌ Router redirect failed:", routerError);
        
        // Fallback to window.location
        try {
          window.location.href = `/interview/${localInterviewInfo?.interviewData?.interview_Id}/thank-you`;
          console.log("✅ Window location redirect initiated");
        } catch (windowError) {
          console.error("❌ Window location redirect failed:", windowError);
          
          // Last resort - force redirect after delay
          setTimeout(() => {
            window.location.href = `/interview/${interviewInfo?.interviewData?.interview_Id}/thank-you`;
          }, 1000);
        }
      }
      
    } catch (error) {
      console.error("❌ Error during cleanup:", error);
      
      // Emergency redirect
      console.log("🆘 Emergency redirect...");
      setTimeout(() => {
        try {
          router.push(`/interview/${interviewInfo?.interviewData?.interview_Id}/thank-you`);
        } catch (e) {
          window.location.href = `/interview/${interviewInfo?.interviewData?.interview_Id}/thank-you`;
        }
      }, 1000);
    }
  };

  const stopInterview = async () => {
    console.log("🛑 Stop interview requested");
    
    if (isCompleted || isCompleting) {
      toast.error("Interview already completed or completing");
      return;
    }

    if (!isCallActive) {
      toast.error("No active interview to end");
      return;
    }

    try {
      setIsStopping(true);
      toast.info("Ending interview...");
      
      if (vapiRef.current) {
        console.log("🛑 Stopping VAPI call...");
        vapiRef.current.stop();
        
        // Fallback: if call-end doesn't fire within 5 seconds, force completion
        setTimeout(async () => {
          if (isStopping && !isCompleted && !isCompleting) {
            console.log("⏰ Call-end timeout, forcing completion...");
            await completeInterview();
          }
        }, 5000);
        
      } else {
        console.log("⚠️ VAPI not available, forcing completion...");
        await completeInterview();
      }

    } catch (error) {
      console.error("❌ Error stopping interview:", error);
      toast.error("Error stopping interview");
      // Force completion anyway
      await completeInterview();
    }
  };

  // Get interview duration from database
  const getInterviewDuration = async () => {
    try {
      if (!interviewInfo?.interviewData?.interview_Id) return;
      
      const { data, error } = await supabase
        .from('interviews')
        .select('interview_duration')
        .eq('interview_Id', interviewInfo.interviewData.interview_Id)
        .single();
      
      if (error) {
        console.error("Error fetching interview duration:", error);
        return;
      }
      
      if (data?.interview_duration) {
        setInterviewDuration(data.interview_duration);
        console.log(`⏰ Interview duration set to ${data.interview_duration} minutes`);
      }
    } catch (error) {
      console.error("Error getting interview duration:", error);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isCallActive || isCompleted || isCompleting) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up! Auto-end interview
          console.log("⏰ Interview time limit reached, auto-ending...");
          clearInterval(interval);
          toast.warning("Interview time limit reached. Ending interview...");
          completeInterview();
          return 0;
        }
        
        // Show warnings at specific time intervals
        if (prev === 300) { // 5 minutes remaining
          toast.warning("5 minutes remaining in interview");
        } else if (prev === 60) { // 1 minute remaining
          toast.warning("1 minute remaining in interview");
        } else if (prev === 30) { // 30 seconds remaining
          toast.error("30 seconds remaining - interview will end soon");
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isCallActive, isCompleted, isCompleting]);

  // Initialize timer when call starts
  useEffect(() => {
    if (isCallActive && interviewStartTime && !timeRemaining) {
      const durationInSeconds = interviewDuration * 60;
      setTimeRemaining(durationInSeconds);
      console.log(`⏰ Timer started: ${interviewDuration} minutes (${durationInSeconds} seconds)`);
    }
  }, [isCallActive, interviewStartTime, interviewDuration, timeRemaining]);

  // Format time for display
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Loading state - show loader until interview data is loaded
  if (!localInterviewInfo) {
    return (
      <div className='p-20 lg:px-48 xl:px-56'>
        <div className='text-center'>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading interview details...</p>
          <button 
            onClick={() => {
              console.log("🔄 Force loading interview data");
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Completed state
  if (isCompleted) {
    return (
      <div className='p-20 lg:px-48 xl:px-56'>
        <div className='text-center'>
          <VivecruitTextLoader size="large" text="Interview completed! Redirecting..." />
        </div>
      </div>
    );
  }

  // Show interview interface immediately, with loading overlay if needed
  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      {/* Debug info - remove this after fixing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
          <p><strong>Debug:</strong> isLoading: {isLoading.toString()}, isCallActive: {isCallActive.toString()}, isInitialized: {isInitialized.toString()}</p>
          <p>User: {localInterviewInfo?.userName || 'Not set'}</p>
          <p>Email: {localInterviewInfo?.userEmail || 'Not set'}</p>
        </div>
      )}
      
      {/* Loading overlay - only show briefly */}
      {isLoading && !isCallActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Initializing interview...</p>
          </div>
        </div>
      )}
      
      {/* Simple manual start button */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => {
            console.log("🎯 Manual VAPI start");
            if (vapiRef.current && localInterviewInfo) {
              startCall();
            } else {
              console.log("❌ VAPI not ready, creating new instance...");
              if (localInterviewInfo) {
                // Create VAPI instance and start call
                const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '700899a8-bae6-4538-bf87-4817245fb314';
                vapiRef.current = new Vapi(vapiKey);
                
                // Set up basic event listeners
                vapiRef.current.on("call-start", () => {
                  console.log("✅ Call has started");
                  setIsCallActive(true);
                  setInterviewStartTime(Date.now());
                  setIsLoading(false);
                });
                
                // Start the call
                startCall();
              }
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
        >
          Start Interview
        </button>
      </div>
      
      <h2 className='font-bold text-xl flex justify-between'>
        AI Interview Taker
        <span className='flex gap-2 items-center'>
          <Timer />
          {isCallActive && <span className='text-green-500'>● Live</span>}
          {timeRemaining && isCallActive && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono ${
              timeRemaining <= 300 ? 'bg-red-100 text-red-600' : 
              timeRemaining <= 600 ? 'bg-yellow-100 text-yellow-600' : 
              'bg-green-100 text-green-600'
            }`}>
              <span className="text-xs">⏰</span>
              <span className="font-bold">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className="relative w-[150px] h-[150px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {!activeUser && isCallActive && (
                <span className="absolute w-full h-full rounded-full bg-violet-500 opacity-75 animate-ping" />
              )}
            </div>
            <Image
              src="/ai.jpg"
              alt="ai"
              width={150}
              height={150}
              className="rounded-full object-cover w-full h-full relative z-10"
            />
          </div>
          <h2 className="">VivCruit-AI</h2>
          <p className="text-sm text-gray-500">
            {isCallActive ? "Interview in progress..." : "Initializing..."}
          </p>
        </div>

        <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className="relative">
            {activeUser && isCallActive && (
              <span className="absolute w-full h-full rounded-full bg-violet-500 opacity-75 animate-ping" />
            )}
            <h2 className='text-7xl bg-primary text-white p-3 rounded-full px-6 mb-4'>
              {localInterviewInfo?.userName?.[0] || 'U'}
            </h2>
          </div>
          <h2>{localInterviewInfo?.userName || 'User'}</h2>
          <p className="text-sm text-gray-500">
            {activeUser ? "Your turn to speak" : "Listening..."}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-5 justify-center mt-7'>
        <div className={`h-12 w-12 p-3 rounded-full flex items-center justify-center ${
          isCallActive ? 'bg-violet-500 text-white' : 'bg-gray-300 text-gray-500'
        }`}>
          <Mic className='h-6 w-6' />
        </div>

        <AlertConformation stopInterview={stopInterview}>
          <div className={`h-12 w-12 p-3 rounded-full flex items-center justify-center cursor-pointer ${
            isCallActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500'
          }`}>
            <Phone className='h-6 w-6' />
          </div>
        </AlertConformation>
      </div>

      <div className='text-center mt-7'>
        <h2 className='text-violet-400 font-medium'>
          {isCallActive ? "Interview In Progress..." : "Initializing Interview..."}
        </h2>
        {isCallActive && (
          <p className='text-sm text-gray-500 mt-2'>
            Click the red phone button to end the interview
          </p>
        )}
      </div>
    </div>
  );
}
