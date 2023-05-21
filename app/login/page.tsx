"use client";

import {Input} from "@/components/ui/input";
import {getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "@firebase/auth";
import firebase from "@/lib/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useEffect, useRef, useState} from "react";
import {CgSpinner} from "react-icons/cg";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";

interface RequestData {
  "debian_xfce": boolean,
  "ubuntu_xfce": boolean,
  "man_xfce": boolean,
  "ubuntu_kde": boolean,
  "premium": boolean,
  "uid": string
}

const auth = getAuth(firebase);

function isAllowed(email: string) {
  const axios = require('axios');
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(`https://us-central1-andronix-techriz.cloudfunctions.net/productLister?email=${email}`)
      let purchaseObj = response as RequestData
      console.log({purchaseObj})
      if (!purchaseObj.premium) {
        reject("User doesn't have a Premium account.")
      } else {
        resolve("User has access to commands.")
      }
    } catch (e) {
      reject({})
    }
  })
}

export default function LoginPage() {

  const emailRef = useRef("")
  const passwordRef = useRef("")
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    setLocalLoading(true)
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
  }

  const [user, loading, error] = useAuthState(auth);
  const [localLoading, setLocalLoading] = useState(false)
  const [premiumUser, setPremiumUser] = useState(false)
  const router = useRouter()
  const {toast} = useToast()


  useEffect(() => {
    if (user) {
      toast({title: "Login Successful!", description: `Welcome back ${user?.displayName}`})
    } else
      console.log("User logged out")
  }, [user]);

  // check for premium
  if (localLoading) {
    router.push("/app")
  } else {
    toast({
      title: "Error",
      variant: "destructive",
      description: "You don't have a premium account. Please purchase one to continue using the app."
    })
  }


  useEffect(() => {
    if (error) {
      toast({description: `Oops! Something went wrong ${error}`, variant: "destructive"})
    }
  }, [error]);


  const handleSubmit = async (e: any) => {
    setLocalLoading(true)
    // @ts-ignore
    const email = emailRef.current.value
    // @ts-ignore
    const password = passwordRef.current.value
    e.preventDefault()
    //checking email with regex and password length to be greater than 6
    if (email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
      if (password.length >= 6) {
        console.log("Logging in")
        console.log(email, password)
        try {
          await login(email, password)
        } catch (e) {
          toast({description: `Oops! Something went wrong ${e}`, variant: "destructive"})
        }
      } else {
        toast({description: "Password must be greater than 6 characters", variant: "destructive"})
      }
    } else {
      toast({description: "Please enter a valid email", variant: "destructive"})
    }
  }
  return (
    <div className="h-min-full bg-white py-6 dark:bg-background sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mx-auto mb-12 flex max-w-[980px] flex-col items-start gap-2">
          <h1
            className="w-full text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            User Login <br className="hidden sm:inline"/>
          </h1>
          <p className="mx-auto text-center text-lg text-muted-foreground sm:text-xl">
            To get started, please log into your Andronix Account. <br/>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-lg">
          <div className="flex flex-col gap-4 p-4 md:p-8">
            <div>
              {/*@ts-ignore*/}
              <Input ref={emailRef} type="email" placeholder="Email" className="w-full"/>
            </div>

            <div>
              {/*@ts-ignore*/}
              <Input ref={passwordRef} type="password" placeholder="Password" className="w-full"/>
            </div>
            <button type={"submit"}
                    className="block rounded-lg bg-orange-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">{!loading ? "Login" : ""}
              {loading &&
                <CgSpinner className={"text-lg w-full mx-auto animate-spin"}/>
              }
            </button>

            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-gray-300 dark:text-gray-600"></span>
              <span className="relative bg-white px-4 text-sm text-gray-400 dark:bg-background dark:text-gray-600">Log in with social</span>
            </div>

            <button type={"button"} onClick={loginWithGoogle}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-center text-sm font-semibold text-gray-800 outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base">
              {!loading &&
                <svg className="h-5 w-5 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23.7449 12.27C23.7449 11.48 23.6749 10.73 23.5549 10H12.2549V14.51H18.7249C18.4349 15.99 17.5849 17.24 16.3249 18.09V21.09H20.1849C22.4449 19 23.7449 15.92 23.7449 12.27Z"
                    fill="#4285F4"/>
                  <path
                    d="M12.2549 24C15.4949 24 18.2049 22.92 20.1849 21.09L16.3249 18.09C15.2449 18.81 13.8749 19.25 12.2549 19.25C9.12492 19.25 6.47492 17.14 5.52492 14.29H1.54492V17.38C3.51492 21.3 7.56492 24 12.2549 24Z"
                    fill="#34A853"/>
                  <path
                    d="M5.52488 14.29C5.27488 13.57 5.14488 12.8 5.14488 12C5.14488 11.2 5.28488 10.43 5.52488 9.71V6.62H1.54488C0.724882 8.24 0.254883 10.06 0.254883 12C0.254883 13.94 0.724882 15.76 1.54488 17.38L5.52488 14.29Z"
                    fill="#FBBC05"/>
                  <path
                    d="M12.2549 4.75C14.0249 4.75 15.6049 5.36 16.8549 6.55L20.2749 3.13C18.2049 1.19 15.4949 0 12.2549 0C7.56492 0 3.51492 2.7 1.54492 6.62L5.52492 9.71C6.47492 6.86 9.12492 4.75 12.2549 4.75Z"
                    fill="#EA4335"/>
                </svg>
              }
              {loading &&
                <CgSpinner className={"text-lg animate-spin"}/>
              }
              Continue with Google
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
