
'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Provider from "./provider";
import Link from "next/link";
import { motion } from 'framer-motion';
import { useEffect ,useState} from 'react';
import {
  Bot,
  Code,
  Video,
  BarChart2,
  ShieldCheck,
  FilePlus, Users, BrainCog, BarChart3
} from "lucide-react";
import Navbar from "./_components/navbar/Navbar";


const images = [
  "/s1.png",
  "/s2.png",
  "/s3.png",
  "/s4.png",

];
export default function Home({ children }) {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

const steps = [
  {
    icon: <FilePlus size={48} />,
    title: "Create Interview",
    description: "Set up the interview by defining the role, required skills, and sharing a secure link with the candidate.",
  },
  {
    icon: <Users size={48} />,
    title: "Candidate Joins",
    description: "Candidates enter a real-time interactive interview room and start the process seamlessly.",
  },
  {
    icon: <BrainCog size={48} />,
    title: "AI Evaluation",
    description: "Advanced AI tracks behavior, voice modulation, eye contact, and problem-solving in real time.",
  },
  {
    icon: <BarChart3 size={48} />,
    title: "Detailed Reports",
    description: "Get automatically generated reports highlighting strengths, weaknesses, and hiring suggestions.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

  return (
    <div>
    <Navbar/>
    <div className="flex flex-col min-h-screen mt-15">

      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-20 px-6 min-h-screen flex flex-col justify-center">
  <div className="grid md:grid-cols-2 gap-8 items-center">
    
    {/* Left Side - Text and Buttons */}
    <div className="text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to <span className="text-yellow-300">Vivecruit</span>
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Empowering Smart Interviews with AI
      </p>
      <div className="flex justify-center md:justify-start gap-4">
        <Link href="/auth">
          <Button variant="outline" className="bg-white text-violet-600 hover:bg-gray-100">
            Sign In / Sign Up
          </Button>
        </Link>
        <Link href="/auth">
          <Button variant="default" className="bg-yellow-400 text-black hover:bg-yellow-500">
            Create Interview
          </Button>
        </Link>
      </div>
    </div>

<div className="w-full aspect-video rounded-xl overflow-hidden shadow-none border-none m-0 p-0">
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube.com/embed/5ZpsrqsK5g8?autoplay=1&loop=1&mute=1&controls=0&modestbranding=1&rel=0&playlist=5ZpsrqsK5g8"
    title="ViveCruit"
    frameBorder="0"
    className="w-full h-full"
    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>

  </div>
</header>

    
      <section className="text-center min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-white to-violet-50">
      <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-2">
        Smart Hiring Starts Here
      </h2>

      <h1 className="text-4xl md:text-5xl font-extrabold text-violet-700 leading-tight max-w-3xl">
        Revolutionize Your Hiring with AI-Powered Interviews
      </h1>

      <p className="text-lg text-gray-600 mt-6 max-w-2xl">
        Vivecruit helps you identify the right talent faster, smarter, and with
        complete objectivity. Our AI-driven platform transforms traditional
        interviews into data-backed, seamless hiring experiences.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/auth"
          className="px-6 py-3 bg-violet-700 hover:bg-violet-800 text-white text-base rounded-xl transition duration-300 shadow-md"
        >
          Get Started for Free
        </Link>
        <Link
          href="/auth"
          className="px-6 py-3 border-2 border-violet-700 text-violet-700 hover:text-white hover:bg-violet-700 rounded-xl text-base transition duration-300 shadow-sm"
        >
          Watch Demo
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        No credit card required · Set up in under 2 minutes
      </p>
    </section>

 <section
      id="about"
      className="min-h-screen flex flex-col justify-center px-6 py-20 bg-white"
    >
      <h2 className="text-4xl font-bold text-center text-violet-700 mb-12">
        About Vivecruit
      </h2>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-center max-w-6xl mx-auto">
        {/* About Content */}
        <div className="flex-1">
          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>Vivecruit</strong> is a next-generation, AI-powered interview platform
            built to redefine how companies evaluate and hire technical talent.
            Our mission is to eliminate guesswork from the recruitment process
            by enabling data-driven, unbiased, and efficient interviews —
            anytime, anywhere.
            <br /><br />
            We combine the power of artificial intelligence with intuitive design
            to help hiring teams conduct intelligent, real-time interviews that
            assess both technical skills and behavioral traits.
            <br /><br />
            Whether you're a fast-growing startup or a large enterprise,
            Vivecruit empowers you to scale your recruitment with confidence and
            consistency — while providing candidates with a seamless and
            transparent interview experience.
          </p>
        </div>

        {/* Image Slideshow */}
        <div className="flex-1 w-full max-w-md overflow-hidden rounded-xl shadow-lg">
          <img
            src={images[current]}
            alt="About Vivecruit"
            className="w-full object-contain transition-all duration-700"
          />
        </div>
      </div>
    </section>


<section
  id="features"
  className="min-h-screen flex flex-col justify-center px-6 py-20 bg-gradient-to-b from-white to-violet-50"
>
  <h2 className="text-4xl font-bold text-center text-violet-700 mb-16 animate-fade-in">
    Powerful Features Designed for Smarter Hiring
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    {/* Feature 1 */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-violet-200 transition-shadow duration-300">
      <Bot className="mx-auto text-violet-600 mb-4" size={48} />
      <h3 className="text-2xl font-semibold mb-2">Real-time AI Evaluation</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Leverage cutting-edge AI to assess candidates’ attentiveness, voice modulation, emotional tone, and technical accuracy—delivering instant and unbiased feedback.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-violet-200 transition-shadow duration-300">
      <Code className="mx-auto text-violet-600 mb-4" size={48} />
      <h3 className="text-2xl font-semibold mb-2">Integrated Coding Environment</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Provide candidates with a real-time, collaborative code editor featuring syntax highlighting, auto-save, live test case results, and language support to simulate real work scenarios.
      </p>
    </div>

    {/* Feature 3 */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-violet-200 transition-shadow duration-300">
      <Video className="mx-auto text-violet-600 mb-4" size={48} />
      <h3 className="text-2xl font-semibold mb-2">Smart Interview Recording</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Record interviews with time-stamped insights, facial analysis, and playback features—enabling transparent evaluations and team collaboration in the final hiring decision.
      </p>
    </div>

    {/* Feature 4 */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-violet-200 transition-shadow duration-300">
      <BarChart2 className="mx-auto text-violet-600 mb-4" size={48} />
      <h3 className="text-2xl font-semibold mb-2">Advanced Analytics Dashboard</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Visualize candidate performance through real-time charts, personality mapping, technical competency scoring, and recommendation reports—all from a single dashboard.
      </p>
    </div>

    {/* Feature 5 */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-violet-200 transition-shadow duration-300">
      <Code className="mx-auto text-violet-600 mb-4" size={48} />
      <h3 className="text-2xl font-semibold mb-2">One-Click Interview Links</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Generate secure, one-time interview links that can be shared with candidates via email, reducing setup time and streamlining the hiring workflow.
      </p>
    </div>

    {/* Feature 6 */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-violet-200 transition-shadow duration-300">
      <ShieldCheck className="mx-auto text-violet-600 mb-4" size={48} />
      <h3 className="text-2xl font-semibold mb-2">Secure & Scalable</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Built with enterprise-grade security and scalable architecture, ensuring data integrity, GDPR compliance, and seamless performance across teams of all sizes.
      </p>
    </div>
  </div>
</section>

     <section
      id="how-it-works"
      className="min-h-screen flex flex-col justify-center px-6 py-20 bg-gradient-to-b from-white to-violet-50"
    >
      <motion.h2
        className="text-4xl font-bold text-center text-violet-700 mb-16"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        How It Works
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={item}
            className="bg-white p-6 shadow-xl rounded-xl transition-transform hover:scale-105"
          >
            <div className="text-violet-600 mb-4 text-5xl">{step.icon}</div>
            <h4 className="font-semibold text-xl mb-2">{step.title}</h4>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

      {/* Testimonials Section */}
<section
  id="testimonials"
  className="min-h-screen flex flex-col justify-center items-center px-6 py-16 bg-gray-50 animate-fade-in"
>
  <h2 className="text-4xl font-bold text-center text-violet-700 mb-12 animate-fade-in-up">
    What Our Users Say
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl animate-fade-in-up">
    {/* Testimonial 1 */}
    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-500 ease-in-out animate-slide-in">
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/check.png"
          alt="HR Manager"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">Anjali Sharma</p>
          <p className="text-sm text-gray-500">HR Manager, TechCorp</p>
        </div>
      </div>
      <p className="text-gray-700 italic">
        “Vivecruit saved us hours of technical screening while giving accurate candidate insights.”
      </p>
      <div className="mt-4 text-yellow-400 flex">
        {'★★★★★'.split('').map((star, i) => (
          <span key={i}>{star}</span>
        ))}
      </div>
    </div>

    {/* Testimonial 2 */}
    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-500 ease-in-out animate-slide-in delay-100">
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/check.png"
          alt="CTO"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">Ravi Mehta</p>
          <p className="text-sm text-gray-500">CTO, InnovateX</p>
        </div>
      </div>
      <p className="text-gray-700 italic">
        “This platform has revolutionized the way we conduct interviews and evaluate skills.”
      </p>
      <div className="mt-4 text-yellow-400 flex">
        {'★★★★★'.split('').map((star, i) => (
          <span key={i}>{star}</span>
        ))}
      </div>
    </div>

    {/* Testimonial 3 */}
    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-500 ease-in-out animate-slide-in delay-200">
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/check.png"
          alt="Recruiter"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">Sneha Patil</p>
          <p className="text-sm text-gray-500">Recruiter, HireRight</p>
        </div>
      </div>
      <p className="text-gray-700 italic">
        “Clean UI, fast results, and detailed analytics. We love using Vivecruit!”
      </p>
      <div className="mt-4 text-yellow-400 flex">
        {'★★★★★'.split('').map((star, i) => (
          <span key={i}>{star}</span>
        ))}
      </div>
    </div>
  </div>
</section>

    <section
  id="cta"
  className="text-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 py-20 px-6 md:px-16 rounded-2xl shadow-lg min-h-screen flex flex-col justify-center items-center animate-fade-in"
>
  <h2 className="text-4xl md:text-5xl font-extrabold text-violet-800 mb-4 transition-opacity duration-700 ease-in-out delay-100 animate-fade-in">
    Ready to Upgrade Your Hiring Game?
  </h2>
  <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 transition-opacity duration-700 ease-in-out delay-300 animate-fade-in">
    Vivecruit revolutionizes the interview process with intelligent automation, AI insights, and seamless candidate experiences. Let your hiring speak quality and speed.
  </p>

  {/* Feature Highlights */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-6 mb-10 animate-fade-in delay-500">
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
      <h3 className="text-xl font-semibold text-violet-700 mb-2">AI-Powered Insights</h3>
      <p className="text-sm text-gray-600">Automatically analyze candidate responses with deep insights for faster decisions.</p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
      <h3 className="text-xl font-semibold text-violet-700 mb-2">Seamless Interview Hosting</h3>
      <p className="text-sm text-gray-600">Conduct interviews with our integrated, user-friendly platform – no downloads required.</p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
      <h3 className="text-xl font-semibold text-violet-700 mb-2">Smart Scheduling</h3>
      <p className="text-sm text-gray-600">Save time with intelligent scheduling features and automated reminders.</p>
    </div>
  </div>

  {/* CTA Button */}
  <Link
    href="/auth"
    className="mt-6 inline-block px-8 py-4 bg-violet-700 text-white rounded-full font-semibold shadow-md hover:shadow-xl transition-transform duration-500 hover:scale-110 hover:bg-violet-800 animate-fade-in delay-700"
  >
    Start Your Free Trial Now
  </Link>

  {/* Sub Note */}
  <p className="mt-4 text-sm text-gray-500 animate-fade-in delay-900">
    No credit card required • Cancel anytime • Trusted by top recruiters
  </p>
</section>
      
    {/* Footer */}
<footer className="bg-gray-100 text-gray-700 px-6 pt-10 pb-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
    {/* Company Info / Links */}
    <div>
      <h4 className="text-lg font-bold mb-4 text-violet-700">Quick Links</h4>
      <ul className="space-y-2 text-sm">
        <li><Link href="/" className="hover:underline">Home</Link></li>
        <li><Link href="/about" className="hover:underline">About Us</Link></li>
        <li><Link href="/features" className="hover:underline">Features</Link></li>
        <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
        <li><Link href="/auth" className="hover:underline">Sign Up</Link></li>
        <li><Link href="/auth" className="hover:underline">Login</Link></li>
      </ul>
    </div>

    {/* Contact Form */}
    <div>
      <h4 className="text-lg font-bold mb-4 text-violet-700">Contact Us</h4>
      <form className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <textarea
          placeholder="Your Message"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="submit"
          className="w-full bg-violet-700 text-white py-2 px-4 rounded-md hover:bg-violet-800 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>

    {/* Branding / Social (Optional Placeholder) */}
    <div className="flex flex-col items-center justify-center">
      <Image src="/logo.png" alt="Vivecruit Logo" width={80} height={80} />
      <p className="text-center mt-4 text-sm">Connecting Talent to Opportunity. Let’s make hiring smarter.</p>
    </div>
  </div>

  {/* Bottom Line */}
  <div className="mt-10 border-t pt-4 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} Vivecruit. All rights reserved. | Built by Vivek Kamble
  </div>
</footer>
    </div>
    </div>
  );
}