import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
    Grid,
    Title,
    rem,
    getStylesRef,
    Container,
    ActionIcon
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'

// Icon
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../../utils/Notify'

// API - declare variable
import courseApi from '../../../api/courseApi'
import cartEmptyimage from '../../../assets/img/cart-empty.png'
import cartStyle from '../../../assets/scss/custom-module-scss/client-custom/cart/cart.module.scss'
import { IconTrash } from '@tabler/icons-react'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const itemsBreadcum = [
    { title: 'Trang chủ', href: '/' },
    { title: 'Giỏ hàng', href: '/cart' }
].map((item, index) => (
    <Anchor href={item.href} key={index} color="dimmed">
        <Text fs="italic">{item.title}</Text>
    </Anchor>
))

function Cart() {
    const user = JSON.parse(localStorage.getItem('user'))
    const listCart = JSON.parse(localStorage.getItem('userCart')) || []

    // *************** Main Variable
    const [carts, setCarts] = useState([])
    const [newestCourse, setNewestCourse] = useState([])

    // *************** Action Variable
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [selectedCart, setSelectedCart] = useState({
        course: ''
    })

    // *************** Logic UI Variable
    const [totalPrice, setTotalPrice] = useState(0)
    let navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // *************** Fetch Area
    const fetchCart = async () => {
        setLoading(true)

        try {
            const userCart = JSON.parse(localStorage.getItem('userCart')) || []
            console.log(userCart)
            setCarts(userCart)

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNewsetCourse = async () => {
        setLoading(true)

        try {
            const resp = await courseApi.getNewestCourse(
                user !== null ? user.username : 'nouser'
            )

            if (resp.status === 200 && resp.data.length > 0) {
                setNewestCourse(resp.data)
                console.log(resp.data)
            } else {
                console.log('loi fetch newestcourse ba con oi')
            }

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    // *************** Fetch Area > CRUD
    const handleRemoveCart = async (courseId, e) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        e.preventDefault()
        try {
            const updateCarts = [...carts]
            const indexToDelete = updateCarts.findIndex(
                (cart) => cart.course.courseId === courseId
            )
            if (indexToDelete !== -1) {
                updateCarts.splice(indexToDelete, 1)
            }

            setCarts(updateCarts)

            const userCart = JSON.parse(localStorage.getItem('userCart')) || []

            if (userCart !== null) {
                const indexToDelete = userCart.findIndex(
                    (cart) => cart.course.courseId === courseId
                )

                if (indexToDelete !== -1) {
                    userCart.splice(indexToDelete, 1)
                    localStorage.setItem('userCart', JSON.stringify(userCart))
                }
            }

            console.log(userCart)

            toast.update(id, Notify.options.deleteSuccess())
            console.log('remove successfully')
        } catch (error) {
            console.log(error)
            toast.update(id, Notify.options.deleteError())
        }
    }

    // *************** Action && Logic UI
    const handleCheckOut = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

        if (user === null) {
            toast.update(
                id,
                Notify.options.createErrorParam(
                    'Vui lòng đăng nhập trước khi thanh toán'
                )
            )
            return
        }

        if (selectedItem === null) {
            toast.update(
                id,
                Notify.options.createErrorParam(
                    'Vui lòng chọn một khóa học để thanh toán'
                )
            )
            return
        } else {
            // store cart to localstorage
            localStorage.setItem('cartCheckout', JSON.stringify(selectedCart))
            return navigate('/payment/checkout')
        }
    }

    // CART - CHECK OUT
    const handleAddCart = (course, e) => {
        e.preventDefault()
        return new Promise((resolve, reject) => {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                const userCart =
                    JSON.parse(localStorage.getItem('userCart')) || []

                const cart = {
                    course: course
                }

                let currentCart = []

                const cartExists = userCart.some(
                    (userCartMap) =>
                        userCartMap.course.courseId === course.courseId
                )

                if (!cartExists) {
                    userCart.push(cart)
                    localStorage.setItem('userCart', JSON.stringify(userCart))
                    currentCart = [cart]
                } else {
                    const prevCart = userCart.filter(
                        (userCartMap) =>
                            userCartMap.course.courseId === course.courseId
                    )
                    currentCart = prevCart
                }

                toast.update(
                    id,
                    Notify.options.createSuccessParam(
                        'Thêm vào giỏ hàng thành công'
                    )
                )

                fetchCart()
                resolve(currentCart)
            } catch (error) {
                toast.update(id, Notify.options.createError())
                console.log(error)
                reject(error)
            }
        })
    }

    const handleCheckOutNow = async (course, e) => {
        e.preventDefault()
        const id = toast(Notify.msg.loading, Notify.options.loading())

        if (user === null) {
            toast.update(
                id,
                Notify.options.createErrorParam(
                    'Vui lòng đăng nhập trước khi thanh toán'
                )
            )
            return
        }

        try {
            const selectedCart = await handleAddCart(course, e)

            // store cart to localstorage
            localStorage.setItem('cartCheckout', JSON.stringify(selectedCart))
            return navigate('/payment/checkout')
        } catch (error) {
            toast.update(id, Notify.options.createError())
            console.log(error)
        }
    }

    const navigateToStudent = (e) => {
        e.preventDefault()
        navigate('/student/classes')
    }

    useEffect(() => {
        // get Total Price from list totalCartItem
        let newTotalPrice = 0
        carts.length > 0 &&
            carts.forEach((item) => (newTotalPrice += item.course.coursePrice))
        setTotalPrice(newTotalPrice)
    }, [carts, loading])

    // *************** Use Effect AREA
    useEffect(() => {
        fetchCart()
        fetchNewsetCourse()
    }, [])

    const slides = newestCourse.map((course, index) => (
        <Carousel.Slide key={index}>
            <Card className={`${cartStyle['card-hover-overlay']}`}>
                {loading ? (
                    <>
                        <Skeleton height={200} radius="sm" mb="sm" />
                    </>
                ) : (
                    <>
                        <Card.Section>
                            <Image
                                src={`${PUBLIC_IMAGE}/avatars/courses/${course.image}`}
                                fit="cover"
                                width="100%"
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
                            <Text color="dark" fw={500} lineClamp={1}>
                                {course.courseName}
                            </Text>
                            <Box>
                                <Flex justify="flex-start" gap="md">
                                    <Text>
                                        {course.rating === 'NaN'
                                            ? 5
                                            : course.rating}
                                    </Text>
                                    <Group position="center">
                                        <Rating
                                            value={
                                                course.rating === 'NaN'
                                                    ? 5
                                                    : course.rating
                                            }
                                            fractions={2}
                                            readOnly
                                        />
                                    </Group>
                                    <Text c="dimmed">
                                        ({course.reviewNumber})
                                    </Text>
                                </Flex>
                            </Box>
                            <Box>
                                <Text fw={500}>
                                    {course.coursePrice.toLocaleString(
                                        'it-IT',
                                        {
                                            style: 'currency',
                                            currency: 'VND'
                                        }
                                    )}
                                </Text>
                            </Box>
                        </Box>
                    </>
                )}

                {/* Overlay đây nha */}
                <Link to={`/course/${course.courseId}`}>
                    <Box className={cartStyle.overlay}>
                        {course.isPurchase ? (
                            <>
                                <Button
                                    color="violet"
                                    fullWidth
                                    onClick={(e) => navigateToStudent(e)}
                                    style={{ zIndex: 1000 }}
                                >
                                    <Text color="#fff" size="md">
                                        Đã đăng ký khóa học
                                    </Text>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="violet"
                                    fullWidth
                                    onClick={(e) => handleAddCart(course, e)}
                                >
                                    <Text color="#fff" size="md">
                                        Thêm vào giỏ hàng
                                    </Text>
                                </Button>
                                <Button
                                    bg={'transparent'}
                                    fullWidth
                                    styles={{
                                        root: {
                                            outline: '1px solid #fff',
                                            '&:hover': {
                                                background: 'transparent'
                                            }
                                        }
                                    }}
                                    onClick={(e) =>
                                        handleCheckOutNow(course, e)
                                    }
                                >
                                    <Text color="#fff" size="md">
                                        ĐĂNG KÝ NGAY
                                    </Text>
                                </Button>
                            </>
                        )}
                    </Box>
                </Link>
            </Card>
        </Carousel.Slide>
    ))

    const handleCheckboxChange = (courseId) => {
        if (selectedItem === courseId) {
            setSelectedItem(null)
        } else if (selectedItem !== null) {
            const id = toast(Notify.msg.loading, Notify.options.loading())
            toast.update(
                id,
                Notify.options.createErrorParam(
                    'Chỉ thanh toán được một lần một khóa học'
                )
            )
        } else {
            setSelectedItem(courseId)
        }
    }

    useEffect(() => {
        const cartCheckout = carts.filter(
            (cart) => cart.course.courseId === selectedItem
        )
        setSelectedCart(cartCheckout)
    }, [selectedItem])

    useEffect(() => {
        fetchCart()
    }, [searchParams.get('checkoutComplete'), listCart.length])

    return (
        <>
            <ToastContainer />

            <Container size="xl">
                {/* BreadCums */}
                <Breadcrumbs
                    className="my-5 p-3"
                    style={{ backgroundColor: '#ebebeb' }}
                >
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
                                <Card className="w-100 shadow-lg mt-4">
                                    <Card.Section className="text-center">
                                        <img
                                            src={cartEmptyimage}
                                            width="40%"
                                            height="40%"
                                            alt=""
                                            className="img-fluid"
                                        />
                                        <h2 className="font-weight-700">
                                            Giỏ hàng của bạn trống. <br />
                                            Tiếp tục mua sắm để tìm một khóa học
                                            ưng ý!
                                        </h2>
                                        <Link to={'/course'}>
                                            <Button
                                                color="violet"
                                                size={'lg'}
                                                fw={500}
                                                className="mb-5 mt-2"
                                                style={{
                                                    borderRadius: '2px',
                                                    fontSize: '20px'
                                                }}
                                            >
                                                TÌM KHÓA HỌC
                                            </Button>
                                        </Link>
                                    </Card.Section>
                                </Card>
                            </>
                        ) : (
                            <>
                                <Grid mt={rem('1rem')}>
                                    <Grid.Col xl="9" lg="9" md="12" sm="12">
                                        <h5 className="font-weight-600 text-dark">
                                            {carts.length} khóa học trong giỏ
                                            hàng
                                        </h5>
                                        <hr className="text-muted mt-0 pt-0" />

                                        {/* item */}
                                        {carts.map((cart, index) => (
                                            <>
                                                <Grid key={index}>
                                                    <Grid.Col span={2}>
                                                        <Link
                                                            to={`/course/${cart.course.courseId}`}
                                                        >
                                                            <img
                                                                src={`${PUBLIC_IMAGE}/avatars/courses/${cart.course.image}`}
                                                                // src={cart.course.courseImage}
                                                                alt={`${cart.course.courseName}`}
                                                                className="img-fluid"
                                                                style={{
                                                                    maxHeight:
                                                                        '100px',
                                                                    width: '100%',
                                                                    objectFit:
                                                                        'cover'
                                                                }}
                                                            />
                                                        </Link>
                                                    </Grid.Col>
                                                    <Grid.Col span={10}>
                                                        <Grid>
                                                            <Grid.Col
                                                                xl="6"
                                                                lg="6"
                                                                md="12"
                                                                sm="12"
                                                            >
                                                                <Link
                                                                    to={`/course/${cart.course.courseId}`}
                                                                    key={index}
                                                                >
                                                                    <p
                                                                        className="font-weight-700 text-dark m-0 p-0"
                                                                        style={{
                                                                            maxWidth:
                                                                                '400px'
                                                                        }}
                                                                    >
                                                                        {
                                                                            cart
                                                                                .course
                                                                                .courseName
                                                                        }
                                                                    </p>
                                                                    <span className="text-muted"></span>
                                                                    <div className="d-flex text-dark">
                                                                        <span className="font-weight-600">
                                                                            {cart
                                                                                .course
                                                                                .rating ===
                                                                            'NaN'
                                                                                ? 5
                                                                                : parseFloat(
                                                                                      cart
                                                                                          .course
                                                                                          .rating
                                                                                  ).toFixed(
                                                                                      1
                                                                                  )}
                                                                        </span>
                                                                        <div className="mx-2">
                                                                            <Rating
                                                                                fractions={
                                                                                    2
                                                                                }
                                                                                defaultValue={
                                                                                    5
                                                                                }
                                                                                value={
                                                                                    cart
                                                                                        .course
                                                                                        .rating ===
                                                                                    'NaN'
                                                                                        ? 5
                                                                                        : parseFloat(
                                                                                              cart
                                                                                                  .course
                                                                                                  .rating
                                                                                          ).toFixed(
                                                                                              1
                                                                                          )
                                                                                }
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        <span className="text-muted">
                                                                            (
                                                                            {
                                                                                cart
                                                                                    .course
                                                                                    .reviewNumber
                                                                            }{' '}
                                                                            đánh
                                                                            giá)
                                                                            - từ{' '}
                                                                            {
                                                                                cart
                                                                                    .course
                                                                                    .totalStudent
                                                                            }{' '}
                                                                            học
                                                                            viên
                                                                        </span>
                                                                    </div>
                                                                    <div className="d-flex justify-content-start">
                                                                        <span className="text-muted">
                                                                            Tổng{' '}
                                                                            {
                                                                                cart
                                                                                    .course
                                                                                    .courseDuration
                                                                            }{' '}
                                                                            Giờ
                                                                            học
                                                                        </span>
                                                                        <span className="mx-2">
                                                                            -
                                                                        </span>
                                                                        <span className="text-muted">
                                                                            Mọi
                                                                            trình
                                                                            độ
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            </Grid.Col>
                                                            <Grid.Col
                                                                xl="2"
                                                                lg="2"
                                                                md="4"
                                                                sm="6"
                                                            >
                                                                <div>
                                                                    {/* <Link
                                                                        to={`/cart/${cart.cartId}`}
                                                                        className="text-danger font-weight-700"
                                                                        
                                                                    > */}
                                                                    <ActionIcon
                                                                        color="red"
                                                                        variant="light"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            handleRemoveCart(
                                                                                cart
                                                                                    .course
                                                                                    .courseId,
                                                                                e
                                                                            )
                                                                        }}
                                                                    >
                                                                        <IconTrash size="1rem" />
                                                                    </ActionIcon>
                                                                    {/* </Link> */}
                                                                </div>
                                                            </Grid.Col>
                                                            <Grid.Col
                                                                xl="2"
                                                                lg="2"
                                                                md="4"
                                                                sm="6"
                                                            >
                                                                <div>
                                                                    <span className="text-primary font-weight-700">
                                                                        {cart.course.coursePrice.toLocaleString(
                                                                            'it-IT',
                                                                            {
                                                                                style: 'currency',
                                                                                currency:
                                                                                    'VND'
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </Grid.Col>
                                                            <Grid.Col
                                                                xl="2"
                                                                lg="2"
                                                                md="4"
                                                                sm="12"
                                                            >
                                                                <div className="d-flex justify-content-sm-end justify-content-md-end">
                                                                    <Checkbox
                                                                        // label="I agree to sell my privacy"
                                                                        color="violet"
                                                                        checked={
                                                                            selectedItem ===
                                                                            cart
                                                                                .course
                                                                                .courseId
                                                                        }
                                                                        onChange={() =>
                                                                            handleCheckboxChange(
                                                                                cart
                                                                                    .course
                                                                                    .courseId
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Grid.Col>
                                                </Grid>
                                                <hr className="text-muted" />
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
                                                {totalPrice.toLocaleString(
                                                    'it-IT',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }
                                                )}
                                            </h3>
                                        </span>
                                        {/* <Link to={"/payment/checkout"} className="mt-2 mb-4"> */}
                                        <Button
                                            color="violet"
                                            uppercase
                                            size="md"
                                            className="w-100"
                                            style={{ borderRadius: '2px' }}
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
                <Box>
                    <Title order={2} color="dark" fw={700} mt={rem('3rem')}>
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
                                background: '#212121',
                                color: '#fff',
                                fontSize: rem(25),
                                '&[data-inactive]': {
                                    opacity: 0,
                                    cursor: 'default'
                                },
                                ref: getStylesRef('controls'),
                                transition: 'opacity 150ms ease',
                                opacity: 0
                            },
                            root: {
                                '&:hover': {
                                    [`& .${getStylesRef('controls')}`]: {
                                        opacity: 1
                                    }
                                }
                            }
                        }}
                    >
                        {slides}
                    </Carousel>
                </Box>
            </Container>
        </>
    )
}

export default Cart
