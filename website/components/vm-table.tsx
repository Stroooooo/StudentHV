import { venv } from "@/config/env"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Spinner } from "./ui/shadcn-io/spinner"
import { useState } from "react"
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
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "./ui/checkbox"
import { Progress } from "@/components/ui/progress"

export type Vms = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Vms>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Name",
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
    cell: ({ row }: any) => row.original.Name.split(" ")[row.original.Name.split(" ").length - 1],
  },
  {
    accessorKey: "State",
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            CPU Usage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "ProcessorCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Virtual CPUs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
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
  const [rowSelection, setRowSelection] = useState<any>({})
  const [progress, setProgress] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const team = window.localStorage.getItem("@TEAM")
  
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
      },
      onError: (error) => {
          console.error("VM creation failed:", error)
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
      },
      onError: (error) => {
          console.error("VM creation failed:", error)
      }
  })

  const startMultiple = () => {
    Object.keys(rowSelection).forEach(async function(key, index) {
      if (data[key] && rowSelection[key] == true) {
        setProgress(index + 1)
        
        await startVMMutation.mutateAsync({vmname: data[key].Name})

        if (index == Object.keys(rowSelection).length - 1) {
          window.location.reload()
        }
      }
    })
  }

  const stopMultiple = () => {
    Object.keys(rowSelection).forEach(async function(key, index) {
      if (data[key] && rowSelection[key] == true) {
        setProgress(index + 1)

        await stopVMMutation.mutateAsync({vmname: data[key].Name})

        if (index == Object.keys(rowSelection).length - 1) {
          window.location.reload()
        }
      }
    })
  }

  const deleteMultiple = () => {
    Object.keys(rowSelection).forEach(async function(key, index) {
      if (data[key] && rowSelection[key] == true) {
        setProgress(index + 1)

        await deleteMMutation.mutateAsync({vmname: data[key].Name})

        if (index == Object.keys(rowSelection).length - 1) {
          window.location.reload()
        }
      }
    })
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

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
    <div>
      <div className="flex gap-2 mb-5 items-center">
        <Button onClick={startMultiple} disabled={Object.keys(rowSelection).length == 0 || progress > 0}>Start All</Button>
        <Button onClick={stopMultiple} disabled={Object.keys(rowSelection).length == 0 || progress > 0}>Stop All</Button>
        <Button onClick={deleteMultiple} disabled={Object.keys(rowSelection).length == 0 || progress > 0}>Delete All</Button>
        <Progress value={progress * 100 / Object.keys(rowSelection).length} className="w-[200px] ml-5" />
      </div>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>   
    </div>
  )
}