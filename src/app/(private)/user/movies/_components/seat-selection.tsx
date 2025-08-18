import { IMovie, IShow, ITheatre } from '@/interfaces'
import React, { Dispatch, SetStateAction } from 'react'

interface SeatSelectionProps {
    show: IShow,
    theatre: ITheatre,
    movie: IMovie,
    selectedSeats: number[],
    setSelectedSeats: Dispatch<SetStateAction<number[]>>
}

export default function SeatSelection({ show, theatre, movie, selectedSeats, setSelectedSeats }: SeatSelectionProps) {
    const capacity = theatre.capacity

    const handleSeatClick = (seatNumber: number) => {
        const alreadySelected = selectedSeats.includes(seatNumber)
        if (alreadySelected) {
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber))
        } else {
            setSelectedSeats([...selectedSeats, seatNumber])
        }
    }
    
    return (
        <div className='grid grid-cols-20 gap-5'>
            {Array.from({ length: capacity }, (_, index) => {
                const alreadyBooked = show.booked_seats.includes(index + 1)
                const isSelected = selectedSeats.includes(index + 1)
                return (
                    <div className={`border p-1 rounded cursor-pointer text-center ${
                        alreadyBooked && 
                        "bg-gray-500 text-white cursor-not-allowed pointer-events-none"
                    }
                        ${isSelected && 'bg-primary text-white'}
                    `}
                        key={index}
                        onClick={() => handleSeatClick(index + 1)}
                    >
                        {index + 1}
                    </div>
                )
            })}

        </div>
    )
}
