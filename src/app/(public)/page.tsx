'use client'

import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function Homepage() {
  return (
    <div className="flex flex-col">
        <div className="px-20 py-5 flex justify-between items-center bg-primary">
            <h1 className="text-xl text-white font-bold">
                Cinego
            </h1>
            <Button variant={'outline'}>Login</Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 min-h-[85vh] items-center px-20">
            <div className="col-span-1">
                <div className="flex flex-col gap-4">
                    <h1 className="text-lg font-bold">
                        Book Your Movie Tickets Instantly
                    </h1>
                    <p className="text-sm font-semibold text-gray-500">
                        CineGo is your one-stop platform for booking movie tickets across multiple theaters. Browse the latest movies, select your preferred seats, and enjoy a smooth, hassle-free booking experience. Whether it's a weekend blockbuster or a weekday show, CineGo has you covered.
                    </p>
                    <Button className="w-max">Get Started</Button>
                </div>
            </div>
            <div className="col-span-1">
                <DotLottieReact
                    src="https://lottie.host/5770f69e-4c8c-4605-abe5-c4e3608e9c9f/kSRTmm3nsL.lottie"    
                    loop
                    autoplay
                />
            </div>
        </div>
    </div>
  )
}