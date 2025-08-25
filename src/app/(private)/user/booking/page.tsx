"use client"

import { cancelBooking, getUserBookings } from '@/actions/bookings';
import PageTitle from '@/components/ui/page-title'
import { IBooking } from '@/interfaces';
import { IUserStore, useUsersStore } from '@/store/users-store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Spinner from '@/components/functional/spinner';
import { formatDate, formatTime } from '@/helpers/date-time-formats';
import dayjs from 'dayjs';
import NoDataMessage from '@/components/functional/no-data-message';
import { Button } from '@/components/ui/button';
import PrivateLayout from '@/layout-provider/private-layout';
import ProfileLayout from '@/layout-provider/profile-layout';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserBookingsPage() {
  const [bookings, setBookins] = useState<IBooking[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useUsersStore() as IUserStore
  const [showCancelModel, setShowCancelModel] = useState<boolean>(false)
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null)
  const [cancelling, setCancelling] = useState<boolean>(false)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response: any = await getUserBookings(user!.id);
      if (!response.success) {
        throw new Error(response.message)
      }
      setBookins(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    try {
      setCancelling(true)
      const response = await cancelBooking(
        selectedBooking!.id,
        selectedBooking?.show?.id!,
        selectedBooking!.seat_number,
        selectedBooking?.payment_id!
      )
      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success('booking cancelled successfully')
      fetchBookings()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setCancelling(false)
      setShowCancelModel(false)
      setSelectedBooking(null)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const columns = [
      'Film dan Teater',
      'Penayangan',
      'Kursi',
      'Jumlah',
      'Status',
      'Actions'
  ]

  return (
    <ProfileLayout>
      <div className='shadow border border-gray-100 bg-white rounded-xl p-5 min-h-[500px]'>
          <h1 className='text-gray-600 font-bold text-2xl'>Pesanan Saya</h1>
          <hr className='border-gray-300 my-5' />

          {loading && <Spinner />}
          
          {!loading && bookings.length === 0 && (
            <NoDataMessage />
          )}

          {!loading && bookings.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="text-left">{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    
                    <TableCell className='flex items-center gap-2 w-max'>
                      <img src={booking.movie?.poster_url} alt={booking.movie?.name} className='w-20'/>
                      <div className='flex flex-col suppercase'>
                        <span className='font-semibold'>{booking.movie?.name}</span>
                        <span className='text-gray-600'>{booking.theatre?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col text-gray-600'>
                        <span className='flex items-center gap-1'>
                          <Calendar size={15}/>
                          {formatDate(booking.show!.date)}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock size={15}/>
                          {formatTime(booking.show!.time)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2 items-center'>
                        {booking.seat_number.map((seat) => (
                          <div key={seat} className='w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center'>{seat}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>Rp {booking.total_amount.toFixed(3)}</TableCell>
                    <TableCell>
                      <Badge className={`
                        ${booking.status === 'booked' ? 'bg-yellow-400' : 'bg-red-400'}  
                      `}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className='py-3'>
                      <div className='flex items-center gap-5'>
                          <Button className='text-sm bg-red-500'
                          disabled={dayjs(booking.show?.date).isAfter(dayjs()) && booking.status === 'booked'}
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowCancelModel(true)
                          }}>Cancel</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {showCancelModel && (
            <Dialog open={showCancelModel} onOpenChange={setShowCancelModel}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Batalkan Pesanan</DialogTitle>
                        <DialogDescription>Biaya yang anda keluarkan akan di kembalikan dalam waktu 1x24 jam</DialogDescription>
                    </DialogHeader>
                    <div className='flex gap-5 mt-5'>
                      <Button className='flex-1' variant={'outline'} onClick={() => setShowCancelModel(false)}>Batal</Button>
                      <Button className='flex-1' onClick={handleCancelBooking} disabled={cancelling}>Ya, Batalkan</Button>
                    </div>
                </DialogContent>
            </Dialog>
          )}
      </div>
    </ProfileLayout>
  )
}
