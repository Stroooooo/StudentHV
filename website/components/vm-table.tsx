import { venv } from "@/config/env"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Spinner } from "./ui/shadcn-io/spinner"
import { AuthContext } from "@/context/AuthContext"
import { useContext, useState } from "react"
import VmSettings from "./dialogs/vm-settings"
import VmConnect from "./dialogs/vm-connect"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
<<<<<<< HEAD
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
=======
import { ArrowUpDown } from "lucide-react"
>>>>>>> 0eede7c (New ability to filter)

export type Vms = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Vms>[] = [
  {
<<<<<<< HEAD
    accessorKey: "vmname",
=======
    accessorKey: "Name",
>>>>>>> 0eede7c (New ability to filter)
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            VM Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
<<<<<<< HEAD
  },
  {
    accessorKey: "status",
=======
    cell: ({ row }: any) => row.original.Name.split(" ")[row.original.Name.split(" ").length - 1],
  },
  {
    accessorKey: "State",
>>>>>>> 0eede7c (New ability to filter)
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
<<<<<<< HEAD
  },
  {
    accessorKey: "cpu",
=======
    cell: ({ row }: any) => {
      const state = row.original.State;
      if (state === 3) return "Powered Off";
      if (state === 2) return "Running";
      if (state === 4) return "Stopping";
      if (state === 6) return "Saved (offline)";
      if (state === 9) return "Paused";
      if (state === 10) return "Starting";
      return state;
    },
  },
  {
    accessorKey: "CPUUsage",
>>>>>>> 0eede7c (New ability to filter)
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
            CPU
=======
            CPU Usage
>>>>>>> 0eede7c (New ability to filter)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
<<<<<<< HEAD
    accessorKey: "memoryassigned",
=======
    accessorKey: "ProcessorCount",
>>>>>>> 0eede7c (New ability to filter)
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
            Memory Assigned
=======
            CPUs
>>>>>>> 0eede7c (New ability to filter)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
<<<<<<< HEAD
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
        console.log(row)
        return (
            <div>

            </div>
        )
        },
    },
