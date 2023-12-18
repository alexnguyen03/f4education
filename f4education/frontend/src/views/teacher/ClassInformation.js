import {
    Alert,
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    Group,
    Image,
    Input,
    Loader,
    MediaQuery,
    Paper,
    rem,
    Skeleton,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import { IconColorSwatch, IconFilterSearch } from '@tabler/icons-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { CheckUserLogin } from '../../utils/formater'

// API
import classApi from '../../api/classApi'

// scss
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

const ClassInformation = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // ********** Param Variable
    let navigate = useNavigate()

    // ********** Main Variable
    const [listClasses, setListClasses] = useState([])

    // ********** Action Variable
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    //  ******** Fetch AREA
    const fetchClassByTeacher = async () => {
        try {
            setLoading(true)
            const resp = await classApi.getAllClassByTeacherId(user.username)
            console.log(
                '🚀 ~ file: ClassInformation.js:51 ~ fetchClassByTeacher ~ resp:',
                resp
            )
            if (resp.status === 200 && resp.data.length > 0) {
                setListClasses(resp.data.reverse())
            }
            console.log(resp.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchClassByTeacher()
    }, [])

    // ********** Action
    const handleChangeSearchClass = (e) => {
        setSearchTerm(e.target.value)
    }

    const navigateToClassInformationDetail = (classId) => {
        navigate('/teacher/class-info/' + classId)
    }

    const filteredClasses = listClasses.filter((item) => {
        const className = item.classes.className
        const startDate = item.classes.startDate
        const endDate = item.classes.endDate
        const courseName = item.courseName[0]

        // console.log(className, startDate, endDate, courseName);

        const lowerSearchTerm = searchTerm.toLowerCase()

        return (
            className.toLowerCase().includes(lowerSearchTerm) ||
            courseName.toLowerCase().includes(lowerSearchTerm) ||
            startDate.includes(lowerSearchTerm) ||
            endDate.includes(lowerSearchTerm)
        )
    })

    const formatDate = (date) => {
        const formattedDate = moment(new Date(date))
            // .locale('vi')
            .format(' DD/MM/yyyy')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    // ************** Render UI
    const classInformationList = filteredClasses.map((c) => (
        <Grid.Col xl={3} lg={3} md={4} sm={6} key={c.classes.classId}>
            {loading ? (
                <>
                    <Skeleton
                        radius={'sm'}
                        mb="lg"
                        mt="md"
                        width={rem('3rem')}
                        height={rem('3rem')}
                    />
                    <Skeleton width={'100%'} height={rem('2rem')} mb="sm" />
                    <Skeleton width={'100%'} height={rem('1rem')} mb="sm" />
                    <Skeleton width={'100%'} height={rem('1rem')} mb="sm" />
                </>
            ) : (
                <>
                    <Paper
                        withBorder
                        radius="md"
                        p={6}
                        className={styles.card}
                        onClick={() =>
                            navigateToClassInformationDetail(c.classes.classId)
                        }
                    >
                        <Flex justify={'space-between'} align="center" mt="md">
                            <ThemeIcon
                                size="xl"
                                radius="md"
                                variant="gradient"
                                gradient={{
                                    deg: 0,
                                    from: 'pink',
                                    to: 'violet'
                                }}
                            >
                                <IconColorSwatch
                                    style={{ width: rem(28), height: rem(28) }}
                                    stroke={1.5}
                                />
                            </ThemeIcon>
                            <Tooltip label="Tổng số sinh viên" position="top">
                                <Alert color="indigo">
                                    {`Tổng số sinh viên: ${c.students.length}`}
                                </Alert>
                            </Tooltip>
                        </Flex>
                        <Title order={3} fw={500} mt="md">
                            Tên Lớp: {c.classes.className}
                        </Title>
                        <Text size="lg" mt="sm" c="dimmed" lineClamp={1}>
                            Khóa học: <strong>{c.courseName[0]}</strong>
                        </Text>
                        <Text size="lg" mt="sm" c="dimmed" lineClamp={1}>
                            Thời gian dạy:{' '}
                            <strong>
                                {moment(c.classes.startDate).format(
                                    'DD/mm/yyyy'
                                ) === 'Invalid date'
                                    ? 'Chưa có ngày khả dụng'
                                    : moment(c.classes.startDate).format(
                                          'DD/mm/yyyy'
                                      )}{' '}
                                -{' '}
                                {moment(c.classes.endDate).format(
                                    'DD/mm/yyyy'
                                ) === 'Invalid date'
                                    ? 'Chưa có ngày khả dụng'
                                    : moment(c.classes.endDate).format(
                                          'DD/mm/yyyy'
                                      )}
                            </strong>
                        </Text>
                        <Flex
                            justify="space-between"
                            align="center"
                            gap={5}
                            mb={10}
                        >
                            <Text size="lg" mt="sm" c="dimmed">
                                Trạng thái lớp:
                            </Text>
                            <Badge
                                color={
                                    c.classes.status === 'Đang diễn ra'
                                        ? 'indigo'
                                        : 'yellow'
                                }
                                mt={12}
                            >
                                {c.classes.status}
                            </Badge>
                        </Flex>
                    </Paper>
                </>
            )}
        </Grid.Col>
    ))

    useEffect(() => {
        const checkLogin = CheckUserLogin(user)
        console.log(checkLogin)

        if (!checkLogin) {
            return navigate('/auth/login')
        }
    }, [])

    return (
        <>
            <Box className={styles.box} p={rem('2rem')}>
                {loading ? (
                    <>
                        <Stack mt={250} mx="auto" align="center">
                            <Title order={2} color="dark">
                                <Loader color="rgba(46, 46, 46, 1)" />
                            </Title>
                            <Text c="dimmed" fz="lg">
                                Vui lòng chờ trong giây lát...
                            </Text>
                        </Stack>
                    </>
                ) : (
                    <>
                        {/* Header section */}
                        {listClasses.length === 0 ? (
                            <>
                                <Stack mx="auto" mt={200} align="center">
                                    <Title
                                        order={3}
                                        color="dark"
                                        style={{ zIndex: '1' }}
                                    >
                                        Hiện không có lớp học nào để hiển thị.
                                    </Title>
                                    <Image
                                        src="https://i.pinimg.com/originals/40/fd/d2/40fdd2c61203798836ab2c55583726aa.png"
                                        width={270}
                                        height={270}
                                        mt={rem('-3rem')}
                                    />
                                    <Link to="/teacher/information">
                                        <Button
                                            variant={'default'}
                                            color="violet"
                                            size="lg"
                                        >
                                            Trở lại trang chủ
                                        </Button>
                                    </Link>
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Group position="apart" mb="xl">
                                    <Title order={2} fw={700} color="dark">
                                        Danh sách lớp học
                                    </Title>
                                    <Button
                                        color="green"
                                        size="md"
                                        onClick={() =>
                                            navigate('/evaluation/teacher')
                                        }
                                    >
                                        Xem đánh giá của học viên
                                    </Button>
                                    <MediaQuery
                                        query="max-width: (780px)"
                                        styles={{ width: '100%' }}
                                    >
                                        <Group position="right">
                                            <Input
                                                id="search-input"
                                                icon={<IconFilterSearch />}
                                                size="md"
                                                w={350}
                                                placeholder="Tìm lớp học"
                                                onChange={(e) =>
                                                    handleChangeSearchClass(e)
                                                }
                                            />
                                            <Button color="violet" size="md">
                                                Tìm kiếm
                                            </Button>
                                        </Group>
                                    </MediaQuery>
                                </Group>

                                <Grid gutter="md">
                                    {/* List Class */}
                                    {classInformationList}
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </Box>
        </>
    )
}

export default ClassInformation
