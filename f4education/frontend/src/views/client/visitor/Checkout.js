import React, { useCallback, useEffect, useState } from 'react'
import {
    createSearchParams,
    Link,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import { Button, Col, Modal, ModalBody, Row } from 'reactstrap'

import logoVnPay from '../../../assets/img/logo-vnpay.png'
import logoPayPal from '../../../assets/img/logo-paypal.png'
import cartEmptyimage from '../../../assets/img/cart-empty.png'

// API
import paymentApi from '../../../api/paymentApi'
import cartApi from '../../../api/cartApi'
import billApi from '../../../api/billApi'
import registerCourseApi from '../../../api/registerCourseApi'
import Paypal from './PayPal'
import moment from 'moment'

// CSS Module
import styles from '../../../assets/css/custom-client-css/Payment.module.css'
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const Checkout = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // router Variable
    const [listCart] = useState(
        JSON.parse(localStorage.getItem('cartCheckout'))
    )

    let navigate = useNavigate()

    // *************** Action Variable
    const [checkOutMethod, setCheckOutMethod] = useState('vnpay')
    const [totalPrice, setTotalPrice] = useState(0)

    //  VNPAY + PAYPAL
    const [transactionNo, setTransactionNo] = useState('')
    const [paymentType, setPaymentType] = useState('')
    const [bankCheckout, setBankCheckout] = useState('')

    // VNPAY
    const [searchParams] = useSearchParams()
    const [responseCode, setResponseCode] = useState('')

    // PayPal
    const [checkoutPayPal, setPayPalCheckout] = useState(false)
    const [showingPayPal, setShowingPayPal] = useState(false)
    const [checkoutComplete, setCheckoutComplete] = useState({
        status: '',
        infor: ''
    })
    const [showModal, setShowModal] = useState(false)
    const [count, setCount] = useState(10)

    // *************** FORM Variable
    const [bill, setBill] = useState({
        totalPrice: totalPrice,
        checkoutMethod: checkOutMethod,
        studentId: user.username
    })

    //  *************** Action && Logic UI AREA
    const handleChangeCheckoutMethod = (e) => {
        if (e.target.id === 'vnpay') {
            setPayPalCheckout(false)
            setShowingPayPal(false)
            setCheckOutMethod('vnpay')
        } else if (e.target.id === 'paypal') {
            setCheckOutMethod('paypal')
        }
    }

    const handleCreatePayment = async () => {
        localStorage.setItem('billCheckout', JSON.stringify(bill))

        if (checkOutMethod === 'vnpay') {
            setPayPalCheckout(false)
            setShowingPayPal(false)
            setCheckOutMethod('vnpay')

            // API direct to VNPay checkout
            try {
                const resp = await paymentApi.createPayment(bill)
                const url = resp.data.url
                window.location.href = url
            } catch (error) {
                console.log(error)
            }
            return
        } else if (checkOutMethod === 'paypal') {
            setPayPalCheckout(true)
            setShowingPayPal(true)
            setCheckOutMethod('paypal')
        }
    }

    // *************** use Effect AREA
    // set Bill for create payment
    useEffect(() => {
        setBill({
            totalPrice: totalPrice,
            checkoutMethod: checkOutMethod,
            studentId: user.username
        })
    }, [totalPrice, checkOutMethod, user.username])

    useEffect(() => {
        console.log(checkOutMethod)
    }, [checkOutMethod])

    // get total price
    useEffect(() => {
        // get Total Price from list totalCartItem
        let newTotalPrice = 0
        listCart.length > 0 &&
            listCart.map((item) => (newTotalPrice += item.course.coursePrice))
        setTotalPrice(newTotalPrice)
    }, [listCart])

    // get and handle response checkout
    useEffect(() => {
        searchParams.get('vnp_ResponseCode')
        setResponseCode(searchParams.get('vnp_ResponseCode'))
        setTransactionNo(searchParams.get('vnp_TransactionNo'))
        setPaymentType(searchParams.get('vnp_CardType'))
    }, [responseCode, searchParams])

    const [paypalPaymentAt, setPayPalPaymentAt] = useState('')

    const handlePaymentPayPalComplete = useCallback((order, isCancle,isError) => {
        console.log(isCancle)
        console.log(isError)
        setPayPalCheckout(true)
        setShowModal(true)
        setCheckoutComplete({
            status: 'success',
            infor: 'Thanh toán thành công!'
        })

        setTransactionNo(order.id)
        setPayPalPaymentAt(new Date().toLocaleString())
        setPaymentType('PayPal')
        setBankCheckout('PayPal Wallet')

        const listCar = JSON.parse(localStorage.getItem('cartCheckout'))

        if (listCar !== null) {
            const updateCartRequest = listCar.map((cart) => ({
                cartId: cart.cartId,
                courseId: cart.course.courseId,
                createDate: cart.createDate,
                studentId: user.username
            }))

            // Create RegisterCoures
            handleCreateRegisterCourse(updateCartRequest)

            // Create Bill
            handleCreateBillAndBillDetail(updateCartRequest)

            // Update Cart
            handleUpdateCart(updateCartRequest)
            localStorage.removeItem('cartCheckout')

            // PayPal checkout logic
            setShowingPayPal(false)
            setPayPalCheckout(false)
        } else {
            return console.log('Other Error')
        }
    }, [])

    useEffect(() => {
        if (responseCode !== null) {
            const handleUpdateCartAndCreateBill = () => {
                if (responseCode === '24') {
                    setShowModal(true)
                    setCheckoutComplete({
                        status: 'cancle',
                        infor: 'Hóa đơn đã được hủy!'
                    })
                    return console.log('Check out fail, cancle progress')
                }
                if (responseCode === '00') {
                    setShowModal(true)
                    setCheckoutComplete({
                        status: 'success',
                        infor: 'Thanh toán thành công!'
                    })
                    setPayPalPaymentAt(new Date().toLocaleString())
                    setBankCheckout('NCB')

                    const listCar = JSON.parse(
                        localStorage.getItem('cartCheckout')
                    )
                    // const billRequest = JSON.parse(localStorage.getItem("billCheckout"));

                    if (listCar !== null) {
                        const updateCartRequest = listCar.map((cart) => ({
                            cartId: cart.cartId,
                            courseId: cart.course.courseId,
                            createDate: cart.createDate,
                            studentId: user.username
                        }))

                        // Create RegisterCoures
                        handleCreateRegisterCourse(updateCartRequest)

                        // Create Bill
                        handleCreateBillAndBillDetail(updateCartRequest)

                        // Update Cart
                        handleUpdateCart(updateCartRequest)
                        localStorage.removeItem('cartCheckout')
                    }
                } else {
                    return console.log('Other Error')
                }
            }
            return handleUpdateCartAndCreateBill()
        } else {
            return console.log(
                "Status normal, user just haven't checkout or stay for fun?"
            )
        }
    }, [responseCode])

    const handleCreateRegisterCourse = async (updateCartRequest) => {
        const registerCourseRequest = updateCartRequest.map((rc) => ({
            courseId: rc.courseId,
            studentId: 1
        }))

        console.log(registerCourseRequest[0])

        try {
            await registerCourseApi.createRegisterCourse(
                registerCourseRequest[0]
            )
        } catch (error) {
            console.log('RegisterCourse: ' + error)
        }
    }

    const handleCreateBillAndBillDetail = async (updateCartRequest) => {
        try {
            const billRequest = {
                totalPrice: totalPrice,
                checkoutMethod: checkOutMethod,
                studentId: user.username
            }

            await billApi.createBill(billRequest)
        } catch (error) {
            console.log('Bill: ' + error)
        }

        localStorage.removeItem('billCheckout')

        // create bill Request for add bill and bill Detail
        const billDetailRequest = updateCartRequest.map((detail) => ({
            totalPrice: totalPrice,
            courseId: detail.courseId
        }))

        // Bill detail
        try {
            await billApi.createBillDetail(billDetailRequest)
        } catch (error) {
            console.log('BillDetail: ' + error)
        }
    }

    // update cart
    const handleUpdateCart = (updateCartRequest) => {
        updateCartRequest.map(async (request) => {
            try {
                await cartApi.updateCart(request, request.cartId)
            } catch (error) {
                console.log('Cart: ' + error)
            }
        })
    }

    useEffect(() => {
        if (count === 0) {
            return
        }

        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1)
        }, 1000)
        return () => clearTimeout(timer)
    }, [count, handlePaymentPayPalComplete])

    useEffect(() => {
        const timeoutRedirect = setTimeout(() => {
            if (checkoutComplete.status === 'success') {
                return navigate({
                    pathname: '/cart',
                    search: `?${createSearchParams({
                        checkoutComplete: true
                    })}`
                })
            }
        }, 9000)
        return () => clearTimeout(timeoutRedirect)
    }, [checkoutComplete, handlePaymentPayPalComplete, navigate])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCheckoutComplete({
                status: '',
                infor: ''
            })
            setShowModal(false)
            setTransactionNo('')
            setPaymentType('')
            setPayPalPaymentAt('')
            setBankCheckout('')
        }, 10000)

        return () => clearTimeout(timeout)
    }, [checkoutComplete, showModal, handlePaymentPayPalComplete])

    return (
        <>
            {/* Title */}
            <div>
                <h1 className="font-weight-800 text-dark my-5 display-2">
                    Thanh toán
                </h1>
                <Link to="/cart">
                    <h3 className="text-muted mt--4">
                        <i className="bx bx-chevrons-left mr-2"></i>trở về
                    </h3>
                </Link>
            </div>

            {/* content */}
            <div className="mt-5 pb-5">
                <Row>
                    {listCart !== null ? (
                        <>
                            <Col xl={8} lg={8} md={12} sm={12} className="p-5">
                                <div className="d-flex justify-content-between">
                                    <h2 className="font-weight-800 text-dark ">
                                        Hình thức thanh toán
                                    </h2>
                                </div>
                                <div className="d-flex">
                                    <div
                                        className="accordion w-100"
                                        id="accordionExample"
                                    >
                                        <div className="card w-100">
                                            <div
                                                className="card-header w-100"
                                                id="headingOne"
                                            >
                                                <h2 className="mb-0">
                                                    <button
                                                        className="btn btn-link btn-block text-left"
                                                        type="button"
                                                        data-toggle="collapse"
                                                        data-target="#collapseOne"
                                                        aria-expanded="true"
                                                        aria-controls="collapseOne"
                                                    >
                                                        <input
                                                            id="vnpay"
                                                            type="radio"
                                                            name="checkoutMethod"
                                                            checked={
                                                                checkOutMethod ===
                                                                'vnpay'
                                                            }
                                                            className="mr-3"
                                                            onChange={
                                                                handleChangeCheckoutMethod
                                                            }
                                                        />
                                                        <label htmlFor="vnpay">
                                                            <img
                                                                src={logoVnPay}
                                                                width="50px"
                                                                height="50px"
                                                                className="img-fluid"
                                                                alt="logo vnpay"
                                                            />
                                                        </label>
                                                    </button>
                                                </h2>
                                            </div>

                                            <div
                                                id="collapseOne"
                                                className="collapse"
                                                aria-labelledby="headingOne"
                                                data-parent="#accordionExample"
                                            >
                                                <div className="card-body">
                                                    Để hoàn tất giao dịch của
                                                    bạn, chúng tôi sẽ chuyển bạn
                                                    đến máy chủ bảo mật của{' '}
                                                    <strong>VnPay</strong>.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div
                                                className="card-header"
                                                id="headingTwo"
                                            >
                                                <h2 className="mb-0">
                                                    <button
                                                        className="btn btn-link btn-block text-left collapsed"
                                                        type="button"
                                                        data-toggle="collapse"
                                                        data-target="#collapseTwo"
                                                        aria-expanded="false"
                                                        aria-controls="collapseTwo"
                                                    >
                                                        <input
                                                            id="paypal"
                                                            type="radio"
                                                            name="checkoutMethod"
                                                            checked={
                                                                checkOutMethod ===
                                                                'paypal'
                                                            }
                                                            className="mr-3"
                                                            onChange={
                                                                handleChangeCheckoutMethod
                                                            }
                                                        />
                                                        <label htmlFor="paypal">
                                                            <img
                                                                src={logoPayPal}
                                                                width="50px"
                                                                height="50px"
                                                                className="img-fluid"
                                                                alt="logo paypal"
                                                            />
                                                        </label>
                                                    </button>
                                                </h2>
                                            </div>
                                            <div
                                                id="collapseTwo"
                                                className="collapse"
                                                aria-labelledby="headingTwo"
                                                data-parent="#accordionExample"
                                            >
                                                <div className="card-body">
                                                    Để hoàn tất giao dịch của
                                                    bạn, chúng tôi sẽ chuyển bạn
                                                    đến máy chủ bảo mật của{' '}
                                                    <strong>PayPal</strong>.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-details mt-5">
                                    <h2 className="font-weight-800 text-dark">
                                        Chi tiết hóa đơn
                                    </h2>
                                    {listCart !== null &&
                                        listCart.map((cart) => (
                                            <Row
                                                className="mb-2"
                                                key={cart.cartId}
                                            >
                                                <Col
                                                    lg="2"
                                                    xl="2"
                                                    md="2"
                                                    sm="2"
                                                >
                                                    <img
                                                        src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
                                                        width={'100%'}
                                                        style={{
                                                            maxHeight: '100px'
                                                        }}
                                                        className="img-fluid"
                                                        alt={
                                                            cart.course
                                                                .courseName
                                                        }
                                                    />
                                                </Col>
                                                <Col
                                                    lg="8"
                                                    xl="8"
                                                    md="8"
                                                    sm="8"
                                                >
                                                    <h4 className="font-weight-800 text-dark">
                                                        {cart.course.courseName}
                                                    </h4>
                                                </Col>
                                                <Col
                                                    lg="2"
                                                    xl="2"
                                                    md="2"
                                                    sm="2"
                                                >
                                                    <h4 className="text-muted">
                                                        {cart.course.coursePrice.toLocaleString(
                                                            'it-IT',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }
                                                        )}
                                                    </h4>
                                                </Col>
                                            </Row>
                                        ))}
                                </div>
                            </Col>
                            <Col
                                xl={4}
                                lg={4}
                                md={12}
                                sm={12}
                                className={`${styles['checkout-summery']} p-5 shadow`}
                                style={{ background: '#f7f7f7' }}
                            >
                                <div>
                                    <div
                                        className={
                                            styles['checkout-sumery-header']
                                        }
                                    >
                                        <h2 className="font-weight-800 text-dark ">
                                            Tổng thanh toán
                                        </h2>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">
                                                Giá gốc:
                                            </span>
                                            <span className="text-muted">
                                                {totalPrice.toLocaleString(
                                                    'it-IT',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }
                                                )}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">
                                                Giảm giá:
                                            </span>
                                            <span className="text-muted">
                                                0đ
                                            </span>
                                        </div>
                                        <hr />
                                        <div
                                            className={
                                                styles['checkout-sum-total']
                                            }
                                        >
                                            <div className="d-flex justify-content-between">
                                                <h3 className="font-weight-700 text-dark">
                                                    Tổng:
                                                </h3>
                                                <h3 className="font-weight-700 text-dark">
                                                    {totalPrice.toLocaleString(
                                                        'it-IT',
                                                        {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }
                                                    )}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            styles[
                                                'check-summery-floating-bottom'
                                            ]
                                        }
                                    >
                                        <div className="d-flex justify-content-between">
                                            <h3 className="font-weight-700 text-dark">
                                                Tổng:
                                            </h3>
                                            <h3 className="font-weight-700 text-dark">
                                                {totalPrice.toLocaleString(
                                                    'it-IT',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }
                                                )}
                                            </h3>
                                        </div>

                                        <div className="mt-3 text-muted">
                                            <span>
                                                Bằng việc hoàn tất giao dịch
                                                mua, bạn đồng ý với các Điều
                                                khoản dịch vụ này.
                                            </span>
                                            <br />

                                            <div className="mt-2">
                                                {showingPayPal &&
                                                checkoutPayPal ? (
                                                    <>
                                                        <Paypal
                                                            totalPrice={
                                                                totalPrice
                                                            }
                                                            handlePaymentPayPalComplete={
                                                                handlePaymentPayPalComplete
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            color="primary"
                                                            className="w-100 mt-2"
                                                            style={{
                                                                borderRadius:
                                                                    '3px'
                                                            }}
                                                            onClick={() =>
                                                                handleCreatePayment()
                                                            }
                                                        >
                                                            Tiếp tục
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto my-au">
                                <h1 className="font-weight-700 ">
                                    Không có khóa học để thanh toán
                                </h1>
                                <img
                                    src={cartEmptyimage}
                                    width="100%"
                                    height="100%"
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </>
                    )}
                </Row>
            </div>

            <Modal className="modal-dialog-centered" isOpen={showModal}>
                <ModalBody>
                    {checkoutComplete.status !== '' && (
                        <>
                            <div
                                className="checkout-popup text-center d-flex flex-column 
                    justify-content-center align-items-center p-2"
                            >
                                <div>
                                    <h3
                                        className={`${
                                            checkoutComplete.status ===
                                            'success'
                                                ? 'text-success'
                                                : 'text-danger'
                                        } font-weight-600`}
                                    >
                                        <span
                                            style={{
                                                background: '#f1f1f1',
                                                borderRadius: '50%'
                                            }}
                                        >
                                            {checkoutComplete.status ===
                                            'success' ? (
                                                <>
                                                    <i
                                                        className="bx bx-check-circle m-2 text-success"
                                                        style={{
                                                            fontSize: '35px'
                                                        }}
                                                    ></i>
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="bx bx-x-circle m-2 text-danger"
                                                        style={{
                                                            fontSize: '35px'
                                                        }}
                                                    ></i>
                                                </>
                                            )}
                                        </span>
                                        <br />
                                        <span>{checkoutComplete.infor}</span>
                                    </h3>
                                </div>
                                {checkoutComplete.status === 'success' && (
                                    <div
                                        style={{
                                            background: '#f1f1f1',
                                            borderRadius: '5px'
                                        }}
                                        className="p-2 w-100 mt-5"
                                    >
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">
                                                    Tổng thanh toán:
                                                </div>
                                                <div className="font-weight-600">
                                                    {totalPrice}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">
                                                    Mã đơn hàng:
                                                </div>
                                                <div className="font-weight-600">
                                                    {transactionNo}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">
                                                    Hình thức thanh toán:
                                                </div>
                                                <div className="font-weight-600">
                                                    {checkOutMethod.toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">
                                                    Thanh toán bằng:
                                                </div>
                                                <div className="font-weight-600">
                                                    {paymentType}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">
                                                    Ngân hàng thanh toán:
                                                </div>
                                                <div className="font-weight-600">
                                                    {bankCheckout}
                                                </div>
                                            </div>
                                        </>

                                        <div className="d-flex justify-content-between">
                                            <div className="text-muted">
                                                Thời gian thanh toán:
                                            </div>
                                            <div className="font-weight-600">
                                                {moment(paypalPaymentAt).format(
                                                    'DD-MM-yyyy, h:mm:ss A'
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="mx-auto mt-5">
                                    <p className="mx-auto text-muted my-3">
                                        {checkoutComplete.status === 'success'
                                            ? 'Tự động trở về sau:'
                                            : 'Tự động đóng sau:'}
                                        <strong>{count}</strong>
                                    </p>
                                    <Link
                                        to={`${
                                            checkoutComplete.status ===
                                            'success'
                                                ? '/cart'
                                                : '#'
                                        }`}
                                    >
                                        <Button
                                            color="primary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            {checkoutComplete.status ===
                                            'success'
                                                ? 'Trở về giỏ hàng'
                                                : 'Trở về thanh toán'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    )
}

export default Checkout
