import { Box, FormGroup, IconButton } from '@mui/material'
import {
    Edit as EditIcon,
    EscalatorWarningOutlined,
    RemoveCircleOutline as RemoveCircleOutlineIcon,
    Search,
    Warning
} from '@mui/icons-material'

import SubjectHeader from 'components/Headers/SubjectHeader'
import { MaterialReactTable } from 'material-react-table'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

// reactstrap components
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardImg,
    Col,
    Container,
    Form,
    FormFeedback,
    Input,
    Modal,
    Row
} from 'reactstrap'

import sessionsApi from 'api/sessionsApi'
import SessionsHeader from 'components/Headers/SessionsHeader'
import { useRef } from 'react'
import { TimeInput } from '@mantine/dates'
import { ActionIcon } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import { IconEyeSearch } from '@tabler/icons-react'
import { Event, Timeline } from 'react-timeline-scribble'
import ReactLoading from 'react-loading'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'

const Sessions = () => {
    // Main variable
    const [sessions, setSessions] = useState([])
    const [sessionsHistories, setSessionsHistories] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const [showHistoryTable, setShowHistoryTable] = useState(false)
    const [showHistoryInfo, setShowHistoryInfo] = useState(false)
    const [loadingGetSessions, setLoadingGetSessions] = useState(false)
    const [loadingHistoryInfo, setLoadingHistoryInfo] = useState(true)
    const [listHistoryById, setListHistoryById] = useState([])
    const [startTimeError, setStartTimeError] = useState('')
    const [endTimeError, setEndTimeError] = useState('')
    const [msgError, setMsgError] = useState({})

    const [session, setSession] = useState({
        admin: {
            adminId: '',
            fullname: '',
            gender: true,
            dateOfBirth: '',
            citizenIdentification: ''
        },
        endTime: '',
        sessionId: null,
        sessionName: 0,
        startTime: ''
    })

    const startRef = useRef()
    const endRef = useRef()
    // Action variable
    const [showModal, setShowModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const [showSessionsHistory, setShowSessionsHistory] = useState(false)

    // Form action area
    const handleChangeInput = (e) => {
        setSession((preSession) => ({
            ...preSession,
            [e.target.name]: e.target.value
        }))
    }

    const fetchSessions = async () => {
        try {
            setLoadingGetSessions(true)
            const resp = await sessionsApi.getAllSessions()
            if (resp.status === 200) {
                setSessions(resp.data)
                setLoadingGetSessions(false)
            }
        } catch (error) {
            setLoadingGetSessions(false)
            console.log(error)
        }
    }
    const validate = () => {
        if (startRef.current.value === '') {
            setStartTimeError('Vui lòng nhập vào Giờ bắt đầu')
        } else {
            setStartTimeError('')
        }
        return startRef.current.value !== '' ? true : false
    }
    const columnSessions = useMemo(
        () => [
            {
                accessorKey: 'sessionName',
                header: 'Tên ca học',
                size: 80
            },
            {
                // accessorFn: (row) => moment(row.startTime).format('h:mm:ss a'),
                accessorKey: 'startTime',
                size: 80,
                header: 'Giờ bắt đầu'
            },
            {
                // accessorFn: (row) => moment(row.endTime).format('h:mm:ss a'),
                accessorKey: 'endTime',
                size: 80,
                header: 'Giờ kết thúc'
            },
            {
                accessorKey: 'admin.fullname',
                size: 80,
                header: 'Tên người tạo'
            }
        ],
        []
    )

    const columnSessionsHistory = useMemo(
        () => [
            {
                accessorKey: 'sessionName',
                header: 'Tên ca học',
                size: 80
            },
            {
                accessorKey: 'adminName',
                header: 'Tên người tạo',
                size: 120
            },
            {
                accessorFn: (row) =>
                    moment(row.modifyDate).format('DD/MM/yyyy, h:mm:ss A'),
                header: 'Ngày chỉnh sửa',
                size: 120
            },
            {
                accessorKey: 'startTime',
                header: 'Giờ bắt đầu',
                size: 90
            },
            {
                accessorKey: 'endTime',
                header: 'Giờ kết thúc',
                size: 90
            },
            {
                accessorKey: 'action',

                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    if (row.action === 'UPDATE') {
                        return <Badge color="primary">Cập nhật</Badge>
                    } else {
                        return <Badge color="success">Tạo mới </Badge>
                    }
                },
                header: 'Hành động',
                size: 60
            }
        ],
        []
    )

    const handleEditForm = (row) => {
        const selectedSession = row.original
        setSession(selectedSession)

        setUpdate(true)
        setShowModal(true)
    }

    const handleInputTimeOnChange = (e) => {
        validate()

        const newStartTime = startRef.current.value

        // Tính toán giờ kết thúc
        const startTime = moment(newStartTime, 'HH:mm') // Sử dụng thư viện moment để xử lý thời gian
        const newEndTime = startTime.add(2, 'hours').format('HH:mm') // Thêm 2 giờ vào giờ bắt đầu để có giờ kết thúc

        // Kiểm tra chồng chéo với danh sách thời gian đã có
        const isOverlapping = sessions
            .filter((item) => item.sessionId !== session.sessionId)
            .some((item) => {
                const existingStartTime = item.startTime
                const existingEndTime = item.endTime

                // Kiểm tra chồng chéo
                return (
                    (newStartTime >= existingStartTime &&
                        newStartTime < existingEndTime) ||
                    (newEndTime > existingStartTime &&
                        newEndTime <= existingEndTime) ||
                    (newStartTime <= existingStartTime &&
                        newEndTime >= existingEndTime)
                )
            })

        if (newStartTime >= newEndTime) {
            setStartTimeError('Giờ kết thúc phải sau giờ bắt đầu')
        } else if (isOverlapping) {
            setStartTimeError('Thời gian trùng lặp với danh sách đã có')
        } else {
            setStartTimeError('')
            setSession((preSession) => ({
                ...preSession,
                startTime: newStartTime,
                endTime: newEndTime
            }))
        }
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()
        if (!validate()) {
            return
        }
        const id = toast(Notify.msg.loading, Notify.options.loading())

        const { endTime, sessionId, sessionName, startTime } = { ...session }
        console.log(user)
        const sessionRequest = {
            adminId: user.username,
            endTime: endTime + ':00',
            sessionId: sessionId,
            sessionName: sessionName,
            startTime: startTime + ':00'
        }
        console.log(
            '🚀 ~ file: Sessions.js:281 ~ handleSubmitForm ~ sessionRequest:',
            sessionRequest
        )
        if (update) {
            upateSessions(sessionRequest, id)
        } else {
            addSessions(sessionRequest, id)
        }
    }

    const handleShowAddForm = () => {
        setShowModal(true)

        let sessionName = sessions.length + 1
        setUpdate(false)
        setSession((preSession) => ({
            ...preSession,
            sessionName: sessionName,
            startTime: '',
            endTime: ''
        }))
    }

    const handleResetForm = () => {
        setShowModal(false)
        setStartTimeError('')
        setMsgError({})
        setStartTimeError('')
        setEndTimeError('')

        setSession({
            admin: {
                adminId: '',
                fullname: '',
                gender: true,
                dateOfBirth: '',
                citizenIdentification: ''
            },
            endTime: '',
            sessionId: null,
            sessionName: '',
            startTime: ''
        })
    }

    const addSessions = async (sessionRequest, id) => {
        handleResetForm()
        try {
            const resp = await sessionsApi.createSessions(sessionRequest)
            if (resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())

                setSessions([resp.data, ...sessions])
            }
        } catch (error) {
            toast.update(id, Notify.options.createError())

            console.log('failed to fetch data', error)
        }
    }
    const upateSessions = async (sessionRequest, id) => {
        try {
            handleResetForm()

            const resp = await sessionsApi.updateSessions(sessionRequest)
            console.log(
                '🚀 ~ file: Sessions.js:310 ~ upateSessions ~ resp:',
                resp
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.updateSuccess())
                setSessions(
                    sessions.map((item) => {
                        if (item.sessionId === session.sessionId) {
                            return resp.data
                        }
                        return item
                    })
                )
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
            console.log('failed to fetch data', error)
        }
    }
    const handleShowAllHistory = () => {
        setShowHistoryTable((pre) => !pre)
    }

    const getAllSesssionHistory = async () => {
        try {
            const resp = await sessionsApi.getAllSessionsHistory()

            if (resp.status === 200) {
                setSessionsHistories(resp.data)
                console.log(resp)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handelShowHistory = async (id) => {
        console.log('🚀 ~ file: Sessions.js:233 ~ handelShowHistory ~ id:', id)
        setShowHistoryInfo(true)
        setLoadingHistoryInfo(true)
        try {
            const resp = await sessionsApi.getHistoryBySessionId(id)
            setListHistoryById(resp.reverse())
            console.log(
                '🚀 ~ file: Sessions.js:240 ~ handelShowHistory ~ resp:',
                resp
            )
            setLoadingHistoryInfo(false)
        } catch (error) {
            console.log('failed to fetch data', error)
        }
    }
    useEffect(() => {
        fetchSessions()
        getAllSesssionHistory()
    }, [])

    return (
        <>
            <ToastContainer />
            <SessionsHeader />

            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">
                            {showSessionsHistory
                                ? 'BẢNG LỊCH SỬ CA HỌC'
                                : 'BẢNG CA HỌC'}
                        </h3>
                        <Button
                            color="default"
                            type="button"
                            onClick={() => {
                                handleShowAllHistory()
                            }}
                        >
                            {showHistoryTable
                                ? 'Danh sách ca học'
                                : 'Lịch sử ca học'}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        {/* Table view */}
                        {!showHistoryTable && (
                            <MaterialReactTable
                                muiTableBodyProps={{
                                    sx: {
                                        //stripe the rows, make odd rows a darker color
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                                displayColumnDefOptions={
                                    !showSessionsHistory && {
                                        'mrt-row-actions': {
                                            header: 'Thao tác',
                                            size: 20
                                        }
                                    }
                                }
                                state={{ isLoading: loadingGetSessions }}
                                columns={columnSessions}
                                data={sessions}
                                initialState={{
                                    columnVisibility: { subjectId: false }
                                }}
                                positionActionsColumn="last"
                                // editingMode="modal" //default
                                enableColumnOrdering
                                // enableRowOrdering
                                enableEditing
                                enableStickyHeader
                                enableColumnResizing
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: false,
                                    showLastButton: false
                                }}
                                renderRowActions={({ row }) => (
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
                                                handleEditForm(row)
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="info"
                                            onClick={() => {
                                                handelShowHistory(
                                                    row.original.sessionId
                                                )
                                            }}
                                        >
                                            <IconEyeSearch />
                                        </IconButton>
                                    </Box>
                                )}
                                // Top Add new Subject button
                                renderTopToolbarCustomActions={() => (
                                    <Button
                                        color="success"
                                        onClick={handleShowAddForm}
                                        variant="contained"
                                        id="addSessions"
                                        disabled={showSessionsHistory}
                                    >
                                        <i className="bx bx-layer-plus"></i>
                                        Thêm ca học
                                    </Button>
                                )}
                            />
                        )}

                        {showHistoryTable && (
                            <MaterialReactTable
                                muiTableBodyProps={{
                                    sx: {
                                        //stripe the rows, make odd rows a darker color
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                                columns={columnSessionsHistory}
                                data={sessionsHistories}
                                initialState={{
                                    columnVisibility: { subjectId: false }
                                }}
                                enableColumnOrdering
                                enableStickyHeader
                                enableColumnResizing
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: false,
                                    showLastButton: false
                                }}
                            />
                        )}
                    </CardBody>
                </Card>

                <Modal
                    className="modal-dialog-centered"
                    isOpen={showModal}
                    // toggle={showModal}
                    backdrop={'static'}
                >
                    <Form onSubmit={handleSubmitForm}>
                        <div className="modal-header">
                            <h3
                                className="modal-title"
                                id="modal-title-default"
                            >
                                {update ? 'Cập nhật ca học' : 'Thêm ca học mới'}
                            </h3>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={handleResetForm}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {update && (
                                <FormGroup className="mb-3">
                                    <label
                                        className="form-control-label"
                                        htmlFor="adminId"
                                    >
                                        Người tạo
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="adminId"
                                        readOnly={true}
                                        // onChange={handleChangeInput}
                                        defaultValue={user.fullname}
                                        name="session.account.adminId"
                                        value={session.admin.fullname}
                                    />
                                </FormGroup>
                            )}
                            <FormGroup className="">
                                <label
                                    className="form-control-label"
                                    htmlFor="name"
                                >
                                    Ca học
                                    <span className="text-danger mx-1">*</span>
                                </label>

                                <Input
                                    readOnly
                                    id="name"
                                    type="number"
                                    onChange={handleChangeInput}
                                    name="sessionName"
                                    value={session.sessionName}
                                />

                                {msgError.sessionNameError && (
                                    <FormFeedback>
                                        {msgError.sessionNameError}
                                    </FormFeedback>
                                )}
                            </FormGroup>

                            <TimeInput
                                withSeconds={false}
                                label="Giờ bắt đầu"
                                ref={startRef}
                                error={startTimeError}
                                onChange={handleInputTimeOnChange}
                                value={session.startTime}
                                radius="md"
                                rightSection={
                                    <ActionIcon
                                        onClick={() =>
                                            startRef.current.showPicker()
                                        }
                                    >
                                        <IconClock size="1rem" stroke={1.5} />
                                    </ActionIcon>
                                }
                                // maw={400}
                                mx="auto"
                                className=""
                            />
                            {msgError.startTimeError && (
                                <span className="text-danger mt-3">
                                    {msgError.startTimeError}
                                </span>
                            )}

                            <TimeInput
                                withSeconds={false}
                                readOnly
                                label="Giờ kết thúc"
                                ref={endRef}
                                radius="md"
                                error={endTimeError}
                                min={session.startTime}
                                variant="default"
                                name="endTime"
                                onChange={handleInputTimeOnChange}
                                value={session.endTime}
                                // rightSection={
                                //     <ActionIcon
                                //         onClick={() =>
                                //             endRef.current.showPicker()
                                //         }
                                //     >
                                //         <IconClock size="1rem" stroke={1.5} />
                                //     </ActionIcon>
                                // }
                                // maw={400}
                                mx="auto"
                            />
                            {msgError.endTimeError && (
                                <span className="text-danger  mt-3">
                                    {msgError.endTimeError}
                                </span>
                            )}
                        </div>
                        <div className="modal-footer">
                            <Button
                                color="default"
                                outline
                                data-dismiss="modal"
                                type="button"
                                onClick={handleResetForm}
                            >
                                Hủy
                            </Button>
                            <Button color="primary" type="submit">
                                {update ? 'Cập nhật' : 'Thêm ca học'}
                            </Button>
                        </div>
                    </Form>
                </Modal>
                <Modal
                    className="modal-dialog-centered  modal-lg"
                    isOpen={showHistoryInfo}
                    toggle={() => setShowHistoryInfo((pre) => !pre)}
                >
                    <div className="modal-header">
                        <h3 className="mb-0">Lịch sử chỉnh sửa khóa học </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setShowHistoryInfo(false)
                            }}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center  mb-3">
                            HIỆN TẠI -
                            {moment(new Date()).format('DD/MM/yyyy, h:mm A')}
                        </div>

                        {loadingHistoryInfo ? (
                            <div className="d-flex justify-content-center">
                                <ReactLoading type={'cylon'} color="#357edd" />
                            </div>
                        ) : (
                            listHistoryById.map((item) => (
                                <Timeline key={item.sessionsHistoryId}>
                                    <Event
                                        interval={
                                            <span className="fw-bold fs-3">
                                                {moment(item.modifyDate).format(
                                                    'DD/MM/yyyy, h:mm A'
                                                )}
                                            </span>
                                        }
                                        title={
                                            <u className="">{item.adminName}</u>
                                        }
                                        subtitle={
                                            <>
                                                <p className="my-2"></p>
                                                <span
                                                    className={`alert alert-${
                                                        item.action === 'UPDATE'
                                                            ? 'primary'
                                                            : 'success'
                                                    } px-3 `}
                                                >
                                                    {item.action === 'UPDATE'
                                                        ? 'Cập nhật'
                                                        : 'Thêm mới'}
                                                </span>
                                            </>
                                        }
                                    >
                                        <Card>
                                            <CardBody>
                                                <div className="d-flex justify-content-center flex-column">
                                                    <p>
                                                        <strong>Tên ca:</strong>
                                                        {item.sessionName}
                                                        <p></p>
                                                        <strong>
                                                            Thời gian học:
                                                        </strong>
                                                        Từ
                                                        <strong>
                                                            {item.startTime}
                                                        </strong>
                                                        - đến
                                                        <strong>
                                                            {item.endTime}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Event>
                                </Timeline>
                            ))
                        )}

                        {listHistoryById.length === 0 &&
                            !loadingHistoryInfo && (
                                <div className="text-warning text-center my-5 py-5">
                                    <Warning /> Không tìm thấy lịch sử
                                </div>
                            )}
                        <div className="text-center">NƠI MỌI THỨ BẮT ĐẦU</div>
                    </div>

                    <div className="modal-footer">
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setShowHistoryInfo(false)
                            }}
                        >
                            Đóng
                        </Button>
                    </div>
                </Modal>
            </Container>
            {/* Page content end */}
        </>
    )
}

export default Sessions
