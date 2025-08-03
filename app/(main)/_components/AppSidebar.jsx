"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SideBarOptions } from "@/services/Constants"

import Link from "next/link"
import { use } from "react"
import { usePathname } from "next/navigation"

export function AppSidebar() {

const path=usePathname();
console.log("Pathname:", path);

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center mt-5">
      <Image src={'/logo.png'} alt="Logo" width={250} height={30} 
        className="w-[140px] h-[70px] "
      />
      <Button className="w-full mt-5 p-5"><Plus/>Create New Interview</Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
            <SidebarContent>
                <SidebarMenu>
                    {SideBarOptions.map((option,index) =>(
                      <SidebarMenuItem
                        key={index}
                        className="p-1">

                        <SidebarMenuButton asChild className={`p-5 ${path==option.path && 'bg-purple-100' }`} >
                        <Link href={option.href}>
                        
                        <option.icon className={`text-[16px] ${path == option.path && 'text-purple-700'}`}/>
                        <span className={`text-[16px] ${path == option.path && 'text-purple-700'}`}>{option.name}</span>
                        </Link>
                        </SidebarMenuButton>

                        </SidebarMenuItem>  
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}