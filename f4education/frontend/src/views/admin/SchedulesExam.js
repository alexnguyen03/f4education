import { Alert, Group, LoadingOverlay } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { Edit as EditIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import SchedulesExamHeader from 'components/Headers/SchedulesExamHeader'
import MaterialReactTable from 'material-react-table'
import moment from 'moment'
import 'moment/locale/vi'
import { useEffect, useMemo, useState } from 'react'
import { Container } from 'react-bootstrap'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Badge, Button, Card, CardHeader, Col, Modal, Row } from 'reactstrap'
import classApi from '../../api/classApi'
import classRoomApi from '../../api/classRoomApi'
import scheduleApi from '../../api/scheduleApi'
import { convertArrayToLabel } from '../../utils/Convertor'
import Notify from '../../utils/Notify'
import courseApi from '../../api/courseApi'
import courseDetailApi from '../../api/courseDetailApi'
import { IconRefresh } from '@tabler/icons-react'
function SchedulesExam() {
    const [listClass, setListClass] = useState([])
    const [classListModalScheduleExam, setClassListModalScheduleExam] =
        useState(false)
    const [scheduleModalScheduleExam, setScheduleModalScheduleExam] =
        useState(false)
    const [choiceSessionModalScheduleExam, setChoiceSessionModalScheduleExam] =
        useState(false)
    const [alertModalScheduleExam, setAlertModalScheduleExam] = useState(false)
    const [showlistSchedule, setShowlistSchedule] = useState(false)
    const [listSession, setListSession] = useState([])
    const [listSchedule, setListSchedule] = useState([])
    const [listClassroom, setListClassroom] = useState([])
    const [numberOfContent, setNumberOfContent] = useState(0)

    const [listClassroomAndSession, setListClassroomAndSession] = useState([])
    const [classSelected, setClassSelected] = useState({
        classId: 0
    })
    const [sessionSelected, setSessionSelected] = useState({
        value: '',
        label: ''
    })
    const [allContentByClassId, setAllContentByClassId] = useState([])

    const [startDate, setStartDate] = useState(null)
    const [scheduleSelectedRow, setScheduleSelectedRow] = useState({
        scheduleId: '',
        studyDate: '',
        session: '',
        classroom: '',
        isPractice: '',
        teacherName: '',
        content: ''
    })
    const [classroomSelected, setClassroomSelected] = useState({
        value: '',
        label: ''
    })

    const toggleModalScheduleExam = (state) => {
        switch (state) {
            case 'classListModalScheduleExam':
                setClassListModalScheduleExam((prevState) => !prevState)
                break
            case 'choiceSessionModalScheduleExam':
                setChoiceSessionModalScheduleExam((prevState) => !prevState)
                break
            case 'alertModalScheduleExam':
                setAlertModalScheduleExam((prevState) => !prevState)
                break
            case 'scheduleModalScheduleExam':
                setScheduleModalScheduleExam((prevState) => !prevState)
                break
            default:
                break
        }
    }

    const formatDate = (date) => {
        const formattedDate = moment(date)
            .locale('vi')
            .format('dddd, DD/MM/yyyy')
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }
    // Danh sách ngày nghỉ lễ trong năm
    const publicHolidays = [
        '01/01', // Tết Dương lịch
        '30/04', // Ngày Giải phóng miền Nam
        '01/05', // Ngày Quốc tế Lao động
        '02/09' // Ngày Quốc khánh
        // Thêm các ngày nghỉ lễ khác nếu cần
    ]
    // Kiểm tra xem một ngày có phải là ngày nghỉ lễ hay không
    const isPublicHoliday = (date) => {
        const formattedDate = date.format('DD/MM')
        return publicHolidays.includes(formattedDate)
    }
    // Lấy ngày hợp lệ tiếp theo
    const getNextValidDay = (date) => {
        let nextDay = moment(date).add(1, 'day')
        while (isPublicHoliday(nextDay)) {
            nextDay = nextDay.add(1, 'day')
        }
        return nextDay
    }

    const generateTimetable = (startDate, numberOfLessons) => {
        const daysOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]
        const timetable = []
        let currentDate = moment(startDate)
        let lessonsRemaining = numberOfLessons - 1
        while (lessonsRemaining >= 0) {
            const dayOfWeek = daysOfWeek[currentDate.day() - 1]

            if (dayOfWeek !== undefined) {
                let isPractice = true

                if (lessonsRemaining % 2 !== 0) {
                    isPractice = false
                }

                if (isPublicHoliday(currentDate)) {
                    const nextValidDay = getNextValidDay(currentDate)
                    timetable.push({
                        date: moment(nextValidDay),
                        session: sessionSelected.label,
                        classroom: classroomSelected.label,
                        isPractice: isPractice
                    })
                    currentDate = nextValidDay
                } else {
                    timetable.push({
                        date: moment(currentDate),
                        session: sessionSelected.label,
                        classroom: classroomSelected.label,
                        isPractice: isPractice
                    })
                }
                lessonsRemaining--
            }
            currentDate = currentDate.add(1, 'day')
        }
        return timetable
    }

    // * LOADING STATES
    const [loadingGetClassroom, setLoadingGetClassroom] = useState(true)
    const [loadingSchedule, setLoadingSchedule] = useState(false)
    const [loadingClass, setLoadingClass] = useState(true)
    //! Tables column
    const columnsClasses = useMemo(
        () => [
            {
                accessorKey: 'className',
                header: 'Tên lớp học',
                size: 50
            },
            {
                accessorKey: 'courseName',
                header: 'Tên khóa học',
                size: 80
            },
            {
                accessorKey: 'teacher.fullname',
                header: 'Giáo viên',
                size: 80
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                size: 35
            }
        ],
        []
    )

    const columnsSchedule = useMemo(
        () => [
            {
                accessorKey: 'scheduleId',
                header: 'Id',
                size: 100
            },
            {
                accessorKey: 'studyDate',
                header: 'Ngày thi',

                accessorFn: (row) => formatDate(row.studyDate),
                size: 80
            },
            {
                accessorKey: 'content',
                header: 'Nội dung',
                size: 200
            },
            {
                accessorKey: 'isPractice',
                header: 'Thi',
                // accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    //lý thuyết: false | thực hành: true
                    if (row === null) {
                        return (
                            <Badge className="font-weight-bold" color="info">
                                {'Thi'}
                            </Badge>
                        )
                    }
                    return row ? (
                        <Badge className="font-weight-bold" color="info">
                            {'Thực hành'}
                        </Badge>
                    ) : (
                        <Badge className="font-weight-bold" color="primary">
                            {'Lý thuyết'}
                        </Badge>
                    )
                },
                size: 35
            },
            {
                accessorKey: 'teacherName',
                header: 'Giáo viên',
                size: 150
            },
            {
                accessorKey: 'session',
                header: 'Ca',
                size: 35
            },
            {
                accessorKey: 'classroom',
                header: 'Phòng',
                size: 35
            }
        ],
        []
    )

    const handleSetupScheduleExam = async () => {
        toggleModalScheduleExam('choiceSessionModalScheduleExam')

        setShowlistSchedule(true)

        const daysOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]
        const timetable = []
        let currentDate = moment(startDate)
        const dayOfWeek = daysOfWeek[currentDate.day() - 1]

        if (dayOfWeek !== undefined) {
            let isPractice = null

            if (isPublicHoliday(currentDate)) {
                const nextValidDay = getNextValidDay(currentDate)
                timetable.push({
                    date: moment(nextValidDay),
                    session: sessionSelected.label,
                    classroom: classroomSelected.label,
                    isPractice: isPractice
                })
                currentDate = nextValidDay
            } else {
                timetable.push({
                    date: moment(currentDate),
                    session: sessionSelected.label,
                    classroom: classroomSelected.label,
                    isPractice: isPractice
                })
            }
        }
        currentDate = currentDate.add(1, 'day')

        console.log(
            '🚀 ~ file: Schedules.js:277 ~ handleSetupSchedule ~ timetable:',
            timetable
        )

        const schedule = timetable.map((item, index) => {
            var content = 'Thi trắc nghiệm cuối khóa học'
            return {
                scheduleId: index,
                studyDate: item.date._d,
                session: item.session,
                classroom: item.classroom,
                isPractice: item.isPractice,
                teacherName: classSelected.teacher.fullname,
                content: content
            }
        })

        setListSchedule(schedule)
    }

    const handleShowModalScheduleExam = (row) => {
        const classDetail = { ...row.original }
        toggleModalScheduleExam('choiceSessionModalScheduleExam')
        setClassSelected(classDetail)
    }

    const handleSetDate = async (val) => {
        setStartDate(val)
        try {
            setLoadingGetClassroom(true)
            const startDate = {
                startDate: moment(new Date(val)).format('yyyy/MM/DD')
            }
            const resp = await classRoomApi.getAllClassRoomAvailblBySessionId(
                startDate
            )
            console.log(
                '🚀 ~ file: Schedules.js:337 ~ getClassroomBySession ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setLoadingGetClassroom(false)
                const uniqueSessions = resp.data
                    .map((item) => {
                        return {
                            sessionId: item.sessionId,
                            sessionName: item.sessionName
                        }
                    })
                    .filter((item, i, arr) => {
                        // Lọc các cặp sessionId và sessionName duy nhất
                        return (
                            arr.findIndex(
                                (obj) =>
                                    obj.sessionId === item.sessionId &&
                                    obj.sessionName === item.sessionName
                            ) === i
                        )
                    })

                console.log(
                    '🚀 ~ file: Schedules.js:387 ~ handleSetDate ~ uniqueSessions:',
                    uniqueSessions
                )
                setListSession(
                    uniqueSessions.sort((a, b) =>
                        a.sessionName.localeCompare(b.sessionName)
                    )
                )
                setListClassroomAndSession(resp.data)
            }
        } catch (error) {
            setLoadingGetClassroom(false)
            console.log(
                '🚀 ~ file: Schedules.js:132 ~ getClassroomBySession ~ error:',
                error
            )
        }
    }
    const handleSaveSchedule = async () => {
        const user = JSON.parse(localStorage.getItem('user'))

        const adminId = user.username
        const id = toast(Notify.msg.loading, Notify.options.loading())

        try {
            const scheduleRequest = {
                classId: classSelected.classId,
                classroomId: classroomSelected.value,
                adminId: adminId,
                sessionId: sessionSelected.value,
                listSchedule: listSchedule
            }
            console.log(
                '🚀 ~ file: Schedules.js:364 ~ handleSaveSchedule ~ scheduleRequest:',
                scheduleRequest
            )

            const resp = await scheduleApi.saveSchedule(
                JSON.stringify(scheduleRequest)
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.updateSuccess())
            }
            console.log(
                '🚀 ~ file: Schedules.js:397 ~ handleSaveSchedule ~ resp:',
                resp
            )
        } catch (error) {
            console.log(
                '🚀 ~ file: Schedules.js:382 ~ handleSaveSchedule ~ error:',
                error
            )
        }
    }

    const handleDeleteSchedule = async (row) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

        try {
            const resp = await scheduleApi.deleteScheduleById(
                row.original.scheduleId
            )
            toast.update(id, Notify.options.deleteSuccess())
            setShowlistSchedule(false)
            fetchAllClass()
        } catch (error) {
            console.log(
                '🚀 ~ file: Schedules.js:382 ~ handleSaveSchedule ~ error:',
                error
            )
        }
    }

    const handleGetScheduleByClassId = async (row) => {
        const classDetail = { ...row.original }
        console.log(
            '🚀 ~ file: Schedules.js:404 ~ handleGetScheduleByClassId ~ classDetail:',
            classDetail
        )
        setLoadingSchedule(true)
        setClassSelected(classDetail)
        try {
            const resp =
                await scheduleApi.findAllScheduleByClassIdAndIsPractice(
                    classDetail.classId
                )
            console.log(
                '🚀 ~ file: Schedules.js:405 ~ handleGetScheduleByClassId ~ resp:',
                resp.data
            )

            setLoadingSchedule(false)
            if (resp.status === 200) {
                const {
                    listSchedules,
                    sessionName,
                    sessionId,
                    classroomName,
                    classroomId
                } = {
                    ...resp.data
                }
                setSessionSelected({
                    value: sessionId,
                    label: sessionName
                })
                setClassroomSelected({
                    value: classroomId,
                    label: classroomName
                })
                console.log(
                    '🚀 ~ file: Schedules.js:416 ~ handleGetScheduleByClassId ~ listSchedules:',
                    listSchedules
                )
                const schedule = listSchedules.map((item) => {
                    return {
                        scheduleId: item.scheduleId,
                        studyDate: moment(item.studyDate)._d,
                        session: sessionName,
                        classroom: classroomName,
                        isPractice: item.isPractice,
                        teacherName: classDetail.teacher.fullname,
                        content: item.content
                    }
                })

                setListSchedule(schedule)
            }
            setShowlistSchedule(true)
        } catch (error) {
            setLoadingSchedule(false)

            console.log(
                '🚀 ~ file: Schedules.js:406 ~ handleGetScheduleByClassId ~ error:',
                error
            )
        }
    }
    //! CALL API
    const getClassroomBySession = (val) => {
        setSessionSelected(val) // co value va label
        const matchingObjects = listClassroomAndSession.filter(
            (item) => item.sessionId === val.value
        )
        setListClassroom(matchingObjects)
    }
    const fetchAllClass = async () => {
        setLoadingClass(true)
        try {
            const resp = await classApi.getAllClassActiveSchedulesExam()
            console.log(
                '🚀 ~ file: Schedules.js:413 ~ fetchAllClass ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setListClass(resp.data)
                console.log(
                    '🚀 ~ file: Schedules.js:45 ~ setListClass ~ error:',
                    resp.data
                )
            }
            setLoadingClass(false)
        } catch (error) {
            setLoadingClass(false)
            console.log(
                '🚀 ~ file: Schedules.js:45 ~ fetchAllClass ~ error:',
                error
            )
        }
    }
    useEffect(() => {
        fetchAllClass()
    }, [])

    return (
        <>
            <ToastContainer />

            <SchedulesExamHeader />
            <Container className="mt--7" fluid>
                {!showlistSchedule && (
                    <Card className="card-profile shadow position-relative ">
                        <LoadingOverlay
                            visible={loadingSchedule}
                            zIndex={1000}
                            color="rgba(46, 46, 46, 1)"
                            size={50}
                        />
                        <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            <h3>DANH SÁCH LỚP HỌC </h3>
                        </CardHeader>
                        <MaterialReactTable
                            muiTableBodyProps={{
                                sx: {
                                    //stripe the rows, make odd rows a darker color
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                            enableColumnResizing
                            enableGrouping
                            enableStickyHeader
                            enableStickyFooter
                            enableRowNumbers
                            state={{ isLoading: loadingClass }}
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Thao tác',
                                    size: 20
                                    // Something else here
                                },
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
                            positionActionsColumn="last"
                            columns={columnsClasses}
                            data={listClass}
                            renderTopToolbarCustomActions={() => (
                                <Button
                                    onClick={fetchAllClass}
                                    color="success"
                                    variant="contained"
                                >
                                    <IconRefresh />
                                </Button>
                            )}
                            enableRowActions
                            renderRowActions={({ row, table }) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        gap: '8px'
                                    }}
                                >
                                    {row.original.hasSchedule === false && (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                handleShowModalScheduleExam(row)
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {row.original.hasSchedule === true && (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                handleGetScheduleByClassId(row)
                                            }}
                                        >
                                            <i className="fa-sharp fa-solid fa-eye"></i>
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                        />
                    </Card>
                )}
                {showlistSchedule ? (
                    <Card className="card-profile shadow">
                        <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            <div className="d-flex justify-content-between">
                                <div
                                    className="d-flex flex-column justify-content-center "
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setShowlistSchedule(false)
                                        fetchAllClass()
                                    }}
                                >
                                    <i className="fa-solid fa-arrow-left"></i>
                                </div>{' '}
                                <div className="shadow px-3 py-2 rounded-sm">
                                    Tên lớp học:{' '}
                                    <span>{classSelected.className}</span>
                                </div>
                                <div className="shadow px-3 py-2 rounded-sm">
                                    Giáo viên:{' '}
                                    <span>
                                        {classSelected.teacher.gender
                                            ? 'Thầy '
                                            : 'Cô '}
                                        {classSelected.teacher.fullname}
                                    </span>
                                </div>
                                <div className="shadow px-3 py-2 rounded-sm">
                                    Thời lượng:{' '}
                                    <span>
                                        {classSelected.registerCourses[0]
                                            .courseDuration / 2}
                                    </span>{' '}
                                    buổi
                                </div>
                                <div className="shadow px-3 py-2 rounded-sm">
                                    Trạng thái:{' '}
                                    <span>{classSelected.status}</span>
                                </div>
                                {/* <div className="shadow px-3 py-2 rounded-sm">
                                    Ca học: {sessionSelected.label}
                                </div>
                                <div className="shadow px-3 py-2 rounded-sm">
                                    Phòng học: {classroomSelected.label}
                                </div> */}
                                <div>
                                    <Button
                                        className="float-right"
                                        color="success"
                                        onClick={(e) => handleSaveSchedule()}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <MaterialReactTable
                            muiTableBodyProps={{
                                sx: {
                                    //stripe the rows, make odd rows a darker color
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                            enableStickyHeader
                            enableStickyFooter
                            enableRowNumbers
                            // state={{ isLoading: loadingCourses }}
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Thao tác',
                                    size: 20
                                    // Something else here
                                },
                                'mrt-row-numbers': {
                                    size: 5
                                }
                            }}
                            positionActionsColumn="last"
                            columns={columnsSchedule}
                            data={listSchedule}
                            enableRowActions
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
                                        onClick={() =>
                                            handleDeleteSchedule(row)
                                        }
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </IconButton>
                                </Box>
                            )}
                            initialState={{
                                columnVisibility: { scheduleId: false }
                            }}
                            muiTableHeadCellProps={{
                                align: 'center'
                            }}
                            muiTableBodyCellProps={{
                                align: 'center'
                            }}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                        />
                    </Card>
                ) : (
                    ''
                )}

                {/* ModalScheduleExam */}
                <Modal
                    className="modal-dialog-centered modal-lg"
                    isOpen={choiceSessionModalScheduleExam}
                    toggle={() =>
                        toggleModalScheduleExam(
                            'choiceSessionModalScheduleExam'
                        )
                    }
                    backdrop
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="classListModalLabel">
                            CHỌN CA HỌC VÀ PHÒNG HỌC
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() =>
                                toggleModalScheduleExam(
                                    'choiceSessionModalScheduleExam'
                                )
                            }
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body py-0">
                        <Row>
                            <Col sm={6}>
                                <label
                                    className="form-control-label text-center w-100"
                                    htmlFor="input-datepicker"
                                >
                                    Chọn ngày thi
                                </label>
                                <Group position="center" pb={'lg'}>
                                    <DatePicker
                                        value={startDate}
                                        onChange={handleSetDate}
                                        defaultDate={
                                            new Date(
                                                new Date().getFullYear(),
                                                new Date().getMonth()
                                            )
                                        }
                                        // disable T7, CN
                                        getDayProps={(date) => {
                                            if (date.getDay() === 0) {
                                                return {
                                                    disabled: true,
                                                    sx: (theme) => ({
                                                        color: theme.colors.red[
                                                            theme.fn.primaryShade()
                                                        ],
                                                        color: 'red'
                                                    })
                                                }
                                            }
                                            if (
                                                date.getDate() ===
                                                new Date().getDate()
                                            ) {
                                                return {
                                                    sx: (theme) => ({
                                                        backgroundColor:
                                                            theme.colors.red[
                                                                theme.fn.primaryShade()
                                                            ],
                                                        color: theme.white,
                                                        ...theme.fn.hover({
                                                            backgroundColor:
                                                                theme.colors
                                                                    .red[7]
                                                        })
                                                    })
                                                }
                                            }
                                        }}
                                        minDate={new Date()}
                                        maxDate={new Date(2029, 10, 1)}
                                    />
                                </Group>
                            </Col>
                            <Col
                                sm={6}
                                className="d-flex flex-column justify-content-around"
                            >
                                <div>
                                    {' '}
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Chọn ca thi
                                    </label>
                                    <Select
                                        options={convertArrayToLabel(
                                            listSession,
                                            'sessionId',
                                            'sessionName'
                                        )}
                                        placeholder="Chọn ca thi"
                                        onChange={(val) => {
                                            getClassroomBySession(val)
                                        }}
                                        isSearchable={true}
                                        isLoading={loadingGetClassroom}
                                        className="py-1"
                                        styles={{ outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Chọn phòng thi
                                    </label>
                                    <div>
                                        <Select
                                            options={convertArrayToLabel(
                                                listClassroom,
                                                'classroomId',
                                                'classroomName'
                                            )}
                                            placeholder="Chọn phòng thi"
                                            onChange={(val) => {
                                                setClassroomSelected(val)
                                            }}
                                            isSearchable={true}
                                            className="py-1"
                                            styles={{ outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        color="primary"
                                        type="button"
                                        onClick={() => {
                                            handleSetupScheduleExam()
                                        }}
                                    >
                                        Xếp lịch thi
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </Container>
        </>
    )
}
export default SchedulesExam
