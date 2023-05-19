"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ManipulatedCommand} from "@/app/app/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import React, {useRef, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {CgSpinner} from "react-icons/cg";
import {Label} from "@/components/ui/label";
import {colorFilters} from "@/app/app/data-table";
import {BsCheck} from "react-icons/bs";
import {Textarea} from "@/components/ui/textarea";
import {deleteDoc, doc, getFirestore, updateDoc} from "@firebase/firestore";
import firebase from "@/lib/firebase";
import toast from "react-hot-toast";

export const getColumns = (uid: string): ColumnDef<ManipulatedCommand>[] => [
  {
    accessorKey: "command",
    cell: ({row}) => {
      return (
        <p className={"font-semibold"}>{row.getValue('command')}</p>
      )
    },
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Command
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({row}) => {
      return (
        <p className={"text-gray-600 dark:text-gray-400"}>{row.getValue('description')}</p>
      )
    }
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({row}) => {
      return (
        <div
          className={`w-fit rounded-md bg-opacity-60 px-3 py-1 dark:bg-opacity-40 ${convertHexCodesToTailwindColors(row.getValue('color'))}`}>
          {getColorNames(row.getValue("color"))}
        </div>
      )
    }
  },
  {
    id: "id",
    accessorKey: "id",
    cell: ({row}) => {
      return (
        <p></p>
      )
    }
  },
  {
    id: "actions",
    cell: ({row}) => {
      const command: string = row.getValue('command') ?? ''
      return (<div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(row.getValue('id'))
                    .then(() => toast.success("Copied Command ID"))
                  }
                >
                  Copy Command ID
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem onClick={() => {
                  const commandRef = doc(getFirestore(firebase!), "users", uid, "commands", row.getValue('id'))
                  //delete the doc
                  try {
                    deleteDoc(commandRef)
                    toast.success("Command deleted.")
                  } catch (e) {
                    console.log({e})
                    toast.error("Something went wrong")
                  }
                }
                } className={"text-red-500"}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Command</DialogTitle>
              </DialogHeader>
              <EditDialog uid={uid} command={{
                command: row.getValue('command'),
                description: row.getValue('description'),
                color: row.getValue('color'),
                id: row.getValue('id')
              }}/>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
]

const EditDialog = ({command, uid}: { command: ManipulatedCommand, uid: string }) => {

  console.log({command})
  const [selectedColor, setSelectedColor] = useState(command.color)
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
    const commandRef = doc(getFirestore(firebase!), "users", uid, "commands", command.id)
    console.log(commandRef.path)
    try {
      await updateDoc(commandRef, {
        com: newCommand,
        dis: newDescription,
        color: newColor
      })
      toast.success("Command updated.")
    } catch (e) {
      console.log({e})
      toast.error("Something went wrong")
    }
  }
  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex flex-col gap-4 p-4">
        <div className={"flex flex-col space-y-3"}>

          <Label>Command</Label>
          {/*@ts-ignore*/}
          <Input ref={commRef} type="text" defaultValue={command.command} placeholder="Command" className="w-full"/>
        </div>

        <div className={"flex flex-col space-y-3"}>
          {/*@ts-ignore*/}
          <Label>Description</Label>
          {/*@ts-ignore*/}
          <Textarea ref={descriptionRef} type="text" defaultValue={command.description} placeholder="Description"
                    className="w-full"/>
        </div>
        <div className={"flex space-x-2"}>
          {
            colorFilters.map((color, index) => (
              <div
                onClick={() => {
                  setSelectedColor(color.value)
                }}
                className={`flex flex-wrap w-fit cursor-pointer items-center justify-center rounded-md bg-opacity-40 px-3 py-1 ${convertHexCodesToTailwindColors(color.value)}`}>
                {selectedColor === color.value &&
                  <BsCheck className={"ml-3"}/>
                }
              </div>
            ))
          }
        </div>
        <button type={"submit"}
                className="block rounded-lg bg-orange-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">{!loading ? "Update" : ""}
          {loading &&
            <CgSpinner className={"mx-auto w-full animate-spin text-lg"}/>
          }
        </button>
      </div>
    </form>
  )
}


export const getColorNames = (hex: string) => {
  switch (hex) {
    case'#740CEB':
      return 'Purple'
    case'#FF8B25':
      return 'Orange'
    case'#EE0F0F':
      return 'Red'
    case'#1E1E1E':
      return 'Black'
    case'#2DEE0F':
      return 'Green'
    case'#299AD4':
      return 'Blue'
  }
}
export const convertHexCodesToTailwindColors = (hex: string) => {
  switch (hex) {
    case'#740CEB':
      return 'dark:bg-purple-800 dark:text-purple-400 bg-purple-300 text-purple-800'
    case'#FF8B25':
      return 'dark:bg-orange-800 dark:text-orange-400 bg-orange-300 text-orange-800'
    case'#EE0F0F':
      return 'dark:bg-red-800 dark:text-red-400 bg-red-300 text-red-800'
    case'#1E1E1E':
      return 'dark:bg-gray-600 dark:text-gray-400 bg-gray-300 text-gray-800'
    case'#2DEE0F':
      return 'dark:bg-green-800 dark:text-green-400 bg-green-300 text-green-800'
    case'#299AD4':
      return 'dark:bg-blue-800 dark:text-blue-400 bg-blue-300 text-blue-800'

  }
}
