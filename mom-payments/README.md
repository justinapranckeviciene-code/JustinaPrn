# mom_justina mokėjimų serveris

Atskiras Vercel projekto katalogas. Vietinė patikra vykdoma su `npm test` šiame kataloge.

| Produkto ID | Suma EUR |
| --- | ---: |
| `soliaris` | 29,00 |
| `mano-pinigu-kodas` | 15,00 |
| `mano-2027-metu-kodas` | 9,99 |
| `as-sau-leidziu` | 39,00 |

`POST /api/checkout` priima `productId` ir `orderId` tik iš produkto serverio su jam skirtu `checkoutKey`. Užsakymas ir kliento teisė jį skaityti sukuriami produkto saugykloje prieš šį kvietimą. Produkto serveris išsaugo grąžintą sesijos ID prieš nukreipdamas pirkėją į Stripe.

`POST /api/stripe-webhook` tikrina parašą pagal neapdorotus užklausos baitus. Priėmęs apmokėtą Checkout sesiją kviečia konkretaus produkto `fulfillmentPath` su jo `fulfillmentKey`. Produkto serveris turi patikrinti savo mokėjimo sesiją ir užsakymą, vienoje transakcijoje įrašyti įvykį bei atrakinti rezultatą. Pakartotinis tos pačios sesijos patvirtinimas turi grąžinti `{"fulfilled":true}` be pakartotinių veiksmų. Kitą atvejį gateway laiko nepristatytu ir leidžia Stripe pakartoti siuntimą. Rezultatas ir PDF lieka produkto serveryje.

Gamybinėje aplinkoje naudojami `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_MODE`, `PAYMENTS_ENABLED` ir `PAYMENT_PRODUCTS`. Paslaptys saugomos Vercel serverio nustatymuose. `PAYMENT_PRODUCTS` yra objektas pagal produkto ID. Kiekvienam įrašui būtini `price`, `origin`, `successPath`, `cancelPath`, `fulfillmentPath`, `checkoutKey`, `fulfillmentKey`. Pasirinktinai `successOrderParameter` nustato užsakymo ID parametrą grįžimo nuorodoje.

Paleidimui katalogo kainos turi būti vienkartinės ir patikrintos paskyroje. Kiekvieno produkto integracija turi išlaikyti apmokėjimo, nesėkmės ir pakartotinio pasiekimo testus. TARO paramos nuoroda naudojama atskirai.