=======
    accessorKey: "MemoryAssigned",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Memory Usage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: any) => bytesToSize(row.original.MemoryAssigned)
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      const team = window.localStorage.getItem("@TEAM")

      const startVMMutation = useMutation({
          mutationFn: async (vmConfig: {
              vmname: string
          }) => {
              const response = await fetch(venv.SERVER + `/vm/${team}/${vmConfig.vmname}/start`, {
                  method: "POST",
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

      const stopVMMutation = useMutation({
          mutationFn: async (vmConfig: {
              vmname: string
          }) => {
              const response = await fetch(venv.SERVER + `/vm/${team}/${vmConfig.vmname}/stop`, {
                  method: "POST",
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
          <div className="text-right flex items-center justify-end gap-5">
              <VmConnect vmName={row.original.Name} />
              {
              row.original.State == 2 || row.original.State == 10 ?
                  <Button variant="destructive" disabled={stopVMMutation.isPending} onClick={() => {
                      stopVMMutation.mutate({vmname: row.original.Name})
                  }}>{
                      stopVMMutation.isPending ?
                          <Spinner />
                      :
                          "Stop VM"
                  }</Button>
              :
                  <Button disabled={startVMMutation.isPending} onClick={() => {
                      startVMMutation.mutate({vmname: row.original.Name})
                  }}>{
                      startVMMutation.isPending ?
                          <Spinner />
                      :
                          "Start VM"
                  }</Button>
              }
              <VmSettings vmName={row.original.Name} />
          </div>
      )
    },
  },
>>>>>>> 0eede7c (New ability to filter)
]


function bytesToSize(bytes: number, decimals = 2) {
  if (!Number(bytes)) {
    return '0 Bytes';
  }

  const kbToBytes = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(kbToBytes),
  );

  return `${parseFloat(
    (bytes / Math.pow(kbToBytes, index)).toFixed(dm),
  )} ${sizes[index]}`;
}


export default function VMTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const team = window.localStorage.getItem("@TEAM")
<<<<<<< HEAD
    const auth: any = useContext(AuthContext)
=======
>>>>>>> 0eede7c (New ability to filter)
    
    const {data, isLoading, isError} = useQuery({ 
        queryKey: ['vmlist'], 
        queryFn: async () => {
            const res = await fetch(venv.SERVER + `/vm/${team}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            return res.json()
        }
    })

<<<<<<< HEAD
    const startVMMutation = useMutation({
        mutationFn: async (vmConfig: {
            vmname: string
        }) => {
            const response = await fetch(venv.SERVER + `/vm/${team}/${vmConfig.vmname}/start`, {
                method: "POST",
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

    const stopVMMutation = useMutation({
        mutationFn: async (vmConfig: {
            vmname: string
        }) => {
            const response = await fetch(venv.SERVER + `/vm/${team}/${vmConfig.vmname}/stop`, {
                method: "POST",
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

    const table = useReactTable({
        data,
=======
    const table = useReactTable({
        data: data || [],
>>>>>>> 0eede7c (New ability to filter)
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
        sorting,
        },
    })

<<<<<<< HEAD
    return (

=======
    if (isLoading) {
        return (
            <div className="min-w-[200px] flex justify-center items-center gap-5 p-5">
                <Spinner /> <h1>Could take a while (1-2 minutes)</h1>
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className="min-w-[200px] flex justify-center items-center gap-5 p-5">
                <p>Error loading VMs. Please try again.</p>
            </div>
        )
    }

    return (
>>>>>>> 0eede7c (New ability to filter)
      <Table>
        <TableCaption>Built by <a className="underline text-blue-500" href="https://www.linkedin.com/in/struan-mclean-821aa427b/">Struan McLean</a></TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
<<<<<<< HEAD
    // <Table>
    //     <TableHeader>
    //         <TableRow>
    //         <TableHead className="w-[100px]">Vm Name</TableHead>
    //         <TableHead>Status</TableHead>
    //         <TableHead>CPU</TableHead>
    //         <TableHead className="text-right">Memory Assigned</TableHead>
    //         </TableRow>
    //     </TableHeader>
    //     <TableBody>
    //         {
    //         isLoading ?
    //             <div className="min-w-[200px] flex justify-center items-center gap-5 p-5">
    //                 <Spinner /> <h1>Could take a while (1-2 minutes)</h1>
    //             </div>
    //         :
    //             data && data.map((data: any, index:  number) => {
    //                 let parts
    //                 let name

    //                 if (auth.isAdmin == "false") {
    //                     parts = data.Name.split(' ');
    //                     name = parts.slice(3).join(' ');                            
    //                 } else {
    //                     parts = data.Name.split(' ');
    //                     name = parts.join(" ")
    //                 }

    //                 const state = () => {
    //                     if (data.State == 3) {
    //                         return "Powered Off"
    //                     } else if (data.State == 2) {
    //                         return "Running"
    //                     } else if (data.State == 4) {
    //                         return "Stoping"
    //                     } else if (data.State == 6) {
    //                         return "Saved (offline)"
    //                     } else if (data.State == 9) {
    //                         return "Paused"
    //                     } else if (data.State == 10) {
    //                         return "Starting"
    //                     } else {
    //                         return data.State
    //                     }
    //                 }

    //                 return (
    //                     <TableRow key={index}>
    //                     <TableCell className="font-medium">{name}</TableCell>
    //                     <TableCell>{state()}</TableCell>
    //                     <TableCell>{data.CPUUsage}</TableCell>
    //                     <TableCell className="text-right">{bytesToSize(data.MemoryAssigned)}</TableCell>
    //                     <TableCell className="text-right flex items-center justify-end gap-5">
    //                         <VmConnect vmName={data.Name} />
    //                         {
    //                         data.State == 2 || data.State == 10 ?
    //                             <Button variant="destructive" disabled={stopVMMutation.isPending} onClick={() => {
    //                                 stopVMMutation.mutate({vmname: data.Name})
    //                             }}>{
    //                                 stopVMMutation.isPending ?
    //                                     <Spinner />
    //                                 :
    //                                     "Stop VM"
    //                             }</Button>
    //                         :
    //                             <Button disabled={startVMMutation.isPending} onClick={() => {
    //                                 startVMMutation.mutate({vmname: data.Name})
    //                             }}>{
    //                                 startVMMutation.isPending ?
    //                                     <Spinner />
    //                                 :
    //                                     "Start VM"
    //                             }</Button>
    //                         }
    //                         <VmSettings vmName={data.Name} />
    //                     </TableCell>
    //                     </TableRow>
    //                 )
    //             })
    //         }
    //     </TableBody>
    //     <TableFooter>
    //         <TableRow>
    //         <TableCell colSpan={3}></TableCell>
    //         <TableCell className="text-right"></TableCell>
    //         </TableRow>
    //     </TableFooter>
    // </Table>
=======
>>>>>>> 0eede7c (New ability to filter)
    )
}