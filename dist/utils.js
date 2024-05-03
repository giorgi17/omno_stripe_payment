"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatingPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const creatingPaymentIntent = (intentParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.STRIPE_SECRET_KEY) {
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: 1000, // amount in cents
            currency: 'usd',
            payment_method: 'pm_card_visa', // payment method ID
            confirm: true, // confirm the Payment Intent immediately
            return_url: `http://localhost:${process.env.PORT}/customerPay`,
        });
        // console.log('paymentIntent', paymentIntent);
        console.log('AAAAs');
        return paymentIntent;
    }
    else {
        return null;
    }
});
exports.creatingPaymentIntent = creatingPaymentIntent;
