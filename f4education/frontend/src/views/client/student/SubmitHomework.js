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
    Badge
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useDisclosure } from '@mantine/hooks'
import { MaterialReactTable } from 'material-react-table'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import moment from 'moment'
import { Dropzone } from '@mantine/dropzone'
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

    // const [opened, { toggle }] = useDisclosure(false)
    const [openedIndexes, setOpenedIndexes] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showModalConfirm, setShowModalConfirm] = useState(false)
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
            }
            console.log(resp.data.length)
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
        } catch (error) {
            console.log(error)
        }
    }

    const submitTask = async (className, taskName) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

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

    // delete file
    const handleDeleteRow = async (row, className, taskName, studentName) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            setLoadingFileStudent(true)
            let fileId = row.original.id
            const resp = await resourceApi.deleteFileById(fileId)
            getAllFilesInFolderTaskStudent(className, taskName, studentName)
            setShowModalConfirm(false)
            setLoadingFileStudent(false)
            toast.update(id, Notify.options.deleteFileSuccess())
        } catch (error) {
            console.log(error)
        }
    }

    const isCurrentDateInRange = (startDate, endDate) => {
        const currentDate = moment()
        return currentDate.isBetween(startDate, endDate, 'day', '[]')
    }

    const toggle = (index) => {
        if (openedIndexes.includes(index)) {
            setOpenedIndexes(openedIndexes.filter((i) => i !== index))
        } else {
            setOpenedIndexes([...openedIndexes, index])
        }
    }

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
                            defaultValue={new Date()}
                            size="lg"
                            bg={'#FFFFFF'}
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col span={8} bg={'#ebebeb'}>
                    {loading ? (
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
                    ) : (
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
                                    {tasks[0].className}- Task
                                </Title>
                            </Group>

                            {tasks.map((task, indexTask) => (
                                <Paper
                                    shadow="xs"
                                    px="xl"
                                    py={10}
                                    my={20}
                                    mx={20}
                                    key={indexTask}
                                >
                                    <Title my={5} order={3}>
                                        {task.title}
                                    </Title>
                                    <Text my={5}>{task.description}</Text>
                                    <Text my={5}>
                                        Thời gian:{' '}
                                        {moment(task.startDate).format(
                                            'DD/MM/yyyy'
                                        )}{' '}
                                        -{' '}
                                        {moment(task.endDate).format(
                                            'DD/MM/yyyy'
                                        )}
                                    </Text>
                                    <Text my={5}>
                                        Giáo viên: {task.teacherName}
                                    </Text>
                                    <Badge
                                        variant="outline"
                                        color="teal"
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
                                    <Text ta="right">
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
                                            }}
                                        >
                                            <IconBookUpload /> Nộp bài
                                        </Button>
                                    </Text>
                                    <Collapse
                                        in={openedIndexes.includes(indexTask)}
                                    >
                                        <Text fw={700}>Bài tập của tôi</Text>
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
                                            data={allFilesInFolderTaskStudent}
                                            initialState={{
                                                columnVisibility: { id: false }
                                            }}
                                            positionActionsColumn="last"
                                            state={{
                                                isLoading: loadingFileStudent
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
                                                        display: 'flex',
                                                        flexWrap: 'nowrap',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => {
                                                            setShowModalConfirm(
                                                                true
                                                            )
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <Modal
                                                        className="modal-dialog-centered modal-lg"
                                                        isOpen={
                                                            showModalConfirm
                                                        }
                                                        backdrop={'static'}
                                                    >
                                                        <div className="modal-header">
                                                            <h1
                                                                className="modal-title"
                                                                id="modal-title-default"
                                                            >
                                                                Thông báo
                                                            </h1>
                                                            <button
                                                                aria-label="Close"
                                                                className="close"
                                                                data-dismiss="modal"
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowModalConfirm(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    aria-hidden={
                                                                        true
                                                                    }
                                                                >
                                                                    ×
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <Title order={2}>
                                                                Bạn có chắc chắn
                                                                muốn xóa file
                                                                ???
                                                            </Title>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <Button
                                                                color="default"
                                                                outline
                                                                data-dismiss="modal"
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowModalConfirm(
                                                                        false
                                                                    )
                                                                }}
                                                            >
                                                                Hủy
                                                            </Button>
                                                            <Button
                                                                color="red"
                                                                type="button"
                                                                onClick={() => {
                                                                    handleDeleteRow(
                                                                        row,
                                                                        task.className,
                                                                        task.title,
                                                                        user.id +
                                                                            ' - ' +
                                                                            user.fullName
                                                                    )
                                                                }}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </Modal>
                                                </Box>
                                            )}
                                        />
                                    </Collapse>
                                    <Modal
                                        className="modal-dialog-centered modal-lg"
                                        isOpen={showModal}
                                        backdrop={'static'}
                                    >
                                        <div className="modal-header">
                                            <h3
                                                className="modal-title"
                                                id="modal-title-default"
                                            >
                                                Nộp bài tập
                                            </h3>
                                            <button
                                                aria-label="Close"
                                                className="close"
                                                data-dismiss="modal"
                                                type="button"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                            >
                                                <span aria-hidden={true}>
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <Dropzone
                                                onDrop={(files) => {
                                                    const selectedFiles =
                                                        Array.from(files)
                                                    setSelectedFile(
                                                        selectedFiles
                                                    )
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
                                                                theme.colors[
                                                                    theme
                                                                        .primaryColor
                                                                ][
                                                                    theme.colorScheme ===
                                                                    'dark'
                                                                        ? 4
                                                                        : 6
                                                                ]
                                                            }
                                                        />
                                                    </Dropzone.Accept>
                                                    <Dropzone.Reject>
                                                        <IconX
                                                            size="3.2rem"
                                                            stroke={1.5}
                                                            color={
                                                                theme.colors
                                                                    .red[
                                                                    theme.colorScheme ===
                                                                    'dark'
                                                                        ? 4
                                                                        : 6
                                                                ]
                                                            }
                                                        />
                                                    </Dropzone.Reject>
                                                    <Dropzone.Idle>
                                                        <IconPhoto
                                                            size="3.2rem"
                                                            stroke={1.5}
                                                        />
                                                    </Dropzone.Idle>

                                                    <div>
                                                        <Text size="xl" inline>
                                                            Thả files excel vào
                                                            đây hoặc click vào
                                                            để chọn files
                                                        </Text>
                                                        <Text
                                                            size="sm"
                                                            color="dimmed"
                                                            inline
                                                            mt={7}
                                                        >
                                                            Thả mỗi lần một
                                                            file, lưu ý dung
                                                            lượng file phải dưới
                                                            5MB
                                                        </Text>
                                                    </div>
                                                </Group>
                                            </Dropzone>
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
                                                    submitTask(
                                                        task.className,
                                                        task.title
                                                    )
                                                }}
                                            >
                                                Nộp
                                            </Button>
                                        </div>
                                    </Modal>
                                </Paper>
                            ))}
                        </>
                    )}
                </Grid.Col>
            </Grid>
        </>
    )
}
export default SubmitHomework
