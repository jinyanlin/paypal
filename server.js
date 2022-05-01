require('dotenv').config();
const express = require('express');
const app = express();
const paypal = require('@paypal/checkout-server-sdk');
const { Template } = require('ejs');

const storeItems = new Map([
    [1, {price: 100, name: "paypal one"}],
    [2, {price: 200, name: "paypal two"}]
])
//create paypal enviroment
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID,process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.get('/', (req,res) => {
    res.render('index', { paypalClientId: process.env.PAYPAL_CLIENT_ID});
});

//post
app.post('/create-order', async (req,res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    const total = req.body.items.reduce((sum, item) => {
        return sum + storeItems.get(item.id).price * item.quantity;
    }, 0)
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units:[
            {
                amount: {
                    currency_code: 'USD',
                    value: total,
                    breakdown:{
                        item_total: {
                            currency_code: 'USD',
                            value: total
                        }
                    }
                },
                items: req.body.items.map(item => {
                    const storeItem = storeItems.get(item.id)
                    return {
                        name: storeItem.name,
                        unit_amount: {
                            currency_code: 'USD',
                            value: storeItem.price
                        },
                        quantity: item.quantity
                    }
                })
            }
        ]
    })
    try{
        const order = await paypalClient.execute(request);
        res.json({id: order.result.id});
    }catch(e){
        res.status(500).json( {error: e.message});
    }
})

app.listen(3000);