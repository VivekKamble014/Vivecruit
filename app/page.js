// import Image from "next/image";
// import { Button } from "@/components/ui/button"
// import Provider from "./provider";
// import Link from "next/link";

// export default function Home({children}) {
//   console.log("Hello Vivecruit");
//   return (
//     <div>
//       <h1>Welcome to Vivecruit</h1>
// <Button variant="outline">Button</Button>  
// <Link href={'/auth'} className='cursor-pointer'>
// <Button variant="outline" className=''>Sign-In / Sign-Up</Button>  
// </Link>  
//     <Provider>
//       {children}
//     </Provider>

// </div>
//   );
// }

'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Provider from "./provider";
import Link from "next/link";

export default function Home({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Hero Section */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to <span className="text-yellow-300">Vivecruit</span></h1>
        <p className="text-lg md:text-xl mb-8">Empowering Smart Interviews with AI</p>
        <div className="flex justify-center gap-4">
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
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-10">
        <Provider>
          {children}
        </Provider>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Vivecruit. All rights reserved. | Built by Vivek Kamble
      </footer>
    </div>
  );
}