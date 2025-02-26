import { DashboardLayout } from "@/components/DashboardLayout"
import { ProfileView } from "@/components/ProfileView"
import { ProfilePageProps } from "@/types/propsTypes";

export default function Profile({ params }: ProfilePageProps) {

  const { username } = params;

  return (
    <DashboardLayout>
      <ProfileView username={username}/>
    </DashboardLayout>
  )
}