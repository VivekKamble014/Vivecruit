
import { Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";

import {
  Code2Icon,
  User2Icon,
  BriefcaseBusinessIcon,
  PuzzleIcon,
  MessageCircleQuestionIcon,
  BookTextIcon,
  LightbulbIcon,
  GlobeIcon,
  LanguagesIcon,
  ClockIcon,
  LaptopIcon,
  BrainIcon,
  BotIcon,
  NetworkIcon,
  ShieldCheckIcon,
  ClipboardListIcon
} from 'lucide-react';




export const SideBarOptions = [
{
    name:"Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    path: "/dashboard"
},
{
    name:"Schedule Interview",
    icon: Calendar,
    href: "/schedule-interview",
    path: "/schedule-interview"
},
{
    name:"All Interviews",
    icon: List,
    href: "/all-interviews",
    path: "/all-interviews"
},
{
    name:"Billing",
    icon: WalletCards,
    href: "/billing",
    path: "/billing"
},
{
    name:"Settings",
    icon: Settings,
    href: "/settings",
    path: "/settings"
},
]

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience-Based",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: PuzzleIcon,
  },
  {
    title: "Situational",
    icon: MessageCircleQuestionIcon,
  },
  {
    title: "Theoretical",
    icon: BookTextIcon,
  },
  {
    title: "Creative Thinking",
    icon: LightbulbIcon,
  },
  {
    title: "Global/International",
    icon: GlobeIcon,
  },
  {
    title: "Language Proficiency",
    icon: LanguagesIcon,
  },
  {
    title: "Time Management",
    icon: ClockIcon,
  },
  {
    title: "Remote Work Skills",
    icon: LaptopIcon,
  },
  {
    title: "Cognitive Ability",
    icon: BrainIcon,
  },
  {
    title: "AI/Automation Awareness",
    icon: BotIcon,
  },
  {
    title: "Networking Skills",
    icon: NetworkIcon,
  },
  {
    title: "Security Awareness",
    icon: ShieldCheckIcon,
  },
  {
    title: "Checklist-Based",
    icon: ClipboardListIcon,
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {jobTitle}
Job Description: {jobDescription}
Interview Duration: {duration}
Interview Type: {type}

Your task:
1. Analyze the job description to identify key responsibilities, required skills, and expected experience.
2. Generate a list of interview questions that match the given duration.
3. Adjust the number and depth of questions based on interview duration.
4. Ensure the tone and structure fit a real-life {type} interview.

Format:
Return your response as a JSON array:
interviewQuestions = [
  {
    question: "Your question here",
    type: "Technical / Behavioral / Experience / Problem Solving / Leadership"
  },
  ...
]

The goal is to create a structured, relevant, and time-optimized interview plan for a {jobTitle} role.
`;