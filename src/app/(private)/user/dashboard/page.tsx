import { getLoggedInUser } from "@/actions/users"
import UserInfo from "@/components/functional/user-info";

export default async function UserDashboardPage() {
    const UserDataResponse = await getLoggedInUser();
    if (!UserDataResponse.success) {
        return <h1>something went wrong</h1>
    }

    const user = UserDataResponse.data
    return (
        <div>
            user dashboard
            <UserInfo user={user} />
        </div>
    )
}