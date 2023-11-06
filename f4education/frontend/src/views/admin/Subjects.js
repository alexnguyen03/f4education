import { Box, FormGroup, IconButton } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import SubjectHeader from 'components/Headers/SubjectHeader'
import MaterialReactTable from 'material-react-table'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { IconEyeSearch, IconListDetails } from '@tabler/icons-react'
// reactstrap components
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    Modal,
    Row,
    UncontrolledTooltip
} from 'reactstrap'

import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'

// Axios
import subjectApi from '../../api/subjectApi'
import subjectHistoryApi from '../../api/subjectHistoryApi'
import courseApi from '../../api/courseApi'

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL

const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    })

    return formatter.format(amount)
}

const Subjects = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    // Main variable
    const [subjects, setSubjects] = useState([])
    const [subjectHistories, setSubjectHistories] = useState([])
    const [subjectArray, setSubjectArray] = useState([])
    const [subjectHistoryPerSubject, setSubjectHistoryPerSubject] = useState([])
    const [coursePerSubjectName, setCoursePerSubjectName] = useState([])

    // Action variable
    const [showModal, setShowModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const [subjectHistoryShowing, setSubjectHistoryShowing] = useState(false)
    const [ModalHistory, setModalHistory] = useState(false)
    const [loadingPopupHistory, setLoadingPopupHistory] = useState(false)
    const [courseBySubject, setCourseBySubject] = useState(false)
    const [subjectLoading, setSubjectLoading] = useState(false)
    const [subjectNameRecent, setSubjectNameRecent] = useState('')

    // Form variable
    const [errorInputSubject, setErrorInputSubject] = useState({
        status: false,
        message: ''
    })

    // *************** Subject AREA
    const [subject, setSubject] = useState({
        subjectId: '',
        adminId: user.username,
        subjectName: '',
        createDate: new Date()
    })

    // Form action area
    const handleChangeInput = (e) => {
        setSubject((prevSubject) => ({
            ...prevSubject,
            [e.target.name]: e.target.value
        }))
    }

    // API Area
    const fetchSubjects = async () => {
        try {
            setSubjectLoading(true)

            const resp = await subjectApi.getAllSubject()

            if (resp.status === 200 && resp.data.length > 0) {
                setSubjectArray(reverseArray(resp.data))
                setSubjects(reverseArray(resp.data))
                console.log(reverseArray(resp.data))
                console.log('restarted application')
            } else {
                console.log('Loi goi ban oi')
            }

            setSubjectLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const reverseArray = (arr) => {
        return arr.reverse()
    }

    const fetchSubjectHistoryPerSubject = async (row) => {
        try {
            setLoadingPopupHistory(true)
            const resp = await subjectHistoryApi.getSubjectHistoryBySubjectId(
                row.subjectId
            )

            if (resp.status === 200 && resp.data.length > 0) {
                setSubjectHistoryPerSubject(reverseArray(resp.data))
            }

            setLoadingPopupHistory(false)
            console.log(resp.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCourseBySubjectName = async (subjectName) => {
        try {
            console.log(subjectName.trim())
            setLoadingPopupHistory(true)
            const resp = await courseApi.getCourseBySubjectName(
                subjectName.trim()
            )

            if (resp.status === 200) {
                console.log(resp.data)
                setCoursePerSubjectName(resp.data)
            } else {
                console.log('error')
            }

            setLoadingPopupHistory(false)
        } catch (error) {
            console.log(error)
        }
    }

    // API_AREA > CRUD
    const handleCreateNewSubject = async () => {
        subject.adminId = user.username

        const lastSubject = subjects.slice(-1)[0]
        const lastSubjectId = lastSubject.subjectId

        subject.subjectId = Number(lastSubjectId + 1)
        subjectArray.push(subject)

        setSubjectArray([...subjectArray])
        console.log(subjectArray.slice(-1)[0])

        subject.subjectId = ''

        subject.subjectId = ''
        // const action = "add";
        if (validateForm()) {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                const body = subject
                const resp = await subjectApi.createSubject(body)

                if (resp.status === 201 || resp.status === 200) {
                    toast.update(id, Notify.options.createSuccess())
                } else {
                    toast.update(id, Notify.options.createError())
                }
            } catch (error) {
                console.log(error)
            }
            console.log('Add Success')
            fetchSubjects()
            setShowModal(false)
            resetForm()
        } else console.log('Error in validation')
    }

    const handleUpdateSubject = async () => {
        const newSubjects = [...subjects]

        const index = newSubjects.findIndex(
            (item) => item.subjectId === subject.subjectId
        )

        if (index !== -1) {
            newSubjects[index] = subject
            setSubjectArray(newSubjects)
        }
        // **
        setSubject(newSubjects[index])

        if (validateForm()) {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                subject.adminId = user.username
                const body = subject
                const resp = await subjectApi.updateSubject(
                    body,
                    subject.subjectId
                )
                if (resp.status === 200) {
                    toast.update(id, Notify.options.updateSuccess())
                } else {
                    toast.update(id, Notify.options.updateError())
                }
                // Add subjectHistory
                // handleCreateNewSubjectHistory(subject, action);
            } catch (error) {
                console.log(error)
            }
        } else return 'error in validate'

        //   console.log("Update success");
        setShowModal(false)
        setUpdate(false)

        fetchSubjects()
        resetForm()
    }

    const handleEditSubject = (row) => {
        setShowModal(true)
        setSubject({
            ...row.original,
            adminId: user.username,
            createDate: row.original.createDate
        })
        setUpdate(true)
        setSubjectNameRecent(row.original.subjectName)
    }

    const resetForm = () => {
        setSubject({
            subjectId: '',
            adminId: user.username,
            subjectName: '',
            createDate: new Date()
        })
    }
    // Validation area
    const validateForm = () => {
        if (subject.subjectName.length === 0) {
            setErrorInputSubject({
                status: true,
                message: 'Vui lòng nhập vào tên môn học.'
            })
            return false
        } else {
            setErrorInputSubject({
                status: false,
                message: ''
            })
        }

        if (subject.subjectName.trim() === subjectNameRecent.trim()) {
            setErrorInputSubject({
                status: false,
                message: ''
            })
            return true
        }

        if (isSubjectNameExists(subject.subjectName)) {
            setErrorInputSubject({
                status: true,
                message: 'Tên môn học đã tồn tại.'
            })
            return false
        } else {
            setErrorInputSubject({
                status: false,
                message: ''
            })
        }

        return true
    }

    const isSubjectNameExists = (subjectName) => {
        const isExists = subjects.some(
            (subject) => subject.subjectName === subjectName
        )
        return isExists
    }

    const handleShowCourseBySubjectName = (row) => {
        setCourseBySubject(true)
        setModalHistory(true)
        fetchCourseBySubjectName(row.subjectName)
    }

    // React Data table area
    const columnSubject = useMemo(
        () => [
            {
                accessorKey: 'subjectId',
                header: 'ID',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 20
            },
            {
                accessorKey: 'adminName',
                header: 'Tên người tạo',
                size: 80
            },
            {
                accessorFn: (row) => displaySubjectName(row),
                header: 'Tên Môn Học',
                size: 180
            },
            // {
            //   accessorFn: (row) => displayTotalCourse(row.totalCoursePerSubject),
            //   header: "khóa học đã đăng ký",
            //   size: 40,
            // },
            {
                accessorFn: (row) =>
                    row.createDate
                        ? moment(row.createDate).format('DD/MM/yyyy, h:mm:ss A')
                        : 'Không có ngày khả dụng',
                header: 'Ngày Tạo',
                size: 120
            }
        ],
        []
    )

    const displaySubjectName = (row) => {
        return <span>{row.subjectName}</span>
    }

    const columnSubjectHistory = useMemo(
        () => [
            {
                accessorKey: 'subjectName',
                header: 'Tên Môn Học',
                size: 80
            },
            {
                accessorFn: (row) =>
                    moment(row.modifyDate).format('DD/MM/yyyy, h:mm:ss A'),
                header: 'Ngày chỉnh sửa',
                size: 120
            },
            {
                accessorKey: 'adminName',
                header: 'Tên người tạo',
                size: 80
            },
            {
                accessorFn: (row) => displayActionHistory(row.action),
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row === 'Cập nhật') {
                        return <Badge color="primary">Cập nhật</Badge>
                    } else {
                        return <Badge color="success">Tạo mới</Badge>
                    }
                },
                header: 'Hành động',
                size: 40
            }
        ],
        []
    )

    const displayActionHistory = (action) => {
        return action === 'CREATE' ? 'Thêm mới' : 'Cập nhật'
    }

    // *************** Header Button area
    const handleChangeSubjectListAndHistory = () => {
        setSubjectHistoryShowing(!subjectHistoryShowing)
    }

    // *************** Subject History AREA
    // API
    const fetchSubjectHistory = async () => {
        try {
            const resp = await subjectHistoryApi.getAllSubjectHistory()

            if (resp.status === 200 && resp.data.length > 0) {
                setSubjectHistories(reverseArray(resp.data))
            } else {
                console.log(resp)
                console.log('loi lich su ban oi')
            }

            console.log('restarted subjectHistory application')
        } catch (error) {
            console.log(error)
        }
    }

    // *************** Use effect area
    useEffect(() => {
        fetchSubjects()
        fetchSubjectHistory()
    }, [])

    return (
        <>
            <ToastContainer />

            {/* HeaderSubject start */}
            <SubjectHeader />
            {/* HeaderSubject End */}

            {/* Page content */}
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">
                            {subjectHistoryShowing
                                ? 'Bảng lịch sử môn học'
                                : 'Bảng Môn học'}
                        </h3>
                        <Button
                            color="default"
                            type="button"
                            onClick={() => handleChangeSubjectListAndHistory()}
                        >
                            {subjectHistoryShowing
                                ? 'Danh sách môn học'
                                : 'Lịch sử môn học'}
                        </Button>
                    </CardHeader>

                    <CardBody>
                        {/* Subject Table */}
                        {!subjectHistoryShowing && (
                            <MaterialReactTable
                                muiTableBodyProps={{
                                    sx: {
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                                enableRowActions
                                positionActionsColumn="last"
                                enableRowNumbers
                                state={{
                                    isLoading: subjectLoading
                                }}
                                displayColumnDefOptions={{
                                    'mrt-row-actions': {
                                        header: 'Thao tác',
                                        size: 40
                                    },
                                    'mrt-row-numbers': {
                                        size: 5
                                    }
                                }}
                                columns={columnSubject}
                                data={subjectArray ?? []}
                                // initialState={{
                                //   columnVisibility: { subjectId: false },
                                // }}
                                initialState={{
                                    columnVisibility: { subjectId: false }
                                }}
                                enableColumnOrdering
                                enableStickyHeader
                                enableStickyFooter
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: true,
                                    showLastButton: true
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
                                            // outline
                                            onClick={() => {
                                                handleEditSubject(row)
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setModalHistory(true)
                                                fetchSubjectHistoryPerSubject(
                                                    row.original
                                                )
                                            }}
                                        >
                                            <IconEyeSearch />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            id="tooltip611234743"
                                            onClick={() => {
                                                handleShowCourseBySubjectName(
                                                    row.original
                                                )
                                            }}
                                        >
                                            <IconListDetails />
                                        </IconButton>
                                        <UncontrolledTooltip
                                            delay={0}
                                            placement="top"
                                            target="tooltip611234743"
                                        >
                                            Các khóa học theo môn học
                                        </UncontrolledTooltip>
                                    </Box>
                                )}
                                // Top Add new Subject button
                                renderTopToolbarCustomActions={() => (
                                    <Button
                                        color="success"
                                        onClick={() => setShowModal(true)}
                                        variant="contained"
                                        id="addSubjects"
                                    >
                                        <i className="bx bx-layer-plus mr-2"></i>{' '}
                                        Thêm môn học
                                    </Button>
                                )}
                            />
                        )}

                        {/* History Table */}
                        {subjectHistoryShowing && (
                            <MaterialReactTable
                                muiTableBodyProps={{
                                    sx: {
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                                enableRowNumbers
                                displayColumnDefOptions={{
                                    'mrt-row-numbers': {
                                        size: 5
                                    }
                                }}
                                columns={columnSubjectHistory}
                                data={subjectHistories}
                                enableColumnOrdering
                                enableStickyHeader
                                enableStickyFooter
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: true,
                                    showLastButton: true
                                }}
                            />
                        )}
                    </CardBody>
                </Card>

                {/* Modal Add - Update Suject*/}
                <Modal className="modal-dialog-centered" isOpen={showModal}>
                    <div className="modal-header">
                        <h3 className="modal-title" id="modal-title-default">
                            {update ? 'Cập nhật môn học' : 'Thêm môn học mới'}
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                                resetForm()
                            }}
                        >
                            <span
                                aria-hidden={true}
                                onClick={() => {
                                    setUpdate(false)
                                    resetForm()
                                }}
                            >
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form method="post">
                            {update && (
                                <>
                                    <FormGroup className="mb-3">
                                        <label
                                            className="form-control-label"
                                            htmlFor="id"
                                        >
                                            Mã môn học
                                        </label>
                                        <Input
                                            className="form-control-alternative"
                                            id="id"
                                            onChange={handleChangeInput}
                                            disabled
                                            name="subjectId"
                                            value={subject.subjectId}
                                        />
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <label
                                            className="form-control-label"
                                            htmlFor="adminId"
                                        >
                                            {update ? 'Tên admin' : 'Mã admin'}
                                        </label>
                                        <Input
                                            className="form-control-alternative"
                                            disabled
                                            id="adminId"
                                            onChange={handleChangeInput}
                                            name="adminId"
                                            value={subject.adminId}
                                        />
                                    </FormGroup>
                                </>
                            )}
                            <FormGroup className="mb-3">
                                <label
                                    className="form-control-label"
                                    htmlFor="name"
                                >
                                    Tên môn học
                                </label>
                                <Input
                                    className={`${
                                        errorInputSubject.status
                                            ? 'is-invalid'
                                            : 'form-control-alternative'
                                    }`}
                                    id="name"
                                    onChange={handleChangeInput}
                                    name="subjectName"
                                    value={subject.subjectName}
                                />
                                <span className="text-danger">
                                    {errorInputSubject.message}
                                </span>
                            </FormGroup>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="default"
                            outline
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                                setUpdate(false)
                                resetForm()
                            }}
                        >
                            Trở lại
                        </Button>
                        <Button
                            color={`${update ? 'primary' : 'success'}`}
                            type="button"
                            onClick={() => {
                                update
                                    ? handleUpdateSubject()
                                    : handleCreateNewSubject()
                                // toast("Cập nhật môn học thành công");
                            }}
                        >
                            {update ? 'Cập nhật' : 'Thêm môn học'}
                        </Button>
                    </div>
                </Modal>

                {/* Modal show history per subject */}
                <Modal className="modal-dialog-centered" isOpen={ModalHistory}>
                    <div className="modal-header">
                        <h3 className="modal-title" id="modal-title-default">
                            {courseBySubject
                                ? 'Danh sách khóa học theo tên môn học'
                                : 'Lịch sử chỉnh sửa'}
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setModalHistory(false)}
                        >
                            <span
                                aria-hidden={true}
                                onClick={() => {
                                    setUpdate(false)
                                    setCourseBySubject(false)
                                }}
                            >
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {courseBySubject && coursePerSubjectName.length > 0 && (
                            <div
                                className="d-flex jusitfy-content-between align-items-center 
                        flex-wrap bg-white position-sticky top-0 py-3"
                                style={{ zIndex: '1' }}
                            >
                                <h4 className="mr-auto">
                                    Tổng khóa học:{' '}
                                    {coursePerSubjectName.length > 0
                                        ? coursePerSubjectName.length
                                        : 0}
                                </h4>
                                <Button
                                    color="default"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => {
                                        setModalHistory(false)
                                        setCourseBySubject(false)
                                    }}
                                >
                                    Trở lại
                                </Button>
                            </div>
                        )}
                        <br />
                        <Row className="container-xxl">
                            {loadingPopupHistory ? (
                                <h3 className="mx-auto">
                                    Vui lòng chờ trong giây lát...
                                </h3>
                            ) : (
                                <>
                                    {courseBySubject ? (
                                        <>
                                            {coursePerSubjectName.length ===
                                            0 ? (
                                                <h3 className="mx-auto">
                                                    Môn học hiện không có khóa
                                                    học nào.
                                                </h3>
                                            ) : (
                                                <>
                                                    {coursePerSubjectName.map(
                                                        (course) => (
                                                            <Col
                                                                key={
                                                                    course.courseId
                                                                }
                                                                xl="12"
                                                                lg="12"
                                                                md="12"
                                                                sm="12"
                                                            >
                                                                <Card className="mb-2">
                                                                    <CardBody>
                                                                        <img
                                                                            // src="https://images.pexels.com/photos/1671436/pexels-photo-1671436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                                            src={`${PUBLIC_IMAGE}/courses/${course.image}`}
                                                                            className="img-fluid"
                                                                            alt=""
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '250px',
                                                                                objectFit:
                                                                                    'cover'
                                                                            }}
                                                                        />
                                                                        <h2 className="font-weight-600 mt-2">
                                                                            {
                                                                                course.courseName
                                                                            }
                                                                        </h2>
                                                                        <div className="d-flex justify-content-start">
                                                                            <h4 className="text-muted">
                                                                                <span className="mr-2">
                                                                                    Thời
                                                                                    lượng:
                                                                                </span>
                                                                                <strong className="font-weight-500">
                                                                                    {
                                                                                        course.courseDuration
                                                                                    }{' '}
                                                                                    Giờ
                                                                                </strong>
                                                                            </h4>
                                                                            <span className="font-weight-600 mx-3 mt--1">
                                                                                |
                                                                            </span>
                                                                            <h4 className="text-muted">
                                                                                <span className="mr-2">
                                                                                    Giá
                                                                                    khóa
                                                                                    học:
                                                                                </span>
                                                                                <strong className="text-primary font-weight-700">
                                                                                    {
                                                                                        formatCurrency(course.coursePrice)
                                                                                    }
                                                                                </strong>
                                                                            </h4>
                                                                        </div>
                                                                        {/* <hr className="text-muted" /> */}
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {subjectHistoryPerSubject.length ===
                                            0 ? (
                                                <h3 className="mx-auto">
                                                    Môn học hiện không có lịch
                                                    sử chỉnh sửa nào.
                                                </h3>
                                            ) : (
                                                <>
                                                    {subjectHistoryPerSubject.map(
                                                        (sb) => (
                                                            <Col
                                                                key={
                                                                    sb.subjectHistoryId
                                                                }
                                                                xl="12"
                                                                lg="12"
                                                                md="12"
                                                                sm="12"
                                                            >
                                                                <h4>
                                                                    ID:{' '}
                                                                    {
                                                                        sb.subjectHistoryId
                                                                    }
                                                                </h4>
                                                                <div>
                                                                    <span className="text-muted">
                                                                        Ngày
                                                                        chỉnh
                                                                        sửa:
                                                                    </span>
                                                                    <strong className="ml-2">
                                                                        {moment(
                                                                            sb.modifyDate
                                                                        ).format(
                                                                            'DD-MM-yyyy, h:mm:ss a'
                                                                        )}
                                                                    </strong>
                                                                    .
                                                                </div>
                                                                <Row>
                                                                    <Col
                                                                        xl="12"
                                                                        lg="12"
                                                                        md="12"
                                                                        sm="12"
                                                                    >
                                                                        <span className="text-muted">
                                                                            Tên
                                                                            môn
                                                                            học:
                                                                        </span>
                                                                        <strong className="ml-2">
                                                                            {
                                                                                sb.subjectName
                                                                            }
                                                                        </strong>
                                                                    </Col>
                                                                    <Col
                                                                        xl="12"
                                                                        lg="12"
                                                                        md="12"
                                                                        sm="12"
                                                                    >
                                                                        <span className="text-muted">
                                                                            Mã
                                                                            môn
                                                                            học:
                                                                        </span>
                                                                        <strong className="ml-2">
                                                                            {
                                                                                sb.subjectId
                                                                            }
                                                                        </strong>
                                                                    </Col>
                                                                    <Col
                                                                        xl="12"
                                                                        lg="12"
                                                                        md="12"
                                                                        sm="12"
                                                                    >
                                                                        <span className="text-muted">
                                                                            Hành
                                                                            động:
                                                                        </span>
                                                                        <strong className="ml-2">
                                                                            {sb.action ===
                                                                            'CREATE'
                                                                                ? 'thêm mới'
                                                                                : 'cập nhật'}
                                                                        </strong>
                                                                    </Col>
                                                                    <Col
                                                                        xl="12"
                                                                        lg="12"
                                                                        md="12"
                                                                        sm="12"
                                                                    >
                                                                        <span className="text-muted">
                                                                            Mã
                                                                            người
                                                                            tạo:
                                                                        </span>
                                                                        <strong className="ml-2">
                                                                            {
                                                                                sb.adminId
                                                                            }
                                                                        </strong>
                                                                    </Col>
                                                                </Row>
                                                                <hr
                                                                    style={{
                                                                        color: '#c6c6c6'
                                                                    }}
                                                                />
                                                            </Col>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Row>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="default"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setModalHistory(false)
                                setCourseBySubject(false)
                            }}
                        >
                            Trở lại
                        </Button>
                    </div>
                </Modal>
            </Container>
            {/* Page content end */}
        </>
    )
}

export default Subjects
