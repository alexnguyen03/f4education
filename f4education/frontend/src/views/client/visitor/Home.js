import { Carousel } from '@mantine/carousel'
import {
    Affix,
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
    IconCoin
} from '@tabler/icons-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Dots from '../../../utils/Dots'

// scss import
import classes from '../../../assets/scss/custom-module-scss/client-custom/home/FeaturesAsymmetrical.module.scss'
import classHeroText from '../../../assets/scss/custom-module-scss/client-custom/home/HeroText.module.scss'

// API
import courseApi from '../../../api/courseApi'
import { Link, useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../../utils/Notify'
import cartStyle from '../../../assets/scss/custom-module-scss/client-custom/cart/cart.module.scss'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const recommentTopic = [
    {
        title: 'Python',
        titleSecond: 'ReactJS'
    },
    {
        title: 'Khoa học máy tính',
        titleSecond: 'NextJS'
    },
    {
        title: 'Nghiên cứu AI',
        titleSecond: 'JavaScript'
    },
    {
        title: 'R (Ngôn ngữ lập trình)',
        titleSecond: 'Tư duy lập trình'
    },
    {
        title: 'Deep learning',
        titleSecond: 'Giải thuật'
    },
    {
        title: 'Artificial Intelligence',
        titleSecond: 'Cấu trúc dữ liệu'
    },
    {
        title: 'Web scrapping',
        titleSecond: 'Cấu trúc dữ liệu'
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
            'Tim của Slakoth chỉ đập một lần một phút. Dù có chuyện gì xảy ra đi nữa, việc đi loanh quanh bất động là bằng lòng.'
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
    const [loading, setLoading] = useState(false)
    const [scroll, scrollTo] = useWindowScroll()

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
            const selectedCart = await handleAddCart(course,e)

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

    // learnext course Carousel
    const LearnNextSlides = newestCourse.map((learn, index) => (
        <Carousel.Slide key={index}>
            {!loading ? (
                <>
                    <Card className={`${cartStyle['card-hover-overlay']}`}>
                        <Card.Section>
                            <Image
                                src={`${PUBLIC_IMAGE}/courses/${learn.image}`}
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
                                            ? 5
                                            : learn.rating}
                                    </Text>
                                    <Group position="center">
                                        <Rating
                                            value={
                                                learn.rating === 'NaN'
                                                    ? 5
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
                                    {learn.coursePrice.toLocaleString('it-IT', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}
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
                </>
            ) : (
                <>
                    <Skeleton height={200} radius="sm" mb="sm" />
                    <Skeleton height={8} radius="xl" />
                    <Skeleton height={8} radius="xl" />
                    <Skeleton height={8} radius="xl" />
                </>
            )}
        </Carousel.Slide>
    ))

    // learnext course Carousel
    const bestSellingslides = bestSellingCourse.map((learn, index) => (
        <Carousel.Slide key={index}>
            {/* Target Hover */}
            {!loading ? (
                <>
                    <Card className={`${cartStyle['card-hover-overlay']}`}>
                        <Card.Section>
                            <Image
                                src={`${PUBLIC_IMAGE}/courses/${learn.image}`}
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
                                            ? 5
                                            : learn.rating}
                                    </Text>
                                    <Group position="center">
                                        <Rating
                                            value={
                                                learn.rating === 'NaN'
                                                    ? 5
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
                                    {learn.coursePrice.toLocaleString('it-IT', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}
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
                </>
            ) : (
                <>
                    <Skeleton height={200} radius="sm" mb="sm" />
                    <Skeleton height={8} radius="xl" />
                    <Skeleton height={8} radius="xl" />
                    <Skeleton height={8} radius="xl" />
                </>
            )}
        </Carousel.Slide>
    ))

    // recommentTopic
    const recommentTopicSlides = recommentTopic.map((learn, index) => (
        <Carousel.Slide key={index}>
            <Card className="card-hover-overlay">
                <Card.Section>
                    <Flex direction="column" wrap="wrap">
                        <Button
                            variant="outline"
                            color="dark"
                            radius="xs"
                            size="md"
                            mb="lg"
                            w={170}
                        >
                            <Text color="dark">{learn.title}</Text>
                        </Button>
                        <Button
                            variant="outline"
                            color="dark"
                            radius="xs"
                            size="md"
                            w={170}
                        >
                            <Text color="dark">{learn.titleSecond}</Text>
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
    }, [])

    return (
        <>
            <ToastContainer />

            <Container size="xl">
                {/* Hero section */}
                <Group
                    className={classHeroText.wrapper}
                    size={1400}
                    mb={rem('5rem')}
                >
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
                            <Link to="/course">
                                <Button
                                    className={classHeroText.control}
                                    size="lg"
                                    variant="default"
                                    color="gray"
                                >
                                    Xem khóa học
                                </Button>
                            </Link>
                            <Button
                                className={classHeroText.control}
                                size="lg"
                                ml={rem(3)}
                            >
                                Đăng ký tài khoản
                            </Button>
                        </div>
                    </Box>
                </Group>

                {/* Feature section */}
                <Group
                    position="apart"
                    my={rem('8rem')}
                    className={classes.wrapper}
                >
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

                {/* what learn nexxt */}
                <Box mt={rem('5rem')}>
                    <Title order={1} mt="lg" fw={700} color="dark">
                        Tiếp theo học gì
                    </Title>
                    <Text size={'xl'} c="dimmed" maw={600} mb="md">
                        Chúng tôi có những khóa học mới nhất và chất lượng nhất
                    </Text>
                    <Box>
                        <Carousel
                            slideSize="20%"
                            height="400px"
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
                                        [`& .${getStylesRef('controls')}`]: {
                                            opacity: 1
                                        }
                                    }
                                }
                            }}
                        >
                            {LearnNextSlides}
                        </Carousel>
                    </Box>
                </Box>

                {/* Top sell course*/}
                <Box>
                    <Title order={1} mt="lg" fw={700} color="dark">
                        Những khóa học bán chạy nhất
                    </Title>
                    <Box>
                        <Carousel
                            slideSize="20%"
                            height="400px"
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
                                        [`& .${getStylesRef('controls')}`]: {
                                            opacity: 1
                                        }
                                    }
                                }
                            }}
                        >
                            {bestSellingslides}
                        </Carousel>
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
            <Box my={rem('5rem')} bg="#10162f" p={rem('2rem')}>
                <Container>
                    <Grid grow>
                        <Grid.Col xl={6} lg={6} md={12} sm={12}>
                            <Box>
                                <Title
                                    order={1}
                                    color="#fff"
                                    fw={700}
                                    mx={'auto'}
                                    align={'center'}
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
                                </Flex>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            {/* Sub Footer section */}
            <Box my={rem('5rem')} p={rem('2rem')}>
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
                            variant="outline"
                            color="dark"
                            size="lg"
                            uppercase
                            // component={'a'}
                            // href="/auth/login"
                        >
                            Đăng ký ngay
                        </Button>
                    </Link>
                </Flex>
            </Box>

            {/* Contact section */}
            <Box my={rem('5rem')} p={rem('2rem')}>
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
