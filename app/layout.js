import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = { // optimize and add seo to out application 
  title: "Vivecruit", //  title of the application
  keywords: "AI, Recruitment, Hiring, Job Search, Vivecruit", // keywords for SEO
  authors: [{ name: "Vivecruit Team", url: "https://vivecruit-two.vercel.app" }], // author information
  creator: "Vivecruit Team", // creator of the application
  description: "Vivecruit - Your AI-Powered Recruitment Assistant",// description for SEO
  icons: {
    icon: "/logo.png", // OR "/logo.png", OR "/favicon.svg"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        
      >
  
        {children}
        {/* <Toaster/> */}
        <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#962EFF',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
          },
        }}
      />
      
      </body>
    </html>
  );
}
