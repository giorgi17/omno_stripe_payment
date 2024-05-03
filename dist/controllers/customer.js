"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customerPayPage = (req, res, next) => {
    res.render('index', {
        path: '/customerPay',
    });
};
exports.default = { customerPayPage };
