import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Col, Row } from 'reactstrap'
import logo from '../../assets/img/brand/f4.png'
import cartEmptyimage from '../../assets/img/cart-empty.png'
// reactstrap components

import {
    Autocomplete,
    Avatar,
    Burger,
    Button,
    Divider,
    Flex,
    Grid,
    Group,
    HoverCard,
    Menu,
    rem,
    SimpleGrid,
    Text,
    Title
} from '@mantine/core'
import {
    IconChevronDown,
    IconLayoutDashboard,
    IconLogout2,
    IconProgressAlert,
    IconSchoolBell,
    IconSearch,
    IconUserBolt
} from '@tabler/icons-react'
import { useDisclosure, useElementSize, useMediaQuery } from '@mantine/hooks'

// css module
import styles from '../../assets/css/custom-client-css/Navbar.module.css'

// API
import cartApi from '../../api/cartApi'
import courseApi from '../../api/courseApi'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const category_1 = ['Java', 'C#', 'PHP', 'JavaScript']
const category_2 = ['NextJS', 'ReactJS', 'AngularJS', 'NodeJS']
const category_3 = ['SQL Server', 'MySQL', 'Xampp']

const ClientNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    const ref = useElementSize()
    const navigate = useNavigate()
    const smallScreen = useMediaQuery('(max-width: 500px)')

    const [lastScrollTop, setLastScrollTop] = useState(0)
    const [activeItems, setActiveItems] = useState([false, false, false])
    const [opened, { toggle }] = useDisclosure(true)

    // *************** CART VARIABLE - AREA START
    const [carts, setCarts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [listCourse, setListCourse] = useState([])

    const fetchCart =async () => {
        if (user !== null) {
            try {
                const resp = await cartApi.getAllCartByStudentId(user.username)
                if (resp.status === 200 && resp.data.length > 0) {
                    setCarts(resp.data)
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            setCarts([])
        }
    }

    const fetchCourse = async () => {
        try {
            const resp = await courseApi.getAll()

            if (resp.status === 200 && resp.data.length > 0) {
                setListCourse(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // get Total Price from list totalCartItem
        let newTotalPrice = 0
        if (carts) {
            carts.map((item) => (newTotalPrice += item.course.coursePrice))
            setTotalPrice(newTotalPrice)
        }
    }, [carts])

    useEffect(() => {
        fetchCart()
        fetchCourse()
    }, [])

    useEffect(() => {
        fetchCart()
    }, [])

    // *************** CART VARIABLE - AREA END
    const handleItemClick = (index) => {
        const newActiveItems = [...activeItems]
        newActiveItems[index] = true
        for (let i = 0; i < newActiveItems.length; i++) {
            if (i !== index) {
                newActiveItems[i] = false
            }
        }
        setActiveItems(newActiveItems)
    }

    const handleLogin = () => {
        navigate('auth/login')
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
    }

    window.addEventListener('scroll', function () {
        const navbar = this.document.querySelector('#navbar-animate')
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop

        if (scrollTop && navbar) {
            window.addEventListener('scroll', function () {
                if (window.pageYOffset === 0) {
                    navbar.style.boxShadow = 'none'
                    navbar.style.top = 0
                } else {
                    navbar.style.boxShadow = '#63636333 2px 2px 8px 0px'
                }
            })

            // if (scrollTop === 0) {
            //   navbar.style.top = 0;
            // }
            if (scrollTop > lastScrollTop) {
                navbar.style.top = '-80px'
            } else {
                navbar.style.top = 0
            }
            setLastScrollTop(scrollTop)
        }
    })

    return (
        <nav
            className={`navbar navbar-expand-lg ${styles['navbar-animate']}`}
            id="navbar-animate"
        >
            <div
                className="container-xl"
                style={{ width: '100%', maxWidth: '1360px' }}
            >
                <Link to={'/'} className="navbar-brand">
                    <img src={logo} className="img-fluid" alt="" />
                </Link>
                <div
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{ zIndex: '99999' }}
                >
                    <Burger opened={!opened} onClick={toggle} />
                </div>

                {/* Content */}
                <div
                    className="collapse navbar-collapse text-dark font-weight-600"
                    id="navbarSupportedContent"
                >
                    <ul
                        className="navbar-nav text-center d-md-flex d-sm-flex 
                        justify-content-start "
                    >
                        <li className="nav-item">
                            <Link
                                to={'/'}
                                className={`
                ${
                    activeItems[0] === true
                        ? 'nav-link custom-nav-link active'
                        : 'nav-link custom-nav-link'
                }
                ${styles['custom-nav-link']}
                `}
                                onClick={() => handleItemClick(0)}
                            >
                                Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to={'/courses'}
                                className={`
                ${
                    activeItems[1]
                        ? 'nav-link custom-nav-link active'
                        : 'nav-link custom-nav-link'
                }
                ${styles['custom-nav-link']}
                `}
                                onClick={() => handleItemClick(1)}
                            >
                                Khóa học
                            </Link>
                        </li>

                        <li className="nav-item">
                            <HoverCard
                                width={'75vw'}
                                position="bottom"
                                radius="sm"
                                shadow="md"
                                withinPortal
                            >
                                <HoverCard.Target>
                                    <Link
                                        to="#"
                                        className={`
                ${
                    activeItems[2]
                        ? 'nav-link custom-nav-link active'
                        : 'nav-link custom-nav-link'
                }
                ${styles['custom-nav-link']}
                `}
                                        onClick={() => handleItemClick(2)}
                                    >
                                        Danh mục
                                        <IconChevronDown
                                            style={{
                                                width: rem(16),
                                                height: rem(16),
                                                marginLeft: '5px'
                                            }}
                                            // color={theme.colors.black[6]}
                                        />
                                    </Link>
                                </HoverCard.Target>

                                <HoverCard.Dropdown
                                    style={{
                                        overflow: 'hidden',
                                        maxWidth: '1000px'
                                    }}
                                    mt="xl"
                                >
                                    <Group position="apart" px={rem('1.5rem')}>
                                        <Text fw={500}>Khóa học</Text>
                                        <Link to="/course" fz="xs">
                                            Tất cả khóa học
                                        </Link>
                                    </Group>

                                    <Divider my="sm" />

                                    <Grid gutter="xl" p={rem('1.5rem')}>
                                        <Grid.Col
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            sm={12}
                                            style={{ height: '100%' }}
                                        >
                                            <div className="mb-auto">
                                                <Title
                                                    order={3}
                                                    fw={700}
                                                    color="dark"
                                                >
                                                    Các chủ đề khóa học phổ biến
                                                </Title>
                                                <Text color="dimmed">
                                                    Khám phá các khóa học miễn
                                                    phí hoặc trả phí về các chủ
                                                    đề mà bạn quan tâm.
                                                </Text>
                                            </div>
                                            <Link
                                                to="/course"
                                                className="w-100"
                                            >
                                                <Button
                                                    color="violet"
                                                    w="100%"
                                                    mt="xl"
                                                >
                                                    Khám phá khóa học
                                                </Button>
                                            </Link>
                                        </Grid.Col>
                                        {/* <Divider orientation="vertical" size="sm" /> */}
                                        <Grid.Col xl={8} lg={8} md={12} sm={12}>
                                            <SimpleGrid
                                                cols={smallScreen ? 1 : 3}
                                                spacing="xl"
                                                verticalSpacing="sm"
                                            >
                                                <Flex
                                                    justify={'center'}
                                                    align={
                                                        smallScreen
                                                            ? 'center'
                                                            : 'flex-start'
                                                    }
                                                    direction={'column'}
                                                    gap={'xl'}
                                                    ml="md"
                                                >
                                                    {category_1.map(
                                                        (c, index) => (
                                                            <Link
                                                                to={`/course`}
                                                                key={index}
                                                            >
                                                                <Text
                                                                    color="dark"
                                                                    fw={700}
                                                                >
                                                                    {c}
                                                                </Text>
                                                            </Link>
                                                        )
                                                    )}
                                                </Flex>
                                                <Flex
                                                    justify={'center'}
                                                    align={'center'}
                                                    direction={'column'}
                                                    gap={'xl'}
                                                >
                                                    {category_2.map(
                                                        (c, index) => (
                                                            <Link
                                                                to={`/course`}
                                                                key={index}
                                                            >
                                                                <Text
                                                                    color="dark"
                                                                    fw={700}
                                                                >
                                                                    {c}
                                                                </Text>
                                                            </Link>
                                                        )
                                                    )}
                                                </Flex>
                                                <Flex
                                                    justify={'center'}
                                                    align={
                                                        smallScreen
                                                            ? 'center'
                                                            : 'flex-end'
                                                    }
                                                    direction={'column'}
                                                    gap={'xl'}
                                                >
                                                    {category_3.map(
                                                        (c, index) => (
                                                            <Link
                                                                to={`/course`}
                                                                key={index}
                                                            >
                                                                <Text
                                                                    color="dark"
                                                                    fw={700}
                                                                >
                                                                    {c}
                                                                </Text>
                                                            </Link>
                                                        )
                                                    )}
                                                </Flex>
                                            </SimpleGrid>
                                        </Grid.Col>
                                    </Grid>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </li>

                        {user === null && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to={'/cart'}
                                        className={`
                ${
                    activeItems[1]
                        ? 'nav-link custom-nav-link active'
                        : 'nav-link custom-nav-link'
                }
                ${styles['custom-nav-link']}
                `}
                                        onClick={() => handleItemClick(1)}
                                    >
                                        Giỏ hàng
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div
                        className="d-flex justify-content-between justify-content-md-center 
                        justify-content-sm-center text-center text-dark ml-auto"
                    >
                        <Autocomplete
                            placeholder="Tìm khóa học.."
                            className="mt-1"
                            ref={ref}
                            style={{ width: rem(300) }}
                            icon={<IconSearch />}
                            data={listCourse.map((c) => c.courseName)}
                        />
                        {user !== null ? (
                            <>
                                <Link
                                    to="/cart"
                                    className={`${styles.cart} mx-4 mt-2`}
                                >
                                    <i
                                        className="bx bx-cart font-weight-500 text-dark"
                                        style={{
                                            fontSize: '32px'
                                        }}
                                    ></i>
                                    {/* <ActionIcon variant="transparent">
                    <IconShoppingCart size="2rem" />
                  </ActionIcon> */}
                                    <Badge
                                        color="rgba(0, 0, 0, 1)"
                                        className={`${styles['header-cart']} font-weight-700`}
                                    >
                                        {carts.length > 0 ? carts.length : 0}
                                    </Badge>
                                    <div className={styles['cart-detail']}>
                                        {carts.length === 0 ? (
                                            <>
                                                <img
                                                    src={cartEmptyimage}
                                                    alt="cart Empty"
                                                    className="img-fluid"
                                                />
                                                <p className="mx-auto mb-3 text-muted font-weight-600 mx-auto">
                                                    Giỏ hàng trống.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`container ${styles['cart-content-overflow']} my-2`}
                                                >
                                                    <Row>
                                                        <Col
                                                            xl="12"
                                                            lg="12"
                                                            md="12"
                                                            sm="12"
                                                        >
                                                            {carts.length > 0 &&
                                                                carts.map(
                                                                    (cart) => (
                                                                        <>
                                                                            <Row className="mt-2">
                                                                                <Col
                                                                                    xl="4"
                                                                                    lg="4"
                                                                                    md="4"
                                                                                    sm="4"
                                                                                >
                                                                                    <img
                                                                                        src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
                                                                                        alt="cart item img"
                                                                                        className="img-fluid"
                                                                                        style={{
                                                                                            maxHeight:
                                                                                                '70px',
                                                                                            width: '100%',
                                                                                            objectFit:
                                                                                                'cover'
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
                                                                                    <span className="font-weight-700 text-dark align-items-start">
                                                                                        {
                                                                                            cart
                                                                                                .course
                                                                                                .courseName
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-muted">
                                                                                        {cart.course.coursePrice.toLocaleString(
                                                                                            'it-IT',
                                                                                            {
                                                                                                style: 'currency',
                                                                                                currency:
                                                                                                    'VND'
                                                                                            }
                                                                                        )}
                                                                                    </span>
                                                                                </Col>
                                                                            </Row>
                                                                            <hr className="m-3 p-0 text-muted" />
                                                                        </>
                                                                    )
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div
                                                    className={`container ${styles['cart-footer']} w-100`}
                                                >
                                                    <p
                                                        className="m-2 p-0 text-dark font-weight-700 text-left"
                                                        style={{
                                                            fontSize: '20px'
                                                        }}
                                                    >
                                                        <span
                                                            className="font-weight-500 mr-2 text-muted"
                                                            style={{
                                                                fontSize: '17px'
                                                            }}
                                                        >
                                                            THANH TOÁN:
                                                        </span>
                                                        <span>
                                                            {totalPrice.toLocaleString(
                                                                'it-IT',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        'VND'
                                                                }
                                                            )}
                                                        </span>
                                                    </p>
                                                    <Link
                                                        to={'/cart'}
                                                        className="w-100"
                                                    >
                                                        <Button
                                                            color="dark"
                                                            className="w-100 mb-3 font-weight-700"
                                                            style={{
                                                                borderRadius:
                                                                    '3px'
                                                            }}
                                                        >
                                                            Tới giỏ hàng
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Link>

                                {/* User menu hover */}
                                <Menu
                                    shadow="md"
                                    withArrow
                                    className="mt-1"
                                    width={200}
                                    trigger="hover"
                                    openDelay={100}
                                    closeDelay={400}
                                >
                                    <Menu.Target>
                                        <Avatar
                                            component="a"
                                            href="/"
                                            target="_blank"
                                            src="https://images.unsplash.com/photo-1695754189990-da05b9433ac4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                            alt="it's me"
                                            radius={50}
                                        />
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>DASHBOARD</Menu.Label>
                                        <Menu.Item
                                            icon={
                                                <IconLayoutDashboard
                                                    size={14}
                                                />
                                            }
                                        >
                                            Hệ thống học tập
                                        </Menu.Item>
                                        <Link to="/course-progress">
                                            <Menu.Item
                                                icon={
                                                    <IconProgressAlert
                                                        size={14}
                                                    />
                                                }
                                            >
                                                Tiến độ học tập
                                            </Menu.Item>
                                        </Link>
                                        <Menu.Item
                                            icon={<IconUserBolt size={14} />}
                                        >
                                            Tài khoản
                                        </Menu.Item>
                                        <Menu.Item
                                            icon={<IconSchoolBell size={14} />}
                                        >
                                            Lịch học
                                        </Menu.Item>

                                        <Menu.Divider />

                                        <Menu.Label>Hệ thống</Menu.Label>
                                        <Menu.Item
                                            color="red"
                                            icon={<IconLogout2 size={14} />}
                                            onClick={() => handleLogout()}
                                        >
                                            Đăng xuất
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="dark"
                                    uppercase
                                    className="mt-1 ml-2 font-weight-700"
                                    onClick={() => handleLogin()}
                                    style={{ borderRadius: '2px' }}
                                >
                                    Đăng nhập
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        // </Container>
    )
}

export default ClientNavbar
