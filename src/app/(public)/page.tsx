"use client"

import { getLoggedInUser } from "@/actions/users";
import toast from "react-hot-toast";
import { IUserStore, useUsersStore } from "@/store/users-store";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import LoginForm from "./_components/login-form"
import RegisterForm from "./_components/register-form"
import { CircleUserRound, MapPin, Menu, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { IMovie, ITheatre } from "@/interfaces"
import NoDataMessage from "@/components/functional/no-data-message"
import { getActiveMovies } from "@/actions/movies"
import { formatDuration } from "@/helpers/date-time-formats"
import SearchMovies from "../(private)/user/movies/_components/search-movies"
import { Input } from "@/components/ui/input"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MovieTitle from "../(private)/user/movies/_components/movie-title"
import Spinner from "@/components/functional/spinner"
import { getAllTheatres } from "@/actions/theatres"
import Link from "next/link";

interface MovieTitleProps {
    searchParams: Promise<{ search?: string}>
}

export default function Homepage({ searchParams }: MovieTitleProps) {
    const [openSheet, setOpenSheet] = useState(false);
    const [form, setForm] = useState<'login' | 'register'>('login')
    const [movies, setMovies] = useState<IMovie[]>([])
    const [theatres, setTheatres] = useState<ITheatre[]>([])
    const [ searchTerm, setSearchTerm ] = useState<string>('')
    const [scrolled, setScrolled] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { user } = useUsersStore() as IUserStore;
    const { setUser } = useUsersStore() as IUserStore;

    const fetchData = async () => {
        try {
            const response = await getLoggedInUser();
            if (!response.success) {
                throw new Error(response.message)
            }
            setUser(response.data);
        } catch (error) {
            Cookies.remove('jwt_token');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push(`/user/movies?search=${searchTerm}`)
    }

    const fetchMovie = async () => {
        try {
            setLoading(true)
            const searchParamsObj = await searchParams
    
            const [movieResponse, theatresResponse]: any[] = await Promise.all([
                getActiveMovies({search: searchParamsObj.search || ''}),
                getAllTheatres()
            ])

            if (!movieResponse.success || !theatresResponse.success) {
                throw new Error(movieResponse.message || theatresResponse.message)
            }

            setMovies(movieResponse.data)
            setTheatres(theatresResponse.data)
        } catch (error: any) {
    
            return <h1>failed to load movie</h1>
        } finally {
            setLoading(false)
        }

    }
    
    useEffect(() => {
        fetchMovie()
        const handleScroll = () => {
        setScrolled(window.scrollY > 0) // true kalau scroll > 0
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])


    return (
        <div className="overflow-x-hidden bg-gradient-to-r from-cyan-50 to-white">
            <div className={`px-20 py-5 flex justify-between items-center fixed top-0 w-full z-100 transition-all duration-300
                ${scrolled ? 'bg-cyan-600' : 'bg-transparent'}
            `}>
                    <div className="flex items-center gap-5">
                        <Link href={'/'}>
                            <img
                                src={"https://cinepolis.co.id/images/cinepolis-logo.png"}
                                alt="logo"
                                className="w-24"
                            />
                        </Link>
                        <div className="flex items-center text-white px-2 py-1 gap-1">
                            <MapPin className="w-3.5" />
                            <h2 className="text-sm font-semibold">MALANG</h2>
                        </div>
                    </div>
                    <div className="text-white space-x-10 font-semibold">
                        <Link href="/user/movies">Movies</Link>
                        <Link href="/user/booking">Booking</Link>
                        <Link href="/user/profile">Profile</Link>
                    </div>
                <div className="flex gap-10">
                    {user ?
                        (
                            <div className="flex gap-5 items-center text-white">
                                <div className="flex items-center gap-1">
                                    <h1 className=" font-bold uppercase">
                                        {user?.name}
                                    </h1>
                                    <CircleUserRound />
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => {setOpenSheet(true); setForm('login')}}
                                    className={`font-bold text-white`}
                                >
                                    Login
                                </button>
                                <Button
                                    onClick={() => {setOpenSheet(true); setForm('register')}}
                                    className='rounded-full bg-white text-cyan-600 font-semibold'>
                                    Buat Akun
                                </Button>
                            </>
                        )
                    }
                </div>
            </div>

            <Carousel className="w-screen">
                <CarouselContent>
                    {/* {loading && <Spinner />} */}
                    {movies.map((movie) => (
                    <CarouselItem key={movie.id}>
                        <Card className="p-0 rounded-none">
                            <CardContent className="p-0">
                                <div className="w-full h-[500px] bg-black flex justify-between items-center">
                                    <div className="text-white uppercase flex flex-col gap-2 ml-26">
                                        <h2 className="text-3xl font-bold">{movie.name}</h2>
                                        <span>{movie.genre} - {formatDuration(Number(movie.duration))}</span>
                                        <Link href={`/user/movies/${movie.id}`}>
                                            <Button className="w-max rounded-lg">Pesan Sekarang</Button>
                                        </Link>
                                    </div>
                                    <div className="flex-none w-[50%] min-h-full bg-cover flex items-end py-16 px-32 bg-center rounded-l-full"
                                        style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.2)), url(${movie.poster_url})`}}
                                    >
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-5 top-1/2 -translate-y-1/2"  />
                <CarouselNext className="right-5 top-1/2 -translate-y-1/2" />
            </Carousel>

            <form onSubmit={handleSearch} className='flex justify-center -mt-8' >
                <div className="shadow-lg rounded-xl flex items-center w-[50vw] h-16 bg-white p-2 z-50">
                    <Input
                        className='rounded-full border-none shadow-none'
                        placeholder='Mau nonton apa, nih?'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type='text'
                    />

                    <button type='submit' className='h-full bg-cyan-600 rounded-xl w-12 text-white flex justify-center items-center'>
                        <Search />
                    </button>
                </div>
            </form>

            <div className="mt-40 px-40">
                <h2 className="text-6xl text-cyan-600 font-bold text-center">Pilih Film Mu</h2>
                <div className="grid grid-cols-4 gap-10 mt-16">
                    {movies.map((movie) => (
                        <MovieTitle key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>

            <div className="py-40 px-40">
                <div className="flex justify-between items-center">
                    <h2 className="text-6xl font-bold text-cyan-600">Join Our Membership</h2>
                    <Button size={"lg"}>Join Now</Button>
                </div>
                <div className="flex justify-between items-center mt-10">
                    <div className="space-y-5">
                        <h3 className="text-4xl font-bold text-cyan-600">Earn Points</h3>
                        <p className="text-2xl">Dapatkan poin lebih banyak dengan<br/>melakukan transaksi di Cinépolis</p>
                        <img src="https://cinepolis.co.id/images/temp/cards_offer01.png" alt="membership" />
                    </div>
                    <div>
                        <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3J3NXRjenc3YWo3M2x0enBuZW5lbnk0bjh2ajl4bjBidTMxN3dseiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2GJ9hPIaKl0J4L6RZH/giphy.gif" alt="" className="w-52 rounded-full shadow-xl shadow-red-300 animate-pulse" />
                    </div>
                </div>
            </div>

            <Carousel className="w-screen">
                <CarouselContent>
                    {/* {loading && <Spinner />} */}
                    {theatres.map((theatre) => (
                    <CarouselItem key={theatre.id}>
                        <Card className="p-0 rounded-none">
                            <CardContent className="p-0">
                                <div className="w-full h-[500px] flex items-center py-16 px-32 bg-cover bg-center"
                                    style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.2)), url(${theatre.theatre_img})`}}
                                >
                                    <div className="text-white uppercase flex flex-col gap-2">
                                        <h2 className="text-3xl font-bold">{theatre.name}</h2>
                                        <span>Kapasitas Kursi: {theatre.capacity}</span>
                                        <Button className="w-max rounded-lg bg-cyan-800">Lihat Detail</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-5 top-1/2 -translate-y-1/2 text-white border-white"  />
                <CarouselNext className="right-5 top-1/2 -translate-y-1/2 text-white border-white" />
            </Carousel>
            
            <Sheet
                open={openSheet}
                onOpenChange={(open) => setOpenSheet(open)}
            >
                <SheetContent className="min-w-[500px] z-100">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                        <div className="flex flex-col items-center justify-center h-screen">
                            {form === 'login' ? <LoginForm setForm={setForm} /> : <RegisterForm setForm={setForm} />}
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
        // <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-100">
        //     <div className="px-20 py-5 flex justify-between items-center">
        //         <div className="flex items-center gap-5">
        //             <img
        //                 src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cinema_XXI.svg/2560px-Cinema_XXI.svg.png"}
        //                 alt="logo"
        //                 className="w-24"
        //             />
        //             <div className="flex items-center bg-slate-200 rounded-full px-5 py-1 gap-1">
        //                 <MapPin className="w-3.5" />
        //                 <h2 className="text-sm font-bold">MALANG</h2>
        //             </div>
        //         </div>
        //         <div className="flex gap-10">
        //             <button onClick={() => {setOpenSheet(true); setForm('login')}} className="font-bold text-cyan-600">Login</button>
        //             <Button onClick={() => {setOpenSheet(true); setForm('register')}} className="rounded-full bg-cyan-600">Buat Akun</Button>
        //         </div>
        //     </div>
        //     <div className="grid lg:grid-cols-2 gap-10 min-h-[85vh] items-center px-20">
        //         <div className="col-span-1">
        //             <div className="flex flex-col gap-4">
        //                 <h1 className="text-2xl font-bold">
        //                     Pesan Tiket Film Anda Segera
        //                 </h1>
        //                 <p className="text-base font-semibold text-gray-500">
        //                     Cinema XXI adalah platform terpadu untuk memesan tiket film di berbagai bioskop XXI. Telusuri film-film terbaru, pilih kursi yang Anda inginkan, dan nikmati pengalaman pemesanan yang mudah dan praktis. Baik film blockbuster akhir pekan maupun film di hari kerja, Cinema XXI siap membantu Anda.
        //                 </p>
        //                 <Button onClick={() => {setForm('login'); setOpenSheet(true)}} className="rounded-full px-10 bg-cyan-600 w-max">Ayo Mulai!</Button>
        //             </div>
        //         </div>
        //         <div className="col-span-1">
        //             <DotLottieReact
        //                 src="https://lottie.host/f621ebfe-ebbc-48cd-99bd-a242ef8aff5e/FM3U2qd4vq.lottie"    
        //                 loop
        //                 autoplay
        //             />
   
        //         </div>
        //     </div>
        //     <Sheet
        //         open={openSheet}
        //         onOpenChange={(open) => setOpenSheet(open)}
        //     >
        //         <SheetContent className="min-w-[500px] bg-black/5 backdrop-blur-2xl">
        //             <SheetHeader>
        //                 <SheetTitle></SheetTitle>
        //                 <div className="flex flex-col items-center justify-center h-screen">
        //                     {form === 'login' ? <LoginForm setForm={setForm} /> : <RegisterForm setForm={setForm} />}
        //                 </div>
        //             </SheetHeader>
        //         </SheetContent>
        //     </Sheet>
        // </div>
    )
}

// KwhbsV5FLJsrNLKu