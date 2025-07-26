# Code Citations

## License: unknown
https://github.com/gladys-pascual/plantley/blob/819e3f866e7009bf7268250e7e87ba5938eda78a/backend/frontend/src/components/PaymentForm/PaymentForm.tsx

```
;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
```


## License: unknown
https://github.com/socialincome-san/public/blob/97bbb30f0228a356d47c095ac86d94ecfa615ff0/website/src/app/%5Blang%5D/%5Bcountry%5D/%28website%29/donate/checkout-form.tsx

```
;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
```


## License: unknown
https://github.com/Llane4/sistema-de-pagos/blob/6b78ef107dc64789ade769f85eeeb512a93157a2/src/ui/components/pay-form.js

```
});

    // This point
```


## License: unknown
https://github.com/Llane4/sistema-de-pagos/blob/6b78ef107dc64789ade769f85eeeb512a93157a2/src/ui/components/pay-form.js

```
});

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error
```


## License: unknown
https://github.com/Llane4/sistema-de-pagos/blob/6b78ef107dc64789ade769f85eeeb512a93157a2/src/ui/components/pay-form.js

```
});

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.
```


## License: unknown
https://github.com/adamliu84/IntoTheDumpster/blob/344af16472bd94ce8de4617345ccf7f43928a18c/project19/src/CheckoutForm.js

```
button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      
      {/* Show any error or success messages */}
      {message &&
```


## License: unknown
https://github.com/amit629/FitnessPalace/blob/1deeb7f73fbb0dc55b95e6334deebc84cf911f6b/frontend/src/Components/productsPages/store/storeComponents/CheckOutForm.jsx

```
button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      
      {/* Show any error or success messages */}
      {message &&
```


## License: unknown
https://github.com/adamliu84/IntoTheDumpster/blob/344af16472bd94ce8de4617345ccf7f43928a18c/project19/src/CheckoutForm.js

```
button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      
      {/* Show any error or success messages */}
      {message && <div id="payment-message" style={
```


## License: unknown
https://github.com/amit629/FitnessPalace/blob/1deeb7f73fbb0dc55b95e6334deebc84cf911f6b/frontend/src/Components/productsPages/store/storeComponents/CheckOutForm.jsx

```
button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      
      {/* Show any error or success messages */}
      {message && <div id="payment-message" style={
```

