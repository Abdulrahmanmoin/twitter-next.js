import { DashboardLayout } from "@/components/DashboardLayout"
import HomePageTweets from "@/components/HomePageTweets"

export default function Home() {
  return (
    <DashboardLayout>
      <HomePageTweets />
    </DashboardLayout>
  )
}