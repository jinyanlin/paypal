
const amountElement = document.getElementById('amount');

paypal.Buttons({
    createOrder: function() {
      // This function sets up the details of the transaction, including the amount and line item details.
      return fetch('/create-order', {
        //upload json data
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [{
            id: 1,
            quantity: 2
          },
        {
          id: 2,
          quantity: 3}]
        })
      })
        .then(res => {
          if(res.ok)
            return res.json(); 
          return res.json().then(json => Promise.reject(json))  //return for reject message of promise
        })
        .then(({ id }) => {
          return id;
        })
        .catch( (e) => {
          console.error(e.error);
        })
      },
    onApprove: function(data, actions) {
      // This function captures the funds from the transaction.
      return actions.order.capture()
    },
  }).render('#paypal');
  //This function displays payment buttons on your web page.
  