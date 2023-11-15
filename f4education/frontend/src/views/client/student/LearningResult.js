import {
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    Group,
    Input,
    rem,
    Skeleton,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { IconFilterSearch } from '@tabler/icons-react'
import { MaterialReactTable } from 'material-react-table'
import moment from 'moment/moment'
import { useEffect, useMemo, useState } from 'react'
import {
    createSearchParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom'

// API
import classApi from '../../../api/classApi'
import pointApi from '../../../api/pointApi'

// SCSS
import resultStyle from '../../../assets/scss/custom-module-scss/client-custom/result/result.module.scss'

// IMAGE PATH
const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const LearningResult = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // Route
    let navigate = useNavigate()
    const [searchParam] = useSearchParams()

    // Main Variable
    const [listClasses, setListClasses] = useState([])
    const [listResult, setListResult] = useState([])

    // Action Variabel
    const [loading, setLoading] = useState(false)
    const [selectedClasses, setSelectedClass] = useState({})
    const [showingDetail, setShowingDetail] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // FETCH
    const handleFetchClasses = async () => {
        try {
            console.log(user.username)
            const resp = await classApi.getLearningResult(
                user.username !== null ? user.username : ''
            )

            console.log(resp)
            if (resp.status === 200) {
                console.log(resp.data)

                setListClasses(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFetchPointAndQuizz = async () => {
        setLoading(true)
        try {
            console.log(searchParam.get('classId'))
            const resp = await pointApi.getPointByStudentAndClass(
                user.username,
                parseInt(searchParam.get('classId'))
            )

            if (resp.status === 200) {
                console.log(resp.data.reverse())
                setListResult(resp.data.reverse())
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Action
    const handleSetSelectedClass = (classes) => {
        setSelectedClass(classes)

        setShowingDetail(true)
        navigate({
            pathname: '/student/result',
            search: `?${createSearchParams({
                classId: classes.classId
            })}`
        })
        document.documentElement.scrollTop = 0
        document.scrollingElement.scrollTop = 0
    }

    const handleChangeSearchClass = (e) => {
        setSearchTerm(e.target.value)
    }

    let filteredClasses
    if (listClasses.length > 0) {
        filteredClasses = listClasses.filter((item) => {
            const className = item.className
            const status = item.status
            const teacherName = item.teacherName
            const startDate = item.startDate
            const endDate = item.endDate
            const lowerSearchTerm = searchTerm.toLowerCase()

            return (
                className.toLowerCase().includes(lowerSearchTerm) ||
                status.toLowerCase().includes(lowerSearchTerm) ||
                teacherName.toLowerCase().includes(lowerSearchTerm) ||
                startDate.toLowerCase().includes(lowerSearchTerm) ||
                endDate.toLowerCase().includes(lowerSearchTerm)
            )
        })
    } else {
        console.error('listClasses is empty')
    }

    // Material table
    const columnPoint = useMemo(
        () => [
            {
                accessorKey: 'averagePoint',
                header: 'Điểm trung bình'
            },
            {
                accessorKey: 'attendancePoint',
                header: 'Điểm chuyên cần'
            },
            {
                accessorKey: 'exercisePoint',
                header: 'Điểm cuối kì'
            },
            {
                accessorKey: 'quizzPoint',
                header: 'Điểm quizz'
            }
        ],
        []
    )

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                await handleFetchClasses()
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        handleFetchPointAndQuizz(user.username, searchParam.get('classId'))
    }, [searchParam.get('classId')])

    return (
        <Box p={rem('2rem')}>
            {/* Title */}
            <Title order={1} color="dark" mb={rem('2rem')}>
                Kết quả học tập
            </Title>

            {/* Showing Detail */}
            {showingDetail && (
                <>
                    <Box mb={50}>
                        <Text
                            color="dimmed"
                            size="lg"
                            mb={15}
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            onClick={() => {
                                setLoading(false)
                                setShowingDetail(false)
                            }}
                        >
                            {'<< '} Trở về
                        </Text>

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
                            columns={columnPoint}
                            data={listResult ?? []}
                            enableColumnOrdering
                            enableStickyHeader
                            enableStickyFooter
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                            renderTopToolbarCustomActions={() => (
                                <Title order={2} fw={500} color="dark">
                                    LỚP HỌC: {selectedClasses.className}
                                </Title>
                            )}
                        />
                    </Box>
                </>
            )}

            {loading ? (
                <>
                    <Skeleton width="100%" height={30} mb={15} />
                    <Skeleton width="100%" height={200} mb={30} />
                    <Skeleton width="100%" height={200} mb={30} />
                    <Skeleton width="100%" height={200} mb={30} />
                </>
            ) : (
                <>
                    <Box>
                        {/* Search tearn */}
                        <Box mb={20}>
                            <Group position="left">
                                <Input
                                    id="search-input"
                                    icon={<IconFilterSearch />}
                                    size="md"
                                    w={350}
                                    placeholder="Tìm lớp học"
                                    onChange={(e) => handleChangeSearchClass(e)}
                                />
                                <Button color="violet" size="md" ml={20}>
                                    Tìm kiếm
                                </Button>
                            </Group>
                        </Box>
                        {filteredClasses.length === 0 ? (
                            <>
                                <Center w="100%">
                                    <Title
                                        order={1}
                                        maw={600}
                                        color="dark"
                                        fw={500}
                                        mt={200}
                                    >
                                        Không có lớp học nào khả dụng !
                                    </Title>
                                </Center>
                            </>
                        ) : (
                            <Box>
                                {/* List Class */}
                                {filteredClasses.map((classes) => (
                                    <>
                                        <Box
                                            w="100%"
                                            className={resultStyle.box}
                                            p={rem('1rem')}
                                            mb={50}
                                            onClick={() => {
                                                handleSetSelectedClass(classes)
                                            }}
                                        >
                                            <Stack>
                                                <Text color="dimmed" size="md">
                                                    Tổng{' '}
                                                    {classes.courseDuration} giờ
                                                    -{' '}
                                                    {classes.courseDuration / 2}{' '}
                                                    buổi học
                                                </Text>
                                                <Title
                                                    order={2}
                                                    fw={500}
                                                    color="dark"
                                                >
                                                    Lớp {classes.className}
                                                    {' - '}Thời gian học từ{' '}
                                                    {moment(
                                                        classes.startDate
                                                    ).format('DD-MM-yyyy')}{' '}
                                                    đến{' '}
                                                    {moment(
                                                        classes.endDate
                                                    ).format('DD-MM-yyyy') !==
                                                    'Invalid date'
                                                        ? moment(
                                                              classes.endDate
                                                          ).format('DD-MM-yyyy')
                                                        : '"chưa có ngày khả dụng"'}
                                                </Title>
                                                <Group position="left">
                                                    <Text
                                                        color="dark"
                                                        size="lg"
                                                    >
                                                        Trạng thái lớp học:{' '}
                                                    </Text>
                                                    <Badge
                                                        color="violet"
                                                        size="md"
                                                        ml={20}
                                                    >
                                                        {classes.status}
                                                    </Badge>
                                                </Group>
                                                <Group position="left">
                                                    <Avatar
                                                        src={`${PUBLIC_IMAGE}/teachers/${classes.teacherImage}`}
                                                        alt={''}
                                                        radius="xl"
                                                    />
                                                    <Group position="left">
                                                        <Text
                                                            color="dark"
                                                            size="lg"
                                                        >
                                                            Giáo viên hướng dẫn:{' '}
                                                        </Text>
                                                        <Text
                                                            color="dimmed"
                                                            size="lg"
                                                        >
                                                            {
                                                                classes.teacherName
                                                            }
                                                        </Text>
                                                    </Group>
                                                </Group>
                                            </Stack>
                                        </Box>
                                    </>
                                ))}
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </Box>
    )
}

export default LearningResult
