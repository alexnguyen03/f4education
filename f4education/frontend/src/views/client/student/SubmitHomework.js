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
    Image,
    Flex
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { MaterialReactTable } from 'material-react-table'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { Dropzone } from '@mantine/dropzone'
import { IconRefresh } from '@tabler/icons-react'
import {
    IconBookUpload,
    IconUpload,
    IconPhoto,
    IconX,
    IconEye
} from '@tabler/icons-react'
import { Modal } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../../utils/Notify'

import taskApi from 'api/taskApi'
import resourceApi from 'api/resourceApi'
import logoTask from '../../../assets/img/taskonlinetab.jpg'

const user = JSON.parse(localStorage.getItem('user'))

const SubmitHomework = () => {
    const itemsBreadcum = [
        { title: 'Trang chủ', href: '/student/classes' },
        { title: 'Nộp bài tập', href: '/student/task' }
    ].map((item, index) => (
        <Anchor href={item.href} key={index} color="dimmed">
            <Text fs="italic">{item.title}</Text>
        </Anchor>
    ))

    const [selectedDate, setSelectedDate] = useState(null)
    const [openedIndexes, setOpenedIndexes] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [className, setClassName] = useState('')
    const [taskName, setTaskName] = useState('')
    const [idFileStudent, setIdFileStudent] = useState('')
    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [showNotificationSearch, setShowNotificationSearch] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingFileStudent, setLoadingFileStudent] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedFile, setSelectedFile] = useState([null])
    const theme = useMantineTheme()
    const [allFilesInFolderTaskStudent, setAllFilesInFolderTaskStudent] =
        useState([])

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
            console.log(resp.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllFilesInFolderTaskStudent = async (
        className,
        taskName,
        studentName
    ) => {
        try {
            setLoadingFileStudent(true)
            const resp = await taskApi.getAllFilesInFolderTaskStudent(
                className,
                taskName,
                studentName
            )
            if (resp.status === 200) {
                setAllFilesInFolderTaskStudent(resp.data)
                setLoadingFileStudent(false)
            }
            if (resp.data.length === undefined) {
                setLoadingFileStudent(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const submitTask = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        if (selectedFile[0] === null) {
            toast.update(id, Notify.options.nullFile())
        } else {
            const formData = new FormData()
            formData.append('className', className)
            formData.append('taskName', taskName)
            formData.append('studentName', user.id + ' - ' + user.fullName)
            for (var i = 0; i < selectedFile.length; i++) {
                formData.append('file', selectedFile[i])
            }
            console.log([...formData])
            try {
                const resp = await taskApi.submitTaskFile(formData)
                if (resp.status === 200) {
                    setShowModal(false)
                    getAllFilesInFolderTaskStudent(
                        className,
                        taskName,
                        user.id + ' - ' + user.fullName
                    )
                    toast.update(id, Notify.options.uploadFileSuccess())
                }
            } catch (error) {
                console.log('Nộp bài thất bại', error)
            }
        }
    }

    // delete file
    const handleDeleteRow = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            setLoadingFileStudent(true)
            const resp = await resourceApi.deleteFileById(idFileStudent)
            setShowModalConfirm(false)
            setLoadingFileStudent(false)
            getAllFilesInFolderTaskStudent(
                className,
                taskName,
                user.id + ' - ' + user.fullName
            )
            toast.update(id, Notify.options.deleteFileSuccess())
        } catch (error) {
            console.log(error)
        }
    }

    const moment = require('moment')

    const isCurrentDateInRange = (startDateTime, endDateTime) => {
        const currentDateTime = moment(new Date()).format('DD-MM-yyyy h:mm:ss')
        console.log(
            '🚀 ~ file: SubmitHomework.js:203 ~ isCurrentDateInRange ~ currentDateTime:',
            currentDateTime
        )
        const startDate = moment(new Date(startDateTime)).format(
            'DD-MM-yyyy h:mm:ss'
        )
        console.log(
            '🚀 ~ file: SubmitHomework.js:206 ~ isCurrentDateInRange ~ startDate:',
            startDate
        )
        const endDate = moment(new Date(endDateTime)).format(
            'DD-MM-yyyy h:mm:ss'
        )
        console.log(
            '🚀 ~ file: SubmitHomework.js:210 ~ isCurrentDateInRange ~ endDate:',
            endDate
        )
        return moment(currentDateTime, 'DD-MM-yyyy h:mm:ss').isBetween(
            moment(startDate, 'DD-MM-yyyy h:mm:ss'),
            moment(endDate, 'DD-MM-yyyy h:mm:ss'),
            null,
            '[]'
        )
    }

    const toggle = (index) => {
        if (openedIndexes.includes(index)) {
            setOpenedIndexes(openedIndexes.filter((i) => i !== index))
        } else {
            setOpenedIndexes([index])
        }
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
            <Breadcrumbs
                className="my-5 p-3"
                style={{ backgroundColor: '#ebebeb' }}
            >
                {itemsBreadcum}
            </Breadcrumbs>
            <Grid>
                <Grid.Col span={3} mx={40}>
                    <Center>
                        <DatePicker
                            key={
                                selectedDate ? selectedDate.toString() : 'null'
                            }
                            defaultValue={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            size="lg"
                            bg={'#FFFFFF'}
                        />
                    </Center>
                    <Center>
                        <Button
                            mt={5}
                            variant="filled"
                            color="violet"
                            onClick={() => {
                                getAllTaskByClassId()
                                setSelectedDate(null)
                            }}
                        >
                            <IconRefresh />
                        </Button>
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
                                        {tasks[0].className}- Bài tập
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
                                                        'DD/MM/yyyy, h:mm:ss A'
                                                    )}{' '}
                                                    -{' '}
                                                    {moment(
                                                        task.endDate
                                                    ).format(
                                                        'DD/MM/yyyy, h:mm:ss A'
                                                    )}
                                                </Text>
                                                <Text my={5}>
                                                    Giáo viên:{' '}
                                                    {task.teacherName}
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
                                                        onClick={() => {
                                                            toggle(indexTask)
                                                            getAllFilesInFolderTaskStudent(
                                                                task.className,
                                                                task.title,
                                                                user.id +
                                                                    ' - ' +
                                                                    user.fullName
                                                            )
                                                        }}
                                                        mr={5}
                                                        mb={10}
                                                    >
                                                        <IconEye /> Xem file
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            !isCurrentDateInRange(
                                                                task.startDate,
                                                                task.endDate
                                                            )
                                                        }
                                                        variant="filled"
                                                        color="teal"
                                                        mt={5}
                                                        onClick={() => {
                                                            setShowModal(true)
                                                            setClassName(
                                                                task.className
                                                            )
                                                            setTaskName(
                                                                task.title
                                                            )
                                                        }}
                                                    >
                                                        <IconBookUpload /> Nộp
                                                        bài
                                                    </Button>
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={12}>
                                                <Collapse
                                                    in={openedIndexes.includes(
                                                        indexTask
                                                    )}
                                                    onEntered={() =>
                                                        toggle(indexTask)
                                                    }
                                                >
                                                    <Text fw={700}>
                                                        Bài tập của tôi
                                                    </Text>
                                                    <hr className="my-3" />
                                                    <MaterialReactTable
                                                        displayColumnDefOptions={{
                                                            'mrt-row-actions': {
                                                                header: 'Xóa',
                                                                size: 80
                                                            }
                                                        }}
                                                        enableRowNumbers
                                                        columns={columnFileTask}
                                                        data={
                                                            allFilesInFolderTaskStudent
                                                        }
                                                        initialState={{
                                                            columnVisibility: {
                                                                id: false
                                                            }
                                                        }}
                                                        positionActionsColumn="last"
                                                        state={{
                                                            isLoading:
                                                                loadingFileStudent
                                                        }}
                                                        enableRowActions={isCurrentDateInRange(
                                                            task.startDate,
                                                            task.endDate
                                                        )}
                                                        renderRowActions={({
                                                            row,
                                                            table
                                                        }) => (
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        'flex',
                                                                    flexWrap:
                                                                        'nowrap',
                                                                    gap: '5px'
                                                                }}
                                                            >
                                                                <IconButton
                                                                    color="secondary"
                                                                    onClick={() => {
                                                                        setShowModalConfirm(
                                                                            true
                                                                        )
                                                                        setIdFileStudent(
                                                                            row
                                                                                .original
                                                                                .id
                                                                        )
                                                                        setClassName(
                                                                            task.className
                                                                        )
                                                                        setTaskName(
                                                                            task.title
                                                                        )
                                                                    }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    />
                                                </Collapse>
                                            </Grid.Col>
                                        </Grid>
                                    </Paper>
                                ))}
                            </>
                        )}
                </Grid.Col>
            </Grid>
            <Modal
                className="modal-dialog-centered modal-lg"
                isOpen={showModal}
                backdrop={'static'}
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        Nộp bài tập
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setShowModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Dropzone
                        onDrop={(files) => {
                            const selectedFiles = Array.from(files)
                            setSelectedFile(selectedFiles)
                        }}
                        maxSize={3 * 1024 ** 2}
                        name="excelFile"
                    >
                        <Group
                            position="center"
                            spacing="xl"
                            style={{
                                minHeight: rem(220),
                                pointerEvents: 'none'
                            }}
                        >
                            <Dropzone.Accept>
                                <IconUpload
                                    size="3.2rem"
                                    stroke={1.5}
                                    color={
                                        theme.colors[theme.primaryColor][
                                            theme.colorScheme === 'dark' ? 4 : 6
                                        ]
                                    }
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    size="3.2rem"
                                    stroke={1.5}
                                    color={
                                        theme.colors.red[
                                            theme.colorScheme === 'dark' ? 4 : 6
                                        ]
                                    }
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size="3.2rem" stroke={1.5} />
                            </Dropzone.Idle>

                            <div>
                                <Text size="xl" inline>
                                    Thả files excel vào đây hoặc click vào để
                                    chọn files
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Thả mỗi lần một file, lưu ý dung lượng file
                                    phải dưới 5MB
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>
                    {selectedFile.length > 0 && (
                        <div>
                            <Text size="lg">File đã chọn:</Text>
                            <ul>
                                {selectedFile.map((file, index) => (
                                    <li key={index}>{file && file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <Button
                        color="default"
                        outline
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            setShowModal(false)
                        }}
                    >
                        Trở lại
                    </Button>
                    <Button
                        color={'teal'}
                        type="button"
                        onClick={() => {
                            submitTask()
                        }}
                    >
                        Nộp
                    </Button>
                </div>
            </Modal>
            <Modal
                className="modal-dialog-centered modal-lg"
                isOpen={showModalConfirm}
                backdrop={'static'}
            >
                <div className="modal-header">
                    <h1 className="modal-title" id="modal-title-default">
                        Thông báo
                    </h1>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setShowModalConfirm(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Title order={2}>Bạn có chắc chắn muốn xóa file ???</Title>
                </div>
                <div className="modal-footer">
                    <Button
                        color="default"
                        outline
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            setShowModalConfirm(false)
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="red"
                        type="button"
                        onClick={() => {
                            handleDeleteRow()
                        }}
                    >
                        Xóa
                    </Button>
                </div>
            </Modal>
        </>
    )
}
export default SubmitHomework
