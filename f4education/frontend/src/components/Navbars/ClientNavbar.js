import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, Col, Row } from 'reactstrap'
// import logo from '../../assets/img/brand/f4.png'
import logo from '../../assets/img/brand/F4EDUCATION.png'
import cartEmptyimage from '../../assets/img/cart-empty.png'

// reactstrap components
import {
    Autocomplete,
    Avatar,
    Burger,
    Button,
    Grid,
    Group,
    HoverCard,
    Menu,
    rem,
    ScrollArea,
    Stack,
    Text
} from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import {
    IconChevronDown,
    IconChevronRight,
    IconLayoutDashboard,
    IconLogout2,
    IconSchoolBell,
    IconSearch,
    IconUserBolt
} from '@tabler/icons-react'

// css module
import styles from '../../assets/css/custom-client-css/Navbar.module.css'

// Utils
import { PreviousURI } from '../../utils/PreviousURI'

// API
import courseApi from '../../api/courseApi'
import subjectApi from '../../api/subjectApi'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const ClientNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const listCart = JSON.parse(localStorage.getItem('userCart')) || []

    const ref = useElementSize()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [lastScrollTop, setLastScrollTop] = useState(0)
    const [activeItems, setActiveItems] = useState([false, false, false])
    const [opened, { toggle }] = useDisclosure(true)

    // *************** CART VARIABLE - AREA START
    const [carts, setCarts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [listCourse, setListCourse] = useState([])
    const [listSubject, setListSubject] = useState([])
    const [courseByLevel, setCourseByLevel] = useState([])
    const [parentCategory, setParentCategory] = useState([])
    const [checkRole, setCheckRole] = useState('')

    // Fetch area
    const fetchCart = async () => {
        try {
            const userCart = JSON.parse(localStorage.getItem('userCart')) || []
            setCarts(userCart)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCourse = async () => {
        try {
            const resp = await courseApi.getAll()

            if (resp.status === 200 && resp.data.length > 0) {
                // const uniqueValues = [
                //     ...new Set(resp.data.map((item) => item.courseName))
                // ]
                setListCourse(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubject = async () => {
        try {
            const resp = await subjectApi.getAllSubject()

            if (resp.status === 200 && resp.data.length > 0) {
                setListSubject(resp.data)

                // Shuffle the array randomly
                const shuffledSubjects = shuffleArray([...resp.data])

                // Calculate the indices to split the array into three parts
                const totalSubjects = shuffledSubjects.length
                const firstThird = Math.floor(totalSubjects / 3)
                const secondThird = firstThird * 2

                // Separate the array into three child arrays
                const frontend = shuffledSubjects.slice(0, firstThird)
                const backend = shuffledSubjects.slice(firstThird, secondThird)
                const orther = shuffledSubjects.slice(secondThird)

                // Store the three arrays in a variable
                const resultArrays = { frontend, backend, orther }
                console.log(resultArrays)
                setParentCategory(resultArrays)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    // get Total Price from list totalCartItem
    useEffect(() => {
        let newTotalPrice = 0
        if (carts) {
            carts.forEach((item) => (newTotalPrice += item.course.coursePrice))
            setTotalPrice(newTotalPrice)
        }
    }, [carts])

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchSubject(), fetchCourse()])
        }
        fetchData()
    }, [user !== null ? user.username : ''])

    useEffect(() => {
        fetchCart()
    }, [searchParams.get('checkoutComplete'), listCart.length])

    useEffect(() => {
        if (user) {
            const checkUserRole = user.roles.some((us) => us === 'ROLE_USER')
            const checkTeacherRole = user.roles.some(
                (us) => us === 'ROLE_TEACHER'
            )
            const checkAdminRole = user.roles.some((us) => us === 'ROLE_ADMIN')

            if (checkUserRole) {
                setCheckRole('user')
            } else if (checkTeacherRole) {
                setCheckRole('teacher')
            } else if (checkAdminRole) {
                setCheckRole('admin')
            } else {
                setCheckRole('user')
            }
        }
    }, [user])

    // *************** CART VARIABLE - AREA END
    const handleItemClick = (index) => {
        const newActiveItems = [...activeItems]
        newActiveItems[index] = true

        for (let i = 0; i < newActiveItems.length; i++) {
            if (i !== index) {
                newActiveItems[i] = false
            }
        }
        console.log(newActiveItems)
        setActiveItems(newActiveItems)
    }

    const handleLogin = () => {
        navigate('auth/login')
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        fetchCart()
        navigate('auth/login')
        // window.location.reload()
        // const currentPath = window.location.pathname
        // console.log('Địa chỉ (path) hiện tại của trang web là:', currentPath)
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

            if (scrollTop > lastScrollTop) {
                navbar.style.top = '-80px'
            } else {
                navbar.style.top = 0
            }
            setLastScrollTop(scrollTop)
        }
    })

    const handleOnChangeLevelCategory = (subjectId) => {
        const listCourseFilter = listCourse.filter(
            (course) => course.subject.subjectId === subjectId
        )
        setCourseByLevel(listCourseFilter)
    }

    const handleOnChangeSearch = (value) => {
        console.log(value)
        if (value === undefined) {
            return
        }

        const currentCourse = listCourse.find(
            (course) => course.courseName.toLowerCase() === value.toLowerCase()
        )
        console.log(currentCourse)

        if (currentCourse === undefined) {
            return
        } else {
            navigate(`/course/${currentCourse.courseId}`)
        }
    }

    useEffect(() => {
        PreviousURI.current = window.location.pathname
        console.log(window.location.pathname)
    }, [navigate])

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
                    <img
                        src={logo}
                        className="img-fluid"
                        alt="F4 Education Center"
                        style={{
                            objectFit: 'cover',
                            width: '120px',
                            height: '35px'
                        }}
                    />
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

                                <HoverCard.Dropdown mt="xl">
                                    <ScrollArea p={20} h={500} offsetScrollbars>
                                        <Grid gutter="xl" p={rem('1.5rem')}>
                                            <Stack display="block">
                                                {listSubject.map(
                                                    (subject, index) => (
                                                        <HoverCard
                                                            position="right-start"
                                                            radius="sm"
                                                            shadow="md"
                                                            withinPortal
                                                            maw={450}
                                                            key={index}
                                                        >
                                                            <HoverCard.Target>
                                                                <Group
                                                                    position="apart"
                                                                    key={
                                                                        subject.subjectId
                                                                    }
                                                                    onMouseEnter={() =>
                                                                        handleOnChangeLevelCategory(
                                                                            subject.subjectId
                                                                        )
                                                                    }
                                                                    mb={10}
                                                                >
                                                                    <Text
                                                                        color="dark"
                                                                        size="lg"
                                                                    >
                                                                        {
                                                                            subject.subjectName
                                                                        }
                                                                    </Text>
                                                                    <IconChevronRight />
                                                                </Group>
                                                            </HoverCard.Target>
                                                            {/* Level 2 category */}
                                                            <HoverCard.Dropdown
                                                                ml={54}
                                                                mt={-45}
                                                                p={20}
                                                                maw={450}
                                                            >
                                                                <Text
                                                                    color="dimmed"
                                                                    fw={700}
                                                                    mb={20}
                                                                    size="lg"
                                                                >
                                                                    Những khóa
                                                                    học phổ biến
                                                                </Text>
                                                                {courseByLevel.length ===
                                                                0 ? (
                                                                    <>
                                                                        <Text
                                                                            color="dimmed"
                                                                            size="lg"
                                                                        >
                                                                            Môn
                                                                            học
                                                                            hiện
                                                                            chưa
                                                                            có
                                                                            khóa
                                                                            học.
                                                                        </Text>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ScrollArea
                                                                            p={
                                                                                20
                                                                            }
                                                                            h={
                                                                                500
                                                                            }
                                                                            offsetScrollbars
                                                                        >
                                                                            {courseByLevel.map(
                                                                                (
                                                                                    course
                                                                                ) => (
                                                                                    <Text
                                                                                        key={
                                                                                            course.courseId
                                                                                        }
                                                                                        size="lg"
                                                                                        mb={
                                                                                            10
                                                                                        }
                                                                                    >
                                                                                        <Link
                                                                                            to={`/course/${course.courseId}`}
                                                                                            style={{
                                                                                                color: '#000',
                                                                                                fontSize:
                                                                                                    '1.25rem'
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                course.courseName
                                                                                            }
                                                                                        </Link>
                                                                                    </Text>
                                                                                )
                                                                            )}
                                                                        </ScrollArea>
                                                                    </>
                                                                )}
                                                            </HoverCard.Dropdown>
                                                        </HoverCard>
                                                    )
                                                )}
                                            </Stack>
                                        </Grid>
                                    </ScrollArea>
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
                    activeItems[3]
                        ? 'nav-link custom-nav-link active'
                        : 'nav-link custom-nav-link'
                }
                ${styles['custom-nav-link']}
                `}
                                        onClick={() => handleItemClick(3)}
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
                            placeholder="Tìm khóa học..."
                            className="mt-1"
                            ref={ref}
                            style={{ width: rem(300) }}
                            icon={<IconSearch />}
                            data={listCourse.map((c) => c.courseName)}
                            // value={searchValue}
                            onChange={(e) => handleOnChangeSearch(e)}
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
                                                                    (
                                                                        cart,
                                                                        index
                                                                    ) => (
                                                                        <>
                                                                            <Row
                                                                                className="mt-2"
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <Col
                                                                                    xl="4"
                                                                                    lg="4"
                                                                                    md="4"
                                                                                    sm="4"
                                                                                >
                                                                                    <img
                                                                                        src={`${PUBLIC_IMAGE}/avatars/courses/${cart.course.image}`}
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
                                            // src="https://images.unsplash.com/photo-1695754189990-da05b9433ac4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                            src={`${PUBLIC_IMAGE}/students/${user.image}`}
                                            alt="it's me"
                                            radius={50}
                                        />
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>DASHBOARD</Menu.Label>
                                        {checkRole === 'user' && (
                                            <Link to="/student/classes">
                                                <Menu.Item
                                                    icon={
                                                        <IconLayoutDashboard
                                                            size={14}
                                                        />
                                                    }
                                                >
                                                    Hệ thống học tập
                                                </Menu.Item>
                                            </Link>
                                        )}
                                        {checkRole === 'teacher' && (
                                            <Link to="/teacher/class-info">
                                                <Menu.Item
                                                    icon={
                                                        <IconLayoutDashboard
                                                            size={14}
                                                        />
                                                    }
                                                >
                                                    Hệ thống giáo viên
                                                </Menu.Item>
                                            </Link>
                                        )}

                                        <Link to="/student/classes">
                                            <Menu.Item
                                                icon={
                                                    <IconUserBolt size={14} />
                                                }
                                            >
                                                Tài khoản
                                            </Menu.Item>
                                        </Link>
                                        {checkRole === 'teacher' && (
                                            <Link to="/teacher/schedule">
                                                <Menu.Item
                                                    icon={
                                                        <IconSchoolBell
                                                            size={14}
                                                        />
                                                    }
                                                >
                                                    Lịch dạy
                                                </Menu.Item>
                                            </Link>
                                        )}

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
    )
}

export default ClientNavbar
