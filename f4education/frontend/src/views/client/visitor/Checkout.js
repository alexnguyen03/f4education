import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import logoVnPay from "../../../assets/img/logo-vnpay.png";
import logoMomo from "../../../assets/img/logo-momo.png";
 
const Checkout = () => {
  return (
    <>
      {/* Title */}
      <h1 className="font-weight-800 text-dark my-5 display-2">Thanh toán</h1>

      {/* content */}
      <div className="mt-5">
        <Row>
          <Col xl={8} lg={8} md={12} sm={12} className="p-5">
            <div className="d-flex justify-content-between">
              <h2 className="font-weight-800 text-dark ">
                Hình thức thanh toán
              </h2>
            </div>
            <div className="d-flex">
              <div class="accordion w-100" id="accordionExample">
                <div class="card w-100">
                  <div class="card-header w-100" id="headingOne">
                    <h2 class="mb-0">
                      <button
                        class="btn btn-link btn-block text-left"
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
                          className="mr-3"
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
                    class="collapse"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <div class="card-body">
                      Để hoàn tất giao dịch của bạn, chúng tôi sẽ chuyển bạn đến
                      máy chủ bảo mật của PayPal.
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header" id="headingTwo">
                    <h2 class="mb-0">
                      <button
                        class="btn btn-link btn-block text-left collapsed"
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
                    class="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionExample"
                  >
                    <div class="card-body">
                      Để hoàn tất giao dịch của bạn, chúng tôi sẽ chuyển bạn đến
                      máy chủ bảo mật của Momo.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-details mt-5">
              <h2 className="font-weight-800 text-dark">Chi tiết hóa đơn</h2>
              <Row>
                <Col lg="2" xl="2" md="2" sm="2">
                  <img
                    src="https://images.unsplash.com/photo-1695309534427-12bdf0afdd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                    width={"100%"}
                    height={"100%"}
                    alt=""
                  />
                </Col>
                <Col lg="8" xl="8" md="8" sm="8">
                  <h4 className="font-weight-800 text-dark">
                    The completed ReactJS programing course: Beginer to advance
                  </h4>
                </Col>
                <Col lg="2" xl="2" md="2" sm="2">
                  <h4 className="text-muted">359.000đ</h4>
                </Col>
              </Row>
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
                <h2 className="font-weight-800 text-dark ">Tổng thanh toán</h2>
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
                    Bằng việc hoàn tất giao dịch mua, bạn đồng ý với các Điều
                    khoản dịch vụ này.
                  </span>
                  <br />
                  <Link className="w-100">
                    <Button
                      color="primary"
                      className="w-100 mt-2"
                      style={{ borderRadius: "3px" }}
                    >
                      Tiếp tục
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Checkout;
