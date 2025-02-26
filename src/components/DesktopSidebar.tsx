import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Search, User } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { MoreOptionsDialogButton } from "./MoreOptionsDialog"

export default async function DesktopSidebar() {

  const session = await getServerSession(authOptions);

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: User, label: "Profile", href: `/profile/${session?.user.username}` },
  ]

  return (
    <div className="fixed h-screen p-2 xl:p-4 flex flex-col ">
      <Link href="/" className="p-2 xl:p-3 hover:bg-gray-900 rounded-full w-fit mb-4">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-white">
          <g>
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </g>
        </svg>
      </Link>

      <ScrollArea className="flex-grow mb-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-center xl:justify-start space-x-4 p-3 hover:bg-gray-900 rounded-full text-xl group"
            >
              <item.icon className="h-6 w-6" />
              <span className="hidden xl:block">{item.label}</span>
              <span className="sr-only ">{item.label}</span>
            </Link>
          ))}
            <MoreOptionsDialogButton isSideNavigator={true}/>
        </nav>
      </ScrollArea>

      <Link
        href={"/post-tweet"}
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white rounded-full text-center py-6 hidden xl:flex items-center justify-center"
      >
        Post
      </Link>

      <Link
        href={"/post-tweet"}
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 xl:hidden"
      >

        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z" />
        </svg>
      </Link>
    </div>
  )
}

