import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import logoPayPal from "../../../assets/img/logo-paypal.png";
import logoVnPay from "../../../assets/img/logo-vnpay.png";
import { Breadcrumbs, Anchor, Text } from "@mantine/core";

const itemsBreadcum = [
  { title: "Trang chủ", href: "/" },
  { title: "Giỏ hàng", href: "/cart" },
].map((item, index) => (
  <Anchor href={item.href} key={index} color="dimmed">
    <Text fs="italic">{item.title}</Text>
  </Anchor>
));

const cartItem = [
  {
    id: "1",
    courseName: "Khóa học ReactJS cho người mới từ 10 năm exp.",
    courseImage:
      "https://images.unsplash.com/photo-1695309534427-12bdf0afdd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    subjectName: "ReactJS",
    ratings: 4.6,
    reviews: 100.0,
    courseDuration: "35h",
    courseLecture: "10 bài học",
    coursePrice: 359.0,
  },
  {
    id: "1",
    courseName: " Khóa học Java Spring boot cho người mới từ 10 năm exp.",
    courseImage:
      "https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    subjectName: "Java Spring boot",
    ratings: 3.5,
    reviews: 70.0,
    courseDuration: "14h",
    courseLecture: "4 bài học",
    coursePrice: 839.0,
  },
];

function Cart() {
  const [totalItem, setTotalItem] = useState(cartItem);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkOutMethod, setCheckOutMethod] = useState("");

  const handleCheckOut = (checkOutMethod) => {
    if (checkOutMethod === "") {
      alert("Choose checkout method bro!");
    }
  };

  useEffect(() => {
    setCheckOutMethod(checkOutMethod);
  }, [checkOutMethod]);

  return (
    <>
      <Breadcrumbs className="my-5 p-3" style={{ backgroundColor: "#ebebeb" }}>
        {itemsBreadcum}
      </Breadcrumbs>
      <h1 className="font-weight-600 text-dark my-3 display-2">Giỏ hàng</h1>
      <Row>
        <Col xl="8" lg="8" md="7" sm="12">
          <h2 className="font-weight-600 text-dark">
            {totalItem.length} khóa học trong giỏ hàng
          </h2>
          <hr className="text-muted mt-0 pt-0" />
          <Row className="cart-item">
            <Col lg="12" xl="12" md="12" sm="12">
              {/* item */}
              {totalItem.map((item, index) => (
                <>
                  <Link to={"/course"} key={index}>
                    <Row>
                      <Col lg="3" xl="3" md="3" sm="3">
                        <img
                          src={item.courseImage}
                          alt="cart img"
                          className="img-fluid"
                        />
                      </Col>
                      <Col lg="5" xl="5" md="5" sm="5">
                        <p className="font-weight-700 text-dark m-0 p-0">
                          {item.courseName}
                        </p>
                        <span className="text-muted">
                          Môn học: <strong>{item.subjectName}</strong>
                        </span>
                        <div className="d-flex text-dark">
                          <span className="font-weight-600">
                            {item.ratings}
                          </span>
                          <div className="mx-2">
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bx-star"></i>
                          </div>
                          <span className="text-muted">({item.reviews})</span>
                        </div>
                        <div className="d-flex justify-content-start">
                          <span className="text-muted">
                            {item.courseDuration}
                          </span>
                          <span className="mx-2">-</span>
                          <span className="text-muted">
                            {item.courseLecture}
                          </span>
                        </div>
                      </Col>
                      <Col lg="2" xl="2" md="2" sm="2">
                        <span className="text-primary font-weight-700">
                          Remove
                        </span>
                      </Col>
                      <Col lg="2" xl="2" md="2" sm="2">
                        <span className="text-primary font-weight-700">
                          {item.coursePrice}
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
            <span className="font-weight-600 display-4 ml-2">1.259.000đ</span>
          </h2>
          <h4 className="text-muted">Vui lòng chọn hình thức thanh toán:</h4>
          <div className="d-flex justify-content-between">
            {checkOutMethod === "paypal" ? (
              <>
                <Button
                  color="secondary"
                  outline
                  active
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
  );
}

export default Cart;
