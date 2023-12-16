import { Carousel } from '@mantine/carousel'
import {
    Affix,
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Flex,
    getStylesRef,
    Grid,
    Group,
    Image,
    Rating,
    rem,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Transition
} from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { breakpoints } from '@mui/system'
import {
    IconArrowAutofitRight,
    IconArrowUp,
    IconCalendarTime,
    IconCertificate,
    IconCloudNetwork,
    IconCoin,
    IconSubtask,
    IconUserCheck
} from '@tabler/icons-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Dots from '../../../utils/Dots'

// scss import
import classes from '../../../assets/scss/custom-module-scss/client-custom/home/FeaturesAsymmetrical.module.scss'
import classHeroText from '../../../assets/scss/custom-module-scss/client-custom/home/HeroText.module.scss'
import cartStyle from '../../../assets/scss/custom-module-scss/client-custom/cart/cart.module.scss'

// API
import { Link, useNavigate } from 'react-router-dom'
import courseApi from '../../../api/courseApi'
import evaluateApi from '../../../api/evaluateApi'

import { toast, ToastContainer } from 'react-toastify'

// Component import
import ClientModal from '../../../components/modals/ClientModal'

// Utils
import Notify from '../../../utils/Notify'
import { formatCurrency } from '../../../utils/formater'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const recommentTopic = [
    {
        title: 'NextJS',
        titleSecond: 'React'
    },
    {
        title: 'Angular',
        titleSecond: 'Javascript'
    },
    {
        title: 'C#',
        titleSecond: 'Java'
    },
    {
        title: 'NodeJS',
        titleSecond: 'Golang'
    },
    {
        title: 'C/C++',
        titleSecond: 'Ruby'
    },
    {
        title: 'Laravel',
        titleSecond: 'PHP'
    },
    {
        title: 'PortgreSQL',
        titleSecond: 'Figma'
    }
]

