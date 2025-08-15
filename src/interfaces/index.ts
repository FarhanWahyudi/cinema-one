export interface IUser {
    id: string,
    email: string,
    password: string,
    name: string,
    role: "user" | "admin",
    created_at: string,
    updated_at: string,
    is_active: boolean,
}