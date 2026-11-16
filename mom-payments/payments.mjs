import {createHmac, timingSafeEqual} from 'node:crypto';

const amounts = Object.freeze({soliaris:2900, 'mano-pinigu-kodas':1500, 'mano-2027-metu-kodas':999, 'as-sau-leidziu':3900});
const completed = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded']);
const orderPattern = /^[a-zA-Z0-9_-]{16,100}$/;
const pricePattern = /^price_[a-zA-Z0-9]+$/;
const modePattern = /^(?:rk|sk)_(live|test)_/;
const response = (body,status=200) => Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

function matches(a,b) {
  if (typeof a!=='string' || typeof b!=='string') return false;
  const left=Buffer.from(a), right=Buffer.from(b);
  return left.length===right.length && timingSafeEqual(left,right);
}

function urlAtOrigin(origin,route) {
  const base=new URL(origin);
  if (base.protocol!=='https:' || base.origin!==origin || !route.startsWith('/')) throw Error('Invalid Site configuration');
  const url=new URL(route,base);
  if (url.origin!==base.origin || url.username || url.password || url.hash) throw Error('Invalid Site path');
  return url;
}

function configured(env, productId) {
  if (!Object.hasOwn(amounts,productId)) return null;
  const destinations=JSON.parse(env.PAYMENT_PRODUCTS || '{}');
  if (!Object.hasOwn(destinations,productId)) return null;
  const p=destinations[productId];
  if (!p || !pricePattern.test(p.price) || typeof p.checkoutKey!=='string' || p.checkoutKey.length<32 ||
      typeof p.fulfillmentKey!=='string' || p.fulfillmentKey.length<32) throw Error('Invalid product configuration');
  return {
    ...p, amount:amounts[productId],
    success:urlAtOrigin(p.origin,p.successPath),
    cancel:urlAtOrigin(p.origin,p.cancelPath),
    fulfillment:urlAtOrigin(p.origin,p.fulfillmentPath),
  };
}

function mode(env) {
  const selected=typeof env.STRIPE_SECRET_KEY==='string' && env.STRIPE_SECRET_KEY.match(modePattern)?.[1];
  return env.PAYMENTS_ENABLED==='true' && selected===env.STRIPE_MODE ? selected : null;
}

function signatureValid(raw,header,secret,now) {
  const entries=(header??'').split(',').map(x=>x.trim());
  const times=entries.filter(x=>x.startsWith('t='));
  if (times.length!==1) return false;
  const time=times[0].slice(2);
  if (!/^\d{10}$/.test(time) || Math.abs(now/1000-Number(time))>300) return false;
  const expected=createHmac('sha256',secret).update(`${time}.`).update(raw).digest('hex');
  return entries.some(x=>x.startsWith('v1=') && matches(x.slice(3),expected));
}

