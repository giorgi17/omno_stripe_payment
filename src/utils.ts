import Stripe from 'stripe';

export const creatingPaymentIntent = async () => {
    if (process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const checkoutIntent = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'test product',
                        },
                        unit_amount: 1 * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:4000/customerTransactionSucces?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:4000/customerPaymentFailedPage',
        });

        return checkoutIntent;
    } else {
        return null;
    }
};