const mockdata = [
    {
        icon: IconCalendarTime,
        title: 'Học ở mọi nơi bạn muốn',
        description:
            'Hệ thống học tập của chúng tôi rất tự do giờ giấc cũng như cách thứ bạn học tập, bạn có thể ngồi ở nhà hoặc đến trung tâm.'
    },
    {
        icon: IconCertificate,
        title: 'Những khóa học chất lượng',
        description:
            'Chúng tôi cung cấp những khóa học chất lượng trên từng giây học tập, bạn có thể trở thành lập trình viên chỉ sau 6 tháng '
    },
    {
        icon: IconCoin,
        title: 'Giá cả rất phải chăng',
        description:
            'Chúng tôi cung cấp những khóa học chất lượng với giá cả cực kì phải chăng, chỉ bằng vài ly trà sữa'
    }
]

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    let navigate = useNavigate()

    // Main Variable
    const [newestCourse, setNewestCourse] = useState([])
    const [bestSellingCourse, setBestSellingCourse] = useState([])
    const [listEvaluate, SetListEvaluate] = useState([])
    const [loading, setLoading] = useState(false)
    const [scroll, scrollTo] = useWindowScroll()
    const [modalLogin, setModalLogin] = useState(false)

    const fetchNewestCourse = async () => {
        setLoading(true)
        try {
            const resp = await courseApi.getNewestCourse(
                user !== null ? user.username : ''
            )

            if (resp.status === 200 && resp.data.length > 0) {
                setNewestCourse(resp.data)
                console.log(resp.data)
            } else {
                console.log('cannot get data')
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTopBestSellingCourse = async () => {
        setLoading(true)
        try {
            const resp = await courseApi.getTopSellingCourse(
                user !== null ? user.username : ''
            )

            if (resp.status === 200 && resp.data.length > 0) {
                setBestSellingCourse(resp.data)
                console.log(resp.data)
            } else {
                console.log('cannot get data best selling')
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchEvaluate = async () => {
        try {
            const resp = await evaluateApi.getNewestEvaluate()

            if (resp.status === 200 && resp.data.length > 0) {
                SetListEvaluate(resp.data)
                console.log(resp.data)
            } else {
                console.log('cannot get data best selling')
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const formatTimeAgo = (reviewDate) => {
        const currentDate = new Date()
        const targetDate = new Date(reviewDate)

        const timeDifference = currentDate - targetDate
        const seconds = Math.floor(timeDifference / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        if (years > 0) {
            return years === 1 ? '1 năm trước' : `${years} năm trước`
        } else if (months > 0) {
            return months === 1 ? '1 tháng trước' : `${months} tháng trước`
        } else if (days > 0) {
            return days === 1 ? '1 ngày trước' : `${days} ngày trước`
        } else if (hours > 0) {
            return hours === 1 ? '1 giờ trước' : `${hours} giờ trước`
        } else if (minutes > 0) {
            return minutes === 1 ? '1 phút trước' : `${minutes} phút trước`
        } else {
            return 'vừa mới'
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

        if (user === null) {
            // toast.update(
            //     id,
            //     Notify.options.createErrorParam(
            //         'Vui lòng đăng nhập trước khi thanh toán'
            //     )
            // )
            setModalLogin(true)
            return
        }

        const id = toast(Notify.msg.loading, Notify.options.loading())
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

    const handleCloseModal = (isOpen) => {
        isOpen === true && setModalLogin(false)
    }

    const navigateToStudent = (e) => {
        e.preventDefault()
        navigate('/student/classes')
    }

    // learnext course Carousel
    const LearnNextSlides = newestCourse.map(
        (learn, index) =>
            !learn.isPurchase && (
                <Carousel.Slide key={index}>
                    <Card className={`${cartStyle['card-hover-overlay']}`}>
                        <Card.Section>
                            <Image
                                src={`${PUBLIC_IMAGE}/avatars/courses/${learn.image}`}
                                fit="cover"
                                width={'100%'}
                                height={200}
                                radius="sm"
                                withPlaceholder
                            />
                        </Card.Section>

                        <Box>
                            <Text fw={500} lineClamp={1} fs="lg">
                                {learn.courseName}
                            </Text>
                            <Box>
                                <Flex justify="flex-start" gap="sm">
                                    <Text>
                                        {learn.rating === 'NaN'
                                            ? 0
                                            : parseFloat(learn.rating).toFixed(
                                                  1
                                              )}
                                    </Text>
                                    <Group position="center">
                                        <Rating
                                            value={
                                                learn.rating === 'NaN'
                                                    ? 0
                                                    : learn.rating
                                            }
                                            fractions={2}
                                            readOnly
                                        />
                                    </Group>
                                    <Text c="dimmed">
                                        ({learn.reviewNumber})
                                    </Text>
                                </Flex>
                            </Box>
                            <Box>
                                <Text fw={500}>
                                    {formatCurrency(learn.coursePrice)}
                                </Text>
                            </Box>
                        </Box>

                        {/* Overlay đây nha */}
                        <Link to={`/course/${learn.courseId}`}>
                            <Box className={cartStyle.overlay}>
                                {learn.isPurchase ? (
                                    <>
                                        <Button
                                            color="violet"
                                            fullWidth
                                            onClick={(e) =>
                                                navigateToStudent(e)
                                            }
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
                                            onClick={(e) =>
                                                handleAddCart(learn, e)
                                            }
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
                                                        background:
                                                            'transparent'
                                                    }
                                                }
                                            }}
                                            onClick={(e) =>
                                                handleCheckOutNow(learn, e)
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
            )
    )

    // learnext course Carousel
    const bestSellingslides = bestSellingCourse.map((learn, index) => (
        <Carousel.Slide key={index}>
            <Card className={`${cartStyle['card-hover-overlay']}`}>
                <Card.Section>
                    <Image
                        src={`${PUBLIC_IMAGE}/avatars/courses/${learn.image}`}
                        fit="cover"
                        width={'100%'}
                        height={200}
                        radius="sm"
                        withPlaceholder
                    />
                </Card.Section>

                <Box>
                    <Text fw={500} lineClamp={1} fs="lg">
                        {learn.courseName}
                    </Text>
                    <Box>
                        <Flex justify="flex-start" gap="sm">
                            <Text>
                                {learn.rating === 'NaN'
                                    ? 0
                                    : parseFloat(learn.rating).toFixed(1)}
                            </Text>
                            <Group position="center">
                                <Rating
                                    value={
                                        learn.rating === 'NaN'
                                            ? 0
                                            : learn.rating
                                    }
                                    fractions={2}
                                    readOnly
                                />
                            </Group>
                            <Text c="dimmed">({learn.reviewNumber})</Text>
                        </Flex>
                    </Box>
                    <Box>
                        <Text fw={500}>
                            {formatCurrency(learn.coursePrice)}
                        </Text>
                    </Box>
                </Box>

                {/* Overlay đây nha */}
                <Link to={`/course/${learn.courseId}`}>
                    <Box className={cartStyle.overlay}>
                        {learn.isPurchase ? (
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
                                    onClick={(e) => handleAddCart(learn, e)}
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
                                    onClick={(e) => handleCheckOutNow(learn, e)}
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

    // evaluate
    const evaluateSlides = listEvaluate.map((evaluate, index) => (
        <Carousel.Slide key={index}>
            <Link to={`/course/${evaluate.courseId}`}>
                <Card withBorder shadow="xl" h={250}>
                    <Stack>
                        <Group position="left">
                            <Text color="dark" lineClamp={2} size="md" fw={500}>
                                <span className="text-primary">Khóa học:</span>{' '}
                                {evaluate.courseName}
                            </Text>
                        </Group>
                        <Group>
                            <Avatar
                                src={`${PUBLIC_IMAGE}/avatars/accounts/${evaluate.studentImage}`}
                                alt={evaluate.studentName}
                                radius="xl"
                            />
                            <Stack spacing="xs">
                                <Text
                                    size="xs"
                                    m={0}
                                    p={0}
                                    c="dimmed"
                                    lineClamp={1}
                                >
                                    Đã đánh giá{' '}
                                    {formatTimeAgo(evaluate.reviewDate)}
                                </Text>
                                <Text
                                    size="md"
                                    color="dark"
                                    fw={500}
                                    m={0}
                                    p={0}
                                    lineClamp={1}
                                >
                                    {evaluate.studentName}
                                </Text>
                                <Group m={0} p={0}>
                                    <Rating
                                        fractions={2}
                                        value={evaluate.rating}
                                        readOnly
                                    />
                                </Group>
                            </Stack>
                        </Group>
                        <Text size="md" color="dark" lineClamp={2} mah={80}>
                            {evaluate.content}
                        </Text>
                    </Stack>
                </Card>
            </Link>
        </Carousel.Slide>
    ))

    // recommentTopic
    const recommentTopicSlides = recommentTopic.map((learn, index) => (
        <Carousel.Slide key={index}>
            <Card className="card-hover-overlay">
                <Card.Section>
                    <Flex direction="column" wrap="wrap">
                        <Button
                            variant="filled"
                            color="violet"
                            radius="xs"
                            size="md"
                            mb="lg"
                            w={170}
                        >
                            <Text color="#fff">{learn.title}</Text>
                        </Button>
                        <Button
                            variant="gradient"
                            color="violet"
                            radius="xs"
                            size="md"
                            w={170}
                        >
                            <Text color="#fff">{learn.titleSecond}</Text>
                        </Button>
                    </Flex>
                </Card.Section>
            </Card>
        </Carousel.Slide>
    ))

    // Feature
    function Feature({ icon: Icon, title, description }) {
        return (
            <div className="shadow p-4 rounded">
                <ThemeIcon variant="light" size={40} radius={40}>
                    <Icon
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                    />
                </ThemeIcon>
                <Text mt="sm" mb={7} fw={700} color="dark">
                    {title}
                </Text>
                <Text size="sm" c="dimmed" lh={1.6} fw={500}>
                    {description}
                </Text>
            </div>
        )
    }

    //  Feature section
    Feature.propTypes = {
        icon: PropTypes.elementType,
        title: PropTypes.string,
        description: PropTypes.string
    }

    const features = mockdata.map((feature, index) => (
        <Feature {...feature} key={index} />
    ))

    // UseEffect AREA
    useEffect(() => {
        fetchNewestCourse()
        fetchTopBestSellingCourse()
        fetchEvaluate()
    }, [])

    return (
        <>
            <ToastContainer />

            {/* Modal login */}
            <ClientModal
                isOpen={modalLogin}
                handleCloseModal={handleCloseModal}
            />

            <Container size="xl">
                {/* Hero section */}
                <Group className={classHeroText.wrapper} size={1400}>
                    <Dots
                        className={classHeroText.dots}
                        style={{ left: 0, top: 0 }}
                    />
                    <Dots
                        className={classHeroText.dots}
                        style={{ left: 60, top: 0 }}
                    />
                    <Dots
                        className={classHeroText.dots}
                        style={{ left: 0, top: 140 }}
                    />
                    <Dots
                        className={classHeroText.dots}
                        style={{ right: 0, top: 60 }}
                    />
                    <Dots
                        className={classHeroText.dots}
                        style={{ right: 0, top: 200 }}
                    />

                    <Box mx={'auto'}>
                        <Title
                            className={classHeroText.title}
                            maw={700}
                            color="dark"
                            align="center"
                            order={1}
                        >
                            Tham gia cùng với
                            <Text
                                component="span"
                                className={classHeroText.highlight}
                                mx={rem('0.5rem')}
                                inherit
                            >
                                hàng triệu
                            </Text>
                            sinh viên tại F4 Education.
                        </Title>
                        <br />
                        <Title
                            order={5}
                            maw={600}
                            size="lg"
                            c="dimmed"
                            className={classHeroText.description}
                        >
                            Học những khóa học lập trình mà bạn thích Java,
                            Python, Reactjs , Ruby,... cùng hàng trăm những khóa
                            học về kỹ năng giao tiếp, kỹ năng thực chiến khác
                            đang chờ đợi các bạn tham gia.
                        </Title>
                        <br />
                        <div className={classHeroText.controls}>
                            <Link to="/courses">
                                <Button
                                    className={classHeroText.control}
                                    size="lg"
                                    variant="default"
                                    color="gray"
                                >
                                    Xem khóa học
                                </Button>
                            </Link>
                            <Link to={'/client-register'}>
                                <Button
                                    className={classHeroText.control}
                                    size="lg"
                                    ml={rem(3)}
                                >
                                    Đăng ký tài khoản
                                </Button>
                            </Link>
                        </div>
                    </Box>
                </Group>

                {/* Feature section */}
                <Group position="apart" className={classes.wrapper}>
                    <Title
                        className={classes.title}
                        align="center"
                        color="dark"
                    >
                        Nâng cấp khả năng và kiến thức của bạn
                    </Title>

                    <br />

                    <Title
                        order={5}
                        size="sm"
                        className={classes.description}
                        align="center"
                        maw={600}
                        color="dimmed"
                    >
                        Cung cấp cho bạn và nhóm của bạn kiến ​​thức, kinh
                        nghiệm và sự tự tin mà bạn và họ cần để giải quyết mọi
                        vấn đề.
                    </Title>

                    <SimpleGrid
                        mt={60}
                        cols={3}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 'md', cols: 3, spacing: 'md' },
                            { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                            { maxWidth: 'xs', cols: 1, spacing: 'sm' }
                        ]}
                    >
                        {features}
                    </SimpleGrid>
                </Group>

                {/* newest course*/}
                <Box mt={rem('1rem')}>
                    <Title order={1} mt="lg" fw={700} color="dark">
                        Những khóa học mới nhất
                    </Title>
                    <Text size={'xl'} c="dimmed" maw={600} mb="md">
                        Chúng tôi có những khóa học mới nhất và chất lượng nhất
                    </Text>
                    <Box>
                        {loading ? (
                            <>
                                <Skeleton
                                    width="100%"
                                    height={200}
                                    radius="sm"
                                    mb="md"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    mb="sm"
                                    radius="sm"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    mb="sm"
                                    radius="sm"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    radius="sm"
                                />
                            </>
                        ) : (
                            <>
                                <Carousel
                                    slideSize="20%"
                                    height="300px"
                                    slideGap="lg"
                                    controlsOffset="xs"
                                    align="start"
                                    dragFree
                                    loop
                                    controlSize={35}
                                    slidesToScroll={breakpoints ? 3 : 1}
                                    styles={{
                                        control: {
                                            background: '#212121',
                                            color: '#fff',
                                            fontSize: rem(35),
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
                                                [`& .${getStylesRef(
                                                    'controls'
                                                )}`]: {
                                                    opacity: 1
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {LearnNextSlides}
                                </Carousel>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Top sell course*/}
                <Box>
                    <Title order={1} mt="lg" mb="md" fw={700} color="dark">
                        Những khóa học bán chạy nhất
                    </Title>
                    <Box>
                        {loading ? (
                            <>
                                <Skeleton
                                    width="100%"
                                    height={200}
                                    radius="sm"
                                    mb="md"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    mb="sm"
                                    radius="sm"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    mb="sm"
                                    radius="sm"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    radius="sm"
                                />
                            </>
                        ) : (
                            <>
                                <Carousel
                                    slideSize="20%"
                                    height="300px"
                                    slideGap="lg"
                                    controlsOffset="xs"
                                    align="start"
                                    dragFree
                                    loop
                                    controlSize={35}
                                    slidesToScroll={breakpoints ? 3 : 1}
                                    styles={{
                                        control: {
                                            background: '#212121',
                                            color: '#fff',
                                            fontSize: rem(35),
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
                                                [`& .${getStylesRef(
                                                    'controls'
                                                )}`]: {
                                                    opacity: 1
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {bestSellingslides}
                                </Carousel>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Topic recomment*/}
                <Box my={rem('5rem')}>
                    <Title order={1} mt="lg" fw={700} color="dark" mb="lg">
                        Những chủ đề gợi ý cho bạn
                    </Title>
                    <Box>
                        <Carousel
                            slideSize="20%"
                            height={'auto'}
                            slideGap="lg"
                            controlsOffset="xs"
                            align="start"
                            dragFree
                            loop
                            slidesToScroll={breakpoints ? 3 : 1}
                            styles={{
                                control: {
                                    background: '#212121',
                                    color: '#fff',
                                    fontSize: rem(25),
                                    '&[data-inactive]': {
                                        opacity: 0,
                                        cursor: 'default'
                                    }
                                }
                            }}
                        >
                            {recommentTopicSlides}
                        </Carousel>
                    </Box>
                </Box>
            </Container>

            {/* Other section */}
            <Box bg="#10162f" p={rem('2rem')}>
                <Container>
                    <Grid grow>
                        <Grid.Col xl={6} lg={6} md={12} sm={12} py="auto">
                            <Box>
                                <Title
                                    order={1}
                                    color="#fff"
                                    fw={700}
                                    mx="auto"
                                    mt="md"
                                    align="center"
                                    maw={300}
                                >
                                    Gia nhập với chúng tôi ngay.
                                </Title>
                            </Box>
                        </Grid.Col>
                        <Grid.Col xl={6} lg={6} md={12} sm={12}>
                            <Group position="apart">
                                <Flex
                                    gap="md"
                                    justify="center"
                                    align="center"
                                    direction="column"
                                    wrap="wrap"
                                >
                                    <Title order={1} color="#fff" fw={700}>
                                        1M
                                    </Title>
                                    <Text color="#fff" fw={700}>
                                        Học viên
                                    </Text>
                                    <IconUserCheck
                                        size={rem('2rem')}
                                        color="#fff"
                                    />
                                </Flex>
                                <Flex
                                    gap="md"
                                    justify="center"
                                    align="center"
                                    direction="column"
                                    wrap="wrap"
                                >
                                    <Title order={1} color="#fff" fw={700}>
                                        10+
                                    </Title>
                                    <Text color="#fff" fw={700}>
                                        Quốc gia
                                    </Text>
                                    <IconCloudNetwork
                                        size={rem('2rem')}
                                        color="#fff"
                                    />
                                </Flex>
                                <Flex
                                    gap="md"
                                    justify="center"
                                    align="center"
                                    direction="column"
                                    wrap="wrap"
                                >
                                    <Title order={1} color="#fff" fw={700}>
                                        100+
                                    </Title>
                                    <Text color="#fff" fw={700}>
                                        Khóa học
                                    </Text>
                                    <IconSubtask
                                        size={rem('2rem')}
                                        color="#fff"
                                    />
                                </Flex>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            {/* Sub Footer section */}
            <Box mt={rem('2rem')} p={rem('2rem')}>
                <Flex direction={'column'} justify="center" align={'center'}>
                    <Title order={1} color="dark" mx={'auto'}>
                        Bắt đầu và nâng cao kỹ năng của bạn
                    </Title>
                    <Text
                        color="dimmed"
                        align="center"
                        maw={500}
                        mx={'auto'}
                        my={rem('1.5rem')}
                    >
                        Cung cấp những khóa học lập trình, kiến thức bạn cần để
                        có thể học tập và đi làm chỉ trong 9 tháng.
                    </Text>
                    <Link to="/auth/login">
                        <Button
                            variant="filled"
                            color="violet"
                            size="lg"
                            uppercase
                        >
                            Đăng ký ngay
                        </Button>
                    </Link>
                </Flex>
            </Box>

            {/* Evaluate */}
            <Container size="xl">
                <Box mt={rem('2rem')}>
                    <Title order={1} mt="lg" mb="md" fw={700} color="dark">
                        Học viên nghĩ gì về khóa học
                    </Title>
                    <Box>
                        {loading ? (
                            <>
                                <Skeleton
                                    width="100%"
                                    height={200}
                                    radius="sm"
                                    mb="md"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    mb="sm"
                                    radius="sm"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    mb="sm"
                                    radius="sm"
                                />
                                <Skeleton
                                    width="100%"
                                    height={10}
                                    radius="sm"
                                />
                            </>
                        ) : (
                            <>
                                <Carousel
                                    slideSize="25%"
                                    height="250px"
                                    slideGap="lg"
                                    controlsOffset="xs"
                                    align="start"
                                    dragFree
                                    loop
                                    controlSize={40}
                                    slidesToScroll={breakpoints ? 3 : 1}
                                    styles={{
                                        control: {
                                            background: '#212121',
                                            color: '#fff',
                                            fontSize: rem(35),
                                            ref: getStylesRef('controls'),
                                            transition: 'opacity 150ms ease'
                                        }
                                    }}
                                >
                                    {evaluateSlides}
                                </Carousel>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>

            {/* Contact section */}
            <Box py={rem('2rem')}>
                <Flex direction={'column'} justify="center" align={'center'}>
                    <Text
                        color="dimmed"
                        align="center"
                        maw={500}
                        mx={'auto'}
                        my={rem('1.5rem')}
                    >
                        Cần hỗ trợ, liên hệ cho chúng tôi ngay bây giờ.
                    </Text>
                    <Title
                        order={1}
                        color="dark"
                        mx={'auto'}
                        component="a"
                        href="mailTo:tronghientran18@gmail.com"
                    >
                        F4 Education <IconArrowAutofitRight />
                    </Title>
                </Flex>
            </Box>

            {/* Affix Button */}
            <Affix
                position={{ bottom: rem(-20), right: rem(20) }}
                h={'150px'}
                opacity={'0.7'}
            >
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            color="dark"
                            size="xs"
                            // radius={'xl'}
                            className="rounded-circle p-2"
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            <IconArrowUp size="1rem" />
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    )
}
export default Home
