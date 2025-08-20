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
      'Teater',
      'Film',
      'Penayangan',
      'Kursi',
      'Jumlah',
      'Status',
      'Actions'
  ]

  return (
    <div>
        <PageTitle title='Booking saya' />

        {loading && <Spinner />}
        
        {!loading && bookings.length === 0 && (
          <NoDataMessage />
        )}

        {!loading && bookings.length > 0 && (
          <Table className='mt-10'>
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
                  
                  <TableCell>{booking.theatre?.name}</TableCell>
                  <TableCell>{booking.movie?.name}</TableCell>
                  <TableCell>{formatDate(booking.show!.date)} - {formatTime(booking.show!.time)}</TableCell>
                  <TableCell>{booking.seat_number.join(', ')}</TableCell>
                  <TableCell>{booking.total_amount}</TableCell>
                  <TableCell>{booking.status.toUpperCase()}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-5'>
                      {dayjs(booking.show?.date).isAfter(dayjs()) && booking.status === 'booked' && (
                        <span className='text-sm cursor-pointer py-5' onClick={() => {
                          setSelectedBooking(booking)
                          setShowCancelModel(true)
                        }}>Cancel</span>
                      )}
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
                      <DialogTitle></DialogTitle>
                      <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className='flex justify-end gap-5'>
                    <Button variant={'outline'}>Batal</Button>
                    <Button onClick={handleCancelBooking} disabled={cancelling}>Ya, Batalkan</Button>
                  </div>
              </DialogContent>
          </Dialog>
        )}
    </div>
  )
}
