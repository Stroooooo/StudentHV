import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { venv } from "@/config/env"
import { Spinner } from "../ui/shadcn-io/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/AuthContext"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default function CreateServerWizard() {
    const team = window.localStorage.getItem("@TEAM")

    const [open, setOpen] = useState(false)
    const [showError, setShowError] = useState(false)
    const auth: any = useContext(AuthContext)

    const { data: isos, isLoading: isLoadingIsos } = useQuery({
        queryKey: ['isos', team],
        queryFn: async () => {
            const res = await fetch(venv.SERVER + `/vm/${team}/isos`, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
            })
            if (!res.ok) {
            throw new Error('Failed to fetch ISOs')
            }
            return res.json()
        }
    })

    const { data: networks, isLoading: isLoadingNetworks } = useQuery({
        queryKey: ['networks', team],
        queryFn: async () => {
            const res = await fetch(venv.SERVER + `/vm/${team}/networks`, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
            })
            if (!res.ok) {
            throw new Error('Failed to fetch networks')
            }
            return res.json()
        }
    })

    const isLoading = isLoadingIsos || isLoadingNetworks

    const mutation = useMutation({
        mutationFn: async (vmConfig: {
            course_name: any,
            name: any
            processors: any
            memoryGB: any
            isoPath?: any,
            networkSwitch: any
        }) => {
            const response = await fetch(venv.SERVER + `/vm/${team}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: (auth.username as string).split(" ").join("-") + " " 
                    + (vmConfig.course_name as string).split(" ").join("-") + " " 
                    + (auth.displayName as string).split(" ").join("-") + " " 
                    + vmConfig.name,
                    processors: vmConfig.processors,
                    memoryGB: vmConfig.memoryGB,
                    isoPath: vmConfig.isoPath,
                    networkSwitch: vmConfig.networkSwitch
                })
            })

            if (!response.ok) {
                throw new Error('Failed to create VM')
            }

            return response.json()
        },
        onSuccess: (data) => {
            window.location.reload()
            setOpen(false)
        },
        onError: (error) => {
            setShowError(true)
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        
        const vmConfig = {
            course_name: formData.get('course_name') as string,
            name: formData.get('vm_name') as string,
            processors: parseInt(formData.get('core_count') as string) || 2,
            memoryGB: parseInt(formData.get('ram_count') as string) || 4,
            isoPath: formData.get('os') as string || undefined,
            networkSwitch: formData.get('network_switch') as string || undefined
        }

        if (!vmConfig.name) {
            return
        }

        mutation.mutate(vmConfig)
    }
    
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Drawer direction="right" open={open} onOpenChange={setOpen}>
                    <DrawerTrigger className="min-w-full">
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Button className="min-w-full">Create new VM</Button>
                        </SidebarMenuButton>
                    </DrawerTrigger>
                    <DrawerContent className="w-[450px]">
                        {
                            isLoading ?
                                <div className="flex justify-center items-center min-h-screen min-w-full text-center">
                                    <div className="text-center flex-col flex justify-center items-center gap-3">
                                        <Spinner />
                                        <h1>Loading ISOs & Networks</h1>                                
                                    </div>
                                </div>
                            :
                                <>
                                    <DrawerHeader className="flex justify-center pt-10">
                                        <div className="text-center">
                                            <DrawerTitle>Create VM</DrawerTitle>
                                            <DrawerDescription>This wizard allows you to create a new VM</DrawerDescription>                      
                                        </div>
                                    </DrawerHeader>

                                    {
                                        showError == true &&
                                            <div className="w-full flex justify-center">
                                                <Alert variant="destructive" className="w-[90%]">
                                                    <AlertCircleIcon />
                                                    <AlertTitle>Unable to process your request.</AlertTitle>
                                                    <AlertDescription>
                                                    <p>Could be the following issues.</p>
                                                    <ul className="list-inside list-disc text-sm">
                                                        <li>You tried to assign more than your qouta</li>
                                                        <li>There was an internal server error</li>
                                                        <li>One of the values is unset</li>
                                                    </ul>
                                                    <p>If this dose not help, please contact your lecturer</p>
                                                    </AlertDescription>
                                                </Alert>                                            
                                            </div>
                                    }
                                    <form className="min-h-full" onSubmit={handleSubmit}>
                                        <div className="p-10 pt-5 flex-col flex gap-y-5">
                                            <div>
                                                <Label className="mb-2" htmlFor="course_name">Course Code *</Label>
                                                <Input 
                                                    id="course_name" 
                                                    name="course_name" 
                                                    placeholder="QBCN-F241A" 
                                                    required
                                                />                        
                                            </div>

                                            <div>
                                                <Label className="mb-2" htmlFor="vm_name">VM Name *</Label>
                                                <Input 
                                                    id="vm_name" 
                                                    name="vm_name" 
                                                    placeholder="Kali Linux" 
                                                    required
                                                />                        
                                            </div>

                                            <div>
                                                <Label className="mb-2" htmlFor="core_count">Core Count {auth.isAdmin == "false" && "(Max 2)"} *</Label>
                                                <Input 
                                                    id="core_count" 
                                                    name="core_count" 
                                                    type="number" 
                                                    defaultValue={1}
                                                    min={1}
                                                    max={16}
                                                    required
                                                />                        
                                            </div>

                                            <div>
                                                <Label className="mb-2" htmlFor="ram_count">RAM Count {auth.isAdmin == "false" && "(Max 4)"} (GB) *</Label>
                                                <Input 
                                                    id="ram_count" 
                                                    name="ram_count" 
                                                    type="number" 
                                                    defaultValue={2}
                                                    min={1}
                                                    max={64}
                                                    required
                                                />                        
                                            </div>

                                            <div>
                                                <Label className="mb-2" htmlFor="os">Operating System *</Label>
                                                <Select name="os" required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pick OS" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            isos && Array.isArray(isos) && isos.map((iso: any, index: number) => (
                                                                <SelectItem key={index} value={iso["FullPath"]}>
                                                                    {iso["Name"]} ({iso["SizeGB"]} GB)
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="mb-2" htmlFor="network_switch">Network *</Label>
                                                <Select name="network_switch" required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Network" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            networks && Array.isArray(networks) && networks.map((network: any, index: number) => (
                                                                <SelectItem key={index} value={network["Name"]}>
                                                                    {network["Name"]} ({network["SwitchType"]})
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <DrawerFooter>
                                            <Button 
                                                type="submit" 
                                                className="min-w-full"
                                                disabled={mutation.isPending}
                                            >
                                                {mutation.isPending ? (
                                                    <>
                                                        <Spinner className="mr-2 h-4 w-4" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    'Create'
                                                )}
                                            </Button>
                                            <DrawerClose asChild>
                                                <Button 
                                                    variant="outline" 
                                                    className="min-w-full"
                                                    type="button"
                                                    disabled={mutation.isPending}
                                                >
                                                    Cancel
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>                    
                                    </form>
                                </>
                        }
                    </DrawerContent>
                </Drawer>   
            </SidebarMenuItem>
        </SidebarMenu>
    )
}