import {
    Badge,
    Box,
    Button,
    Container, Grid,
    Group,
    Image,
    Input, Loader,
    MediaQuery,
    Modal,
    Paper,
    rem,
    Skeleton,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
    IconAlertCircle,
    IconFilterSearch, IconMedal2
} from '@tabler/icons-react'
import { MaterialReactTable } from 'material-react-table'
import moment from 'moment/moment'
import { useEffect, useMemo, useState } from 'react'

// API
import classApi from '../../api/classApi'
import pointApi from '../../api/pointApi'

// scss
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

// IMAGE PATH
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const ClassResult = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // Main Variable
    const [listClasses, setListClasses] = useState([])

    // Action Variable
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedClass, setSelectedClass] = useState([])
    const [showModal, handlersShowModal] = useDisclosure(false, {
        onOpen: () => console.log(''),
        onClose: () => setSelectedClass([])
    })

    // Fetch Area
    const fetchListClasses = async () => {
        try {
            const resp = await classApi.getAllClassByTeacherId(user.username)

            if (resp.status === 200 && resp.data.length > 0) {
                const dataResponse = resp.data

                const resultClass = []
                for (let i = 0; i < dataResponse.length; i++) {
                    const classes = dataResponse[i]

                    const studentAndPoint = await fetchPointAndStudent(
                        classes.classes.classId
                    )

                    console.log(studentAndPoint)

                    const studyPercentage = calculatePercentage(
                        studentAndPoint.listPointsOfStudent
                    )

                    const newClassesData = {
                        ...classes,
                        studentAndPoint: studentAndPoint.listPointsOfStudent,
                        studyPercentage: studyPercentage
                    }

                    resultClass.push(newClassesData)
                }

                console.log(resultClass)
                setListClasses(resultClass)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPointAndStudent = async (classId) => {
        try {
            const resp = await pointApi.getAllPointByClassId(parseInt(classId))
            return resp.data
        } catch (error) {
            console.log(error)
        }
    }

    const calculatePercentage = (pointAndStudent) => {
        let excellentCount = 0
        let goodCount = 0
        let fairCount = 0
        let averageCount = 0
        let weakCount = 0

        pointAndStudent.forEach((student) => {
            const averagePoint = student.averagePoint

            if (averagePoint >= 9) {
                excellentCount++
            } else if (averagePoint >= 8) {
                goodCount++
            } else if (averagePoint >= 5) {
                fairCount++
            } else if (averagePoint >= 3) {
                averageCount++
            } else {
                weakCount++
            }
        })

        // caculate for each item
        const totalCount = pointAndStudent.length
        const excellentPercentage = (excellentCount / totalCount) * 100
        const goodPercentage = (goodCount / totalCount) * 100
        const fairPercentage = (fairCount / totalCount) * 100
        const averagePercentage = (averageCount / totalCount) * 100
        const weakPercentage = (weakCount / totalCount) * 100

        return {
            excellent: excellentPercentage.toFixed(2),
            good: goodPercentage.toFixed(2),
            fair: fairPercentage.toFixed(2),
            average: averagePercentage.toFixed(2),
            weak: weakPercentage.toFixed(2),
            countExcellent: excellentCount,
            countGood: goodCount,
            countFair: fairCount,
            countAverage: averageCount,
            countWeak: weakCount
        }
    }

    // ********** Action
    const handleChangeSearchClass = (e) => {
        setSearchTerm(e.target.value)
    }

    const filteredClasses = listClasses.filter((item) => {
        const className = item.classes.className
        const startDate = item.classes.startDate
        const endDate = item.classes.endDate
        const courseName = item.courseName[0]

        const lowerSearchTerm = searchTerm.toLowerCase()

        return (
            className.toLowerCase().includes(lowerSearchTerm) ||
            courseName.toLowerCase().includes(lowerSearchTerm) ||
            startDate.includes(lowerSearchTerm) ||
            endDate.includes(lowerSearchTerm)
        )
    })

    const handleSetSelectedClass = (students) => {
        console.log(students)
        setSelectedClass(students)
        handlersShowModal.open()
    }

    // React Data table area
    const showTypeOfStudy = (averagePoint) => {
        if (averagePoint >= 9) {
            return (
                <Badge color="violet" size="md">
                    Xuất sắc
                </Badge>
            )
        } else if (averagePoint >= 8) {
            return (
                <Badge color="indigo" size="md">
                    Giỏi
                </Badge>
            )
        } else if (averagePoint >= 5) {
            return (
                <Badge color="indigo" size="md">
                    Khá
                </Badge>
            )
        } else if (averagePoint >= 3) {
            return (
                <Badge color="indigo" size="md">
                    Trung bình
                </Badge>
            )
        } else if (averagePoint > 0) {
            return (
                <Badge color="red" size="md">
                    Yếu
                </Badge>
            )
        } else {
            return (
                <Badge color="gray" size="md">
                    Chưa có điểm
                </Badge>
            )
        }
    }

    const columnStudent = useMemo(
        () => [
            {
                accessorKey: 'studentImg',
                header: 'Hình ảnh',
                size: 20,
                Cell: ({ cell }) => (
                    <Image
                        src={`${PUBLIC_IMAGE}/students/${cell.row.original.studentImage}`}
                        width={30}
                        height={30}
                        radius="50%"
                        withPlaceholder
                        alt="student-img"
                    />
                )
            },
            {
                accessorKey: 'studentName',
                header: 'Tên sinh viên',
                size: 180
            },
            {
                accessorKey: 'averagePoint',
                header: 'Điểm trung bình',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return <span>{row.toFixed(2)}</span>
                },
                size: 30
            },
            {
                accessorKey: 'attendancePoint',
                header: 'Điểm chuyên cần',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return <span>{row.toFixed(2)}</span>
                },
                size: 30
            },
            {
                accessorKey: 'exercisePoint',
                header: 'Điểm cuối kì',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return <span>{row.toFixed(2)}</span>
                },
                size: 30
            },
            {
                accessorKey: 'quizzPoint',
                header: 'Điểm quiz',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return <span>{row.toFixed(2)}</span>
                },
                size: 30
            },
            {
                accessorFn: (row) => row,
                header: 'Xếp loại',
                size: 80,
                Cell: ({ cell }) => {
                    return showTypeOfStudy(cell.row.original.averagePoint)
                }
            }
        ],
        []
    )

    // ************** Render UI
    const resultList = filteredClasses.map((classes, index) => (
        <Grid.Col xl={4} lg={4} md={6} sm={12} key={index}>
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
                    <Tooltip
                        label="Nhấn vào để xem chi tiết"
                        color="indigo"
                        withArrow
                    >
                        <Paper
                            withBorder
                            radius="md"
                            p={15}
                            className={styles['card-without-border']}
                            onClick={() =>
                                handleSetSelectedClass(classes.studentAndPoint)
                            }
                        >
                            <Stack>
                                <Title
                                    order={3}
                                    color="dark"
                                    fw={700}
                                    lineClamp={2}
                                >
                                    LỚP: {classes.classes.className}
                                </Title>
                                <Title
                                    order={4}
                                    color="dark"
                                    fw={500}
                                    lineClamp={2}
                                    mt={-15}
                                >
                                    Khóa học: {classes.courseName[0]}
                                </Title>
                                <Group position="left" m={0} p={0}>
                                    <Text size="md" color="dimmed">
                                        Trạng thái:{' '}
                                    </Text>
                                    <Badge color="indigo">
                                        {classes.classes.status}
                                    </Badge>
                                </Group>
                                <Text
                                    color="dimmed"
                                    size="md"
                                    mt={-15}
                                    lineClamp={2}
                                >
                                    Thời gian học từ ngày{' '}
                                    <strong>
                                        {classes.classes.startDate !== null
                                            ? moment(
                                                  classes.classes.startDate
                                              ).format('DD-MM-yyyy')
                                            : 'Chưa có ngày khả dụng'}
                                    </strong>{' '}
                                    đến{' '}
                                    <strong>
                                        {classes.classes.endDate !== null
                                            ? moment(
                                                  classes.classes.endDate
                                              ).format('DD-MM-yyyy')
                                            : 'Chưa có ngày khả dụng'}
                                    </strong>
                                </Text>
                                <Box>
                                    <Text
                                        color="dark"
                                        fw={700}
                                        size="xl"
                                        mb={10}
                                    >
                                        Tổng quan tỉ lệ xếp loại sinh viên
                                    </Text>
                                    {/* List xep loai sinh vien */}
                                    <Box>
                                        <Group position="apart" mb={15}>
                                            <Group position="left">
                                                <ThemeIcon
                                                    color="violet"
                                                    size={24}
                                                    radius="xl"
                                                >
                                                    <IconMedal2 size="1rem" />
                                                </ThemeIcon>
                                                <Text
                                                    color="dimmed"
                                                    size="md"
                                                    mr="auto"
                                                >
                                                    {
                                                        classes.studyPercentage
                                                            .countExcellent
                                                    }{' '}
                                                    sv "Xuất sắc":{' '}
                                                </Text>
                                            </Group>
                                            <Badge
                                                color="violet"
                                                size="lg"
                                                ml="auto"
                                            >
                                                {
                                                    classes.studyPercentage
                                                        .excellent
                                                }
                                                %
                                            </Badge>
                                        </Group>

                                        <Group position="apart" mb={15}>
                                            <Group position="left">
                                                <ThemeIcon
                                                    color="indigo"
                                                    size={24}
                                                    radius="xl"
                                                >
                                                    <IconMedal2 size="1rem" />
                                                </ThemeIcon>
                                                <Text
                                                    color="dimmed"
                                                    size="md"
                                                    mr="auto"
                                                >
                                                    {
                                                        classes.studyPercentage
                                                            .countGood
                                                    }{' '}
                                                    sv "Giỏi":{' '}
                                                </Text>
                                            </Group>
                                            <Badge
                                                color="indigo"
                                                size="lg"
                                                ml="auto"
                                            >
                                                {classes.studyPercentage.good}%
                                            </Badge>
                                        </Group>

                                        <Group position="apart" mb={15}>
                                            <Group position="left">
                                                <ThemeIcon
                                                    color="indigo"
                                                    size={24}
                                                    radius="xl"
                                                >
                                                    <IconMedal2 size="1rem" />
                                                </ThemeIcon>
                                                <Text
                                                    color="dimmed"
                                                    size="md"
                                                    mr="auto"
                                                >
                                                    {
                                                        classes.studyPercentage
                                                            .countFair
                                                    }{' '}
                                                    sv "Khá":{' '}
                                                </Text>
                                            </Group>
                                            <Badge
                                                color="indigo"
                                                size="lg"
                                                ml="auto"
                                            >
                                                {classes.studyPercentage.fair}%
                                            </Badge>
                                        </Group>

                                        <Group position="apart" mb={15}>
                                            <Group position="left">
                                                <ThemeIcon
                                                    color="indigo"
                                                    size={24}
                                                    radius="xl"
                                                >
                                                    <IconMedal2 size="1rem" />
                                                </ThemeIcon>
                                                <Text
                                                    color="dimmed"
                                                    size="md"
                                                    mr="auto"
                                                >
                                                    {
                                                        classes.studyPercentage
                                                            .countAverage
                                                    }{' '}
                                                    sv "Trung bình":{' '}
                                                </Text>
                                            </Group>
                                            <Badge
                                                color="indigo"
                                                size="lg"
                                                ml="auto"
                                            >
                                                {
                                                    classes.studyPercentage
                                                        .average
                                                }
                                                %
                                            </Badge>
                                        </Group>

                                        <Group position="apart" mb={15}>
                                            <Group position="left">
                                                <ThemeIcon
                                                    color="red"
                                                    size={24}
                                                    radius="xl"
                                                >
                                                    <IconAlertCircle size="1rem" />
                                                </ThemeIcon>
                                                <Text
                                                    color="dimmed"
                                                    size="md"
                                                    mr="auto"
                                                >
                                                    {
                                                        classes.studyPercentage
                                                            .countWeak
                                                    }{' '}
                                                    sv "Yếu":{' '}
                                                </Text>
                                            </Group>
                                            <Badge
                                                color="indigo"
                                                size="lg"
                                                ml="auto"
                                            >
                                                {classes.studyPercentage.weak}%
                                            </Badge>
                                        </Group>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>
                    </Tooltip>
                </>
            )}
        </Grid.Col>
    ))

    // UseEffect Area
    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            await fetchListClasses()
            setLoading(false)
        }

        fetchData()
    }, [])

    return (
        <Container fluid size="xl">
            <Box p={rem('2rem')} mt={10} className={styles.box}>
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
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Group position="apart" mb="xl">
                                    <Title order={2} color="dark">
                                        KẾT QUẢ HỌC TẬP
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

                                {/* List Class */}
                                <Grid gutter="md">{resultList}</Grid>
                            </>
                        )}
                    </>
                )}
            </Box>

            {/* Modals */}
            <Modal.Root
                opened={showModal}
                onClose={handlersShowModal.close}
                centered
                size="auto"
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title color="dark" fw={500}>
                            Chi tiết điểm học viên
                        </Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Stack mb={20}>
                            <MaterialReactTable
                                muiTableBodyProps={{
                                    sx: {
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                                enableRowNumbers
                                state={{
                                    isLoading: loading
                                }}
                                displayColumnDefOptions={{
                                    'mrt-row-numbers': {
                                        size: 5
                                    }
                                }}
                                columns={columnStudent}
                                data={
                                    selectedClass !== null || []
                                        ? selectedClass
                                        : []
                                }
                                enableColumnOrdering
                                enableStickyHeader
                                enableStickyFooter
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: true,
                                    showLastButton: true
                                }}
                            />
                            <Button
                                onClick={() => {
                                    handlersShowModal.close()
                                    setSelectedClass([])
                                }}
                                variant="filled"
                                color="violet"
                                ml="auto"
                            >
                                Xác nhận
                            </Button>
                        </Stack>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </Container>
    )
}

export default ClassResult
