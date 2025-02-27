import Link from "next/link"
import { Home, Search, User } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { MoreOptionsDialogButton } from "./MoreOptionsDialog"

export default async function MobileNavigation() {

  const session = await getServerSession(authOptions)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2">
      <div className="flex justify-around items-center">
        <Link href="/" className="p-2">
          <Home className="h-6 w-6" />
        </Link>
        <Link href="/explore" className="p-2">
          <Search className="h-6 w-6" />
        </Link>
        <Link href={`/profile/${session?.user.username}`} className="p-2">
          <User className="h-6 w-6" />
        </Link>
        {/* <Button variant="ghost" className="p-2 "> */}
          <MoreOptionsDialogButton />
        {/* </Button> */}
      </div>
    </nav>
  )
}

