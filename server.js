require('dotenv').config();
const express = require('express');
const app = express();

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



app.listen(3000);