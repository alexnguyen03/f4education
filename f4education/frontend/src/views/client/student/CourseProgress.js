import {
    Badge,
    Box,
    Button,
    Card,
    Center,
    Grid,
    Group,
    Image,
    Progress,
    Rating,
    rem,
    RingProgress,
    Skeleton,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import { useEffect, useState } from 'react'

import { IconArrowBack, IconArrowRight } from '@tabler/icons-react'
import { Link, useRoutes, useSearchParams } from 'react-router-dom'

// Scss
import styles from '../../../assets/scss/custom-module-scss/client-custom/course-progress/CourseProgress.module.scss'

// API
import moment from 'moment'
import courseApi from '../../../api/courseApi'
import registerCoursecAPI from '../../../api/registerCourseApi'

const studentId = 'loinvpc04549'
const user = JSON.parse(localStorage.getItem('user'))

// IMAGE PATH
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

// NOTES: GET DATA FROM DB
//  ClassID is unique
//  GET from Schedule select from current day to the back By ClassId = ?
// EXP: currentDay-20-08-2023 => startDate 27-07-2023
// Count by classId
//  WE got totalClassId => ngay da hoc.

const CourseProgress = () => {
    //  ***********Route
    // const route = useRoutes()
    // const searchParam = useSearchParams()
    // const classIdParam = searchParam.get('classId')

    // Schedule insert data: Khác ngày, content,notes
    // *********** Main variable
    const [courseProgresses, setCourseProgresses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState({})
    const [showingDetail, setShowingDetail] = useState(false)
    const [totalCountCourseProgress, setTotalCountCourseProgress] = useState(0)
    const [newestCourse, setNewestCourse] = useState([])

    // *********** Action variable
    const [loading, setLoading] = useState(false)

    // *********** FETCH AREA
    const fetchCourseProgress = async () => {
        try {
            setLoading(true)

            const resp = await registerCoursecAPI.getAllCourseProgress(
                studentId
            )
            const reversedData = resp.data.reverse()
            setCourseProgresses(reversedData)

            const newCourseProgresses = []
            for (let i = 0; i < reversedData.length; i++) {
                const element = reversedData[i]
                const startDate = element.classes.startDate
                const endDate = element.classes.endDate

                const progressCourseRequest = {
                    startDate,
                    endDate
                }

                console.log(progressCourseRequest)

                const totalProgress = await fetchCourseProgressByClassId(
                    element.classes.classId,
                    progressCourseRequest
                )
                const newCourse = {
                    ...element,
                    totalProgress: totalProgress
                }
                newCourseProgresses.push(newCourse)
            }

            console.log(newCourseProgresses)
            setCourseProgresses(newCourseProgresses)

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCourseProgressByClassId = async (
        classId,
        progressCourseRequest
    ) => {
        try {
            const resp = await registerCoursecAPI.getCourseProgressByClassId(
                classId,
                progressCourseRequest
            )
            // setSelectedCourse(resp.data)
            setTotalCountCourseProgress(resp.data)
            return resp.data
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNewestCourse = async () => {
        try {
            setLoading(true)
            const resp = await courseApi.getNewestCourse()

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

    const handleShowCourseProgress = (course) => {
        setSelectedCourse(course)
        setShowingDetail(true)
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
    }

    // ************ USE EFECT AREA
    useEffect(() => {
        setSelectedCourse(selectedCourse)
    }, [selectedCourse])

    useEffect(() => {
        fetchCourseProgress()
        fetchNewestCourse()
    }, [])

    useEffect(() => {
        setTotalCountCourseProgress(totalCountCourseProgress)
    }, [totalCountCourseProgress])

    // useEffect(() => {
    //     route.push(`?classId=${selectedCourse.classId}`, {
    //         scroll: false
    //     })
    // }, [route, selectedCourse])

    return (
        <>
            {/* Title */}
            <Box>
                <Title order={1} fw={700} mt={rem('2rem')} color="dark">
                    Tiến độ học tập
                </Title>
            </Box>

            {/* Hero banner */}
            {/* <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => <div></div>}
            </Transition> */}
            <Box
                pos={'relative'}
                p={rem('3.5rem')}
                my={rem('4rem')}
                className={styles.box}
            >
                <Stack maw={500}>
                    {showingDetail ? (
                        <>
                            <Stack align="left">
                                <Title order={2} fw={500} color="dark">
                                    {selectedCourse.course.courseName}
                                </Title>
                                <Group position="left">
                                    <Text c="dimmed" fz="xl">
                                        Lớp học:{' '}
                                        <strong>
                                            {selectedCourse.classes.className}
                                        </strong>
                                    </Text>
                                    -
                                    <Text c="dimmed" fz="xl">
                                        <strong>
                                            {selectedCourse.course
                                                .courseDuration / 2}
                                        </strong>{' '}
                                        buổi học
                                    </Text>
                                </Group>
                                <Text fz="lg">
                                    Từ ngày:{' '}
                                    <strong>
                                        {moment(
                                            selectedCourse.classes.startDate
                                        ).format('DD-MM-yyyy')}
                                    </strong>{' '}
                                    -{' '}
                                    <strong>
                                        {moment(
                                            selectedCourse.classes.endDate
                                        ).format('DD-MM-yyyy')}
                                    </strong>
                                </Text>
                                <Group position="left">
                                    <Text fw={500} color="dimmed" fz="lg">
                                        Trạng thái lớp học:
                                    </Text>{' '}
                                    <Badge
                                        color="indigo"
                                        size="lg"
                                        p={3}
                                        ml={5}
                                        mt={5}
                                    >
                                        {selectedCourse.classes.status}
                                    </Badge>
                                </Group>
                                <Text
                                    color="dimmed"
                                    fw={500}
                                    fz="lg"
                                    lineClamp={3}
                                >
                                    Giáo viên hướng dẫn:
                                    <strong className="ml-2">
                                        {selectedCourse.teacherName}
                                    </strong>
                                </Text>
                                <Text
                                    color="dimmed"
                                    fw={500}
                                    fz="lg"
                                    lineClamp={3}
                                >
                                    Mô tả khóa học:
                                    <strong className="ml-2">
                                        {
                                            selectedCourse.course
                                                .courseDescription
                                        }
                                        , Lorem ipsum dolor sit amet
                                        consectetur, adipisicing elit.
                                        Reprehenderit quo pariatur rerum
                                        blanditiis provident dolores itaque,
                                        illo porro. Totam, libero!
                                    </strong>
                                </Text>
                                <Button
                                    variant="outline"
                                    color="indigo"
                                    size="lg"
                                    leftIcon={<IconArrowBack />}
                                    mt={10}
                                    onClick={() => {
                                        fetchCourseProgress()
                                        // fetchNewestCourse();
                                    }}
                                >
                                    Trở về trang tổng quan
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <>
                            {loading ? (
                                <>
                                    <Stack>
                                        <Skeleton width={'75%'} height={25} />
                                        <Skeleton
                                            width="100%"
                                            height={50}
                                            mt={8}
                                        />
                                        <Group position="left">
                                            <Skeleton
                                                width="49%"
                                                height={25}
                                                mt={8}
                                            />
                                            <Skeleton
                                                width="49%"
                                                height={25}
                                                mt={8}
                                            />
                                        </Group>
                                    </Stack>
                                </>
                            ) : (
                                <>
                                    <Title order={2} fw={500} color="dark">
                                        Xin chào, "{user.fullName}"
                                    </Title>
                                    <Text c="dimmed" fz="lg">
                                        Chào mừng bạn đến với phần "Tiến độ học
                                        tập" mới tại F4 Education. Đây sẽ là
                                        trung tâm chứa tất cả các hướng dẫn mà
                                        chúng tôi cung cấp và tiến trình học tập
                                        của bạn.
                                    </Text>
                                    <Text c="dimmed" fz="lg" mt={5}>
                                        Chúng tôi mong bạn có thể tiếp tục học
                                        với chúng tôi.
                                    </Text>
                                    <Group>
                                        <Link
                                            to={`/course/${
                                                courseProgresses.length > 0
                                                    ? courseProgresses[0].course
                                                          .courseId
                                                    : ''
                                            }`}
                                        >
                                            <Tooltip
                                                label={
                                                    courseProgresses.length > 0
                                                        ? courseProgresses[0]
                                                              .course.courseName
                                                        : ''
                                                }
                                            >
                                                <Button
                                                    variant="filled"
                                                    color="dark"
                                                    radius={8}
                                                    p={15}
                                                    maw={'100%'}
                                                    fz={'lg'}
                                                    size="lg"
                                                >
                                                    Khóa học mới nhất"
                                                    {courseProgresses.length > 0
                                                        ? courseProgresses[0]
                                                              .course.courseName
                                                        : ''}
                                                    "
                                                </Button>
                                            </Tooltip>
                                        </Link>
                                        <Link to="/course">
                                            <Button
                                                variant="default"
                                                color="dark"
                                                radius={8}
                                                p={15}
                                                fz={'lg'}
                                                size="lg"
                                            >
                                                Toàn bộ khóa học
                                            </Button>
                                        </Link>
                                    </Group>
                                </>
                            )}
                        </>
                    )}
                </Stack>

                {showingDetail ? (
                    <>
                        <Card
                            className={styles['floating-result']}
                            mt={40}
                            style={{ minHeight: '570px' }}
                        >
                            <Card.Section>
                                <Image
                                    // src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                                    src={`${PUBLIC_IMAGE}/course/${selectedCourse.course.image}`}
                                    height={250}
                                    alt="Norway"
                                    withPlaceholder
                                />
                            </Card.Section>
                            <Card.Section mt={25} p={10}>
                                <Box w={'100%'}>
                                    <Text
                                        fw={500}
                                        fz="lg"
                                        color="dimmed"
                                        align="center"
                                        mb={15}
                                    >
                                        Tiến độ khóa học
                                    </Text>
                                    <Text
                                        fw={'bolder'}
                                        color="dark"
                                        fz="xl"
                                        align="center"
                                        m={0}
                                        p={0}
                                    >
                                        {(
                                            (totalCountCourseProgress /
                                                (selectedCourse.course
                                                    .courseDuration /
                                                    2)) *
                                            2 *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </Text>
                                    <Progress
                                        value={(
                                            (totalCountCourseProgress /
                                                (selectedCourse.course
                                                    .courseDuration /
                                                    2)) *
                                            2 *
                                            100
                                        ).toFixed(1)}
                                        size="xl"
                                        radius="xl"
                                        striped
                                        w={'100%'}
                                    />
                                </Box>
                                <Stack align="left" mt={25}>
                                    <Text
                                        color="dimmed"
                                        fw={500}
                                        fz="xl"
                                        m={0}
                                        p={0}
                                    >
                                        Số buổi đã học:{' '}
                                        <strong className="ml-2">
                                            {selectedCourse.totalProgress} /{' '}
                                            {selectedCourse.course
                                                .courseDuration / 2}
                                        </strong>
                                    </Text>
                                    <Text
                                        color="dimmed"
                                        fw={500}
                                        fz="xl"
                                        m={0}
                                        p={0}
                                    >
                                        Số buổi vắng:{' '}
                                        <strong className="ml-2">
                                            {selectedCourse.totalProgress} /{' '}
                                            {selectedCourse.course
                                                .courseDuration / 2}
                                        </strong>
                                    </Text>
                                </Stack>
                            </Card.Section>
                        </Card>
                    </>
                ) : (
                    <>
                        <Box className={styles['floating-result']}>
                            <Stack align={'center'} p={rem('1rem')}>
                                <Title order={5} color="dark" fw={700}>
                                    Làm tốt lắm!
                                </Title>
                                <Text fz="md" c="dimmed">
                                    Tổng quan
                                </Text>
                                <Box>
                                    <RingProgress
                                        label={
                                            <Text
                                                size="md"
                                                align="center"
                                                color="dark"
                                                fw={700}
                                            >
                                                {/* Cai gi do o day. VD: phan tram khoa da hoc */}
                                            </Text>
                                        }
                                        size={150}
                                        sections={[
                                            {
                                                value:
                                                    courseProgresses.length *
                                                    50,
                                                color: 'cyan',
                                                tooltip: `Tổng ${courseProgresses.length} khóa học đăng ký`
                                            },
                                            {
                                                value: 0,
                                                color: 'lime',
                                                tooltip: 'Đã hoàn thành 0 khóa'
                                            },
                                            {
                                                value:
                                                    courseProgresses.length *
                                                    50,
                                                color: 'violet',
                                                tooltip: `Đang học ${courseProgresses.length} khóa`
                                            }
                                        ]}
                                    />
                                </Box>
                                <Text c="dimmed" size="md" align="left"></Text>
                                <Grid grow>
                                    <Grid.Col span={6}>
                                        <Box className={styles['box-score']}>
                                            <Stack>
                                                <Text
                                                    color="dark"
                                                    fz="lg"
                                                    fw={700}
                                                >
                                                    {courseProgresses.length}
                                                </Text>
                                                <Text
                                                    color="dimmed"
                                                    fz="lg"
                                                    mt={rem('-0.7rem')}
                                                >
                                                    Khóa đã đăng ký
                                                </Text>
                                            </Stack>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Box className={styles['box-score']}>
                                            <Stack>
                                                <Text
                                                    color="dark"
                                                    fz="lg"
                                                    fw={700}
                                                >
                                                    0
                                                </Text>
                                                <Text
                                                    color="dimmed"
                                                    fz="lg"
                                                    mt={rem('-0.7rem')}
                                                >
                                                    Bài đã hoàn thành
                                                </Text>
                                            </Stack>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Box className={styles['box-score']}>
                                            <Stack>
                                                <Text
                                                    color="dark"
                                                    fz="lg"
                                                    fw={700}
                                                >
                                                    {courseProgresses.length}
                                                </Text>
                                                <Text
                                                    color="dimmed"
                                                    fz="lg"
                                                    mt={rem('-0.7rem')}
                                                >
                                                    Bài đang học
                                                </Text>
                                            </Stack>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </Box>
                    </>
                )}
            </Box>

            {/* In Progress Course */}
            <Box mt={rem('8rem')}>
                <Group position="left" mb={'lg'}>
                    <Title order={2} color="dark" fw={700}>
                        Trong tiến trình học
                    </Title>
                </Group>
                <Grid>
                    {courseProgresses.map((progress, index) => (
                        <Grid.Col
                            xl={3}
                            lg={3}
                            md={4}
                            sm={6}
                            // component='a'
                            // href={`?classId=${progress.classId}`}
                            onClick={() => handleShowCourseProgress(progress)}
                            key={index}
                        >
                            <Card
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                                className={styles.card}
                            >
                                <Card.Section>
                                    <Image
                                        // src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                                        src={`${PUBLIC_IMAGE}/course/${progress.course.image}`}
                                        height={160}
                                        alt="Norway"
                                        withPlaceholder
                                    />
                                </Card.Section>

                                <Text c="dimmed" fz="md" mt="md">
                                    HƯỚNG DẪN
                                </Text>
                                <Text
                                    fz="lg"
                                    color="dark"
                                    fw={500}
                                    lineClamp={2}
                                >
                                    {progress.course.courseName}
                                </Text>
                                <Text size="sm" color="dimmed">
                                    <strong>{totalCountCourseProgress}</strong>{' '}
                                    trên{' '}
                                    <strong>
                                        {progress.course.courseDuration / 2}
                                    </strong>{' '}
                                    bài đã học.
                                </Text>
                                {/* {fetchCourseProgressByClassId(
                                    course.classes.classId
                                )} */}
                                <Stack mt={8}>
                                    <Text
                                        fw={'bolder'}
                                        color="dark"
                                        fz="xl"
                                        align="right"
                                        m={0}
                                        p={0}
                                    >
                                        {(
                                            (totalCountCourseProgress /
                                                (progress.course
                                                    .courseDuration /
                                                    2)) *
                                            2 *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </Text>
                                    <Progress
                                        value={(
                                            (totalCountCourseProgress /
                                                (progress.course
                                                    .courseDuration /
                                                    2)) *
                                            2 *
                                            100
                                        ).toFixed(1)}
                                        size="xl"
                                        radius="xl"
                                        striped
                                    />
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Box>

            {/* Relation course in progress */}
            <Box mt={rem('8rem')}>
                <Group position="apart" mb={'lg'}>
                    <Title order={2} color="dark" fw={700}>
                        Các khóa học hàng đầu khác
                    </Title>
                    <Group position="right" align={'center'}>
                        <Link to="/course">
                            <Text
                                color="dimmed"
                                fz="lg"
                                fw={500}
                                style={{ cursor: 'pointer' }}
                                mr={rem('-0.6rem')}
                            >
                                <IconArrowRight color="gray" />
                            </Text>
                        </Link>
                        <Link to="/course">
                            <Text
                                color="dimmed"
                                fz="lg"
                                fw={500}
                                style={{ cursor: 'pointer' }}
                            >
                                Khám phá ngay
                            </Text>
                        </Link>
                    </Group>
                </Group>
                <Grid>
                    {newestCourse.map((course, index) => (
                        <Grid.Col xl={3} lg={3} md={4} sm={6} key={index}>
                            <Card
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                                className={styles.card}
                                height={340}
                                style={{ height: '340px' }}
                                component="a"
                                href={`/course/${course.courseId}`}
                            >
                                <Card.Section>
                                    <Image
                                        // src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                                        src={`${PUBLIC_IMAGE}/course/${course.image}`}
                                        height={200}
                                        withPlaceholder
                                        alt={course.courseName}
                                    />
                                </Card.Section>

                                <Text c="dimmed" fz="md" mt="md" lineClamp={2}>
                                    {course.courseName}
                                </Text>
                                <Text fz="lg" color="dark" fw={500}>
                                    Giá:{' '}
                                    {course.coursePrice.toLocaleString(
                                        'it-IT',
                                        {
                                            style: 'currency',
                                            currency: 'VND'
                                        }
                                    )}
                                </Text>
                                <Group position="apart">
                                    <Text color="dimmed">4.6</Text>
                                    <Rating
                                        value={3.5}
                                        fractions={2}
                                        readOnly
                                        mx={2}
                                    />
                                    <Text color="dimmed">(39.930)</Text>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Box>

            {/* complete course */}
            <Box mt={rem('8rem')}>
                <Group position="apart" mb={'lg'}>
                    <Title order={2} color="dark" fw={700}>
                        Các khóa học đã hoàn thành
                    </Title>
                    <Group position="right" align={'center'}>
                        <Link to="/course">
                            <Text
                                color="dimmed"
                                fz="lg"
                                fw={500}
                                style={{ cursor: 'pointer' }}
                                mr={rem('-0.6rem')}
                            >
                                <IconArrowRight color="gray" />
                            </Text>
                        </Link>
                        <Link to="/course">
                            <Text
                                color="dimmed"
                                fz="lg"
                                fw={500}
                                style={{ cursor: 'pointer' }}
                            >
                                Khám phá ngay
                            </Text>
                        </Link>
                    </Group>
                </Group>
                <Box className={styles.box} p={rem('3rem')}>
                    <Center>
                        <svg
                            width="100"
                            height="101"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="50"
                                cy="50.5"
                                r="50"
                                fill="#D9EEE1"
                            ></circle>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M72.5806 32H42.5806C41.1999 32 40.0806 33.1193 40.0806 34.5V59.5C40.0806 60.8807 41.1999 62 42.5806 62H72.5806C73.9613 62 75.0806 60.8807 75.0806 59.5V34.5C75.0806 33.1193 73.9613 32 72.5806 32ZM42.5806 29.5C39.8191 29.5 37.5806 31.7386 37.5806 34.5V59.5C37.5806 62.2614 39.8191 64.5 42.5806 64.5H72.5806C75.342 64.5 77.5806 62.2614 77.5806 59.5V34.5C77.5806 31.7386 75.342 29.5 72.5806 29.5H42.5806Z"
                                fill="#282A35"
                            ></path>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M75.0806 42H40.0806V39.5H75.0806V42Z"
                                fill="#282A35"
                            ></path>
                            <path
                                d="M45.0806 35.75C45.0806 36.4404 44.5209 37 43.8306 37C43.1402 37 42.5806 36.4404 42.5806 35.75C42.5806 35.0596 43.1402 34.5 43.8306 34.5C44.5209 34.5 45.0806 35.0596 45.0806 35.75Z"
                                fill="#282A35"
                            ></path>
                            <path
                                d="M48.8306 35.75C48.8306 36.4404 48.2709 37 47.5806 37C46.8902 37 46.3306 36.4404 46.3306 35.75C46.3306 35.0596 46.8902 34.5 47.5806 34.5C48.2709 34.5 48.8306 35.0596 48.8306 35.75Z"
                                fill="#282A35"
                            ></path>
                            <path
                                d="M52.5806 35.75C52.5806 36.4404 52.0209 37 51.3306 37C50.6402 37 50.0806 36.4404 50.0806 35.75C50.0806 35.0596 50.6402 34.5 51.3306 34.5C52.0209 34.5 52.5806 35.0596 52.5806 35.75Z"
                                fill="#282A35"
                            ></path>
                            <g clipPath="url(#clip0_3207_63633)">
                                <path
                                    d="M53.9697 47.0887L37.2084 45.1374C35.9866 44.9964 34.7693 45.222 33.6785 45.7916L18.7298 53.62C17.5768 54.224 16.9564 55.4653 17.1871 56.7097C17.4177 57.9542 18.4418 58.8907 19.7346 59.0414L21.2054 59.2125C21.1134 59.5594 21.056 59.9152 21.0409 60.2797C20.443 60.7198 20.1024 61.465 20.2469 62.2442C20.3696 62.9066 20.822 63.3993 21.3908 63.6626L21.1302 71.0125C21.1075 71.6517 21.6826 72.1478 22.3119 72.0311L25.76 71.392C26.3893 71.2754 26.7484 70.6063 26.4981 70.0176L23.6203 63.2494C24.0563 62.7999 24.3027 62.1777 24.1799 61.5152C24.0592 60.8638 23.62 60.377 23.0657 60.1097C23.0947 59.8787 23.1717 59.6661 23.2518 59.4504L26.8165 59.8653L27.2397 67.0497C27.6422 69.2214 33.2512 70.0036 39.7677 68.7959C46.2842 67.5881 51.2404 64.8484 50.8378 62.676L48.6589 55.817L54.9744 52.5095C56.128 51.9054 56.7478 50.6641 56.5171 49.4197C56.2865 48.1753 55.2625 47.2393 53.9697 47.0887ZM47.6836 62.6549C44.4044 65.4365 34.1861 67.3037 30.1774 65.8994L29.8426 60.2178L36.4965 60.9926C37.2208 61.0764 38.5663 61.1029 40.0264 60.3384L45.9607 57.2305L47.6836 62.6549ZM38.6349 57.6799C38.0879 57.9663 37.4543 58.0837 36.8411 58.0124L27.0453 56.8709L37.029 53.0144C37.5446 52.8159 37.8009 52.237 37.6018 51.7215C37.4029 51.2041 36.8181 50.954 36.3097 51.1499L24.2218 55.8185C23.8279 55.9703 23.4755 56.1818 23.1434 56.4169L20.4555 56.1027L35.0693 48.4495C35.6163 48.1632 36.2499 48.0457 36.8631 48.117L53.2493 50.0266L38.6349 57.6799Z"
                                    fill="white"
                                ></path>
                                <path
                                    d="M38.6349 57.6799C38.0879 57.9663 37.4543 58.0837 36.8411 58.0124L27.0453 56.8709L37.029 53.0144C37.5446 52.8159 37.8009 52.237 37.6018 51.7215C37.4029 51.2041 36.8181 50.954 36.3097 51.1499L24.2218 55.8185C23.8279 55.9703 23.4755 56.1818 23.1434 56.4169L20.4555 56.1027L35.0693 48.4495C35.6163 48.1632 36.2499 48.0457 36.8631 48.117L53.2493 50.0266L38.6349 57.6799Z"
                                    fill="white"
                                ></path>
                                <path
                                    d="M47.6836 62.6549C44.4044 65.4365 34.1861 67.3037 30.1774 65.8994L29.8426 60.2178L36.4965 60.9926C37.2208 61.0764 38.5663 61.1029 40.0264 60.3384L45.9607 57.2305L47.6836 62.6549Z"
                                    fill="white"
                                ></path>
                                <path
                                    d="M53.9697 47.0877L37.2084 45.1364C35.9866 44.9954 34.7693 45.221 33.6785 45.7906L18.7298 53.619C17.5768 54.223 16.9564 55.4643 17.1871 56.7088C17.4177 57.9532 18.4418 58.8898 19.7346 59.0404L21.2054 59.2115C21.1134 59.5585 21.056 59.9143 21.0409 60.2787C20.443 60.7188 20.1024 61.464 20.2469 62.2432C20.3696 62.9057 20.822 63.3984 21.3908 63.6616L21.1302 71.0116C21.1075 71.6508 21.6826 72.1468 22.3119 72.0301L25.76 71.3911C26.3893 71.2744 26.7484 70.6053 26.4981 70.0167L23.6203 63.2484C24.0563 62.7989 24.3027 62.1767 24.1799 61.5143C24.0592 60.8629 23.62 60.376 23.0657 60.1088C23.0947 59.8777 23.1717 59.6652 23.2518 59.4494L26.8165 59.8643L27.2397 67.0487C27.6422 69.2205 33.2512 70.0027 39.7677 68.7949C46.2842 67.5871 51.2404 64.8474 50.8378 62.6751L48.6589 55.816L54.9744 52.5085C56.128 51.9044 56.7478 50.6632 56.5171 49.4187C56.2865 48.1743 55.2625 47.2383 53.9697 47.0877ZM47.6836 62.6539C44.4044 65.4355 34.1861 67.3027 30.1774 65.8985L29.8426 60.2168L36.4965 60.9916C37.2208 61.0754 38.5663 61.1019 40.0264 60.3374L45.9607 57.2295L47.6836 62.6539V62.6539ZM38.6349 57.6789C38.0879 57.9653 37.4543 58.0827 36.8411 58.0114L27.0453 56.8699L37.029 53.0135C37.5446 52.8149 37.8009 52.236 37.6018 51.7206C37.4029 51.2032 36.8181 50.953 36.3097 51.149L24.2218 55.8175C23.8279 55.9693 23.4755 56.1808 23.1434 56.4159L20.4555 56.1017L35.0693 48.4485C35.6163 48.1622 36.2499 48.0448 36.8631 48.1161L53.2493 50.0257L38.6349 57.6789V57.6789Z"
                                    fill="#282A35"
                                ></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_3207_63633">
                                    <rect
                                        width="40"
                                        height="32"
                                        fill="white"
                                        transform="translate(15 44.9092) rotate(-10.5)"
                                    ></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </Center>
                    <Stack align={'center'}>
                        <Text color="dark" fz="xl" fw="bold">
                            Tại đây sẽ hiển thị các khóa học đã hoàn thành
                        </Text>
                        <Text c="dimmed" fz="md">
                            Có khóa học bị thiếu, hãy reload lại trang.
                        </Text>
                        <Button radius={30} size="lg" variant="default" mt={10}>
                            Toàn bộ khóa học
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}

export default CourseProgress
