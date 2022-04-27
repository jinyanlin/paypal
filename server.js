const express = require('express');

const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.get('/', (req,res) => {
    res.render('index', { paypalClientId: 'AcokJ8myoxySarlI-fFQStDddMc9Kkc7qxN0aSTBQ5xzs08FAzd_ZhoV_IKqncUyFrAAPB-vwA3tKY_o'})
});


app.listen(3000);