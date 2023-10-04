import React, { useRef, useEffect } from "react";

export default function Paypal({ totalPrice, handlePaymentPayPalComplete }) {
  const paypal = useRef();

  const converterPrice = totalPrice * 0.000057;

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "CAD",
                  value: converterPrice,
                  // value: 5.0,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          handlePaymentPayPalComplete(order);
          // localStorage.setItem("paypalCheckOut", JSON.stringify(order));
        },
        onError: (err) => {
          console.log(err);
          // window.location.href = "/your-error-page-here";
        },
        oncancel: (data) => {
          console.log("cancle:" + data);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}
