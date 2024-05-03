import express from 'express';
import customerPayController from '../controllers/customer';

const router = express.Router();

router.get('/customerPay', customerPayController.customerPayPage);

router.get(
    '/customerPaymentFailedPage',
    customerPayController.customerPaymentFailedPage
);

router.get('/createPaymentIntent', customerPayController.customerCreatePay);

router.get(
    '/customerTransactionPage',
    customerPayController.customerTransactionPage
);

router.get(
    '/customerTransactionSucces',
    customerPayController.customerTransactionSucces
);

router.get('/omnoPayment', customerPayController.omnoPayment);

router.post(
    '/omnoTransactionStatusHook',
    customerPayController.omnoTransactionStatusHook
);

export default router;
