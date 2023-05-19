"use client"

import Link from "next/link"

import {siteConfig} from "@/config/site"
import {buttonVariants} from "@/components/ui/button"
import {Icons} from "@/components/icons"
import {MainNav} from "@/components/main-nav"
import {ThemeToggle} from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useAuthState, useSignOut} from "react-firebase-hooks/auth";
import {getAuth} from "@firebase/auth";
import firebase from "@/lib/firebase";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {CgSpinner} from "react-icons/cg";
import {useEffect} from "react";

const auth = getAuth(firebase);

export function SiteHeader() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [signOut, loading, error] = useSignOut(auth);
  useEffect(() => {
    console.log({auth: user?.photoURL})
  }, [auth]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav}/>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5"/>
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.play_store}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.playStore className="h-6 w-6 fill-current"/>
                <span className="sr-only">Google Play Store</span>
              </div>
            </Link>
            <ThemeToggle/>
            {user &&
              <div className={"flex items-center justify-center"}>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <img referrerPolicy="no-referrer"
                         src={user?.photoURL ?? `https://api.dicebear.com/6.x/thumbs/png?seed=${user?.email}`}
                         className={"my-4 ml-4 h-8 w-8 rounded-full"} alt=""/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className={"text-red-500"} onClick={async () => {
                      const success = await signOut();
                      if (success) {
                        toast.success("Signed out successfully");
                        router.push("/");
                      } else {
                        toast.error("Error signing out");
                      }
                    }
                    }>{!loading ? "Logout" : ""}
                      {loading &&
                        <CgSpinner className={"mx-auto w-full animate-spin text-lg"}/>
                      }</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          </nav>
        </div>
      </div>
    </header>
  )
}
