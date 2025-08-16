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

export interface IMovie {
    id: string,
    name: string,
    description: string,
    release_date: string,
    genre: string[],
    duration: string,
    poster_url: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
}