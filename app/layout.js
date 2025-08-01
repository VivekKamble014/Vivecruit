import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  // authors: [{ name: "Vivecruit Team", url: "https://vivecruit.com" }], // author information
  creator: "Vivecruit Team", // creator of the application
  description: "Vivecruit - Your AI-Powered Recruitment Assistant",// description for SEO
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
