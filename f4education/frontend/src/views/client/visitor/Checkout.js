import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
// import Notification from "@mantine/core";
import IconCheck from "@tabler/icons-react";

import logoVnPay from "../../../assets/img/logo-vnpay.png";
import logoMomo from "../../../assets/img/logo-momo.png";
import cartEmptyimage from "../../../assets/img/cart-empty.png";

// API
import paymentApi from "../../../api/paymentApi";
import cartApi from "../../../api/cartApi";
const PUBLIC_IMAGE = "http://localhost:8080/img";

const Checkout = () => {
  // router Variable
  const [listCart] = useState(JSON.parse(localStorage.getItem("cartCheckout")));

  // *************** Action Variable
  const [checkOutMethod, setCheckOutMethod] = useState("vnpay");
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchParams] = useSearchParams();
  const [responseCode, setResponseCode] = useState("");
  const [showNotification, setShowNotification] = useState({
    status: false,
    title: "",
    message: "",
    color: "",
  });

  // *************** FORM Variable
  const [bill, setBill] = useState({
    totalPrice: 0,
    status: "",
    checkoutMethod: "",
  });

  //  *************** Action && Logic UI AREA
  const handleChangeCheckoutMethod = (e) => {
    if (e.id === "vnpay") {
      setCheckOutMethod("vnpay");
      return;
    } else if (e.id === "momo") {
      setCheckOutMethod("momo");
      return;
    }
  };

  const handleCreatePayment = async (checkOutMethod) => {
    if (checkOutMethod === "") {
      alert("Choose checkout method bro!");
      return;
    } else {
      // API direct to VNPay checkout
      try {
        const resp = await paymentApi.createPayment(bill);
        const url = resp.url;
        window.location.href = url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const notifycationAction = (title, message, color) => {
  //   setShowNotification({
  //     status: true,
  //     title: title,
  //     message: message,
  //     color: color,
  //   });
  // };

  // *************** use Effect AREA
  // set Bill for create payment
  useEffect(() => {
    setBill({
      totalPrice: totalPrice,
      checkoutMethod: checkOutMethod,
      status: "",
    });
  }, [totalPrice, checkOutMethod]);

  useEffect(() => {
    setCheckOutMethod(checkOutMethod);
  }, [checkOutMethod]);

  // get total price
  useEffect(() => {
    // get Total Price from list totalCartItem
    let newTotalPrice = 0;
    listCart !== null &&
      listCart.map((item) => (newTotalPrice += item.course.coursePrice));
    setTotalPrice(newTotalPrice);
  }, [listCart]);

  // get and handle response checkout
  useEffect(() => {
    searchParams.get("vnp_ResponseCode");
    setResponseCode(searchParams.get("vnp_ResponseCode"));
  }, [responseCode, searchParams]);

  useEffect(() => {
    if (responseCode !== null) {
      const handleUpdateCartAndCreateBill = () => {
        if (responseCode === "24") {
          // notifycationAction(
          //   "F4 Education thông báo",
          //   "Thanh toán đã được hủy!",
          //   "teal"
          // );
          return console.log("Check out fail, cancle progress");
        }
        if (responseCode === "00") {
          const listCar = JSON.parse(localStorage.getItem("cartCheckout"));
          if (listCar !== null) {
            const updateCartRequest = listCar.map((cart) => ({
              cartId: cart.cartId,
              courseId: cart.course.courseId,
              createDate: cart.createDate,
            }));

            updateCartRequest.map(async (request) => {
              try {
                const resp = await cartApi.updateCart(request, request.cartId);
                console.log(resp);
              } catch (error) {
                console.log(error);
              }
              localStorage.removeItem("cartCheckout");
            });
            // redirect to cart
            // redirect("/cart");
            window.location.href = "/cart";
          }
        } else {
          return console.log("Other Error");
        }
      };
      return handleUpdateCartAndCreateBill();
    } else {
      return console.log(
        "Status normal, user just haven't checkout or stay for fun?"
      );
    }
  }, [responseCode]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setShowNotification({
  //       status: false,
  //       title: "",
  //       message: "",
  //     });
  //   }, 4000);
  //   return () => clearTimeout(timeout);
  // }, [showNotification]);

  return (
    <>
      {/* Title */}
      <h1 className="font-weight-800 text-dark my-5 display-2">Thanh toán</h1>

      {/* content */}
      <div className="mt-5">
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
                  <div className="accordion w-100" id="accordionExample">
                    <div className="card w-100">
                      <div className="card-header w-100" id="headingOne">
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
                              checked
                              className="mr-3"
                              onClick={(e) =>
                                handleChangeCheckoutMethod(e.target)
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
                          Để hoàn tất giao dịch của bạn, chúng tôi sẽ chuyển bạn
                          đến máy chủ bảo mật của <strong>VnPay</strong>.
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header" id="headingTwo">
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
                              id="momo"
                              type="radio"
                              name="checkoutMethod"
                              className="mr-3"
                              onClick={(e) =>
                                handleChangeCheckoutMethod(e.target)
                              }
                            />
                            <label htmlFor="momo">
                              <img
                                src={logoMomo}
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
                        id="collapseTwo"
                        className="collapse"
                        aria-labelledby="headingTwo"
                        data-parent="#accordionExample"
                      >
                        <div className="card-body">
                          Để hoàn tất giao dịch của bạn, chúng tôi sẽ chuyển bạn
                          đến máy chủ bảo mật của <strong>Momo</strong>.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-details mt-5">
                  <h2 className="font-weight-800 text-dark">
                    Chi tiết hóa đơn
                  </h2>
                  {listCart.map((cart) => (
                    <Row>
                      <Col lg="2" xl="2" md="6" sm="6">
                        <img
                          src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
                          width={"100%"}
                          height={"100%"}
                          className="img-fluid"
                          alt={cart.course.courseName}
                        />
                      </Col>
                      <Col lg="8" xl="8" md="12" sm="12">
                        <h4 className="font-weight-800 text-dark">
                          {cart.course.courseName}
                        </h4>
                      </Col>
                      <Col lg="2" xl="2" md="6" sm="6">
                        <h4 className="text-muted">
                          {cart.course.coursePrice.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
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
                className="checkout-summery p-5 shadow"
                style={{ background: "#f7f7f7" }}
              >
                <div>
                  <div className="checkout-sumery-header">
                    <h2 className="font-weight-800 text-dark ">
                      Tổng thanh toán
                    </h2>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Giá gốc:</span>
                      <span className="text-muted">359.999đ</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Giảm giá:</span>
                      <span className="text-muted">0đ</span>
                    </div>
                    <hr />
                    <div className="checkout-sum-total">
                      <div className="d-flex justify-content-between">
                        <h3 className="font-weight-700 text-dark">Tổng:</h3>
                        <h3 className="font-weight-700 text-dark">359.999đ</h3>
                      </div>
                    </div>
                  </div>
                  <div className="check-summery-floating-bottom">
                    <div className="d-flex justify-content-between">
                      <h3 className="font-weight-700 text-dark">Tổng:</h3>
                      <h3 className="font-weight-700 text-dark">359.999đ</h3>
                    </div>

                    <div className="mt-3 text-muted">
                      <span>
                        Bằng việc hoàn tất giao dịch mua, bạn đồng ý với các
                        Điều khoản dịch vụ này.
                      </span>
                      <br />
                      <Link className="w-100">
                        <Button
                          color="primary"
                          className="w-100 mt-2"
                          style={{ borderRadius: "3px" }}
                          onClick={() => handleCreatePayment(checkOutMethod)}
                        >
                          Tiếp tục
                        </Button>
                      </Link>
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

      {/* Notifycation */}
      {/* {showNotification.status && (
        <Notification
          icon={<IconCheck size="1.1rem" />}
          color={showNotification.color}
          title={showNotification.title}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "2023",
            maxWidth: "400px",
          }}
        >
          {showNotification.message}
        </Notification>
      )} */}
    </>
  );
};

export default Checkout;
