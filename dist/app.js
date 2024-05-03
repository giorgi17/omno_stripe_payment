'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const utils_1 = require('./utils');
require('dotenv').config({ path: './config.env' });
// Stripe
const createdPaymentIntent = (0, utils_1.creatingPaymentIntent)({
    amount: 1000,
    currency: 'usd',
    payment_method: 'pm_card_visa',
    confirm: true,
    return_url: 'https://google.com',
});

const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', 'src/views');
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
app.use(express_1.default.json());
// Routes
const customer_1 = __importDefault(require('./routes/customer'));
// Allowing headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTION'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

// Applying routes
app.use(customer_1.default);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
