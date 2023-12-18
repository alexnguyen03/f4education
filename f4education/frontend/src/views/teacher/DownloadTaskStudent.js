import {
    Center,
    Grid,
    Anchor,
    Text,
    Breadcrumbs,
    Title,
    Group,
    Paper,
    Button,
    Collapse,
    rem,
    useMantineTheme,
    Loader,
    Stack,
    Badge,
    Flex
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Box, IconButton } from '@mui/material'
import moment from 'moment'
import { IconBookDownload } from '@tabler/icons-react'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'

import taskApi from 'api/taskApi'
import resourceApi from 'api/resourceApi'

import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'
import { Try } from '@mui/icons-material'
import logoTask from '../../assets/img/taskonlinetab.jpg'

const user = JSON.parse(localStorage.getItem('user'))

const DownloadTaskStudent = () => {
    let navigate = useNavigate()

    const [selectedDate, setSelectedDate] = useState(null)
    const [showNotification, setShowNotification] = useState(false)
    const [showNotificationSearch, setShowNotificationSearch] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    const redirectTo = () => {
        return navigate('/teacher/class-info/' + searchParams.get('classId'))
    }

    const [tasks, setTasks] = useState([
        {
            taskId: 0,
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            className: '',
            teacherName: ''
        }
    ])

    // bảng file task
    const columnFileTask = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID File',
                size: 150
            },
            {
                accessorKey: 'name',
                header: 'Tên File',
                size: 200
            },
            {
                accessorKey: 'size',
                header: 'Size',
                size: 50
            }
        ],
        []
    )

    const getAllTaskByClassId = async () => {
        try {
            setLoading(true)
            const resp = await taskApi.getAllTaskByClassId(
                searchParams.get('classId')
            )
            if (resp.status === 200 && resp.data.length > 0) {
                setTasks(resp.data)
                setLoading(false)
            }
            if (resp.data.length === 0) {
                setShowNotification(true)
            }
            console.log(resp.data.length)
        } catch (error) {
            console.log(error)
        }
    }

    const handleOnClickDownloadFiles = async (className, taskName) => {
        try {
            const resp = await resourceApi.downloadFilesStudent(
                className,
                taskName
            )
            alert(resp.status)
            if (resp.status === 200) {
                const blob = new Blob([resp.data], { type: 'application/zip' })
                const url = window.URL.createObjectURL(blob)
                // Tạo một thẻ <a> ẩn và kích hoạt tải về
                const a = document.createElement('a')
                a.href = url
                a.download = taskName + '.zip'
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()

                // Xóa thẻ <a> và URL tạo ra sau khi tải xong
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                deleteFoldelTmp()
            }
        } catch (error) {
            console.error('Failed to download files:', error)
        }
    }

    const deleteFoldelTmp = async () => {
        try {
            const resp = await resourceApi.deleteFoldelTmp()
        } catch (error) {
            console.error('Failed to delete files:', error)
        }
    }

    const isCurrentDateInRange = (startDateTime, endDateTime) => {
        const currentDateTime = moment(new Date()).format('DD-MM-yyyy h:mm:ss')
        const startDate = moment(new Date(startDateTime)).format(
            'DD-MM-yyyy h:mm:ss'
        )
        const endDate = moment(new Date(endDateTime)).format(
            'DD-MM-yyyy h:mm:ss'
        )
        return moment(currentDateTime, 'DD-MM-yyyy h:mm:ss').isBetween(
            moment(startDate, 'DD-MM-yyyy h:mm:ss'),
            moment(endDate, 'DD-MM-yyyy h:mm:ss'),
            null,
            '[]'
        )
    }

    const [filteredTasks, setFilteredTasks] = useState(tasks)

    useEffect(() => {
        if (selectedDate !== null) {
            const filteredTasks = tasks.filter((task) => {
                const startDate = new Date(task.startDate)
                const endDate = new Date(task.endDate)
                return selectedDate >= startDate && selectedDate <= endDate
            })
            if (filteredTasks.length === 0) {
                setShowNotificationSearch(true)
            } else {
                setShowNotificationSearch(false)
                setFilteredTasks(filteredTasks)
            }
        } else {
            setShowNotificationSearch(false)
            setFilteredTasks(tasks)
        }
    }, [selectedDate, tasks])

    useEffect(() => {
        getAllTaskByClassId()
    }, [])

    return (
        <>
            <ToastContainer />
            <Box my={'md'} className={styles['box-header']}>
                <Group position="apart" px={'lg'} py={'md'}>
                    <div
                        onClick={() => redirectTo()}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    <Title order={3} color="dark">
                        Chi tiết lớp học: {tasks[0].className}
                    </Title>
                </Group>
            </Box>
            <Grid mt={50}>
                <Grid.Col span={3} mx={40}>
                    <Center>
                        <DatePicker
                            // defaultValue={new Date()}
                            onChange={(date) => setSelectedDate(date)}
                            size="lg"
                            bg={'#FFFFFF'}
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col span={8} bg={'#ebebeb'}>
                    {showNotification && (
                        <Center>
                            <Stack align="center">
                                <i
                                    className="bx bxl-dropbox"
                                    style={{
                                        fontSize: '5rem',
                                        marginTop: '50px'
                                    }}
                                />
                                <br />
                                <Title
                                    order={2}
                                    color="dark"
                                    maw={600}
                                    align="center"
                                >
                                    Bạn chưa có Task nào trong lớp học
                                </Title>
                            </Stack>
                        </Center>
                    )}
                    {showNotificationSearch && (
                        <Center>
                            <Stack align="center">
                                <i
                                    className="bx bxl-dropbox"
                                    style={{
                                        fontSize: '5rem',
                                        marginTop: '50px'
                                    }}
                                />
                                <br />
                                <Title
                                    order={2}
                                    color="dark"
                                    maw={600}
                                    align="center"
                                >
                                    Không tìm thấy Task trong lớp học
                                </Title>
                            </Stack>
                        </Center>
                    )}
                    {loading && showNotification === false && (
                        <>
                            <Stack mt={100} mx="auto" align="center">
                                <Title order={2} color="dark">
                                    <Loader color="rgba(46, 46, 46, 1)" />
                                </Title>
                                <Text c="dimmed" fz="lg">
                                    Vui lòng chờ trong giây lát...
                                </Text>
                            </Stack>
                        </>
                    )}
                    {loading === false &&
                        showNotification === false &&
                        showNotificationSearch === false && (
                            <>
                                <Group>
                                    <BookmarkIcon
                                        style={{
                                            display: 'inline-block',
                                            transform: 'rotate(270deg)'
                                        }}
                                        fontSize="large"
                                        color="success"
                                    />
                                    <Title order={2}>
                                        Bài tập của lớp: {tasks[0].className}
                                    </Title>
                                </Group>

                                {filteredTasks.map((task, indexTask) => (
                                    <Paper
                                        shadow="xs"
                                        px="xl"
                                        py={10}
                                        my={20}
                                        mx={20}
                                        key={indexTask}
                                    >
                                        <Grid>
                                            <Grid.Col span={2} mt={17}>
                                                <img
                                                    src={logoTask}
                                                    className="img-fluid p-0"
                                                    alt="logo task"
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={9} ml={10} mt={5}>
                                                <Title my={5} order={3}>
                                                    {task.title}
                                                </Title>
                                                <Text my={5}>
                                                    {task.description}
                                                </Text>
                                                <Text my={5}>
                                                    Thời gian:{' '}
                                                    {moment(
                                                        task.startDate
                                                    ).format(
                                                        'DD/MM/yyyy, hh:mm A'
                                                    )}{' '}
                                                    -{' '}
                                                    {moment(
                                                        task.endDate
                                                    ).format(
                                                        'DD/MM/yyyy, hh:mm A'
                                                    )}
                                                </Text>
                                                <Badge
                                                    variant="outline"
                                                    color={
                                                        isCurrentDateInRange(
                                                            task.startDate,
                                                            task.endDate
                                                        )
                                                            ? 'teal'
                                                            : 'red'
                                                    }
                                                    size="lg"
                                                    mt={10}
                                                >
                                                    {isCurrentDateInRange(
                                                        task.startDate,
                                                        task.endDate
                                                    )
                                                        ? 'Đang diễn ra'
                                                        : 'Đã kết thúc'}
                                                </Badge>
                                                <Text ta={'right'}>
                                                    <Button
                                                        variant="filled"
                                                        color="teal"
                                                        mt={5}
                                                        mb={10}
                                                        onClick={() => {
                                                            handleOnClickDownloadFiles(
                                                                task.className,
                                                                task.title
                                                            )
                                                        }}
                                                    >
                                                        <IconBookDownload />{' '}
                                                        Download
                                                    </Button>
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                    </Paper>
                                ))}
                            </>
                        )}
                </Grid.Col>
            </Grid>
        </>
    )
}
export default DownloadTaskStudent