async function rawBody(request, limit) {
  if (!request.body) return Buffer.alloc(0);
  const reader=request.body.getReader();
  const chunks=[];
  let size=0;
  try {
    for (;;) {
      const {value,done}=await reader.read();
      if (done) return Buffer.concat(chunks,size);
      size+=value.byteLength;
      if (size>limit) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
}

function checkoutSession(session, selected, product, order, productId) {
  return session?.object==='checkout.session' &&
    typeof session.id==='string' && session.id.startsWith(`cs_${selected}_`) &&
    session.livemode===(selected==='live') && session.mode==='payment' &&
    session.currency==='eur' && session.amount_total===product.amount &&
    session.client_reference_id===order && session.metadata?.order_id===order &&
    session.metadata?.product_id===productId && session.metadata?.price_id===product.price;
}

export async function createCheckout(request,env,fetcher=fetch) {
  if (request.method!=='POST') return response({error:'Method not allowed'},405);
  const selected=mode(env);
  if (!selected || !env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')) return response({error:'Payments disabled'},503);
  try {
    const raw=await rawBody(request,4096);
    if (raw===null) return response({error:'Request too large'},413);
    let input;
    try { input=JSON.parse(raw); } catch { return response({error:'Invalid request'},400); }
    const {productId,orderId}=input??{};
    if (typeof productId!=='string' || typeof orderId!=='string' || !orderPattern.test(orderId)) {
      return response({error:'Invalid request'},400);
    }
    const p=configured(env,productId);
    if (!p || !matches(request.headers.get('authorization'),`Bearer ${p.checkoutKey}`)) {
      return response({error:'Unauthorized'},401);
    }
    const success=p.success;
    if (p.successOrderParameter) success.searchParams.set(p.successOrderParameter,orderId);
    const fields=new URLSearchParams({
      mode:'payment', currency:'eur', 'line_items[0][price]':p.price,'line_items[0][quantity]':'1',
      'adaptive_pricing[enabled]':'false',success_url:success.href,cancel_url:p.cancel.href,
      client_reference_id:orderId,'metadata[product_id]':productId,'metadata[order_id]':orderId,
      'metadata[price_id]':p.price,'payment_intent_data[metadata][product_id]':productId,
      'payment_intent_data[metadata][order_id]':orderId,
    });
    const stripe=await fetcher('https://api.stripe.com/v1/checkout/sessions',{
      method:'POST',body:fields,redirect:'error',signal:AbortSignal.timeout(8000),
      headers:{Authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,'Stripe-Version':'2026-09-30.endive',
        'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':`mom-justina:${productId}:${orderId}`},
    });
    if (!stripe.ok) return response({error:'Stripe checkout unavailable'},502);
    const session=await stripe.json();
    const checkout=new URL(session.url);
    if (!checkoutSession(session,selected,p,orderId,productId) || session.status!=='open' ||
        session.payment_status!=='unpaid' || checkout.origin!=='https://checkout.stripe.com' || checkout.username || checkout.password) {
      return response({error:'Stripe checkout mismatch'},502);
    }
    return response({id:session.id,url:session.url});
  } catch {
    return response({error:'Checkout unavailable'},502);
  }
}

export async function stripeWebhook(request,env,fetcher=fetch,now=Date.now()) {
  if (request.method!=='POST') return response({error:'Method not allowed'},405);
  const selected=mode(env);
  if (!selected || !env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')) return response({error:'Payments disabled'},503);
  let raw,event;
  try {
    raw=await rawBody(request,262144);
    if (raw===null) return response({error:'Request too large'},413);
    if (!signatureValid(raw,request.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET,now)) {
      return response({error:'Invalid signature'},400);
    }
    event=JSON.parse(raw);
  } catch {
    return response({error:'Invalid event'},400);
  }
  if (!completed.has(event?.type)) return response({received:true});
  const session=event.data?.object;
  const productId=session?.metadata?.product_id;
  if (typeof productId!=='string' || !Object.hasOwn(amounts,productId)) return response({received:true});
  try {
    const p=configured(env,productId);
    if (!p) return response({error:'Product configuration unavailable'},503);
    const order=session.metadata.order_id;
    if (typeof order!=='string' || !orderPattern.test(order) || !/^evt_[a-zA-Z0-9]+$/.test(event.id||'') ||
        event.livemode!==(selected==='live') || !checkoutSession(session,selected,p,order,productId)) {
      return response({error:'Payment mismatch'},400);
    }
    if (session.payment_status!=='paid') return response({received:true});
    if (session.status!=='complete') return response({error:'Payment mismatch'},400);
    const delivered=await fetcher(p.fulfillment,{
      method:'POST',redirect:'error',signal:AbortSignal.timeout(8000),
      headers:{Authorization:`Bearer ${p.fulfillmentKey}`,'Content-Type':'application/json','Idempotency-Key':event.id},
      body:JSON.stringify({eventId:event.id,sessionId:session.id,orderId:order,productId,
        priceId:p.price,amount:p.amount,currency:'eur',live:selected==='live'}),
    });
    if (!delivered.ok || (await delivered.json()).fulfilled!==true) {
      return response({error:'Fulfillment not confirmed'},502);
    }
    return response({received:true});
  } catch {
    return response({error:'Fulfillment unavailable'},502);
  }
}
