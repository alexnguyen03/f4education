import {
    Accordion,
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Breadcrumbs,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Grid,
    Group,
    Image,
    List,
    Pagination,
    Rating,
    rem,
    Skeleton,
    Spoiler,
    Stack,
    Text,
    Textarea,
    Title
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
    IconChevronRight,
    IconDeviceMobile,
    IconDeviceTvOld,
    IconInfinity,
    IconSourceCode,
    IconStarFilled,
    IconTrash,
    IconTrophy
} from '@tabler/icons-react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/moment'

import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../../utils/Notify'

// MODULE CSS
import styles from '../../../assets/scss/custom-module-scss/client-custom/course-detail/CourseDetail.module.scss'

// API
import courseDetailApi from '../../../api/courseDetailApi'
import courseApi from '../../../api/courseApi'
import evaluateApi from '../../../api/evaluateApi'

// IMAGE PATH
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    })

    return formatter.format(amount)
}

function CourseDetailClient() {
    const user = JSON.parse(localStorage.getItem('user'))

    let navigate = useNavigate()

    // ROUTES AND ACTION UI VARAIABLE
    const params = useParams()
    const [isActive, setIsActive] = useState(false)
    const MediumScreen = useMediaQuery('(max-width: 1200px)')

    // BREADCUM
    const items = [
        { title: 'Trang chủ', href: '/' },
        { title: 'Khóa học', href: '/course' },
        { title: 'Chi tiết khóa học', href: `/course/${params.courseId}` }
    ].map((item, index) => (
        <Anchor
            href={item.href}
            key={index}
            color="#E9ECEF"
            styles={{
                color: {
                    '&hover': {
                        color: '#fff'
                    }
                }
            }}
        >
            {item.title}
        </Anchor>
    ))

    // MAIN VARIABLE
    const [course, setCourse] = useState({})
    const [listCourseContent, setListCourseContent] = useState([])
    const [listEvaluate, setListEvaluate] = useState([])
    const [newstCourse, setNewstCourse] = useState([])

    // ACTION VARIABLE
    const [loading, setLoading] = useState(false)
    const [evaluateRequest, setEvaluateRequest] = useState({
        rating: '',
        content: '',
        studentId: '',
        registerCourseId: ''
    })

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const totalItems = listEvaluate.length
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentItems = listEvaluate.slice(firstIndex, lastIndex)

    const handlePaginationChange = (page) => {
        setCurrentPage(page)
    }

    // Fetch AREA
    const fetchCurrentCourse = async () => {
        try {
            const resp = await courseApi.getCourseByCourseId(
                params.courseId,
                user !== null ? user.username : 'nouser'
            )

            console.log(resp.data)
            if (resp.status === 200) {
                setCourse(resp.data)
            } else if (resp.status === 204) {
                console.log('no content')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNewestCourse = async () => {
        try {
            const resp = await courseApi.getNewestCourse(
                user !== null ? user.username : 'nouser'
            )

            if (resp.status === 200) {
                setNewstCourse(resp.data)
                console.log(resp.data)
            } else if (resp.status === 204) {
                console.log('no content')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchListCourseContent = async () => {
        try {
            const resp = await courseDetailApi.getAllByCourseId(params.courseId)
            if (resp.status === 200) {
                setListCourseContent(resp.data)
            } else console.log('Error at fetchCourseContent')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchListEvaluate = async () => {
        try {
            const resp = await evaluateApi.getAllByCourseId(params.courseId)

            if (resp.status === 200) {
                setListEvaluate(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // FETCH + CRUD AREA
    const handleCreateEvaluate = async () => {
        evaluateRequest.studentId = user.username
        evaluateRequest.registerCourseId = course.registerCourseId

        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            const resp = await evaluateApi.createEvaluate(evaluateRequest)
            if (resp.status === 201 || resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())
                fetchListEvaluate()
                fetchCurrentCourse()
            }
        } catch (error) {
            toast.update(id, Notify.options.createError())
        }
    }

    const handleDeleteEvaluate = async (evaluateId) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            const updateEvaluate = [...listEvaluate]
            const indexToDelete = updateEvaluate.findIndex(
                (evalu) => evalu.evaluateId === evaluateId
            )
            if (indexToDelete !== -1) {
                updateEvaluate.splice(indexToDelete, 1)
            }

            setListEvaluate(updateEvaluate)

            const resp = await evaluateApi.deleteEvaluate(evaluateId)
            if (resp.status === 204 || resp.status === 200) {
                toast.update(id, Notify.options.deleteSuccess())
                fetchListEvaluate()
            }
        } catch (error) {
            toast.update(id, Notify.options.deleteError())
        }
    }

    const handleOnChangeEvaluate = (e) => {
        setEvaluateRequest((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    // CART - CHECK OUT
    const handleAddCart = (course) => {
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

                console.log(currentCart)
                console.log(userCart)
                resolve(currentCart)
            } catch (error) {
                toast.update(id, Notify.options.createError())
                console.log(error)
                reject(error)
            }
        })
    }

    const handleCheckOut = async (course) => {
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
            const selectedCart = await handleAddCart(course)

            // store cart to localstorage
            localStorage.setItem('cartCheckout', JSON.stringify(selectedCart))
            return navigate('/payment/checkout')
        } catch (error) {
            toast.update(id, Notify.options.createError())
            console.log(error)
        }
    }

    // useEffect AREA
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await Promise.all([
                fetchCurrentCourse(),
                fetchListCourseContent(),
                fetchListEvaluate(),
                fetchNewestCourse()
            ])
            setLoading(false)
        }

        fetchData()
    }, [params])

    // UI ACTION
    window.addEventListener('scroll', handleScroll)

    function handleScroll() {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop

        if (scrollTop > 300) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }

    return (
        <>
            <ToastContainer />

            {/* Top banner */}
            <Box mt={rem('2rem')} bg="#2d2f31">
                <Container size="xl">
                    <Grid gutter="xl">
                        <Grid.Col xl={8} lg={8} md={12} sm={12}>
                            <Stack align="start">
                                {loading ? (
                                    <>
                                        <Skeleton
                                            width={500}
                                            height={30}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width={400}
                                            height={20}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width={200}
                                            height={15}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width={400}
                                            height={20}
                                            mb={10}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {MediumScreen ? (
                                            <>
                                                <Center mx="auto">
                                                    <Container size="lg">
                                                        <Stack>
                                                            <Breadcrumbs
                                                                separator={
                                                                    <IconChevronRight />
                                                                }
                                                                mt="xs"
                                                            >
                                                                {items}
                                                            </Breadcrumbs>
                                                            <Image
                                                                src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                                                                height={200}
                                                                alt={
                                                                    course.courseName
                                                                }
                                                                withPlaceholder
                                                            />
                                                            <Title
                                                                order={1}
                                                                color="#fff"
                                                                fw={700}
                                                                lineClamp={2}
                                                            >
                                                                {
                                                                    course.courseName
                                                                }
                                                            </Title>
                                                            <Group position="left">
                                                                <Group position="left">
                                                                    <Text
                                                                        color="yellow"
                                                                        size="lg"
                                                                    >
                                                                        {course.rating ===
                                                                        'NaN'
                                                                            ? 5
                                                                            : parseFloat(
                                                                                  course.rating
                                                                              ).toFixed(
                                                                                  1
                                                                              )}
                                                                    </Text>
                                                                    <Rating
                                                                        fractions={
                                                                            2
                                                                        }
                                                                        defaultValue={
                                                                            5
                                                                        }
                                                                        value={
                                                                            course.rating ===
                                                                            'NaN'
                                                                                ? 5
                                                                                : parseFloat(
                                                                                      course.rating
                                                                                  ).toFixed(
                                                                                      1
                                                                                  )
                                                                        }
                                                                        readOnly
                                                                    />
                                                                </Group>
                                                                <Text
                                                                    color="#E9ECEF"
                                                                    size="lg"
                                                                >
                                                                    (
                                                                    {
                                                                        course.reviewNumber
                                                                    }{' '}
                                                                    Đánh giá)
                                                                    {' - '}
                                                                    {
                                                                        course.totalStudent
                                                                    }{' '}
                                                                    học viên
                                                                </Text>
                                                            </Group>
                                                            <Group position="left">
                                                                <Text
                                                                    color="#fff"
                                                                    size="lg"
                                                                >
                                                                    Tạo bởi
                                                                    {'  '}
                                                                    <Anchor
                                                                        href="/"
                                                                        underline
                                                                    >
                                                                        F4Education.com
                                                                    </Anchor>{' '}
                                                                </Text>
                                                            </Group>
                                                            <Group
                                                                position="apart"
                                                                mt="md"
                                                                mb="xs"
                                                            >
                                                                <Text
                                                                    weight={500}
                                                                    color="#fff"
                                                                    size="xl"
                                                                >
                                                                    Giá khóa
                                                                    học:{' '}
                                                                    {formatCurrency(
                                                                        course.coursePrice
                                                                    )}
                                                                </Text>
                                                            </Group>

                                                            <Button
                                                                variant="filled"
                                                                color="violet"
                                                                mt="md"
                                                            >
                                                                Thêm vào giỏ
                                                                hàng
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                color="dark"
                                                                mt="sm"
                                                            >
                                                                Mua ngay
                                                            </Button>
                                                        </Stack>
                                                    </Container>
                                                </Center>
                                            </>
                                        ) : (
                                            <>
                                                <Breadcrumbs
                                                    separator={
                                                        <IconChevronRight />
                                                    }
                                                    mt="xs"
                                                >
                                                    {items}
                                                </Breadcrumbs>
                                                <Title
                                                    order={1}
                                                    color="#fff"
                                                    fw={700}
                                                    lineClamp={2}
                                                >
                                                    {course.courseName}
                                                </Title>
                                                <Group position="left">
                                                    <Group position="left">
                                                        <Text
                                                            color="yellow"
                                                            size="lg"
                                                        >
                                                            {course.rating ===
                                                            'NaN'
                                                                ? 5
                                                                : parseFloat(
                                                                      course.rating
                                                                  ).toFixed(1)}
                                                        </Text>
                                                        <Rating
                                                            fractions={2}
                                                            defaultValue={5}
                                                            value={
                                                                course.rating ===
                                                                'NaN'
                                                                    ? 5
                                                                    : parseFloat(
                                                                          course.rating
                                                                      ).toFixed(
                                                                          1
                                                                      )
                                                            }
                                                            readOnly
                                                        />
                                                    </Group>
                                                    <Text
                                                        color="#E9ECEF"
                                                        size="lg"
                                                    >
                                                        ({course.reviewNumber}{' '}
                                                        Đánh giá){' - '}
                                                        {
                                                            course.totalStudent
                                                        }{' '}
                                                        học viên
                                                    </Text>
                                                </Group>
                                                <Group position="left">
                                                    <Text
                                                        color="#fff"
                                                        size="lg"
                                                    >
                                                        Tạo bởi{' '}
                                                        <Anchor
                                                            href="/"
                                                            underline
                                                        >
                                                            F4Education.com
                                                        </Anchor>{' '}
                                                    </Text>
                                                </Group>
                                                <Group
                                                    position="apart"
                                                    mt="md"
                                                    mb="xs"
                                                >
                                                    <Text
                                                        weight={500}
                                                        color="#fff"
                                                        size="xl"
                                                    >
                                                        {' '}
                                                        Giá khóa học:{' '}
                                                        {formatCurrency(
                                                            course.coursePrice
                                                        )}
                                                    </Text>
                                                </Group>
                                            </>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </Grid.Col>
                        <Grid.Col xl={4} lg={4} md={12} sm={12} pos="relative">
                            <Card
                                shadow="sm"
                                withBorder
                                p={0}
                                className={styles['card-detail-main']}
                                style={{
                                    display: `${isActive ? 'none' : ''}`
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Skeleton
                                            width="100%"
                                            height={200}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width="100%"
                                            height={25}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width="100%"
                                            height={20}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width="100%"
                                            height={20}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width="100%"
                                            height={200}
                                            mb={10}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Card.Section>
                                            <Image
                                                src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                                                height={200}
                                                alt={course.courseName}
                                                mt={-10}
                                                withPlaceholder
                                            />
                                        </Card.Section>

                                        <Card.Section px="sm">
                                            <Stack px="lg">
                                                <Group
                                                    position="apart"
                                                    mt="md"
                                                    mb="xs"
                                                >
                                                    <Title
                                                        order={1}
                                                        fw={700}
                                                        color="dark"
                                                        underline
                                                    >
                                                        {formatCurrency(
                                                            course.coursePrice
                                                        )}
                                                    </Title>
                                                    <Badge
                                                        color="pink"
                                                        variant="light"
                                                    >
                                                        Giảm giá
                                                    </Badge>
                                                </Group>

                                                {course.isPurchase ? (
                                                    <>
                                                        <Button
                                                            variant="filled"
                                                            color="violet"
                                                            fullWidth
                                                            mt="md"
                                                            onClick={() =>
                                                                navigate(
                                                                    '/student/classes'
                                                                )
                                                            }
                                                        >
                                                            Đã đăng ký khóa học
                                                            này
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="filled"
                                                            color="violet"
                                                            fullWidth
                                                            mt="md"
                                                            onClick={() => {
                                                                handleAddCart(
                                                                    course
                                                                )
                                                            }}
                                                        >
                                                            Thêm vào giỏ hàng
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            color="dark"
                                                            fullWidth
                                                            onClick={() => {
                                                                handleCheckOut(
                                                                    course
                                                                )
                                                            }}
                                                        >
                                                            Đăng ký ngay
                                                        </Button>
                                                    </>
                                                )}

                                                <Stack align="start" mb="sm">
                                                    <Text
                                                        color="dark"
                                                        fw={700}
                                                        size="xl"
                                                        mt="md"
                                                        mb="sm"
                                                    >
                                                        Khóa học này bao gồm
                                                    </Text>
                                                    <Group>
                                                        <IconDeviceTvOld />
                                                        <Text
                                                            color="dark"
                                                            size="md"
                                                        >
                                                            {course.courseDuration /
                                                                2}{' '}
                                                            buổi học
                                                        </Text>
                                                    </Group>
                                                    <Group>
                                                        <IconSourceCode />
                                                        <Text
                                                            color="dark"
                                                            size="md"
                                                        >
                                                            {listCourseContent.length >
                                                            0
                                                                ? listCourseContent.length
                                                                : 0}{' '}
                                                            Tài nguyên môn học
                                                        </Text>
                                                    </Group>
                                                    <Group>
                                                        <IconDeviceMobile />
                                                        <Text
                                                            color="dark"
                                                            size="md"
                                                        >
                                                            Truy cập từ điện
                                                            thoại - Laptop
                                                        </Text>
                                                    </Group>
                                                    <Group>
                                                        <IconInfinity />
                                                        <Text
                                                            color="dark"
                                                            size="md"
                                                        >
                                                            Truy cập suôt đời
                                                        </Text>
                                                    </Group>
                                                    <Group>
                                                        <IconTrophy />
                                                        <Text
                                                            color="dark"
                                                            size="md"
                                                        >
                                                            Chứng chỉ hoàn thành
                                                        </Text>
                                                    </Group>
                                                </Stack>
                                            </Stack>
                                        </Card.Section>
                                    </>
                                )}
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            {/* Show Sticky top on Scroll */}
            <Box
                className={
                    styles[
                        isActive
                            ? 'sticky-top-course-detail-active'
                            : 'sticky-top-course-detail'
                    ]
                }
                p={rem('0.6rem')}
            >
                <Container size="xl">
                    <Stack>
                        <Text color="#fff" fw={700} size="xl" maw={700}>
                            {course.courseName}
                        </Text>
                        <Group position="left">
                            <Group position="left">
                                <Text color="yellow" size="lg">
                                    {course.rating === 'NaN'
                                        ? 5
                                        : parseFloat(course.rating).toFixed(1)}
                                </Text>
                                <Rating
                                    fractions={2}
                                    defaultValue={5}
                                    value={
                                        course.rating === 'NaN'
                                            ? 5
                                            : parseFloat(course.rating).toFixed(
                                                  1
                                              )
                                    }
                                    readOnly
                                />
                            </Group>
                            <Text color="#E9ECEF" size="lg">
                                ({course.reviewNumber} Đánh giá){' - '}
                                {course.totalStudent} học viên
                            </Text>
                        </Group>
                    </Stack>

                    <Card
                        shadow="sm"
                        p={0}
                        withBorder
                        className={styles[isActive ? 'fixed-top' : '']}
                    >
                        {loading ? (
                            <>
                                <Skeleton width="100%" height={200} mb={10} />
                                <Skeleton width="100%" height={25} mb={10} />
                                <Skeleton width="100%" height={20} mb={10} />
                                <Skeleton width="100%" height={20} mb={10} />
                                <Skeleton width="100%" height={200} mb={10} />
                            </>
                        ) : (
                            <>
                                <Card.Section>
                                    <Image
                                        src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                                        height={200}
                                        alt={course.courseName}
                                        mt={-10}
                                        withPlaceholder
                                    />
                                </Card.Section>

                                <Card.Section px="sm">
                                    <Stack px="lg">
                                        <Group position="apart" mt="md" mb="xs">
                                            <Title
                                                order={1}
                                                fw={700}
                                                color="dark"
                                                underline
                                            >
                                                {formatCurrency(
                                                    course.coursePrice
                                                )}
                                            </Title>
                                            <Badge color="pink" variant="light">
                                                Giảm giá
                                            </Badge>
                                        </Group>

                                        {course.isPurchase ? (
                                            <>
                                                <Button
                                                    variant="filled"
                                                    color="violet"
                                                    fullWidth
                                                    mt="md"
                                                    onClick={() =>
                                                        navigate(
                                                            '/student/classes'
                                                        )
                                                    }
                                                >
                                                    Đã đăng ký khóa học này
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="filled"
                                                    color="violet"
                                                    fullWidth
                                                    mt="md"
                                                    onClick={() => {
                                                        handleAddCart(course)
                                                    }}
                                                >
                                                    Thêm vào giỏ hàng
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    color="dark"
                                                    fullWidth
                                                    onClick={() => {
                                                        handleCheckOut(course)
                                                    }}
                                                >
                                                    Đăng ký ngay
                                                </Button>
                                            </>
                                        )}

                                        <Stack align="start" mb="sm">
                                            <Text
                                                color="dark"
                                                fw={700}
                                                size="xl"
                                                mt="md"
                                                mb="sm"
                                            >
                                                Khóa học này bao gồm
                                            </Text>
                                            <Group>
                                                <IconDeviceTvOld />
                                                <Text color="dark" size="md">
                                                    {course.courseDuration / 2}{' '}
                                                    buổi học
                                                </Text>
                                            </Group>
                                            <Group>
                                                <IconSourceCode />
                                                <Text color="dark" size="md">
                                                    {listCourseContent.length >
                                                    0
                                                        ? listCourseContent.length
                                                        : 0}{' '}
                                                    Tài nguyên môn học
                                                </Text>
                                            </Group>
                                            <Group>
                                                <IconDeviceMobile />
                                                <Text color="dark" size="md">
                                                    Truy cập từ điện thoại -
                                                    Laptop
                                                </Text>
                                            </Group>
                                            <Group>
                                                <IconInfinity />
                                                <Text color="dark" size="md">
                                                    Truy cập suôt đời
                                                </Text>
                                            </Group>
                                            <Group>
                                                <IconTrophy />
                                                <Text color="dark" size="md">
                                                    Chứng chỉ hoàn thành
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Stack>
                                </Card.Section>
                            </>
                        )}
                    </Card>
                </Container>
            </Box>

            {/* Detail infformation */}
            <Container size="xl" mt="lg">
                <Grid p="md" gutter="xl">
                    <Grid.Col xl={8} lg={8} md={12} sm={12}>
                        {/* content course */}
                        <Box my={rem('2rem')}>
                            <Title order={3} color="dark" fw={700} mb="lg">
                                Nội dung khóa học
                            </Title>
                            <Text color="dark" size="lg">
                                {listCourseContent.length > 0
                                    ? listCourseContent.length
                                    : 0}{' '}
                                bài học - {course.courseDuration} tổng số giờ
                                học.
                            </Text>
                            {!loading && listCourseContent.length === 0 ? (
                                <>
                                    <Box
                                        sx={(theme) => ({
                                            backgroundColor:
                                                theme.colorScheme === 'dark'
                                                    ? theme.colors.dark[6]
                                                    : theme.colors.gray[0],
                                            textAlign: 'center',
                                            padding: theme.spacing.xl,
                                            borderRadius: theme.radius.md,
                                            cursor: 'pointer',

                                            '&:hover': {
                                                backgroundColor:
                                                    theme.colorScheme === 'dark'
                                                        ? theme.colors.dark[5]
                                                        : theme.colors.gray[1]
                                            }
                                        })}
                                    >
                                        <Text
                                            color="dimmed"
                                            size="xl"
                                            fw={500}
                                            align="center"
                                        >
                                            Khóa học hiện chưa có tài nguyên
                                        </Text>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Spoiler
                                        maxHeight={600}
                                        color="dark"
                                        showLabel={
                                            <Center>
                                                <Button
                                                    color="dark"
                                                    variant="default"
                                                    fullWidth
                                                    size="lg"
                                                    mt={8}
                                                >
                                                    Hiển thị tất cả khóa học
                                                </Button>
                                            </Center>
                                        }
                                        hideLabel={
                                            <Center>
                                                <Button
                                                    color="dark"
                                                    variant="default"
                                                    fullWidth
                                                    size="lg"
                                                    mt={8}
                                                >
                                                    Ẩn bớt khóa học
                                                </Button>
                                            </Center>
                                        }
                                    >
                                        <Accordion
                                            variant="contained"
                                            chevronPosition="left"
                                            defaultValue="customization0"
                                        >
                                            {listCourseContent.length > 0 && (
                                                <>
                                                    {listCourseContent.map(
                                                        (
                                                            courseContent,
                                                            index
                                                        ) => (
                                                            <>
                                                                <Accordion.Item
                                                                    value={`customization${index}`}
                                                                    key={index}
                                                                >
                                                                    <Accordion.Control>
                                                                        <Text
                                                                            color="dark"
                                                                            size="lg"
                                                                            fw={
                                                                                500
                                                                            }
                                                                        >
                                                                            {
                                                                                courseContent.lessionTitle
                                                                            }
                                                                        </Text>
                                                                    </Accordion.Control>
                                                                    <Accordion.Panel>
                                                                        <Text
                                                                            color="dark"
                                                                            size="md"
                                                                        >
                                                                            {
                                                                                courseContent.lessionContent
                                                                            }
                                                                        </Text>
                                                                    </Accordion.Panel>
                                                                </Accordion.Item>
                                                            </>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </Accordion>
                                    </Spoiler>
                                </>
                            )}
                        </Box>

                        {/* Requirement */}
                        <Box my={rem('2rem')}>
                            <Text color="dark" fw={700} size="xl" mb="lg">
                                Yêu câu
                            </Text>
                            <List withPadding>
                                <List.Item>
                                    Không cần kinh nghiệm lập trình.
                                </List.Item>
                                <List.Item>
                                    Việc tải xuống và cài đặt được đề cập khi
                                    bắt đầu khóa học.
                                </List.Item>
                                <List.Item>
                                    Kỹ năng máy tính cơ bản: lướt web, chạy
                                    chương trình, lưu và mở tài liệu, v.v.
                                </List.Item>
                            </List>
                        </Box>

                        {/* Description */}
                        <Box my={rem('2rem')}>
                            <Text color="dark" fw={700} size="xl" mb="lg">
                                Mô tả
                            </Text>
                            <Spoiler
                                maxHeight={150}
                                color="dark"
                                showLabel="Hiển thị"
                                hideLabel="Ẩn"
                            >
                                Nếu bạn là nhân viên văn phòng, sinh viên, quản
                                trị viên hoặc chỉ muốn làm việc hiệu quả hơn với
                                máy tính của mình, lập trình sẽ cho phép bạn
                                viết mã có thể tự động hóa các tác vụ tẻ nhạt.
                                Khóa học này dựa trên cuốn sách phổ biến (và
                                miễn phí!), Tự động hóa công việc nhàm chán bằng
                                Python. Automate the Boring Stuff with Python
                                được viết dành cho những người muốn tăng tốc độ
                                viết các chương trình nhỏ thực hiện các tác vụ
                                thực tế càng sớm càng tốt. Bạn không cần biết
                                các thuật toán sắp xếp hoặc lập trình hướng đối
                                tượng, vì vậy khóa học này bỏ qua tất cả khoa
                                học máy tính và tập trung vào việc viết mã để
                                hoàn thành công việc. Khóa học này dành cho
                                người mới bắt đầu hoàn chỉnh và bao gồm ngôn ngữ
                                lập trình Python phổ biến. Bạn sẽ học các khái
                                niệm cơ bản cũng như:
                                <List withPadding>
                                    <List.Item>
                                        rút trích nội dung trang web
                                    </List.Item>
                                    <List.Item>
                                        Phân tích cú pháp bảng tính PDF và Excel
                                    </List.Item>
                                    <List.Item>
                                        Tự động hóa bàn phím và chuột
                                    </List.Item>
                                    <List.Item>Gửi email và văn bản</List.Item>
                                    <List.Item>
                                        Và một số chủ đề thiết thực khác
                                    </List.Item>
                                </List>
                                Khi kết thúc khóa học này, bạn sẽ có thể viết mã
                                không chỉ làm tăng đáng kể năng suất của bạn mà
                                còn có thể liệt kê kỹ năng thú vị và sáng tạo
                                này vào sơ yếu lý lịch của bạn.
                            </Spoiler>
                        </Box>

                        {/*  new course */}
                        <Box my={rem('2rem')}>
                            <Text color="dark" fw={700} size="xl" mb="lg">
                                Những khóa học mới
                            </Text>

                            {loading ? (
                                <>
                                    <Skeleton
                                        height={20}
                                        width="100%"
                                        mb={10}
                                    />
                                    <Skeleton height={80} width="100%" />
                                </>
                            ) : (
                                <>
                                    <Spoiler
                                        maxHeight={400}
                                        color="dark"
                                        showLabel={
                                            <Center>
                                                <Button
                                                    color="dark"
                                                    variant="default"
                                                    size="lg"
                                                >
                                                    Hiển thị tất cả khóa học
                                                </Button>
                                            </Center>
                                        }
                                        hideLabel={
                                            <Center>
                                                <Button
                                                    color="dark"
                                                    variant="default"
                                                    size="lg"
                                                >
                                                    Ẩn bớt khóa học
                                                </Button>
                                            </Center>
                                        }
                                    >
                                        {loading ? (
                                            <>
                                                <Skeleton
                                                    width={'100%'}
                                                    height={85}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {newstCourse.map(
                                                    (course, index) => (
                                                        <>
                                                            <Link
                                                                to={`/course/${course.courseId}`}
                                                                key={index}
                                                                onClick={() => {
                                                                    // handleSwitchCourse()
                                                                }}
                                                            >
                                                                <Card>
                                                                    <Card.Section>
                                                                        <Grid>
                                                                            <Grid.Col
                                                                                span={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <Image
                                                                                    src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                                                                                    alt={
                                                                                        course.courseName
                                                                                    }
                                                                                    height={
                                                                                        82
                                                                                    }
                                                                                    withPlaceholder
                                                                                />
                                                                            </Grid.Col>
                                                                            <Grid.Col
                                                                                span={
                                                                                    10
                                                                                }
                                                                            >
                                                                                <Grid>
                                                                                    <Grid.Col
                                                                                        span={
                                                                                            7
                                                                                        }
                                                                                    >
                                                                                        <Stack>
                                                                                            <Text
                                                                                                color="dark"
                                                                                                fw={
                                                                                                    700
                                                                                                }
                                                                                                fz="xl"
                                                                                                lineClamp={
                                                                                                    1
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    course.courseName
                                                                                                }
                                                                                            </Text>
                                                                                            <Text color="dimmed">
                                                                                                {
                                                                                                    course.courseDuration
                                                                                                }{' '}
                                                                                                giờ{' '}
                                                                                                -{' '}
                                                                                                {course.courseDuration /
                                                                                                    2}{' '}
                                                                                                buổi
                                                                                                học
                                                                                            </Text>
                                                                                        </Stack>
                                                                                    </Grid.Col>
                                                                                    <Grid.Col
                                                                                        span={
                                                                                            5
                                                                                        }
                                                                                    >
                                                                                        <Group position="apart">
                                                                                            <Text
                                                                                                color="dark"
                                                                                                fz="xl"
                                                                                                lineClamp={
                                                                                                    1
                                                                                                }
                                                                                            >
                                                                                                {course.rating ===
                                                                                                'NaN'
                                                                                                    ? 5
                                                                                                    : parseFloat(
                                                                                                          course.rating
                                                                                                      ).toFixed(
                                                                                                          1
                                                                                                      )}
                                                                                                <IconStarFilled
                                                                                                    style={{
                                                                                                        color: '#f6ad06',
                                                                                                        marginTop:
                                                                                                            '-5px',
                                                                                                        marginLeft:
                                                                                                            '5px'
                                                                                                    }}
                                                                                                />
                                                                                            </Text>
                                                                                            <Text
                                                                                                color="dark"
                                                                                                fz="lg"
                                                                                                fw={
                                                                                                    500
                                                                                                }
                                                                                            >
                                                                                                {formatCurrency(
                                                                                                    course.coursePrice
                                                                                                )}
                                                                                            </Text>
                                                                                        </Group>
                                                                                    </Grid.Col>
                                                                                </Grid>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                    </Card.Section>
                                                                </Card>
                                                                <Divider />
                                                            </Link>
                                                        </>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </Spoiler>
                                </>
                            )}
                        </Box>

                        {/*  Comment */}
                        <Box my={rem('2rem')}>
                            <Text color="dark" fw={700} size="xl" mb="lg">
                                Phản hồi người dùng
                            </Text>

                            {/* Check if user purchase course */}
                            {course.isPurchase && (
                                <Stack mb={8}>
                                    <Rating
                                        fractions={2}
                                        defaultValue={0}
                                        value={evaluateRequest.rating}
                                        onChange={(newValue) =>
                                            setEvaluateRequest({
                                                ...evaluateRequest,
                                                rating: newValue
                                            })
                                        }
                                    />
                                    <Textarea
                                        minRows={2}
                                        placeholder="Đánh giá khóa học"
                                        name="content"
                                        value={evaluateRequest.content}
                                        onChange={(e) =>
                                            handleOnChangeEvaluate(e)
                                        }
                                    />
                                    <Button
                                        variant="filled"
                                        color="dark"
                                        size="md"
                                        ml="auto"
                                        mb="lg"
                                        onClick={() => handleCreateEvaluate()}
                                    >
                                        Đánh giá khóa học
                                    </Button>
                                </Stack>
                            )}

                            {listEvaluate.length === 0 && !loading ? (
                                <>
                                    <Box
                                        sx={(theme) => ({
                                            backgroundColor:
                                                theme.colorScheme === 'dark'
                                                    ? theme.colors.dark[6]
                                                    : theme.colors.gray[0],
                                            textAlign: 'center',
                                            padding: theme.spacing.xl,
                                            borderRadius: theme.radius.md,
                                            cursor: 'pointer',

                                            '&:hover': {
                                                backgroundColor:
                                                    theme.colorScheme === 'dark'
                                                        ? theme.colors.dark[5]
                                                        : theme.colors.gray[1]
                                            }
                                        })}
                                    >
                                        <Text
                                            color="dimmed"
                                            fw={700}
                                            size="md"
                                            align="center"
                                        >
                                            Khóa học hiện chưa có phản hồi nào
                                        </Text>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Grid gutter="xl">
                                        {/* Item */}
                                        {listEvaluate.length > 0 && (
                                            <>
                                                {currentItems.map(
                                                    (evaluate, index) => (
                                                        <>
                                                            <Grid.Col
                                                                xl={6}
                                                                lg={6}
                                                                md={12}
                                                                sm={12}
                                                                key={index}
                                                            >
                                                                <Stack>
                                                                    <Divider />
                                                                    <Group>
                                                                        <Avatar
                                                                            src={`${PUBLIC_IMAGE}/students/${evaluate.studentImage}`}
                                                                            alt={
                                                                                evaluate.studentName
                                                                            }
                                                                            radius="xl"
                                                                        />
                                                                        <Stack spacing="xs">
                                                                            <Group
                                                                                w="100%"
                                                                                position="apart"
                                                                            >
                                                                                <Text
                                                                                    size="sm"
                                                                                    m={
                                                                                        0
                                                                                    }
                                                                                    p={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        evaluate.studentName
                                                                                    }
                                                                                </Text>
                                                                                {user !==
                                                                                null ? (
                                                                                    <>
                                                                                        {evaluate.studentId ===
                                                                                            user.username && (
                                                                                            <ActionIcon
                                                                                                color="red"
                                                                                                variant="light"
                                                                                                onClick={() =>
                                                                                                    handleDeleteEvaluate(
                                                                                                        evaluate.evaluateId
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <IconTrash size="1rem" />
                                                                                            </ActionIcon>
                                                                                        )}
                                                                                        {/* {evaluate.studentId ===
                                                                                            user.username && (
                                                                                            <ActionIcon
                                                                                                color="indigo"
                                                                                                variant="light"
                                                                                                onClick={() =>
                                                                                                    handleUpdateEvaluate(
                                                                                                        evaluate.evaluateId
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <IconPencil size="1rem" />
                                                                                            </ActionIcon>
                                                                                        )} */}
                                                                                    </>
                                                                                ) : (
                                                                                    <>

                                                                                    </>
                                                                                )}
                                                                            </Group>
                                                                            <Text
                                                                                size="xs"
                                                                                m={
                                                                                    0
                                                                                }
                                                                                p={
                                                                                    0
                                                                                }
                                                                                c="dimmed"
                                                                            >
                                                                                {moment(
                                                                                    evaluate.reviewDate
                                                                                ).format(
                                                                                    'DD-MM-yyyy h:m:s A'
                                                                                )}
                                                                            </Text>
                                                                            <Group
                                                                                m={
                                                                                    0
                                                                                }
                                                                                p={
                                                                                    0
                                                                                }
                                                                            >
                                                                                <Rating
                                                                                    fractions={
                                                                                        2
                                                                                    }
                                                                                    defaultValue={
                                                                                        evaluate.rating
                                                                                    }
                                                                                    readOnly
                                                                                />
                                                                            </Group>
                                                                        </Stack>
                                                                    </Group>
                                                                    <Text
                                                                        pl={54}
                                                                        size="md"
                                                                        color="dark"
                                                                    >
                                                                        {
                                                                            evaluate.content
                                                                        }
                                                                    </Text>
                                                                </Stack>
                                                            </Grid.Col>
                                                        </>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </Grid>
                                </>
                            )}

                            {listEvaluate.length > itemsPerPage && (
                                <Center mt={20}>
                                    <Pagination
                                        total={totalItems}
                                        color="violet"
                                        withEdges
                                        value={currentPage}
                                        onChange={handlePaginationChange}
                                        itemsPerPage={itemsPerPage}
                                    />
                                </Center>
                            )}
                        </Box>
                    </Grid.Col>
                    <Grid.Col xl={4} lg={4} md={12} sm={12}></Grid.Col>
                </Grid>
            </Container>
        </>
    )
}

export default CourseDetailClient
