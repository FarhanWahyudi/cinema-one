"use server"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const getStripeClientSecret = async (amount: number) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            description: 'Payment for cinego movie tickets'
        })

        return {
            success: true,
            data: paymentIntent.client_secret
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}