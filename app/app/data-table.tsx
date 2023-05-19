"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import React, {useRef, useState} from "react"
import {Input} from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {FilterIcon} from "lucide-react";
import {convertHexCodesToTailwindColors, getColorNames} from "./columns"
import {RxCross2} from "react-icons/rx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {collection, doc, getFirestore, setDoc} from "@firebase/firestore";
import firebase from "@/lib/firebase";
import toast from "react-hot-toast";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {BsCheck} from "react-icons/bs";
import {CgSpinner} from "react-icons/cg";
import {DialogClose} from "@radix-ui/react-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export const colorFilters = [
  {
    label: "Red",
    value: "#EE0F0F",
  },
  {
    label: "Blue",
    value: "#299AD4"
  },
  {
    label: "Green",
    value: "#2DEE0F"
  },
  {
    label: "Purple",
    value: "#740CEB"
  },
  {
    label: "Orange",
    value: "#FF8B25"
  }, {
    label: "Gray",
    value: "#1E1E1E"
  }
]

export function DataTable<TData, TValue>({columns, data, uid}: DataTableProps<TData, TValue> & { uid: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },

  })

  const [addModalOpen, setAddModalOpen] = useState(false)


  //hide the id column from the table
  React.useEffect(() => {
    table.getColumn("id")?.toggleVisibility(false)
  }, [table])
  return (
    <div>
      <div className="grid grid-cols-1 items-center py-4 gap-4 md:grid-cols-2 md:flex-row">
        <div className={"flex w-full items-center py-4"}>
          <Input
            placeholder="Filter commands..."
            value={(table.getColumn("command")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("command")?.setFilterValue(event.target.value)
            }
            className="mr-4 max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 border p-0">
                <span className="sr-only">Open menu</span>
                <FilterIcon className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter Commands</DropdownMenuLabel>
              {
                colorFilters.map((color, index) => (
                  <div>
                    <DropdownMenuItem
                      key={color.value}
                      onClick={() => {
                        table.getColumn("color")?.setFilterValue(color.value)
                      }}
                    >{
                      color.label
                    }</DropdownMenuItem>
                    {index !== colorFilters.length - 1 &&
                      <DropdownMenuSeparator/>
                    }
                  </div>
                ))
              }

            </DropdownMenuContent>
          </DropdownMenu>
          <>{
            table.getColumn("color")?.getFilterValue() &&
            <div
              onClick={() => {
                table.getColumn("color")?.setFilterValue(undefined)
              }}
              className={`mx-4 flex w-fit cursor-pointer items-center justify-center rounded-md  bg-opacity-40 px-3  py-1 ${convertHexCodesToTailwindColors((table.getColumn("color")?.getFilterValue() as string) ?? "")}`}>
              {getColorNames(table.getColumn("color")?.getFilterValue() as string) ?? ""}
              <RxCross2 className={"ml-3"}/>

            </div>
          }
          </>
        </div>
        <div className={"col-span-1 justify-self-end"}>
          <Dialog open={addModalOpen}>
            <DialogTrigger>
              <Button size={"lg"} onClick={
                () => {
                  setAddModalOpen(true)
                }
              }>Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Command</DialogTitle>
              </DialogHeader>
              <AddCommandDialog setModalVisibility={setAddModalOpen} modalVisibility={addModalOpen} uid={uid}/>
              <DialogClose/>
            </DialogContent>
          </Dialog>
        </div>

      </div>
      <div className="rounded-md my-5 -m-3 border">
        <Table>
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
      </div>

    </div>
  )
}

const AddCommandDialog = ({uid, setModalVisibility, modalVisibility}: {
  uid: string,
  setModalVisibility: any, modalVisibility: any
}) => {
  const [selectedColor, setSelectedColor] = useState("#299AD4")
  const [loading, setLoading] = useState(false)
  const commRef = useRef("")
  const descriptionRef = useRef("")
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    //@ts-ignore
    const newCommand = commRef.current.value
    //@ts-ignore
    const newDescription = descriptionRef.current.value
    const newColor = selectedColor
    const commandRef = doc(collection(getFirestore(firebase!), "users", uid, "commands"))
    console.log(commandRef.path)
    try {
      await setDoc(commandRef, {
        com: newCommand,
        dis: newDescription,
        color: newColor
      })
      toast.success("Command Added.")
    } catch (e) {
      console.log({e})
      toast.error("Something went wrong")
    } finally {
      setModalVisibility(false)
    }

  }
  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex flex-col gap-4 p-4">
        <div className={"flex flex-col space-y-3"}>

          <Label>Command</Label>
          {/*@ts-ignore*/}
          <Input ref={commRef} type="text" placeholder="Command" className="w-full"/>
        </div>

        <div className={"flex flex-col space-y-3"}>
          {/*@ts-ignore*/}
          <Label>Description</Label>
          {/*@ts-ignore*/}
          <Textarea ref={descriptionRef} type="text" placeholder="Description"
                    className="w-full"/>
        </div>
        <div className={"flex space-x-2"}>
          {
            colorFilters.map((color, index) => (
              <div
                onClick={() => {
                  setSelectedColor(color.value)
                }}
                className={`flex w-fit cursor-pointer flex-wrap items-center justify-center rounded-md bg-opacity-40 px-3 py-1 ${convertHexCodesToTailwindColors(color.value)}`}>
                {selectedColor === color.value &&
                  <BsCheck className={"ml-3"}/>
                }
              </div>
            ))
          }
        </div>
        <button type={"submit"}
                className="block rounded-lg bg-orange-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-700 md:text-base">{!loading ? "Add" : ""}
          {loading &&
            <CgSpinner className={"mx-auto w-full animate-spin text-lg"}/>
          }
        </button>
        <button onClick={() => {
          setModalVisibility(false)
        }}
                className="block rounded-lg bg-gray-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 md:text-base">{!loading ? "Close" : ""}
        </button>

      </div>
    </form>
  )
}
