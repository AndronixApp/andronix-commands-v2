import "@/styles/globals.css"
import {Metadata} from "next"

import {siteConfig} from "@/config/site"
import {fontSans} from "@/lib/fonts"
import {cn} from "@/lib/utils"
import {SiteHeader} from "@/components/site-header"
import {TailwindIndicator} from "@/components/tailwind-indicator"
import {ThemeProvider} from "@/components/theme-provider"
import {Toaster} from "@/components/ui/toaster";
import React from "react";
import Footer from "@/components/footer";
import Head from "next/head";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "white"},
    {media: "(prefers-color-scheme: dark)", color: "black"},
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Andronix Commands</title>

        <meta name="title" content="Andronix Commands"/>
        <meta name="description"
              content="Andronix Commands provides access to your saved terminal commands right from your browser. anytime anywhere."/>

        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta property="og:description"
              content="Andronix Commands provides access to your saved terminal commands right from your browser. anytime anywhere."/>
        <meta property="og:image" content="https://web.andronix.app/og.jpeg"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Andronix Commands"/>
        <meta property="og:url" content="https://web.andronix.app"/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:title" content="Andronix Commands"/>
        <meta property="twitter:description"
              content="Andronix Commands provides access to your saved terminal commands right from your browser. anytime anywhere."/>
        <meta property="twitter:image" content="https://web.andronix.app/og.jpeg"/>
        <meta property="twitter:url" content="https://web.andronix.app"/>

      </Head>
      <head/>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader/>
          <div className="flex-1">{children}</div>
        </div>
        <TailwindIndicator/>
      </ThemeProvider>
      <Toaster/>
      <Footer></Footer>
      </body>

      </html>
    </>
  )
}
