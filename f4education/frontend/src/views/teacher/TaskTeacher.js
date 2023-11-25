import {
    Box,
    Button,
    Flex,
    Modal,
    Skeleton,
    NumberInput,
    TextInput,
    Textarea,
    LoadingOverlay
} from '@mantine/core'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { Edit as EditIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'

// API
import scheduleApi from '../../api/scheduleApi'
import taskTeacherApi from '../../api/taskTeacherApi'

// scss
import { useDisclosure } from '@mantine/hooks'
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

const today = new Date('2023-12-30').toDateString().substring(4, 16).trim()

const TaskTeacher = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')

    let navigate = useNavigate()

    const [examOpened, handlers] = useDisclosure(false, {
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed')
    })

    const [listClasses, setListClasses] = useState([])

    const [datepicker, setDatepicker] = useState([null, null])

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [update, setUpdate] = useState(false)

    //! useState chứa lịch dạy của giảng viên
    const [schedules, setSchedules] = useState([])

    const [tasks, setTasks] = useState([])

    const [visible, setVisible] = useState(false)

    const [schedulesFillter, setSchedulesFillter] = useState([])

    //! useState chứa 1 buổi dạy của giảng viên
    const [schedule, setSchedule] = useState({
        date: '',
        classRoomName: '',
        classId: '',
        courseName: '',
        sessionName: '',
        time: '',
        isPractice: false
    })

    const [task, setTask] = useState({
        taskId: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        classesId: ''
    })

    const [taskRequest, setTaskRequest] = useState({
        taskId: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        classesId: ''
    })

    const openEdit = (row) => {
        const startDate = new Date(row.original.startDate)
        const endDate = new Date(row.original.endDate)
        setTask({ ...row.original, startDate, endDate })
        form.setValues({
            taskId: row.original.taskId,
            title: row.original.title,
            startDate: startDate,
            endDate: endDate,
            description: row.original.description,
            classesId: 6
        })
        handlers.open()
    }

    //! fetch lịch dạy của giảng viên
    const fetchClassByTeacher = async () => {
        try {
            setLoading(true)
            const resp = await scheduleApi.findAllScheduleTeacherByID(user.id)
            if (resp.status === 200 && resp.data.length > 0) {
                let data = resp.data
                setSchedules(data)
                let dataFilter = await filler(data, datepicker)
                setSchedulesFillter([...dataFilter])
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getTasks = async () => {
        try {
            setLoading(true)
            const resp = await taskTeacherApi.getAllTask(6)
            if (resp.status === 200 && resp.data.length > 0) {
                let data = resp.data
                console.log(
                    '🚀 ~ file: TaskTeacher.js:98 ~ getTasks ~ data:',
                    data
                )
                setTasks(data)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (date) => {
        const formattedDate = moment(date)
            .locale('vi')
            .format('dddd, DD/MM/yyyy')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    const formatDateTime = (date) => {
        const formattedDate = moment(date)
            .locale('vi')
            .format('dddd, DD/MM/yyyy HH:mm')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    const columnTask = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Tiêu đề',
                enableEditing: false,
                enableSorting: false,
                size: 80
            },
            {
                accessorKey: 'description',
                header: 'Mô tả',
                size: 80
            },
            {
                accessorKey: 'startDate',
                header: 'Thời gian bắt đầu',
                enableEditing: false,
                enableSorting: false,
                accessorFn: (row) => formatDateTime(row.startDate),
                size: 100
            },
            {
                accessorKey: 'endDate',
                header: 'Thời gian kết thúc',
                enableEditing: false,
                enableSorting: false,
                accessorFn: (row) => formatDateTime(row.endDate),
                size: 100
            }
        ],
        []
    )

    const redirectTo = (classId) => {
        return navigate('/teacher/classes-info/' + classId)
    }

    const filler = async (list, value) => {
        let schedulesInThePast = null
        let check = false
        if (value[0] != null && value[1] != null) {
            check = true
        }

        switch (check) {
            case true: {
                schedulesInThePast = list.filter((item) => {
                    return (
                        new Date(item.date.substring(0, 10)) >
                            new Date(value[0]) &&
                        new Date(item.date.substring(0, 10)) <
                            new Date(value[1])
                    )
                })
                break
            }
            default: {
                schedulesInThePast = list.filter((item) => {
                    return (
                        new Date(item.date.substring(0, 10)) > new Date(today)
                    )
                })
                break
            }
        }

        return schedulesInThePast
    }

    const navigateToClassInformationDetail = (classId) => {
        navigate('/teacher/classes-info/' + classId)
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

    const onChangeDatePickr = async (value) => {
        setDatepicker(value)
        let dataFilter = await filler(schedules, value)
        setSchedulesFillter([...dataFilter])
        console.log(
            '🚀 ~ file: TaskTeacher.js:224 ~ onChangeDatePickr ~ dataFilter:',
            task
        )
    }

    const submit = async () => {
        // e.preventDefault()

        const startDate = new Date(form.values.startDate)
        const endDate = new Date(form.values.endDate)

        const taskRequest = {
            ...form.values,
            startDate: startDate,
            endDate: endDate
        }
        // console.log('🚀', taskRequest)
        const id = toast(Notify.msg.loading, Notify.options.loading())

        try {
            const resp = await taskTeacherApi.addTask(taskRequest)
            if (resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())
                getTasks()
                resetForm()
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
            console.log(
                '🚀 ~ file: ClassDetail.js:94 ~ handleSave ~ error:',
                error
            )
        }
    }

    const resetForm = () => {
        // hide form
        // setUpdate(false)
        form.setValues({
            taskId: '',
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            classesId: 6
        })

        handlers.close()
    }

    const addTask = () => {
        console.log('🚀', form)

        handlers.open()
    }

    const handelOnChangeInput = (e) => {
        console.log(
            '🚀 ~ file: TaskTeacher.js:259 ~ handelOnChangeInput ~ e.target:',
            e.target
        )
        const { name, value } = e.target

        // Xử lý cho các trường input khác (không phải ngày tháng)
        setTask((preTask) => ({
            ...preTask,
            [name]: value,
            numberSession: 0
        }))
    }

    const handelOnChangeInputDate = (date) => {
        console.log(
            '🚀 ~ file: TaskTeacher.js:259 ~ handelOnChangeInput ~ e.target:',
            date
        )

        // Chuyển đổi giá trị ngày tháng sang đối tượng ngày JavaScript
        setTask((preTask) => ({
            ...preTask,
            startDate: date,
            numberSession: 0
        }))
    }

    const form = useForm({
        initialValues: {
            taskId: '',
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            classesId: 6
        },

        // functions will be used to validate values at corresponding key
        validate: {
            title: (value) => (value === '' ? 'Không để trống tên gọi' : null),
            startDate: (value) =>
                value === '' ? 'Vui lòng chọn thời gian bắt đầu' : null,
            endDate: (value) =>
                value === '' ? 'Vui lòng chọn thời gian kết thúc' : null,
            description: (value) =>
                value === '' ? 'Không để trống miêu tả' : null
        }
    })

    useEffect(() => {
        getTasks()
    }, [])

    return (
        <>
            <ToastContainer />
            {/* Model edit form */}
            <Modal.Root opened={examOpened} onClose={resetForm} centered>
                <Modal.Overlay />
                <Modal.Content pos="relative">
                    <LoadingOverlay visible={visible} overlayBlur={2} />
                    <Modal.Header>
                        <Modal.Title>Giao bài tập </Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Box maw={340} mx="auto">
                            <form onSubmit={form.onSubmit(submit)}>
                                <DateTimePicker
                                    valueFormat="DD/MM/YYYY HH:mm"
                                    label="Thời gian bắt đầu"
                                    placeholder="Thời gian bắt đầu..."
                                    maw={400}
                                    maxDate={form.values.endDate}
                                    {...form.getInputProps('startDate')}
                                    mx="auto"
                                />
                                <DateTimePicker
                                    mt="sm"
                                    valueFormat="DD/MM/YYYY HH:mm"
                                    label="Thời gian kết thúc"
                                    placeholder="Thời gian bắt đầu..."
                                    maw={400}
                                    minDate={form.values.startDate}
                                    {...form.getInputProps('endDate')}
                                    mx="auto"
                                />
                                <TextInput
                                    mt="sm"
                                    label="Tên gọi"
                                    placeholder="Tên gọi bài tập..."
                                    name="title"
                                    {...form.getInputProps('title')}
                                />
                                <Textarea
                                    mt="sm"
                                    label="Miêu tả"
                                    placeholder="Miêu tả bài tập..."
                                    {...form.getInputProps('description')}
                                />
                                <Button type="submit" mt="sm">
                                    Lưu
                                </Button>
                            </form>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

            <Box className={styles['box-content']}>
                {loading ? (
                    <>
                        <Flex justify="space-between" align="center">
                            <Skeleton width={150} height={30} mb="lg" />
                            <Skeleton width="200" height={20} mb="lg" />
                        </Flex>

                        <Skeleton width={'100%'} height={400} />
                    </>
                ) : (
                    <>
                        <MaterialReactTable
                            muiTableBodyProps={{
                                sx: {
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                            enableRowNumbers
                            columns={columnTask}
                            data={tasks}
                            enableColumnOrdering
                            enableStickyHeader
                            renderTopToolbarCustomActions={() => (
                                <Button onClick={addTask} color="green">
                                    <i className="bx bx-layer-plus"></i>
                                    Thêm task mới
                                </Button>
                            )}
                            displayColumnDefOptions={{
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
                            enableRowActions
                            positionActionsColumn="last"
                            renderRowActions={({ row, table }) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        gap: '8px'
                                    }}
                                >
                                    <IconButton
                                        color="secondary"
                                        onClick={() => {
                                            openEdit(row)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            )}
                            muiTableBodyRowProps={({ row }) => {
                                if (
                                    new Date(row.original.date)
                                        .toDateString()
                                        .substring(4, 16)
                                        .trim() === today
                                ) {
                                    console.log('==========')
                                    return {
                                        sx: { backgroundColor: 'red' }
                                    }
                                }
                            }}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                        />
                    </>
                )}
            </Box>
        </>
    )
}

export default TaskTeacher
