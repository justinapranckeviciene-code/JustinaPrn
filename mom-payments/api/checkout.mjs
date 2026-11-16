import {createCheckout} from '../payments.mjs';
export default {fetch:request=>createCheckout(request,process.env)};
