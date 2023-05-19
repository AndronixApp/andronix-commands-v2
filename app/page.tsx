import Link from "next/link"
import {buttonVariants} from "@/components/ui/button"
import {BsFillTerminalFill} from "react-icons/bs";

export default function IndexPage() {
  return (
    <div id="home" className="bg-[url('/bg.png')] bg-center">
      <div className={"flex h-screen items-center justify-center"}>
        <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
          <BsFillTerminalFill className={"mx-auto w-full text-5xl"}/>
          <div className="mx-auto flex max-w-[980px] flex-col items-start gap-2">
            <h1
              className="w-full text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
              Andronix Commands <br className="hidden sm:inline"/>
            </h1>
            <p className="mx-auto text-center text-lg text-muted-foreground sm:text-xl">
              Access your Andronix Commands from anywhere, anytime. <br/>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={"/login"}
              className={buttonVariants({size: "lg"})}
            >
              Get Started
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href={"https://play.andronix.app"}
              className={buttonVariants({variant: "outline", size: "lg"})}
            >
              Download
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href={"https://github.com/AndronixApp/andronix-command-cli"}
              className={buttonVariants({variant: "outline", size: "lg"})}
            >
              CLI
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
