import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { venv } from "@/config/env";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/shadcn-io/spinner";
import {
  SettingsIcon,
} from "lucide-react"

export default function VmSettings({vmName}: any) {
    const team = window.localStorage.getItem("@TEAM")
    const parts = vmName.split(' ');
    const name = parts.slice(3).join(' ');

    const {data, isLoading} = useQuery({ 
        queryKey: ['ip' + vmName], 
        queryFn: async () => {
            const res = await fetch(venv.SERVER + `/vm/${team}/${vmName}/ip`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error('Failed to fetch IP')
            }

            return res.json()
        }
    })

    const deleteMMutation = useMutation({
        mutationFn: async (vmConfig: {
            vmname: string
        }) => {
            const response = await fetch(venv.SERVER + `/vm/${team}/${vmConfig.vmname}`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('Failed to create VM')
            }

            return response.json()
        },
        onSuccess: (data) => {
            console.log("VM started successfully:", data)
            window.location.reload()
        },
        onError: (error) => {
            console.error("VM creation failed:", error)
        }
    })

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline">
                    <SettingsIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{name} Settings</DialogTitle>
                    <DialogDescription>
                        These are the available settings for your vm
                        in this software
                    </DialogDescription>
                </DialogHeader>
                
                <h1>IP Address: {JSON.stringify(data)}</h1>

                <Dialog>
                    <DialogTrigger>
                        <Button variant="destructive" className="w-full">
                            Delete VM
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete {name}</DialogTitle>
                            <DialogDescription>
                                Are you sure? You can't get it back after this action.
                            </DialogDescription>
                        </DialogHeader>

                        <Button onClick={() => deleteMMutation.mutate({vmname: vmName})} disabled={deleteMMutation.isPending} variant="destructive">
                            {deleteMMutation.isPending && <Spinner />}
                            Delete VM
                        </Button>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    )
}