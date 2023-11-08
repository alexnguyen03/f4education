import React, { useRef, useEffect } from 'react'

export default function Paypal({ totalPrice, handlePaymentPayPalComplete }) {
    const paypal = useRef()

    const converterPrice = totalPrice * 0.000057

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                description: 'Cool looking table',
                                amount: {
                                    currency_code: 'CAD',
                                    // value: converterPrice
                                    value: 1.0
                                }
                            }
                        ]
                    })
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture()
                    handlePaymentPayPalComplete(order, null, null)
                },
                onError: (err) => {
                    const isError = true
                    handlePaymentPayPalComplete(null, null, isError)
                    console.log(err)
                },
                oncancel: (data) => {
                    const isCancle = true
                    handlePaymentPayPalComplete(null, isCancle, null)
                    console.log(data)
                }
            })
            .render(paypal.current)
    }, [handlePaymentPayPalComplete])

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    )
}
