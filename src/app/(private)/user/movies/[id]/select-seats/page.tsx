'use client'

import { getMovieById } from '@/actions/movies'
import { getShowById, updateShow } from '@/actions/shows'
import { getTheatreById } from '@/actions/theatres'
import Spinner from '@/components/functional/spinner'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import { formatDate, formatTime } from '@/helpers/date-time-formats'
import { IBooking, IMovie, IShow, ITheatre } from '@/interfaces'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { promise } from 'zod'
import SeatSelection from '../../_components/seat-selection'
import { getStripeClientSecret } from '@/actions/payments'
import toast from 'react-hot-toast'
import { handleClientScriptLoad } from 'next/script'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../../_components/checkout-form'
import { IUserStore, useUsersStore } from '@/store/users-store'
import { createBooking } from '@/actions/bookings'
import NoDataMessage from '@/components/functional/no-data-message'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function SelectSeats() {
    const [loading, setLoading] = useState(false)
    const [movie, setMovie] = useState<IMovie | null>(null)
    const [theatre, setTheatre] = useState<ITheatre | null>(null)
    const [show, setShow] = useState<IShow | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [selectedSeats, setSelectedSeats] = useState<number[]>([])
    const paramas = useParams()
    const searchParams = useSearchParams()
    const [fetchingClientSecret, setFetchingClientSecret] = useState(false)
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [openCheckout, setOpenCheckout] = useState(false)
    const { user } = useUsersStore() as IUserStore
    const router = useRouter()

    const fetchData = async () => {
        try {
            setLoading(true)
            const [movieResponse, theatreResponse, showResponse]: any[] = await Promise.all([
                getMovieById(paramas.id as string),
                getTheatreById(searchParams.get('theatreId') as string),
                getShowById(searchParams.get('showId') as string)
            ])
            if (!movieResponse.success || !theatreResponse.success || !showResponse.success) {
                throw new Error(
                    movieResponse.message || theatreResponse.message || showResponse.message || 'Failed to fetch data'
                )
            }
            setMovie(movieResponse.data)
            setTheatre(theatreResponse.data)
            setShow(showResponse.data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const getClientSecret = async () => {
        try {
            setFetchingClientSecret(true)
            const response = await getStripeClientSecret(
                selectedSeats.length * (show?.ticket_price || 0)
            )
            if (!response.success) {
                throw new Error(response.message || "Failed to get payment client server")
            }
            console.log(response.data)
            setClientSecret(response.data)
            setOpenCheckout(true)
        } catch (error: any) {
            toast.error(error.message || "Failed to get payment client server")
        } finally {
            setFetchingClientSecret(false)
        }
    }

    const onPaymentSuccess = async (paymentId: string) => {
        try {
            const payload: Partial<IBooking> = {
                user_id: user?.id,
                show_id: show?.id,
                theatre_id: theatre?.id,
                movie_id: movie?.id,
                seat_numbers: selectedSeats,
                total_tickets: selectedSeats.length,
                total_amount: selectedSeats.length * (show?.ticket_price || 0),
                payment_id: paymentId,
                status: "booked",
            }

            const response = await createBooking(payload)
            if (!response.success) {
                throw new Error(response.message) || 'Failded to create booking'
            }

            const existingBookedSeats = show?.booked_seats || []
            const updatedBookedSeats = [...existingBookedSeats, ...selectedSeats]
            const showUpdateResponse = await updateShow(show!.id, {
                ...show,
                booked_seats: updatedBookedSeats,
                available_seats_count: theatre!.capacity - updatedBookedSeats.length || 0
            })

            if (!showUpdateResponse.success) {
                throw new Error(showUpdateResponse.message || 'Failed to update show')
            }
            toast.success("Your booking is successfully")
            router.push('/user/booking')
        } catch (error: any) {
            toast.error(error.message || 'Failed to create booking')
        }
    }

    const options: any = {
        clientSecret: clientSecret,
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <h1>{error}</h1>
    }

    if (movie && theatre && show) {
        return (
            <div className='flex flex-col gap-5'>
            <img src={movie?.poster_url} alt="" className='fixed top-0 left-0 w-full opacity-20 h-[70vh] object-cover [mask-image:linear-gradient(to_bottom,black,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%] pointer-events-none'/>
                <div className='flex justify-between items-center'>
                    <PageTitle title='Select Seats' />
                    <div className='flex items-center gap-5'>
                        <Button className='bg-cyan-600' disabled={selectedSeats.length === 0 || fetchingClientSecret} onClick={getClientSecret}>Pesan Sekarang</Button>
                    </div>
                </div>
                <div className='p-5 flex justify-between border-none bg-gradient-to-r from-white to-cyan-50 rounded-lg shadow-none z-10'>
                    <div>
                        <h1 className='text-lg font-bold'>{movie.name}</h1>
                        <p className='text-sm to-gray-600 uppercase'>
                            {theatre.name} - {theatre.address} - {formatDate(show.date)} - {formatTime(show.time)}
                        </p>
                    </div>
                    {selectedSeats.length > 0 && (
                        <div className='text-sm'>
                            <p className='text-sm font-semibold'>
                                Kursi: {selectedSeats.map((seat) => seat).join(', ')}
                            </p>
                            <p className='text-sm font-semibold'>
                                Total Harga:{' '}
                                <span>
                                    Rp {(selectedSeats.length * show.ticket_price).toFixed(3)}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
                <SeatSelection
                    show={show}
                    theatre={theatre}
                    movie={movie}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                />
                {openCheckout && clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm
                            openCheckout={openCheckout}
                            setOpenCheckout={setOpenCheckout}
                            onPaymentSuccess={onPaymentSuccess}
                        />
                    </Elements>
                )}
            </div>
        )
    }

    return (
       <NoDataMessage />

    )
}
