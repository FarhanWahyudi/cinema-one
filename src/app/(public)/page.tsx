'use client'

import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"
import LoginForm from "./_components/login-form"
import RegisterForm from "./_components/register-form"
import { MapPin } from "lucide-react"

export default function Homepage() {
    const [openSheet, setOpenSheet] = useState(false);
    const [form, setForm] = useState<'login' | 'register'>('login')
        return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-100">
            <div className="px-20 py-5 flex justify-between items-center">
                <div className="flex items-center gap-5">
                    <img
                        src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cinema_XXI.svg/2560px-Cinema_XXI.svg.png"}
                        alt="logo"
                        className="w-24"
                    />
                    <div className="flex items-center bg-slate-200 rounded-full px-5 py-1 gap-1">
                        <MapPin className="w-3.5" />
                        <h2 className="text-sm font-bold">MALANG</h2>
                    </div>
                </div>
                <div className="flex gap-10">
                    <button onClick={() => {setOpenSheet(true); setForm('login')}} className="font-bold text-cyan-600">Login</button>
                    <Button onClick={() => {setOpenSheet(true); setForm('register')}} className="rounded-full bg-cyan-600">Buat Akun</Button>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 min-h-[85vh] items-center px-20">
                <div className="col-span-1">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">
                            Pesan Tiket Film Anda Segera
                        </h1>
                        <p className="text-base font-semibold text-gray-500">
                            Cinema XXI adalah platform terpadu untuk memesan tiket film di berbagai bioskop XXI. Telusuri film-film terbaru, pilih kursi yang Anda inginkan, dan nikmati pengalaman pemesanan yang mudah dan praktis. Baik film blockbuster akhir pekan maupun film di hari kerja, Cinema XXI siap membantu Anda.
                        </p>
                        <Button onClick={() => {setForm('login'); setOpenSheet(true)}} className="rounded-full px-10 bg-cyan-600 w-max">Ayo Mulai!</Button>
                    </div>
                </div>
                <div className="col-span-1">
                    <DotLottieReact
                        src="https://lottie.host/f621ebfe-ebbc-48cd-99bd-a242ef8aff5e/FM3U2qd4vq.lottie"    
                        loop
                        autoplay
                    />
   
                </div>
            </div>
            <Sheet
                open={openSheet}
                onOpenChange={(open) => setOpenSheet(open)}
            >
                <SheetContent className="min-w-[500px] bg-black/5 backdrop-blur-2xl">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                        <div className="flex flex-col items-center justify-center h-screen">
                            {form === 'login' ? <LoginForm setForm={setForm} /> : <RegisterForm setForm={setForm} />}
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

// KwhbsV5FLJsrNLKu