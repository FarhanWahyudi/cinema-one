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

export interface ITheatre {
    id: string,
    name: string,
    address: string,
    capacity: number,
    is_active: boolean,
    created_at: string,
    updated_at: string,
}

export interface IShow {
    id: string,
    movie_id: string,
    theatre_id: string,
    date: string,
    time: string,
    ticket_price: number,
    booked_seats: number[],
    available_seats_count: number,
    is_active: boolean,
    created_at: string,
    updated_at: string,

    movie: IMovie,
    theatre: ITheatre
}