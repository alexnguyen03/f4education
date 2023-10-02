import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Loader,
  Image,
  Card,
  Box,
  Flex,
  Group,
  Rating,
  Skeleton,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

// API - declare variable
import cartApi from "../../../api/cartApi";
import courseApi from "../../../api/courseApi";
import cartEmptyimage from "../../../assets/img/cart-empty.png";
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
//     courseId: "1",
//     courseName: "Khóa học ReactJS cho người mới từ 10 năm exp.",
//     courseImage:
//       "https://images.unsplash.com/photo-1695309534427-12bdf0afdd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//     subjectName: "ReactJS",
//     ratings: 4.6,
//     reviews: 100.345,
//     courseDuration: "35h",
//     courseLecture: "10 bài học",
//     coursePrice: 359.135,
//   },
//   {
//     courseId: "2",
//     courseName: " Khóa học Java Spring boot cho người mới từ 10 năm exp.",
//     courseImage:
//       "https://images.unsplash.com/photo-1695075989376-ac0e8549ec8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//     subjectName: "Java Spring boot",
//     ratings: 3.5,
//     reviews: 70.395,
//     courseDuration: "14h",
//     courseLecture: "4 bài học",
//     coursePrice: 839.284,
//   },
// ];

// zalopay vnpay

function Cart() {
  // *************** Main Variable
  const [carts, setCarts] = useState([]);
  const [newestCourse, setNewestCourse] = useState([]);

  // *************** Action Variable
  const [loading, setLoading] = useState(false);

  // *************** Logic UI Variable
  const [totalPrice, setTotalPrice] = useState(0);

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

  const fetchNewsetCourse = async () => {
    try {
      setLoading(true);
      const resp = await courseApi.getNewestCourse();
      setNewestCourse(resp.reverse());
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
    } catch (error) {
      console.log(error);
    }
  };

  // *************** Action && Logic UI
  const handleCheckOut = async () => {
    // store cart to localstorage
    localStorage.setItem("cartCheckout", JSON.stringify(carts));
  };

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
    fetchNewsetCourse();
  }, []);

  const slides = newestCourse.map((course) => (
    <Carousel.Slide key={course.courseId}>
      <Card>
        {loading ? (
          <>
            <Skeleton height={200} radius="sm" mb="sm" />
          </>
        ) : (
          <>
            <Card.Section component="a" href={`/course/${course.courseId}`}>
              <Image
                src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                fit="cover"
                width={"100%"}
                height={200}
                radius="sm"
                alt={`${course.courseName}`}
                withPlaceholder
              />
            </Card.Section>
          </>
        )}

        {loading ? (
          <>
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} radius="xl" />
          </>
        ) : (
          <>
            <Box>
              <Text
                fw={500}
                lineClamp={2}
                component="a"
                href={`/course/${course.courseId}`}
              >
                {course.courseName}
              </Text>
              <Box>
                <Flex justify="flex-start" gap="md">
                  <Text>3.6</Text>
                  <Group position="center">
                    <Rating value={3.56} fractions={2} readOnly />
                  </Group>
                  <Text c="dimmed">(389.208)</Text>
                </Flex>
              </Box>
              <Box>
                <Text fw={500}>
                  {course.coursePrice.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </Box>
            </Box>
          </>
        )}
      </Card>
    </Carousel.Slide>
  ));

  return (
    <>
      {/* BreadCums */}
      <Breadcrumbs className="my-5 p-3" style={{ backgroundColor: "#ebebeb" }}>
        {itemsBreadcum}
      </Breadcrumbs>

      {/* Title */}
      <h1 className="font-weight-700 text-dark my-5 display-2">Giỏ hàng</h1>

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
                <Card.Section className="text-center">
                  <img
                    src={cartEmptyimage}
                    width="40%"
                    height="40%"
                    alt=""
                    className="img-fluid"
                  />
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
                </Card.Section>
              </Card>
            </>
          ) : (
            <>
              <Row>
                <Col xl="9" lg="9" md="12" sm="12">
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
                            <div className="d-flex justify-content-between flex-wrap">
                              <div>
                                <img
                                  src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
                                  // src={cart.course.courseImage}
                                  alt={`${cart.course.courseName}`}
                                  className="img-fluid"
                                  style={{
                                    maxHeight: "100px",
                                    width: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-weight-700 text-dark m-0 p-0">
                                  {cart.course.courseName}
                                </p>
                                <span className="text-muted">
                                  {/* Môn học: <strong>{cart.subjectName}</strong> */}
                                </span>
                                <div className="d-flex text-dark">
                                  <span className="font-weight-600">
                                    {/* {cart.ratings} */}4.6
                                  </span>
                                  <div className="mx-2">
                                    <i className="bx bxs-star text-warning"></i>
                                    <i className="bx bxs-star text-warning"></i>
                                    <i className="bx bxs-star text-warning"></i>
                                    <i className="bx bxs-star text-warning"></i>
                                    <i className="bx bx-star"></i>
                                  </div>
                                  <span className="text-muted">
                                    {/* ({cart.reviews}) */} (39.930)
                                  </span>
                                </div>
                                <div className="d-flex justify-content-start">
                                  <span className="text-muted">
                                    {cart.course.courseDuration}
                                  </span>
                                  <span className="mx-2">-</span>
                                  <span className="text-muted">
                                    {cart.course.numberSession} bài giảng
                                  </span>
                                  <span className="mx-2">-</span>
                                  <span className="text-muted">All Levels</span>
                                </div>
                              </div>
                              <div>
                                <Link
                                  to={`/cart/${cart.cartId}`}
                                  className="text-danger font-weight-700"
                                  onClick={(e) => {
                                    handleRemoveCart(cart.cartId, e);
                                  }}
                                >
                                  Remove
                                </Link>
                              </div>
                              <div className="ml-sm-0 ml-auto">
                                <span className="text-primary font-weight-700">
                                  {cart.course.coursePrice.toLocaleString(
                                    "it-IT",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                            <hr className="text-muted" />
                          </Link>
                        </>
                      ))}
                    </Col>
                  </Row>
                </Col>
                <Col
                  xl="3"
                  lg="3"
                  md="12"
                  sm="12"
                  className="mt-2 cart-summery-floating-bottom w-100"
                >
                  <span className="font-weight-600 text-muted">
                    Tổng thanh toán:
                    <br />
                    <h1 className="font-weight-700">
                      {totalPrice.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h1>
                  </span>
                  <Link to={"/payment/checkout"}>
                    <Button
                      color="primary"
                      className="w-100 mt-2"
                      style={{ borderRadius: "2px" }}
                      onClick={() => handleCheckOut()}
                    >
                      Thanh toán
                    </Button>
                  </Link>
                </Col>
              </Row>
            </>
          )}
        </>
      )}

      <h3 className="font-weight-700 text-dark my-5 display-3">
        Những khóa học mới nhất
      </h3>

      <Carousel
        slideSize="25%"
        height="300px"
        slideGap="lg"
        controlsOffset="xs"
        align="start"
        loop
        dragFree
        slidesToScroll={2}
        styles={{
          control: {
            background: "#212121",
            color: "#fff",
          },
        }}
      >
        {slides}
      </Carousel>
    </>
  );
}

export default Cart;
