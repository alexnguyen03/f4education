import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Col, Row } from "reactstrap";
import logo from "../../assets/img/brand/f4.png";
import cartEmptyimage from "../../assets/img/cart-empty.png";
// reactstrap components

// API
import cartApi from "../../api/cartApi";
const PUBLIC_IMAGE = "http://localhost:8080/img";

const ClientNavbar = () => {
  const [login, setLogin] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [activeItems, setActiveItems] = useState([true, false, false]);

  // *************** CART VARIABLE - AREA START
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const resp = await cartApi.getAllCart();
      setCarts(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get Total Price from list totalCartItem
    let newTotalPrice = 0;
    carts.map((item) => (newTotalPrice += item.course.coursePrice));
    setTotalPrice(newTotalPrice);
  }, [carts]);

  useEffect(() => {
    fetchCart();
  }, []);

  // *************** CART VARIABLE - AREA END

  const handleItemClick = (index) => {
    const newActiveItems = [...activeItems];
    newActiveItems[index] = true; // toggle clicked item to active
    for (let i = 0; i < newActiveItems.length; i++) {
      if (i !== index) {
        newActiveItems[i] = false; // remove active class from other items
      }
    }
    setActiveItems(newActiveItems); // update state
  };

  const handleLogin = (prev) => {
    setLogin(!prev);
  };

  const handleCartEmpty = (prev) => {
    setCartEmpty(!prev);
  };

  window.addEventListener("scroll", function () {
    const navbar = this.document.querySelector("#navbar");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) {
      navbar.style.top = "0";
    }
    if (scrollTop > lastScrollTop) {
      navbar.style.top = "-80px";
    } else {
      navbar.style.top = "0";
    }
    setLastScrollTop(scrollTop);
  });

  return (
    <nav className="navbar navbar-expand-lg" id="navbar">
      <div className="container-xl">
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
              <Link
                to={"/"}
                className={
                  activeItems[0]
                    ? "nav-link custom-nav-link active"
                    : "nav-link custom-nav-link"
                }
                onClick={() => handleItemClick(0)}
              >
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={"/course"}
                className={
                  activeItems[1]
                    ? "nav-link custom-nav-link active"
                    : "nav-link custom-nav-link"
                }
                onClick={() => handleItemClick(1)}
              >
                Khóa học
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={"/cart"}
                className={
                  activeItems[2]
                    ? "nav-link custom-nav-link active"
                    : "nav-link custom-nav-link"
                }
                onClick={() => handleItemClick(2)}
              >
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
                <Link to="/cart" className="cart mx-4 mt-2">
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
                    {carts.length === 0 ? (
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
                        <div className="container cart-content-overflow my-2">
                          <Row>
                            <Col xl="12" lg="12" md="12" sm="12">
                              {carts.map((cart) => (
                                <>
                                  <Row className="mt-2">
                                    <Col xl="4" lg="4" md="4" sm="4">
                                      <img
                                        src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
                                        alt="cart item img"
                                        className="img-fluid"
                                        style={{
                                          maxHeight: "70px",
                                          width: "100%",
                                          objectFit: "cover",
                                        }}
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
                                        {cart.course.courseName}
                                      </span>
                                      <span className="text-muted">
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
                                  <hr className="m-3 p-0 text-muted" />
                                </>
                              ))}
                            </Col>
                          </Row>
                        </div>
                        <div className="container cart-footer w-100">
                          <p
                            className="m-2 p-0 text-dark font-weight-700 text-left"
                            style={{ fontSize: "20px" }}
                          >
                            <span
                              className="font-weight-500 mr-2 text-muted"
                              style={{ fontSize: "17px" }}
                            >
                              THANH TOÁN:
                            </span>
                            <span>
                              {totalPrice.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </p>
                          <Link to={"/cart"} className="w-100">
                            <Button
                              color="dark"
                              className="w-100 mb-3 font-weight-700"
                              style={{ borderRadius: "3px" }}
                            >
                              Tới giỏ hàng
                            </Button>
                          </Link>
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
                <Button
                  color="dark"
                  outline
                  className="font-weight-800"
                  onClick={() => handleLogin(login)}
                  style={{ borderRadius: "2px" }}
                >
                  Đăng nhập
                </Button>
                {/* <Button color="dark" onClick={() => handleLogin(login)}>
                Đăng ký
              </Button> */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
