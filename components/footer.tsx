export default function Footer() {
  return (
    <footer className="rounded-lg bg-white p-4 shadow dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">© {new Date().getFullYear()} <a href="https://andronix.app"
                                                                                          className="hover:underline">Andronix App™</a>. All Rights Reserved.
    </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="https://play.andronix.app" className="mr-4 hover:underline md:mr-6 ">Download</a>
          </li>
          <li>
            <a href="https://docs.andronix.app" className="mr-4 hover:underline md:mr-6">Documentation</a>
          </li>
          <li>
            <a href="https://status.andronix.app" className="mr-4 hover:underline md:mr-6">Status</a>
          </li>
          <li>
            <a href="https://chat.andronix.app" className="hover:underline">Discord</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
