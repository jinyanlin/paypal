require('dotenv').config();
const express = require('express');
const app = express();
const paypal = require('@paypal/checkout-server-sdk');
const { Template } = require('ejs');

const storeItems = new Map([
    [1, {price: 100, name: "paypal one"}],
    [2, {price: 200, name: "paypal two"}]
])

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.get('/', (req,res) => {
    res.render('index', { paypalClientId: process.env.PAYPAL_CLIENT_ID});
});

//post
app.post('/create-order', (req,res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    const total = req.body.items.reduce((sum, item) => {
        return sum + storeItems.get(item.id).price * quantity;
    })
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
                items: req.body.items.Map(item => {
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
})

app.listen(3000);