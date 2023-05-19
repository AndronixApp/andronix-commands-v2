"use client"

import {useCollection} from "react-firebase-hooks/firestore";
import {collection, getFirestore} from "@firebase/firestore";
import firebase from "@/lib/firebase";

import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "@firebase/auth";
import React, {useEffect, useState} from "react";
import "firebase/firestore"
import {CgSpinner} from "react-icons/cg";
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {DataTable} from "./data-table";
import {getColumns} from "@/app/app/columns";
import {useToast} from "@/components/ui/use-toast";


export interface ManipulatedCommand {
  id: string
  description: string,
  command: string,
  color: string
}

export default function AppPage() {
  const {toast} = useToast()
  const auth = getAuth(firebase)
  const [user, loadingAuth, errorAuth] = useAuthState(auth)
  const [value, loading, error] = useCollection(
    collection(getFirestore(firebase!), `users/${user?.uid}/commands`), {snapshotListenOptions: {includeMetadataChanges: true}});
  const [commands, setCommands] = useState<ManipulatedCommand[]>([])

  useEffect(() => {
    let temp = value?.docs.map((doc) => {
      console.log(doc.data())
      return {
        id: doc.id,
        description: doc.data().dis,
        command: doc.data().com,
        color: doc.data().color
      }
    })
    setCommands(temp ?? [])
  }, [value]);


  return (
    <div>
      <section className="container items-center justify-center gap-6 pb-8 pt-6 md:py-10">
        <div className={"flex items-center justify-center"}>
          <p>
            {
              error && <Alert variant="destructive">
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {JSON.stringify(error)}
                </AlertDescription>
              </Alert>}
            {loading &&
              <CgSpinner className={"mx-auto w-full animate-spin text-3xl"}/>
            }
          </p>
        </div>
        {value && (
          <DataTable columns={getColumns(user?.uid ?? "", toast)} data={commands} uid={user?.uid ?? ""}/>
        )}

      </section>
    </div>
  )
}
