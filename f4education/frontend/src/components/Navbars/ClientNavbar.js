import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Col, Row } from "reactstrap";
import logo from "../../assets/img/brand/f4.png";
import cartEmptyimage from "../../assets/img/cart-empty.png";
// reactstrap components

const ClientNavbar = () => {
  const [login, setLogin] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(true);

  const handleLogin = (prev) => {
    setLogin(!prev);
  };

  const handleCartEmpty = (prev) => {
    setCartEmpty(!prev);
  };

  return (
    <nav className="container-xl navbar navbar-expand-lg">
      <Link to={"/"} className="navbar-brand">
        <img src={logo} className="img-fluid" alt="" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="bx bx-menu-alt-right"></i>
      </button>
      <div
        className="collapse navbar-collapse text-dark font-weight-600"
        id="navbarSupportedContent"
      >
        <ul
          className="navbar-nav mx-auto text-center d-md-flex d-sm-flex 
            justify-content-md-center justify-content-sm-center"
        >
          <li className="nav-item">
            <Link to={"/"} className="nav-link custom-nav-link" href="#">
              Trang chủ
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/course"} className="nav-link custom-nav-link " href="#">
              Khóa học
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"#"} className="nav-link custom-nav-link">
              Liên hệ
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/cart"} className="nav-link custom-nav-link">
              Giỏ hàng
            </Link>
          </li>
        </ul>
        <div
          className="d-flex justify-content-between 
              justify-content-md-center justify-content-sm-center text-center text-dark"
        >
          {login ? (
            <>
              <span className="mt-2">
                <i
                  className="bx bx-search bx-rotate-90 font-weight-500"
                  style={{ fontSize: "25px" }}
                ></i>
              </span>
              <Link to="/cart" className="cart mx-5 mt-2">
                <i
                  className="bx bx-cart font-weight-500 text-dark"
                  style={{
                    fontSize: "25px",
                  }}
                ></i>
                <Badge color="rgba(0, 0, 0, 1)" className="header-cart">
                  1
                </Badge>
                <div className="cart-detail">
                  {cartEmpty ? (
                    <>
                      <img
                        src={cartEmptyimage}
                        alt="cart Empty"
                        className="img-fluid"
                        onClick={() => handleCartEmpty(cartEmpty)}
                      />
                      <p
                        className="mx-auto mb-3 text-muted font-weight-600 mx-auto"
                        onClick={() => handleCartEmpty(cartEmpty)}
                      >
                        Giỏ hàng trống.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="container my-2">
                        <Row>
                          <Col xl="12" lg="12" md="12" sm="12">
                            {/* Item */}
                            <Row>
                              <Col xl="4" lg="4" md="4" sm="4">
                                <img
                                  src="https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60"
                                  alt="cart item img"
                                  className="img-fluid"
                                />
                              </Col>
                              <Col
                                xl="8"
                                lg="8"
                                md="8"
                                sm="8"
                                className="d-flex flex-wrap flex-column text-left"
                              >
                                <span className="font-weight-900 text-dark align-items-start">
                                  Khóa học lập trình với ReactJS && Spring boot
                                </span>
                                <span className="text-muted">270.000đ</span>
                              </Col>
                            </Row>
                            <hr className="m-3 p-0 text-muted" />
                            {/* Item */}
                            <Row>
                              <Col xl="4" lg="4" md="4" sm="4">
                                <img
                                  src="https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60"
                                  alt="cart item img"
                                  className="img-fluid"
                                />
                              </Col>
                              <Col
                                xl="8"
                                lg="8"
                                md="8"
                                sm="8"
                                className="d-flex flex-wrap flex-column text-left"
                              >
                                <span className="font-weight-900 text-dark align-items-start">
                                  Khóa học lập trình với ReactJS && Spring boot
                                </span>
                                <span className="text-muted">270.000đ</span>
                              </Col>
                            </Row>
                            <hr className="m-3 p-0 text-muted" />
                            {/* Item */}
                            <Row>
                              <Col xl="4" lg="4" md="4" sm="4">
                                <img
                                  src="https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60"
                                  alt="cart item img"
                                  className="img-fluid"
                                />
                              </Col>
                              <Col
                                xl="8"
                                lg="8"
                                md="8"
                                sm="8"
                                className="d-flex flex-wrap flex-column text-left"
                              >
                                <span className="font-weight-900 text-dark align-items-start">
                                  Khóa học lập trình với ReactJS && Spring boot
                                </span>
                                <span className="text-muted">270.000đ</span>
                              </Col>
                            </Row>
                            <hr className="m-3 p-0 text-muted" />
                            {/* Item */}
                            <Row>
                              <Col xl="4" lg="4" md="4" sm="4">
                                <img
                                  src="https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60"
                                  alt="cart item img"
                                  className="img-fluid"
                                />
                              </Col>
                              <Col
                                xl="8"
                                lg="8"
                                md="8"
                                sm="8"
                                className="d-flex flex-wrap flex-column text-left"
                              >
                                <span className="font-weight-900 text-dark align-items-start">
                                  Khóa học lập trình với ReactJS && Spring boot
                                </span>
                                <span className="text-muted">270.000đ</span>
                              </Col>
                            </Row>
                            <hr className="m-3 p-0 text-muted" />
                            {/* Item */}
                            <Row>
                              <Col xl="4" lg="4" md="4" sm="4">
                                <img
                                  src="https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60"
                                  alt="cart item img"
                                  className="img-fluid"
                                />
                              </Col>
                              <Col
                                xl="8"
                                lg="8"
                                md="8"
                                sm="8"
                                className="d-flex flex-wrap flex-column text-left"
                              >
                                <span className="font-weight-900 text-dark align-items-start">
                                  Khóa học lập trình với ReactJS && Spring boot
                                </span>
                                <span className="text-muted">270.000đ</span>
                              </Col>
                            </Row>
                            <hr className="m-3 p-0 text-muted" />
                          </Col>
                          <Col xl="12" lg="12" md="12" sm="12">
                            <Link
                              to="#"
                              className="mx-auto font-weight-900 text-danger"
                              onClick={() => handleCartEmpty(cartEmpty)}
                            >
                              Clear Cart
                            </Link>
                          </Col>
                          <Col xl="12" lg="12" md="12" sm="12">
                            <p
                              className="m-2 p-0 text-dark font-weight-700 text-left"
                              style={{ fontSize: "20px" }}
                            >
                              <span className="font-weight-500 mr-2 text-muted">
                                THANH TOÁN:
                              </span>
                              <span>1.2000.000d</span>
                            </p>
                            <Button color="dark" className="w-100">
                              Tới giỏ hàng
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </>
                  )}
                </div>
              </Link>
              <span className="mt-2">
                <i
                  className="bx bx-user font-weight-500"
                  style={{ fontSize: "25px" }}
                ></i>
              </span>
            </>
          ) : (
            <>
              <Button color="dark" outline onClick={() => handleLogin(login)}>
                Đăng nhập
              </Button>
              <Button color="dark" onClick={() => handleLogin(login)}>
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
