import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createCheckout,stripeWebhook} from './payments.mjs';

const sizes={soliaris:2900,'mano-pinigu-kodas':1500,'mano-2027-metu-kodas':999,'as-sau-leidziu':3900};
const destinations=Object.fromEntries(Object.keys(sizes).map((key,i)=>[key,{
  origin:`https://${key}.example`, price:`price_Fixture${i}`,
  successPath:'/result',cancelPath:'/?checkout=cancelled',fulfillmentPath:'/api/payment-confirmed',
  checkoutKey:String(i).repeat(32),fulfillmentKey:String(i+4).repeat(32),
}]));
const env={
  STRIPE_SECRET_KEY:'rk_test_fixture_only',STRIPE_WEBHOOK_SECRET:'whsec_fixture_only',
  STRIPE_MODE:'test',PAYMENTS_ENABLED:'true',PAYMENT_PRODUCTS:JSON.stringify(destinations),
};
const now=1780000000000;
const orderId='a36504e3-d757-4ef8-8cf9-104139d73b69';
const gateway='https://gateway.example';
const newCheckout=(productId,token=destinations[productId].checkoutKey)=>new Request(gateway+'/api/checkout',{
  method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify({productId,orderId,amount:1}),
});
const session=(productId,patch={})=>({
  object:'checkout.session',id:'cs_test_abc',mode:'payment',livemode:false,amount_total:sizes[productId],currency:'eur',
  client_reference_id:orderId,metadata:{product_id:productId,order_id:orderId,price_id:destinations[productId].price},
  payment_status:'paid',status:'complete',...patch,
});
function send(productId,patch={},options={}) {
  const raw=JSON.stringify({id:'evt_fixture',type:options.type||'checkout.session.completed',livemode:false,
    data:{object:session(productId,patch)}});
  const ts=now/1000-(options.stale?301:0);
  const sig=createHmac('sha256',env.STRIPE_WEBHOOK_SECRET).update(`${ts}.${raw}`).digest('hex');
  return new Request(gateway+'/api/stripe-webhook',{method:'POST',
    headers:{'Stripe-Signature':`t=${ts},v1=${options.forged?'00':sig}`},body:options.modified?'\ufeff'+raw:raw});
}

for (const productId of Object.keys(sizes)) {
  test(`${productId} checkout uses its fixed EUR price and forwards only to its own product`,async()=>{
    const product=destinations[productId];
    const r=await createCheckout(newCheckout(productId),env,async (url,init)=>{
      assert.equal(url,'https://api.stripe.com/v1/checkout/sessions');
      assert.equal(init.body.get('currency'),'eur');
      assert.equal(init.body.get('line_items[0][price]'),product.price);
      assert.equal(init.body.get('line_items[0][quantity]'),'1');
      assert.equal(init.body.get('adaptive_pricing[enabled]'),'false');
      assert.equal(init.headers['Idempotency-Key'],`mom-justina:${productId}:${orderId}`);
      const value=session(productId,{status:'open',payment_status:'unpaid',url:'https://checkout.stripe.com/c/pay/cs_test_abc'});
      return Response.json(value);
    });
    assert.equal(r.status,200);
    assert.equal((await r.json()).id,'cs_test_abc');

    const confirmations=[];
    const fulfill=async (url,init)=>{
      assert.equal(url.href,`${product.origin}${product.fulfillmentPath}`);
      assert.equal(init.headers.Authorization,'Bearer '+product.fulfillmentKey);
      assert.equal(init.headers['Idempotency-Key'],'evt_fixture');
      confirmations.push(JSON.parse(init.body));
      return Response.json({fulfilled:true});
    };
    assert.equal((await stripeWebhook(send(productId),env,fulfill,now)).status,200);
    assert.equal((await stripeWebhook(send(productId),env,fulfill,now)).status,200);
    assert.deepEqual(confirmations[0],{eventId:'evt_fixture',sessionId:'cs_test_abc',orderId,productId,priceId:product.price,amount:sizes[productId],currency:'eur',live:false});
    assert.deepEqual(confirmations[0],confirmations[1]);
  });
}

test('cross-product credentials, tampered amounts, forged and stale signatures cannot grant access',async()=>{
  const noFetch=()=>assert.fail('unexpected external call');
  assert.equal((await createCheckout(newCheckout('mano-pinigu-kodas',destinations.soliaris.checkoutKey),env,noFetch)).status,401);
  assert.equal((await createCheckout(newCheckout('soliaris'),{...env,PAYMENTS_ENABLED:'false'},noFetch)).status,503);
  assert.equal((await createCheckout(newCheckout('soliaris'),{...env,STRIPE_MODE:'live'},noFetch)).status,503);
  for (const opts of [{forged:true},{stale:true},{modified:true}]) {
    assert.equal((await stripeWebhook(send('soliaris',{},opts),env,noFetch,now)).status,400);
  }
  for (const patch of [{amount_total:1500},{currency:'usd'},{livemode:true},{client_reference_id:'bad'},
    {metadata:{...session('soliaris').metadata,price_id:destinations['mano-pinigu-kodas'].price}}]) {
    assert.equal((await stripeWebhook(send('soliaris',patch),env,noFetch,now)).status,400);
  }
  assert.equal((await stripeWebhook(send('soliaris',{payment_status:'unpaid'}),env,noFetch,now)).status,200);
  assert.equal((await stripeWebhook(send('soliaris',{}, {type:'checkout.session.async_payment_failed'}),env,noFetch,now)).status,200);
});

test('delivery failure stays retriable instead of falsely acknowledging a paid order',async()=>{
  for (const downstream of [new Response('',{status:503}),Response.json({fulfilled:false})]) {
    assert.equal((await stripeWebhook(send('soliaris'),env,async()=>downstream,now)).status,502);
  }
});
