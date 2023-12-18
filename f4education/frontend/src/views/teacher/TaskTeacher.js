import {
    Box,
    Button,
    Flex,
    LoadingOverlay,
    Modal,
    Skeleton,
    TextInput,
    Textarea
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { Edit as EditIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'

// API
import taskTeacherApi from '../../api/taskTeacherApi'

// scss
import { useDisclosure } from '@mantine/hooks'
import styles from '../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss'

const today = new Date('2023-12-30').toDateString().substring(4, 16).trim()

const TaskTeacher = () => {
    const [examOpened, handlers] = useDisclosure(false, {
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed')
    })

    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)

    const [tasks, setTasks] = useState([])

    const [visible, setVisible] = useState(false)

    const { classId } = useParams()

    const openEdit = (row) => {
        setUpdate(true)
        const startDate = new Date(row.original.startDate)
        const endDate = new Date(row.original.endDate)
        form.setValues({
            taskId: row.original.taskId,
            title: row.original.title,
            startDate: startDate,
            endDate: endDate,
            description: row.original.description,
            classesId: row.original.classesId
        })
        handlers.open()
    }

    const getTasks = async () => {
        try {
            setLoading(true)
            const resp = await taskTeacherApi.getAllTask(classId)
            if (resp.status === 200 && resp.data.length > 0) {
                let data = resp.data
                setTasks(data.reverse())
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
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

    const submit = async () => {
        // e.preventDefault()

        const startDate = new Date(form.values.startDate)
        const endDate = new Date(form.values.endDate)

        const taskRequest = {
            ...form.values,
            startDate: startDate,
            endDate: endDate
        }
        setVisible(true)
        const id = toast(Notify.msg.loading, Notify.options.loading())

        try {
            const resp = await taskTeacherApi.addTask(taskRequest)
            if (resp.status === 200) {
                if (update) {
                    // setTasks([resp.data, ...tasks])
                    setTasks(
                        tasks.map((item) => {
                            if (item.taskId === taskRequest.taskId) {
                                return resp.data
                            }
                            return item
                        })
                    )
                    toast.update(id, Notify.options.updateTaskSuccess())
                } else {
                    setTasks([resp.data, ...tasks])
                    toast.update(id, Notify.options.createTaskSuccess())
                }
                resetForm()
            } else {
                if (resp.data === 1) {
                    toast.update(id, Notify.options.existTitleTask())
                }
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
            console.log(
                '🚀 ~ file: ClassDetail.js:94 ~ handleSave ~ error:',
                error
            )
        }
        setVisible(false)
    }

    const resetForm = () => {
        if (update) {
            setUpdate(false)
            form.setValues({
                taskId: '',
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                classesId: classId
            })
        }
        handlers.close()
    }

    const addTask = () => {
        setUpdate(false)

        handlers.open()
    }

    const form = useForm({
        initialValues: {
            taskId: '',
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            classesId: classId
        },

        // functions will be used to validate values at corresponding key
        validate: {
            title: (value) => {
                if (value === '') {
                    return 'Không để trống tên bài tập'
                }

                return null
            },
            startDate: (value) => {
                if (value === '') {
                    return 'Vui lòng chọn thời gian bắt đầu'
                }
                const now = new Date()
                const startDate = new Date(value)
                const rangeTime = (startDate - now) / 1000
                if (rangeTime < 0) {
                    return 'Thời gian bắt đầu ít nhất từ thời điểm hiện tại'
                }
                return null
            },

            endDate: (value, values) => {
                if (value === '') {
                    return 'Vui lòng chọn thời gian kết thúc'
                }

                const now = new Date()
                const endDate = new Date(value)
                const rangeTime_now = (endDate - now) / 1000
                if (rangeTime_now < 3600) {
                    return 'Thời gian kết thúc ít nhất 1 giờ từ thời điểm hiện tại'
                }
                const startDate = new Date(values.startDate)

                const rangeTime = (endDate - startDate) / 1000
                if (rangeTime < 3600) {
                    return 'Thời gian giao bài tập tối thiểu là 1 tiếng'
                }
                return null
            },
            description: (value) =>
                value === '' ? 'Không để trống mô tả' : null
        }
    })

    useEffect(() => {
        getTasks()
        const a = localStorage.getItem('hehe')
        console.log('🚀 ~ file: TaskTeacher.js:362 ~ useEffect ~ a:', a)
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
                        <Modal.Title>
                            <b>Giao bài tập</b>
                        </Modal.Title>
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
                                    clearable
                                    minDate={new Date()}
                                    maxDate={form.values.endDate}
                                    {...form.getInputProps('startDate')}
                                    mx="auto"
                                />
                                <DateTimePicker
                                    mt="sm"
                                    clearable
                                    valueFormat="DD/MM/YYYY HH:mm"
                                    label="Thời gian kết thúc"
                                    placeholder="Thời gian bắt đầu..."
                                    maw={400}
                                    minDate={
                                        form.values.startDate || new Date()
                                    }
                                    {...form.getInputProps('endDate')}
                                    mx="auto"
                                />
                                <TextInput
                                    mt="sm"
                                    label="Tên bài tập"
                                    placeholder="Tên gọi bài tập..."
                                    name="title"
                                    {...form.getInputProps('title')}
                                />
                                <Textarea
                                    mt="sm"
                                    label="Mô tả"
                                    placeholder="Mô tả bài tập..."
                                    {...form.getInputProps('description')}
                                />
                                <div className="modal-footer pr-0">
                                    <Button
                                        type="submit"
                                        mt="sm"
                                        color="primary"
                                    >
                                        {update ? 'Lưu' : 'Thêm'}
                                    </Button>
                                </div>
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
                            enableRowActions
                            renderTopToolbarCustomActions={() => (
                                <div>
                                    <Button onClick={addTask} color="green">
                                        <i className="bx bx-layer-plus"></i>
                                        Giao thêm bài tập
                                    </Button>
                                    <Button
                                        onClick={getTasks}
                                        className="ml-2"
                                        color="green"
                                    >
                                        <i class="fa-solid fa-arrows-rotate"></i>
                                    </Button>
                                </div>
                            )}
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Thao tác',
                                    size: 20
                                },
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
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
