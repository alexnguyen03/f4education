import {
    Accordion,
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
    Flex,
    Grid,
    Group,
    Image,
    List,
    Rating,
    rem,
    Skeleton,
    Spoiler,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
    IconCheck,
    IconChevronRight,
    IconDeviceMobile,
    IconDeviceTvOld,
    IconInfinity,
    IconSourceCode,
    IconStarFilled,
    IconTrophy
} from '@tabler/icons-react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment/moment'

// MODULE CSS
import styles from '../../../assets/scss/custom-module-scss/client-custom/course-detail/CourseDetail.module.scss'

// API
import courseDetailApi from '../../../api/courseDetailApi'
import courseApi from '../../../api/courseApi'
import evaluateApi from '../../../api/evaluateApi'
import cartApi from '../../../api/cartApi'

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

    // Fetch AREA
    const fetchCurrentCourse = async () => {
        setLoading(true)
        try {
            console.log(params.courseId)
            const resp = await courseApi.getCourseByCourseId(params.courseId)

            if (resp.status === 200) {
                setCourse(resp.data)
                console.log(resp.data)

                setLoading(false)
            } else if (resp.status === 204) {
                console.log('no content')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNewestCourse = async () => {
        setLoading(true)
        try {
            const resp = await courseApi.getNewestCourse()

            if (resp.status === 200) {
                setNewstCourse(resp.data)
                console.log(resp.data)

                setLoading(false)
            } else if (resp.status === 204) {
                console.log('no content')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchListCourseContent = async () => {
        setLoading(true)
        try {
            const resp = await courseDetailApi.getAllByCourseId(params.courseId)
            if (resp.status === 200) {
                console.log(resp.data)
                setListCourseContent(resp.data)
                setLoading(false)
            } else console.log('Error at fetchCourseContent')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchListEvaluate = async () => {
        setLoading(true)
        try {
            const resp = await evaluateApi.getAllByCourseId(params.courseId)

            if (resp.status === 200 && resp.data.length > 0) {
                setListEvaluate(resp.data)
                console.log(resp.data)
                setLoading(false)
            } else console.log('Error at fetch Evaluate')
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddCart = async (course, user) => {
        const cart = {
            courseId: course.courseId,
            studentId: user
        }
        try {
            const resp = await cartApi.createCart(cart)
            console.log(resp.data)
            console.log(resp.status)
        } catch (error) {
            console.log(error)
        }
    }

    // USEEFFECT AREA
    useEffect(() => {
        fetchCurrentCourse()
        fetchListCourseContent()
        fetchListEvaluate()
        fetchNewestCourse()
    }, [])

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
            {/* Top banner */}
            <Box mt={rem('2rem')} bg="#2d2f31">
                <Container size="xl">
                    <Grid gutter="xl">
                        <Grid.Col xl={8} lg={8} md={12} sm={12}>
                            <Stack align="start">
                                {loading ? (
                                    <>
                                        <Skeleton
                                            width={400}
                                            height={25}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width={350}
                                            height={15}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width={150}
                                            height={15}
                                            mb={10}
                                        />
                                        <Skeleton
                                            width={350}
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
                                                                            : course.rating}
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
                                                                                : course.rating
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
                                                                : course.rating}
                                                        </Text>
                                                        <Rating
                                                            fractions={2}
                                                            defaultValue={5}
                                                            value={
                                                                course.rating ===
                                                                'NaN'
                                                                    ? 5
                                                                    : course.rating
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

                                                <Button
                                                    variant="filled"
                                                    color="violet"
                                                    fullWidth
                                                    mt="md"
                                                    onClick={() => {
                                                        handleAddCart(
                                                            course,
                                                            user.username
                                                        )
                                                    }}
                                                >
                                                    Thêm vào giỏ hàng
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    color="dark"
                                                    fullWidth
                                                >
                                                    Mua ngay
                                                </Button>

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
                <Stack>
                    <Text color="#fff" fw={700} size="xl" maw={700}>
                        {course.courseName}
                    </Text>
                    <Group position="left">
                        <Group position="left">
                            <Text color="yellow" size="lg">
                                {course.rating === 'NaN' ? 5 : course.rating}
                            </Text>
                            <Rating
                                fractions={2}
                                defaultValue={5}
                                value={
                                    course.rating === 'NaN' ? 5 : course.rating
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
                                            {formatCurrency(course.coursePrice)}
                                        </Title>
                                        <Badge color="pink" variant="light">
                                            Giảm giá
                                        </Badge>
                                    </Group>

                                    <Button
                                        variant="filled"
                                        color="violet"
                                        fullWidth
                                        mt="md"
                                        onClick={() => {
                                            handleAddCart(course, user.username)
                                        }}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        variant="default"
                                        color="dark"
                                        fullWidth
                                    >
                                        Mua ngay
                                    </Button>

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
                                                {course.courseDuration / 2} buổi
                                                học
                                            </Text>
                                        </Group>
                                        <Group>
                                            <IconSourceCode />
                                            <Text color="dark" size="md">
                                                {listCourseContent.length > 0
                                                    ? listCourseContent.length
                                                    : 0}{' '}
                                                Tài nguyên môn học
                                            </Text>
                                        </Group>
                                        <Group>
                                            <IconDeviceMobile />
                                            <Text color="dark" size="md">
                                                Truy cập từ điện thoại - Laptop
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
            </Box>

            {/* Detail infformation */}
            <Container size="xl" mt="lg">
                <Grid p="md" gutter="xl">
                    <Grid.Col xl={8} lg={8} md={12} sm={12}>
                        {/* Introducetion */}
                        {/* <Box p={rem('2rem')} className={styles['box']}>
                            <Title order={3} color="dark" fw={700} mb="lg">
                                Bạn sẽ được học những gì
                            </Title>
                            <Grid>
                                <Grid.Col xl={6} lg={6} md={12} sm={12}>
                                    <Stack>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Tự động hóa các tác vụ trên máy
                                                tính của họ bằng cách viết các
                                                chương trình đơn giản.
                                            </Text>
                                        </Flex>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Lập trình tạo và cập nhật bảng
                                                tính Excel.
                                            </Text>
                                        </Flex>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Thu thập dữ liệu các trang web
                                                và lấy thông tin từ các nguồn
                                                trực tuyến.
                                            </Text>
                                        </Flex>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Sử dụng các công cụ gỡ lỗi của
                                                Ngôn ngữ để nhanh chóng tìm ra
                                                lỗi trong mã của bạn
                                            </Text>
                                        </Flex>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col xl={6} lg={6} md={12} sm={12}>
                                    <Stack>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Viết chương trình có thể nhận
                                                dạng mẫu văn bản bằng "biểu thức
                                                chính quy"
                                            </Text>
                                        </Flex>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Phân tích tài liệu PDF và Word.
                                            </Text>
                                        </Flex>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Viết chương trình gửi thông báo
                                                qua email.
                                            </Text>
                                        </Flex>
                                        <Flex justify="start" gap={5}>
                                            <IconCheck />
                                            <Text size="md" color="dark">
                                                Lập trình điều khiển chuột và
                                                bàn phím để nhấp và gõ cho bạn.
                                            </Text>
                                        </Flex>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box> */}

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
                                                    (courseContent, index) => (
                                                        <>
                                                            <Accordion.Item
                                                                value={`customization${index}`}
                                                                key={index}
                                                            >
                                                                <Accordion.Control>
                                                                    <Text
                                                                        color="dark"
                                                                        size="lg"
                                                                        fw={500}
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
                                        <Skeleton width={'100%'} height={85} />
                                    </>
                                ) : (
                                    <>
                                        {newstCourse.map((course, index) => (
                                            <>
                                                <Card
                                                    key={index}
                                                    component="a"
                                                    href={`/course/${course.courseId}`}
                                                >
                                                    <Card.Section>
                                                        <Grid>
                                                            <Grid.Col span={2}>
                                                                <Image
                                                                    src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                                                                    alt={
                                                                        course.courseName
                                                                    }
                                                                    height={82}
                                                                    withPlaceholder
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={10}>
                                                                <Grid>
                                                                    <Grid.Col
                                                                        span={7}
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
                                                                                }
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
                                                                        span={5}
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
                                                                                    : course.rating}
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
                                            </>
                                        ))}
                                    </>
                                )}
                            </Spoiler>
                        </Box>

                        {/*  Comment */}
                        <Box my={rem('2rem')}>
                            <Text color="dark" fw={700} size="xl" mb="lg">
                                Phản hồi người dùng
                            </Text>
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
                                                    Hiển thị tất cả Bình luận
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
                                                    Ẩn bớt Bình luận
                                                </Button>
                                            </Center>
                                        }
                                    >
                                        <Grid gutter="xl">
                                            {/* Item */}
                                            {listEvaluate.length > 0 && (
                                                <>
                                                    {listEvaluate.map(
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
                                                                                // src="https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
                                                                                src={`${PUBLIC_IMAGE}/students/${evaluate.studentImage}`}
                                                                                alt={
                                                                                    evaluate.studentName
                                                                                }
                                                                                radius="xl"
                                                                            />
                                                                            <Stack spacing="xs">
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
                                                                                    <Text
                                                                                        color="dark"
                                                                                        size="sm"
                                                                                    >
                                                                                        {
                                                                                            evaluate.rating
                                                                                        }
                                                                                    </Text>
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
                                                                            pl={
                                                                                54
                                                                            }
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
                                    </Spoiler>
                                </>
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
