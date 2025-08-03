import Image from "next/image";
import { Button } from "@/components/ui/button"
import Provider from "./provider";
import Link from "next/link";

export default function Home({children}) {
  console.log("Hello Vivecruit");
  return (
    <div>
      <h1>Welcome to Vivecruit</h1>
<Button variant="outline">Button</Button>  
<Link href={'/auth'} className='cursor-pointer'>
<Button variant="outline" className=''>Sign-In / Sign-Up</Button>  
</Link>  
    <Provider>
      {children}
    </Provider>

</div>
  );
}
