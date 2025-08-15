import { IUser } from "@/interfaces";

export default function UserInfo({ user }: { user: IUser}) {
    return (
        <div className="flex flex-col gap-5">
            <h1>user id: {user.id}</h1>
            <h1>user name: {user.name}</h1>
            <h1>user email: {user.email}</h1>
            <h1>user role: {user.role}</h1>
        </div>
    )
}