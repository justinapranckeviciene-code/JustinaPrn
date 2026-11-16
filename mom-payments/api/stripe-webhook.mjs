import {stripeWebhook} from '../payments.mjs';
export default {fetch:request=>stripeWebhook(request,process.env)};
