import React, { useEffect, useState } from "react";
import { Link, redirect, useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import logoPayPal from "../../../assets/img/logo-paypal.png";
import logoVnPay from "../../../assets/img/logo-vnpay.png";
import { Breadcrumbs, Anchor, Text, Loader } from "@mantine/core";
import cartEmptyimage from "../../../assets/img/cart-empty.png";
// import notifications from "@mantine/notifications";

// API
import cartApi from "../../../api/cartApi";
import paymentApi from "../../../api/paymentApi";
const PUBLIC_IMAGE = "http://localhost:8080/img";

const itemsBreadcum = [
  { title: "Trang chủ", href: "/" },
  { title: "Giỏ hàng", href: "/cart" },
].map((item, index) => (
  <Anchor href={item.href} key={index} color="dimmed">
    <Text fs="italic">{item.title}</Text>
  </Anchor>
));

// const cartItem = [
//   {
//     id: "1",
//     courseName: "Khóa học ReactJS cho người mới từ 10 năm exp.",
//     courseImage:
//       "https://images.unsplash.com/photo-1695309534427-12bdf0afdd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//     subjectName: "ReactJS",
//     ratings: 4.6,
//     reviews: 100.0,
//     courseDuration: "35h",
//     courseLecture: "10 bài học",
//     coursePrice: 359.135,
//   },
//   {
//     id: "1",
//     courseName: " Khóa học Java Spring boot cho người mới từ 10 năm exp.",
//     courseImage:
//       "https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//     subjectName: "Java Spring boot",
//     ratings: 3.5,
//     reviews: 70.0,
//     courseDuration: "14h",
//     courseLecture: "4 bài học",
//     coursePrice: 839.284,
//   },
// ];

// zalopay vnpay
function Cart() {
  // *************** Main Variable
  const [carts, setCarts] = useState([]);

  // *************** Action Variable
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [responseCode, setResponseCode] = useState("");

  useEffect(() => {
    searchParams.get("vnp_ResponseCode");
    setResponseCode(responseCode);
  }, [responseCode, searchParams]);

  // *************** FORM Variable
  const [bill, setBill] = useState({
    totalPrice: 0,
    status: "",
    checkoutMethod: "",
  });

  // *************** Logic UI Variable
  // const [totalCartItem, setTotalCartItem] = useState(cartItem);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkOutMethod, setCheckOutMethod] = useState("");

  // *************** Fetch Area
  const fetchCart = async () => {
    try {
      setLoading(true);
      const resp = await cartApi.getAllCart();
      setCarts(resp);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // *************** Fetch Area > CRUD
  const handleRemoveCart = async (cartId, e) => {
    e.preventDefault();
    try {
      const resp = await cartApi.removeCart(cartId);
      setCarts(resp);
      console.log("remove successfully");
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // *************** Action && Logic UI
  const handleCheckOut = async (checkOutMethod) => {
    if (checkOutMethod === "") {
      alert("Choose checkout method bro!");
      return;
    } else {
      setBill({
        totalPrice: totalPrice,
        checkoutMethod: checkOutMethod,
        status: "Chờ thanh toán",
      });

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

  const handleUpdateCartAndCreateBill = async () => {
    if (responseCode === null) {
      return;
    }
    if (responseCode === 24) {
      return;
    } else {
      try {
        const resp = await cartApi.updateCart(bill);
      } catch (error) {
        
      }
    }
  };

  useEffect(() => {
    setBill({
      totalPrice: totalPrice,
      checkoutMethod: checkOutMethod,
      status: "Chờ thanh toán",
    });
  }, [totalPrice, checkOutMethod]);

  useEffect(() => {
    setCheckOutMethod(checkOutMethod);
  }, [checkOutMethod]);

  useEffect(() => {
    // get Total Price from list totalCartItem
    let newTotalPrice = 0;
    carts.length > 0 &&
      carts.map((item) => (newTotalPrice += item.course.coursePrice));
    setTotalPrice(newTotalPrice);
  }, [carts, loading]);

  // *************** Use Effect AREA
  useEffect(() => {
    fetchCart();
  }, []);

  // Checkout -> save data to localStorage(List cartID, billResDTO Data) -> create_payment (VNPAY) -> payment...
  // save data to localStorage (listCartID)
  // After payment -> redirect prev page -> check responseCode
  // If response code === 00 ? update cart , add bill : dont do anything stupid

  return (
    <>
      {/* BreadCums */}
      <Breadcrumbs className="my-5 p-3" style={{ backgroundColor: "#ebebeb" }}>
        {itemsBreadcum}
      </Breadcrumbs>

      {/* Title */}
      <h1 className="font-weight-800 text-dark my-3 display-2">Giỏ hàng</h1>

      {/* Loading */}
      {loading ? (
        <h1 className="display-1 text-center mt-5">
          <Loader color="rgba(46, 46, 46, 1)" size={50} />
        </h1>
      ) : (
        <>
          {carts.length === 0 ? (
            <>
              <Card className="w-100 shadow-lg">
                <CardBody className="text-center">
                  <img src={cartEmptyimage} width="40%" height="40%" alt="" />
                  <h1 className="font-weight-800">
                    Giỏ hàng của bạn trống. <br />
                    Tiếp tục mua sắm để tìm một khóa học ưng ý!
                  </h1>
                  <Link to={"/course"}>
                    <Button
                      color="primary"
                      className="font-weight-800"
                      style={{ borderRadius: "2px", fontSize: "20px" }}
                    >
                      Tìm Khóa học
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </>
          ) : (
            <>
              <Row>
                <Col xl="8" lg="8" md="7" sm="12">
                  <h3 className="font-weight-600 text-dark">
                    {carts.length} khóa học trong giỏ hàng
                  </h3>
                  <hr className="text-muted mt-0 pt-0" />
                  <Row className="cart-item">
                    <Col lg="12" xl="12" md="12" sm="12">
                      {/* item */}
                      {carts.map((cart, index) => (
                        <>
                          <Link
                            to={`/course/${cart.course.courseId}`}
                            key={index}
                          >
                            <Row>
                              <Col lg="3" xl="3" md="4" sm="4">
                                <img
                                  src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
                                  alt={`${cart.course.courseName}`}
                                  className="img-fluid"
                                  style={{
                                    maxHeight: "100px",
                                    width: "100%",
                                    objectFit: "contain",
                                  }}
                                  // style={{ borderRadius: "3px" }}
                                />
                              </Col>
                              <Col lg="5" xl="5" md="8" sm="8">
                                <p className="font-weight-700 text-dark m-0 p-0">
                                  {cart.course.courseName}
                                </p>
                                <span className="text-muted">
                                  {/* Môn học: <strong>{cart.subjectName}</strong> */}
                                </span>
                                <div className="d-flex text-dark">
                                  {/* <span className="font-weight-600">
                            {cart.ratings}
                          </span> */}
                                  {/* <div className="mx-2">
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bx-star"></i>
                          </div> */}
                                  {/* <span className="text-muted">({cart.reviews})</span> */}
                                </div>
                                <div className="d-flex justify-content-start">
                                  <span className="text-muted">
                                    {cart.course.courseDuration}h
                                  </span>
                                  <span className="mx-2">-</span>
                                  <span className="text-muted">
                                    {cart.course.numberSession} bài giảng
                                  </span>
                                </div>
                              </Col>
                              <Col
                                lg="2"
                                xl="2"
                                md="6"
                                sm="6"
                                className="mt-md-2 mt-sm-2"
                              >
                                <Link
                                  to={`/cart/${cart.cartId}`}
                                  className="text-danger font-weight-700"
                                  onClick={(e) => {
                                    handleRemoveCart(cart.cartId, e);
                                    redirect(`/course`);
                                  }}
                                >
                                  Remove
                                </Link>
                              </Col>
                              <Col
                                lg="2"
                                xl="2"
                                md="6"
                                sm="6"
                                className="mt-md-2 mt-sm-2"
                              >
                                <span className="text-primary font-weight-700">
                                  {cart.course.coursePrice.toLocaleString(
                                    "it-IT",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}
                                </span>
                              </Col>
                            </Row>
                            <hr className="text-muted" />
                          </Link>
                        </>
                      ))}
                    </Col>
                  </Row>
                </Col>
                <Col xl="4" lg="4" md="5" sm="12" className="mt-2">
                  <h2 className="font-weight-600">
                    Tổng thanh toán:
                    <span className="font-weight-700 ml-2">
                      {totalPrice.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </h2>
                  <h4 className="text-muted">
                    Vui lòng chọn hình thức thanh toán:
                  </h4>
                  <div className="d-flex justify-content-between">
                    {checkOutMethod === "paypal" ? (
                      <>
                        <Button
                          color="secondary"
                          outline
                          active
                          className="shadow-lg"
                          onClick={() => setCheckOutMethod("")}
                        >
                          <img
                            src={logoPayPal}
                            width="200px"
                            height="50px"
                            className="img-fluid"
                            alt="logo paypal"
                          />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="secondary"
                          outline
                          onClick={() => setCheckOutMethod("paypal")}
                        >
                          <img
                            src={logoPayPal}
                            width="200px"
                            height="50px"
                            className="img-fluid"
                            alt="logo paypal"
                          />
                        </Button>
                      </>
                    )}
                    {checkOutMethod === "vnpay" ? (
                      <>
                        <Button
                          color="secondary"
                          outline
                          active
                          className="shadow-lg"
                          onClick={() => setCheckOutMethod("")}
                        >
                          <img
                            src={logoVnPay}
                            width="200px"
                            height="50px"
                            className="img-fluid"
                            alt="logo vnpay"
                          />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="secondary"
                          outline
                          onClick={() => setCheckOutMethod("vnpay")}
                        >
                          <img
                            src={logoVnPay}
                            width="200px"
                            height="50px"
                            className="img-fluid"
                            alt="logo vnpay"
                          />
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    color="primary"
                    className="w-100 mt-5"
                    onClick={() => handleCheckOut(checkOutMethod)}
                  >
                    Thanh toán
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Cart;
