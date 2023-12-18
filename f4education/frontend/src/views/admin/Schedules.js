import { Alert, Group, LoadingOverlay } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { Edit as EditIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import SchedulesHeader from 'components/Headers/SchedulesHeader'
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
function Schedules() {
    const [listClass, setListClass] = useState([])
    const [classListModal, setClassListModal] = useState(false)
    const [scheduleModal, setScheduleModal] = useState(false)
    const [choiceSessionModal, setChoiceSessionModal] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const [showlistSchedule, setShowlistSchedule] = useState(false)
    const [listSession, setListSession] = useState([])
    const [listSchedule, setListSchedule] = useState([])
    const [listClassroom, setListClassroom] = useState([])
    const [numberOfContent, setNumberOfContent] = useState(0)
    const [updateSchedule, setUpdateSchedule] = useState(false)

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
        number: 0,
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

    const toggleModal = (state) => {
        switch (state) {
            case 'classListModal':
                setClassListModal((prevState) => !prevState)
                break
            case 'choiceSessionModal':
                setChoiceSessionModal((prevState) => !prevState)
                break
            case 'alertModal':
                setAlertModal((prevState) => !prevState)
                break
            case 'scheduleModal':
                setScheduleModal((prevState) => !prevState)
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
                accessorKey: 'studyDate',
                header: 'Ngày học',

                accessorFn: (row) => (
                    <>
                        {formatDate(row.studyDate)}
                        <div>
                            <Badge className="font-weight-bold" color="primary">
                                {row.startTime}
                            </Badge>

                            <Badge className="font-weight-bold" color="info">
                                {row.endTime}
                            </Badge>
                        </div>
                    </>
                ),
                size: 80
            },
            {
                accessorKey: 'content',
                header: 'Nội dung',
                size: 200
            },
            {
                accessorKey: 'isPractice',
                header: 'Thực hành/Lý thuyết',
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

    //!  HANDLE FUNCTIONS
    const handleSetupSchedule = async () => {
        toggleModal('choiceSessionModal')

        setShowlistSchedule(true)
        const numberOfLessons =
            classSelected.registerCourses[0].courseDuration / 2
        console.log(
            '🚀 ~ file: Schedules.js:232 ~ handleSetupSchedule ~ numberOfLessons:',
            numberOfLessons
        )

        const ls = generateTimetable(startDate, numberOfLessons)
        console.log(
            '🚀 ~ file: Schedules.js:277 ~ handleSetupSchedule ~ ls:',
            ls
        )

        try {
            const resp = await courseApi.getAllCourseContentByClassId(
                classSelected.classId
            )
            console.log(
                '🚀 ~ file: Schedules.js:241 ~ handleSetupSchedule ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setAllContentByClassId(resp.data)
                const schedule = ls.map((item, index) => {
                    var content = 'Chưa có nội dung'
                    if (resp.data[index]) {
                        content = resp.data[index]
                    }
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
        } catch (error) {
            console.log(
                '🚀 ~ file: Schedules.js:239 ~ handleSetupSchedule ~ error:',
                error
            )
        }
    }

    const handleUpdateSchedule = () => {
        const oldSchedule = listSchedule.filter((item) => {
            if (item.scheduleId < scheduleSelectedRow.scheduleId) {
                return {
                    scheduleId: item.scheduleId,
                    studyDate: moment(new Date(item.studyDate))._d,
                    session: sessionSelected.label,
                    classroom: classroomSelected.label,
                    isPractice: item.isPractice,
                    teacherName: classSelected.teacher.fullname,
                    content: item.content
                }
            }
        })
        if (oldSchedule.length === 0) {
            toast(Notify.msg.updateSuccess, Notify.options.updateSuccess())
            toggleModal('scheduleModal')
            return
        }
        const lastItemIndex = oldSchedule[oldSchedule.length - 1].scheduleId

        const numberOfLessons =
            classSelected.registerCourses[0].courseDuration / 2 -
            oldSchedule.length

        const lsScheduleUpdate = generateTimetable(startDate, numberOfLessons)

        const newSchedule = lsScheduleUpdate.map((item, index) => {
            index = index + lastItemIndex + 1
            var content = 'Chưa có nội dung!!!'
            if (allContentByClassId[index]) {
                content = allContentByClassId[index]
            }
            return {
                scheduleId: index,
                studyDate: item.date,
                session: item.session,
                classroom: item.classroom,
                isPractice: item.isPractice,
                teacherName: classSelected.teacher.fullname,
                content: content
            }
        })
        setUpdateSchedule(true)
        // toast(Notify.msg.updateSuccess, Notify.options.updateSuccess())
        toggleModal('scheduleModal')
        setListSchedule([...oldSchedule, ...newSchedule])
    }
    const handleShowModal = (row) => {
        const classDetail = { ...row.original }
        toggleModal('choiceSessionModal')
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
                listSchedule: listSchedule,
                isUpdate: updateSchedule
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
    const handleChangeSchedule = (row) => {
        console.log(
            '🚀 ~ file: Schedules.js:444 ~ handleChangeSchedule ~ row:',
            row
        )
        toggleModal('scheduleModal')

        setScheduleSelectedRow({
            number: parseInt(row.index + 1),
            ...row.original,
            studyDate: row.original.studyDate
        })
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
            const resp = await scheduleApi.getScheduleByClassId(
                classDetail.classId
            )
            console.log(
                '🚀 ~ file: Schedules.js:405 ~ handleGetScheduleByClassId ~ resp:',
                resp
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
                        startTime: item.startTime,
                        endTime: item.endTime,
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
            const resp = await classApi.getAllClassActive()
            console.log(
                '🚀 ~ file: Schedules.js:413 ~ fetchAllClass ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setListClass(resp.data)
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

            <SchedulesHeader />
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
                                    {!row.original.hasSchedule && (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                handleShowModal(row)
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {row.original.hasSchedule && (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                // handleShowModal(row)
                                                handleGetScheduleByClassId(row)
                                            }}
                                        >
                                            <i className="fa-sharp fa-solid fa-eye"></i>
                                        </IconButton>
                                    )}
                                    {/* <IconButton
                                    color="info"
                                    onClick={() => {
                                        handelShowHistory(
                                            row.original.courseId
                                        )
                                    }}
                                >
                                    <IconEyeSearch />
                                </IconButton> */}
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
                                    <i className="fa-solid fa-list"></i>
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
                                            handleChangeSchedule(row)
                                        }
                                    >
                                        <i className="fa-solid fa-arrows-left-right-to-line"></i>{' '}
                                    </IconButton>
                                </Box>
                            )}
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
                {/* //! modals */}
                {/* Modal */}
                <Modal
                    className="modal-dialog-centered modal-lg"
                    isOpen={choiceSessionModal}
                    toggle={() => toggleModal('choiceSessionModal')}
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
                            onClick={() => toggleModal('choiceSessionModal')}
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
                                    Chọn ngày bắt đầu
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
                                        // minDate={new Date()}
                                        // maxDate={new Date(2029, 10, 1)}
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
                                        Chọn ca học
                                    </label>
                                    <Select
                                        options={convertArrayToLabel(
                                            listSession,
                                            'sessionId',
                                            'sessionName'
                                        )}
                                        placeholder="Chọn ca học"
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
                                        Chọn phòng học
                                    </label>
                                    <div>
                                        <Select
                                            options={convertArrayToLabel(
                                                listClassroom,
                                                'classroomId',
                                                'classroomName'
                                            )}
                                            placeholder="Chọn phòng học"
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
                                        onClick={handleSetupSchedule}
                                    >
                                        Xếp thời khóa biểu
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    className="modal-dialog-centered"
                    isOpen={scheduleModal}
                    toggle={() => toggleModal('scheduleModal')}
                    backdrop
                    onClosed={() => {
                        setStartDate(new Date())
                    }}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="classListModalLabel">
                            CHỌN NGÀY THAY THẾ
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => toggleModal('scheduleModal')}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body py-0">
                        <div className="d-flex flex-column justify-content-betweent mb-4">
                            <div>
                                <Group
                                    position="center"
                                    pb={'lg'}
                                    className="shadow mb-4 rounded pt-3"
                                >
                                    <DatePicker
                                        value={startDate}
                                        onChange={setStartDate}
                                        defaultDate={
                                            new Date(
                                                new Date(
                                                    scheduleSelectedRow.studyDate
                                                ).getFullYear(),
                                                new Date(
                                                    scheduleSelectedRow.studyDate
                                                ).getMonth()
                                            )
                                        }
                                        // minDate={
                                        //     new Date(
                                        //         scheduleSelectedRow.studyDate
                                        //     )
                                        // }
                                        // maxDate={new Date(2029, 10, 1)}
                                        getDayProps={(date) => {
                                            if (date.getDay() === 0) {
                                                return { disabled: true }
                                            }
                                            // if (
                                            //     date.getDate() === minDateUpdate
                                            // ) {
                                            //     return {
                                            //         sx: (theme) => ({
                                            //             backgroundColor:
                                            //                 theme.colors.red[
                                            //                     theme.fn.primaryShade()
                                            //                 ],
                                            //             color: theme.white,
                                            //             ...theme.fn.hover({
                                            //                 backgroundColor:
                                            //                     theme.colors
                                            //                         .red[7]
                                            //             })
                                            //         })
                                            //     }
                                            // }
                                        }}
                                    />
                                    <Badge color={'primary'}>
                                        {' '}
                                        Bạn đang chọn Buổi thứ:{' '}
                                        {scheduleSelectedRow.number} -{' '}
                                        {formatDate(
                                            scheduleSelectedRow.studyDate._d
                                        )}
                                    </Badge>
                                </Group>
                            </div>

                            <div className="d-flex justify-content-center">
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={handleUpdateSchedule}
                                >
                                    Xếp thời khóa biểu
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Container>
        </>
    )
}
export default Schedules
