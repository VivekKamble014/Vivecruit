
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

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
👉 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🍀 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
question:",
type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
...
}]
🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

export const FEEDBACK_PROMPT=`{{conversation}}  
Depends on this Interview Conversation between assistant and user,  
Give me feedback for user interview. Give me rating out of 10 for technical Skills,  
Communication, Problem Solving, Experince. Also give me summery in 3 lines  
about the interview and one line to let me know whether is recommanded  
for hire or not with msg. Give me response in JSON format  
{  
  feedback:{  
    rating:{  
      techicalSkills:5,  
      communication:6,  
      problemSolving:4,  
      experince:7  
    },  
    summery:<in 3 Line>,  
    Recommendation:"",  
    RecommendationMsg:""  
  }  
}`