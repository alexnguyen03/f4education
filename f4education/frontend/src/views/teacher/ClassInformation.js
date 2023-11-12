import {
    Alert,
    Badge,
    Box,
    Button,
    Center,
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

// API
import classApi from '../../api/classApi'

// scss
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

const teacherId = 'nguyenhoainam121nTC'

const ClassInformation = () => {
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
            const resp = await classApi.getAllClassByTeacherId(teacherId)
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
        navigate('/teacher/classes-infor/' + classId)
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

    // ************** Render UI
    const classInformationList = filteredClasses.map((c) => (
        <Grid.Col xl={3} lg={4} md={4} sm={6} key={c.classes.classId}>
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
                        p={0}
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
                                <Alert
                                    title={c.numberStudent}
                                    color="indigo"
                                ></Alert>
                            </Tooltip>
                        </Flex>
                        <Title order={3} fw={500} mt="md">
                            Tên Lớp: {c.classes.className}
                        </Title>
                        <Text size="lg" mt="sm" c="dimmed" lineClamp={2}>
                            Khóa học: {c.courseName[0]}
                        </Text>
                        <Text size="lg" mt="sm" c="dimmed">
                            Thời gian dạy:{' '}
                            <strong>
                                {moment(c.classes.startDate).format(
                                    'DD/mm/yyyy'
                                )}{' '}
                                -{' '}
                                {moment(c.classes.endDate).format('DD/mm/yyyy')}
                            </strong>
                        </Text>
                        <Flex justify="start" align="center" gap={5} mb={10}>
                            <Text size="lg" mt="sm" c="dimmed">
                                Trạng thái:
                            </Text>
                            <Badge color="indigo" mt={12}>
                                {c.classes.status}
                            </Badge>
                        </Flex>
                    </Paper>
                </>
            )}
        </Grid.Col>
    ))

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
                                    <MediaQuery
                                        query="max-width: (780px)"
                                        styles={{ width: '100%' }}
                                    >
                                        <Group position="right">
                                            <Input
                                                id="search-input"
                                                icon={<IconFilterSearch />}
                                                size="md"
                                                maw={270}
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
