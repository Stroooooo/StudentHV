"use client"

import * as React from "react"
import {
  Server,
  ServerIcon,
} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import CreateServerWizard from "./wizards/create-server"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { venv } from "@/config/env"
import { Spinner } from "./ui/shadcn-io/spinner"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth: any = useContext(AuthContext)

  const {data, isLoading, isError} = useQuery({ 
        queryKey: ['teamlist'], 
        queryFn: async () => {
            const res = await fetch(venv.SERVER + `/vm/teams`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            return res.json()
        }
  })

  console.log(data)
  
  return (
    <Sidebar collapsible="icon" {...props} className="text-white">
      <SidebarHeader className="bg-[#532E80]">
        <div className="flex items-center gap-2 mt-2">
          <Image alt="logo" src={process.env.NEXT_PUBLIC_LOGO_URL || ""} width={60} height={60} className="p-2" />
        </div>
        <div className="my-2 min-w-full border-t-[1px] border-gray-400"></div>
        {
          isLoading ?
            <Spinner />
          :
            <TeamSwitcher teams={data} />
        }
        <CreateServerWizard />
      </SidebarHeader>
      <SidebarContent className="bg-[#532E80]">
      </SidebarContent>
      <SidebarFooter className="bg-[#532E80]">
        <NavUser user={{
          name: auth["displayName"],
          email: auth["username"] + "@nescol.ac.uk",
          avatar: "",
          isAdmin: auth.isAdmin
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
