import React, { FormEvent, useState } from 'react'
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
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
import { BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
interface CheckoutFormProps {
    openCheckout: boolean
    setOpenCheckout: (open: boolean) => void;
    onPaymentSuccess?: (paymentId: string) => void
}

export default function CheckoutForm({ openCheckout, setOpenCheckout, onPaymentSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete",
            },
            redirect: 'if_required'
        });

        setLoading(false)

        if (result.error) {
            toast.error(result.error.message || 'Payment failed')
        } else {
            toast.success("Payment successfully")
            setOpenCheckout(false)
            if (onPaymentSuccess) {
                onPaymentSuccess(result.paymentIntent?.id || '')
            }
        }
    };
    return (
        <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <form onSubmit={handleSubmit}>
            <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
                <DialogDescription>
                Compleate your payment to book the selected movie tickets
                </DialogDescription>
            </DialogHeader>
            <form className='flex flex-col justify-between p-5'>
                <PaymentElement />
                <div className='flex gap-3 justify-end mt-5'>
                    <Button onClick={() => setOpenCheckout(false)} disabled={loading} type='button' variant={'outline'}>Batal</Button>
                    <Button className='bg-cyan-600' type='submit' disabled={!stripe || loading}>
                        Bayar
                    </Button>
                </div>
            </form>
            </DialogContent>
        </form>
        </Dialog>
    )
}
