import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Loader,
  Button,
  Image,
  Card,
  Box,
  Flex,
  Group,
  Rating,
  Skeleton,
  Checkbox,
  HoverCard,
  Grid,
  Title,
  rem,
  getStylesRef,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

// Icon
import { IconShoppingCartPlus } from "@tabler/icons-react";

// API - declare variable
import cartApi from "../../../api/cartApi";
import courseApi from "../../../api/courseApi";
import cartEmptyimage from "../../../assets/img/cart-empty.png";

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL;

const itemsBreadcum = [
  { title: "Trang chủ", href: "/" },
  { title: "Giỏ hàng", href: "/cart" },
].map((item, index) => (
  <Anchor href={item.href} key={index} color="dimmed">
    <Text fs="italic">{item.title}</Text>
  </Anchor>
));

function Cart() {
  // *************** Main Variable
  const [carts, setCarts] = useState([]);
  const [newestCourse, setNewestCourse] = useState([]);

  // *************** Action Variable
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCart, setSelectedCart] = useState({
    cartId: "",
    course: "",
  });

  // *************** Logic UI Variable
  const [totalPrice, setTotalPrice] = useState(0);
  let navigate = useNavigate();

  // *************** Fetch Area
  const fetchCart = async () => {
    try {
      setLoading(true);
      const resp = await cartApi.getAllCart();

      if (resp.status === 200 && resp.data.length > 0) {
        setCarts(resp.data);
      } else {
        console.log("Loi fetch cart ba con oi");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNewsetCourse = async () => {
    try {
      setLoading(true);
      const resp = await courseApi.getNewestCourse();

      if (resp.status === 200 && resp.data.length > 0) {
        setNewestCourse(resp.data);
      } else {
        console.log("loi fetch newestcourse ba con oi");
      }

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
      // setCarts(resp);
      fetchCart();
      console.log("remove successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // *************** Action && Logic UI
  const handleCheckOut = async () => {
    if (selectedItem === null) {
      alert("Chon khoa hoc di ban ei, 1 khoa thoi");
      return;
    }
    // store cart to localstorage
    else {
      localStorage.setItem("cartCheckout", JSON.stringify(selectedCart));
      return navigate("/payment/checkout");
    }
  };

  const handleAddCart = async (course) => {
    const cart = {
      courseId: course.courseId,
      studentId: 1,
    };
    try {
      const resp = await cartApi.createCart(cart);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
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

  const slides = newestCourse.map((course, index) => (
    <Carousel.Slide
      key={index}
      style={{
        overflow: "visible",
      }}
    >
      <HoverCard width={270} shadow="md" position="bottom">
        {/* Target Hover */}
        <Card className="card-hover-overlay">
          {loading ? (
            <>
              <Skeleton height={200} radius="sm" mb="sm" />
            </>
          ) : (
            <>
              <HoverCard.Target>
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
              </HoverCard.Target>
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

        {/* Value hover */}
        <HoverCard.Dropdown>
          <Button
            color="grape"
            variant="light"
            onClick={() => handleAddCart(course)}
            leftIcon={<IconShoppingCartPlus size="1rem" />}
          >
            Thêm vào giỏ hàng
          </Button>
          <Text c="dimmed">
            Giá khóa học:
            <Text fw="500">
              {course.coursePrice.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Carousel.Slide>
  ));

  const handleCheckboxChange = (cartId) => {
    if (selectedItem === cartId) {
      setSelectedItem(null);
    } else if (selectedItem !== null) {
      alert("error choose just 1 course at time");
      return console.log("Chỉ được chọn duy nhất 1 khóa học");
    } else {
      setSelectedItem(cartId);
    }
  };

  useEffect(() => {
    const cartCheckout = carts
      .filter((cart) => cart.cartId === selectedItem)
      .map((cart) => ({
        cartId: cart.cartId,
        course: cart.course,
      }));
    setSelectedCart(cartCheckout);
  }, [selectedItem]);

  return (
    <>
      {/* BreadCums */}
      <Breadcrumbs className="my-5 p-3" style={{ backgroundColor: "#ebebeb" }}>
        {itemsBreadcum}
      </Breadcrumbs>

      {/* Title */}
      <Title order={1} color="dark" fw={700}>
        Giỏ hàng
      </Title>

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
                  <h3 className="font-weight-800">
                    Giỏ hàng của bạn trống. <br />
                    Tiếp tục mua sắm để tìm một khóa học ưng ý!
                  </h3>
                  <Link to={"/course"}>
                    <Button
                      color="violet"
                      size={"lg"}
                      className="font-weight-800 mb-5 mt-2"
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
              <Grid mt={rem("1rem")}>
                <Grid.Col xl="9" lg="9" md="12" sm="12">
                  <h5 className="font-weight-600 text-dark">
                    {carts.length} khóa học trong giỏ hàng
                  </h5>
                  <hr className="text-muted mt-0 pt-0" />

                  {/* item */}
                  {carts.length > 0 &&
                    carts.map((cart, index) => (
                      <>
                        <Grid key={index}>
                          <Grid.Col span={2}>
                            <Link Link to={`/course/${cart.course.courseId}`}>
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
                            </Link>
                          </Grid.Col>
                          <Grid.Col span={10}>
                            <Grid>
                              <Grid.Col xl="6" lg="6" md="12" sm="12">
                                <Link
                                  Link
                                  to={`/course/${cart.course.courseId}`}
                                  key={index}
                                >
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
                                    <span className="text-muted">
                                      All Levels
                                    </span>
                                  </div>
                                </Link>
                              </Grid.Col>
                              <Grid.Col xl="2" lg="2" md="4" sm="6">
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
                              </Grid.Col>
                              <Grid.Col xl="2" lg="2" md="4" sm="6">
                                <div>
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
                              </Grid.Col>
                              <Grid.Col xl="2" lg="2" md="4" sm="12">
                                <div className="d-flex justify-content-sm-end justify-content-md-end">
                                  <Checkbox
                                    // label="I agree to sell my privacy"
                                    color="violet"
                                    checked={selectedItem === cart.cartId}
                                    onChange={() =>
                                      handleCheckboxChange(cart.cartId)
                                    }
                                  />
                                </div>
                              </Grid.Col>
                            </Grid>
                            <hr className="text-muted" />
                          </Grid.Col>
                        </Grid>
                      </>
                    ))}
                </Grid.Col>
                <Grid.Col
                  xl="3"
                  lg="3"
                  md="12"
                  sm="12"
                  className="mt-2 cart-summery-floating-bottom w-100"
                >
                  <span className="font-weight-600 text-muted">
                    Tổng tiền:
                    <br />
                    <h3 className="font-weight-700">
                      {totalPrice.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h3>
                  </span>
                  {/* <Link to={"/payment/checkout"} className="mt-2 mb-4"> */}
                  <Button
                    color="violet"
                    uppercase
                    size="md"
                    className="w-100"
                    style={{ borderRadius: "2px" }}
                    disabled={carts.length === 0}
                    onClick={() => handleCheckOut()}
                  >
                    Thanh toán
                  </Button>
                </Grid.Col>
              </Grid>
            </>
          )}
        </>
      )}

      {/* Newest Course */}
      <Title order={2} color="dark" fw={700} mt={rem("3rem")}>
        Những khóa học mới nhất
      </Title>

      {/* Mantine Carousel */}
      <Carousel
        slideSize="20%"
        height="350px"
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
            fontSize: rem(25),
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
            ref: getStylesRef("controls"),
            transition: "opacity 150ms ease",
            opacity: 0,
          },
          root: {
            "&:hover": {
              [`& .${getStylesRef("controls")}`]: {
                opacity: 1,
              },
            },
          },
        }}
      >
        {slides}
      </Carousel>
    </>
  );
}

export default Cart;
