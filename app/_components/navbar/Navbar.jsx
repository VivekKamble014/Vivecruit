// 'use client';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// export default function Navbar() {
//   return (
//     <motion.nav
//       className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
//       initial={{ y: -80 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6, ease: 'easeOut' }}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center ">
//        <Link href="/" className="text-xl font-bold text-violet-700 flex items-center gap-2">
//   <Image src="/logo.png" alt="Logo" width={100} height={80} />
  
// </Link>
//         <div className="flex gap-6 items-center">
//           <Link href="#about" className="hover:text-violet-600 transition font-medium">About</Link>
//           <Link href="#video" className="hover:text-violet-600 transition font-medium">How It Works</Link>
//           <Link href="#contact" className="hover:text-violet-600 transition font-medium">Contact</Link>
//           <Link href="/auth">
//             <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
//               Sign In
//             </button>
//           </Link>
//         </div>
//       </div>
//     </motion.nav>
//   );
// }

'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-violet-700 flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={100} height={80} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="#about" className="hover:text-violet-600 transition font-medium">About</Link>
          <Link href="#video" className="hover:text-violet-600 transition font-medium">How It Works</Link>
          <Link href="#contact" className="hover:text-violet-600 transition font-medium">Contact</Link>
          <Link href="/auth">
            <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
              Sign In
            </button>
          </Link>
        </div>

      <div className="md:hidden">
  <Link href="/auth">
    <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
      Sign In
    </button>
  </Link>
</div>
</div>
    </motion.nav>
  );
}