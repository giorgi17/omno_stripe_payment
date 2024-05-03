import { Request, Response, NextFunction } from 'express';
import { creatingPaymentIntent } from '../utils';
import { Stripe } from 'stripe';
import axios from 'axios';

const customerPayPage = (req: Request, res: Response, next: NextFunction) => {
    res.render('index', {
        path: '/customerPay',
    });
};

const customerPaymentFailedPage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.render('paymentFailed', {
        path: '/paymentFailed',
    });
};

const customerCreatePay = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Stripe
    const createdPaymentIntent = await creatingPaymentIntent();
    const sessionId = createdPaymentIntent?.id;
    const publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;

    res.redirect(
        `/customerTransactionPage/?sessionId=${sessionId}&publishable_key=${publishable_key}`
    );
};

const customerTransactionPage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const sessionId = req.query.sessionId;
    const publishable_key = req.query.publishable_key;

    res.render('customerTransactionPage', {
        path: '/customerTransactionPage',
        sessionId,
        publishable_key,
    });
};

const customerTransactionSucces = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const sessionId = req.query.session_id;

    if (typeof sessionId === 'string' && process.env.STRIPE_SECRET_KEY) {
        try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const paymentIntent = await stripe.checkout.sessions.retrieve(
                sessionId
            );

            const transactionData = {
                billing: {
                    firstName: paymentIntent.customer_details?.name,
                    lastName: paymentIntent.customer_details?.name,
                    address1: 'gamrekeli',
                    city: 'tbilisi',
                    state: 'Saburtalo',
                    country: paymentIntent.customer_details?.address?.country,
                    postalCode: '0160',
                    phone: '+995591271271',
                    email: paymentIntent.customer_details?.email,
                },
                amount: paymentIntent.amount_subtotal,
                currency: paymentIntent.currency?.toUpperCase(),
                hookUrl: 'http://localhost:4000/omnoTransactionStatusHook',
                callback: 'http://localhost:4000/customerPay',
                callbackFail: 'http://localhost:4000/customerPaymentFailedPage',
            };

            // Getting Omno bearer token
            const data = {
                grant_type: process.env.OMNO_GRANT_TYPE,
                client_id: process.env.OMNO_CLIENT_ID,
                client_secret: process.env.OMNO_CLIENT_SECRET,
            };
            const omnoTokenResponse = await axios.post(
                'https://sso.omno.com/realms/omno/protocol/openid-connect/token',
                data,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const bearerToken = await omnoTokenResponse.data.access_token;

            const transactionAddResponse = await axios.post(
                'https://api.omno.com/transaction/create',
                JSON.stringify(transactionData),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearerToken}`,
                    },
                }
            );

            if (transactionAddResponse.data?.paymentUrlIframe) {
                res.redirect(
                    `/omnoPayment/?paymentUrlIframe=${transactionAddResponse.data?.paymentUrlIframe}`
                );
            }
        } catch (error) {
            console.log('error', error);
        }
    }
};

const omnoPayment = async (req: Request, res: Response, next: NextFunction) => {
    const paymentUrlIframe = req.query.paymentUrlIframe;
    if (paymentUrlIframe) {
        res.render('omnoPayment', {
            path: '/omnoPayment',
            paymentUrlIframe,
        });
    }
};

const omnoTransactionStatusHook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const hookData = req.body?.hookData;
    if (hookData) {
        console.log('Omno hook sent this data', hookData);
    }
};

export default {
    customerPayPage,
    customerPaymentFailedPage,
    customerCreatePay,
    customerTransactionPage,
    customerTransactionSucces,
    omnoPayment,
    omnoTransactionStatusHook,
};
