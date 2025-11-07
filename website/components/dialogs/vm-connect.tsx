import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "../ui/item"
import { ChevronRightIcon, CommandIcon } from "lucide-react"
import { Kbd, KbdGroup } from "../ui/kbd"
import { useQuery } from "@tanstack/react-query"
import { venv } from "@/config/env"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/shadcn-io/spinner"
export default function VmConnect({vmName}: any) {
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

    const [activeTeam, setActiveTeam] = useState<null | string>(null)
    const [copied, setCopied] = useState(false)
    
    useEffect(() => {
        if (data) {
            const teamName = window.localStorage.getItem("@TEAM") || "VH1"

            const team = data.filter((team: string[]) => team[0] == teamName)[0][1]

            setActiveTeam(team)            
        }
    }, [data])

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }, [copied])

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="default">
                    Connect
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect</DialogTitle>
                    <DialogDescription>
                        This is a guide on how to connect to your vm
                    </DialogDescription>
                </DialogHeader>

                {
                    activeTeam == null ?
                        <div>
                            <Spinner />
                            <p>Loading connection command...</p>
                        </div>
                    :
                        <Item variant="outline" size="sm" asChild>
                            <a onClick={() => {
                                navigator.clipboard.writeText(`vmconnect ${activeTeam} "${vmName}"`)
                                setCopied(true)
                            }}>
                                <ItemMedia>
                                    <CommandIcon className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>vmconnect {activeTeam} "{vmName}"</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <KbdGroup>
                                        {
                                            copied ?
                                                <Kbd>Copied!</Kbd>
                                            :
                                                <Kbd>Click to copy</Kbd>
                                        }
                                    </KbdGroup>
                                </ItemActions>
                            </a>
                        </Item>                        
                }

                <p>Run this in your windows comand prompt. You can find this by searching "cmd" in the search bar on your computer.</p>
            </DialogContent>
        </Dialog>
    )
}