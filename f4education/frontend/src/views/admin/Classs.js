import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
    Modal,
    Badge
} from 'reactstrap'
import ClasssHeader from 'components/Headers/ClasssHeader'
import { useState, useMemo, useEffect } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Box, IconButton, MenuItem } from '@mui/material'
import moment from 'moment'

// gọi API từ classApi
import classApi from 'api/classApi'

// gọi API từ classHistoryApi
import classHistoryApi from 'api/classHistoryApi'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formater'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'
import { IconRefresh } from '@tabler/icons-react'

const Classs = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [classses, setClassses] = useState([])
    const [loading, setLoading] = useState(false)
    const [classHistories, setClassHistories] = useState([])
    const [classHistoryByClassId, setClassHistotyByClassId] = useState([])
    const [showFormClass, setShowFormClass] = useState(false)
    const [showFormClassHistory, setShowFormClassHistory] = useState(false)
    const [update, setUpdate] = useState(true)
    const [isClassHistoryShowing, setIsClassHistoryShowing] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [errors, setErrors] = useState({})

    // khởi tạo Class
    const [classs, setClasss] = useState({
        classId: '',
        className: '',
        startDate: '',
        endDate: '',
        maximumQuantity: 0,
        status: 'Đang chờ'
    })

    const isClassNameExists = (newClassName) => {
        // Kiểm tra xem tên lớp mới đã tồn tại trong đối tượng classs hay chưa
        return Object.values(classses).some(
            (cls) => cls.className === newClassName
        )
    }

    // bắt lỗi form
    const validateForm = () => {
        let validationErrors = {}
        if (!classs.className) {
            validationErrors.className = 'Vui lòng nhập tên lớp học !!!'
        }
        if (classs.maximumQuantity <= 0) {
            validationErrors.maximumQuantity =
                'Số lượng tối đa phải lớn hơn 0 !!!'
        }
        if (classs.maximumQuantity >= 50) {
            validationErrors.maximumQuantity =
                'Số lượng tối đa không được lớn hơn 50 !!!'
        }
        if (isClassNameExists(classs.className) && update) {
            validationErrors.className = 'Tên lớp học đã tồn tại !!!'
        }
        return validationErrors
    }

    // thay đổi giá trị của biến
    const handleChangeClassListAndHistory = () => {
        setIsClassHistoryShowing(!isClassHistoryShowing)
    }

    // xử lý status
    const renderSelect = (status) => {
        switch (status) {
            case 'Đang chờ':
                return (
                    <>
                        <option data-value="Đang chờ" value="Đang chờ">
                            Đang chờ
                        </option>
                        <option data-value="Đang diễn ra" value="Đang diễn ra">
                            Đang diễn ra
                        </option>
                    </>
                )
                break
            case 'Đang diễn ra':
                return (
                    <>
                        <option data-value="Đang diễn ra" value="Đang diễn ra">
                            Đang diễn ra
                        </option>
                        <option data-value="Kết thúc" value="Kết thúc">
                            Kết thúc
                        </option>
                    </>
                )
                break
            case 'Kết thúc':
                return (
                    <>
                        <option data-value="Đang diễn ra" value="Đang diễn ra">
                            Đang diễn ra
                        </option>
                        <option data-value="Kết thúc" value="Kết thúc">
                            Kết thúc
                        </option>
                    </>
                )
                break
            default:
                break
        }
    }

    // lấy dữ liệu của select status
    const handleOnChangeSelect = (e) => {
        const selectedIndex = e.target.options.selectedIndex
        const status =
            e.target.options[selectedIndex].getAttribute('data-value')
        // setSelectedStatus(status);
        setClasss({
            ...classs,
            status: status
        })
        console.log(status)
    }

    // edit row class
    const handleEditRow = (row) => {
        console.log(
            '🚀 ~ file: Classs.js:128 ~ handleEditRow ~ row:',
            typeof row.original.classId
        )

        setShowFormClass(true)
        setUpdate(false)
        setSelectedStatus(row.original.status)
        console.log(selectedStatus)
        setClasss({ ...row.original })
    }

    // show modal classhistory
    const handleShowClassHistory = (row) => {
        setShowFormClassHistory(true)
        getDataClassHistoryByClassId(row.original.classId)
    }

    // lấy dữ liệu từ form
    const handelOnChangeInput = (e) => {
        setClasss({
            ...classs,
            [e.target.name]: e.target.value
        })
    }

    // xóa trắng form
    const handleResetForm = () => {
        setShowFormClass((pre) => !pre)
        setClasss({
            className: '',
            maximumQuantity: 0,
            status: 'Đang chờ'
        })
        setUpdate(true)
        setErrors({})
    }

    // resetModal ClassHistory
    const handleResetClassHistory = () => {
        setShowFormClassHistory((pre) => !pre)
    }

    // lấy tấc cả dữ liệu Class từ database (gọi api)
    const getDataClass = async () => {
        try {
            setLoading(true)
            const resp = await classApi.getAllClass()
            console.log('🚀 ~ file: Classs.js:195 ~ getDataClass ~ resp:', resp)
            if (resp.status === 200) {
                setLoading(false)
                setClassses(resp.data.reverse())
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    // thêm class
    const createClass = async (e) => {
        e.preventDefault()
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length === 0) {
            var id = null

            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                const resp = await classApi.createClass(classs, user.username)
                if (resp.status === 200) {
                    toast.update(id, Notify.options.createSuccess())
                    handleResetForm()
                    setClassses([resp.data, ...classses])
                    // getDataClass()
                } else {
                    toast.update(id, Notify.options.createError())
                }
            } catch (error) {
                console.log('Thêm thất bại', error)
                toast.update(id, Notify.options.createError())
            }
        } else {
            setErrors(validationErrors)
        }
    }

    // cập nhật class
    const updateClass = async (e) => {
        e.preventDefault()
        var id = null
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length === 0) {
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                console.log(classs)
                const body = classs
                if (
                    body.status === 'Đang chờ' ||
                    body.status === 'Đang diễn ra'
                ) {
                    body.endDate = null
                } else {
                    body.endDate = new Date()
                }
                const resp = await classApi.updateClass(body, classs.classId)
                if (resp.status === 200) {
                    toast.update(id, Notify.options.updateSuccess())
                    handleResetForm()
                    setClassses(
                        classses.map((item) => {
                            if (item.classId === classs.classId) {
                                return resp.data
                            }
                            return item
                        })
                    )
                }
            } catch (error) {
                console.log('Cập nhật thất bại', error)
                toast.update(id, Notify.options.updateError())
            }
        } else {
            setErrors(validationErrors)
        }
    }

    // bảng lớp học
    const columnClass = useMemo(
        () => [
            {
                accessorKey: 'classId',
                header: 'Mã lớp học',
                size: 100
            },
            {
                accessorKey: 'className',
                header: 'Tên lớp học',
                size: 100
            },
            {
                accessorKey: 'teacher.fullname',
                header: 'Giáo viên',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row === undefined)
                        return <Badge color="warning">Chưa có giáo viên</Badge>
                    else return row
                },
                size: 100
            },
            {
                accessorKey: 'courseName',
                header: 'Tên khóa học',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row === null)
                        return <Badge color="warning">Chưa có khóa học</Badge>
                    else return row
                },
                size: 100
            },
            {
                accessorKey: 'startDate',
                accessorFn: (row) => formatDate(row.startDate),
                header: 'Ngày bắt đầu',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.startDate !== null) {
                        return <span>{formatDate(row.startDate)}</span>
                    } else {
                        return <span>Chưa bắt đầu</span>
                    }
                },
                size: 90
            },
            {
                accessorKey: 'endDate',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.endDate !== null) {
                        return <span>{formatDate(row.endDate)}</span>
                    } else {
                        return <span>Chưa kết thúc</span>
                    }
                },
                header: 'Ngày kết thúc',
                size: 90
            },
            {
                accessorKey: 'maximumQuantity',
                header: 'Số lượng tối đa',
                size: 95
            },
            {
                accessorKey: 'admin.fullname',
                header: 'Tên người tạo',
                size: 95
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row === 'Đang diễn ra') {
                        return <Badge color="info">{row}</Badge>
                    } else if (row === 'Đang chờ') {
                        return <Badge color="primary">{row}</Badge>
                    } else if (row === 'Kết thúc') {
                        return <Badge color="success">{row}</Badge>
                    }
                },
                size: 95
            }
        ],
        []
    )

    // hiển thị tiếng việt
    const displayActionHistory = (action) => {
        if (action === 'UPDATE') {
            return <Badge color="primary">Cập nhật</Badge>
        } else if (action === 'CREATE') {
            return <Badge color="success">Tạo mới </Badge>
        }
    }

    // bảng lịch sử lớp học
    const columnClassHistory = useMemo(
        () => [
            {
                accessorKey: 'classId',
                header: 'Mã lớp học',
                size: 90
            },
            {
                accessorKey: 'className',
                header: 'Tên lớp học',

                size: 100
            },
            {
                accessorKey: 'startDate',
                accessorFn: (row) => formatDate(row.startDate),
                header: 'Ngày bắt đầu',
                size: 105
            },
            {
                accessorKey: 'endDate',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    if (row.endDate !== null) {
                        return <span>{formatDate(row.endDate)}</span>
                    } else {
                        return <span>Chưa kết thúc</span>
                    }
                },
                header: 'Ngày kết thúc',
                size: 105
            },
            {
                accessorKey: 'maximumQuantity',
                header: 'Số lượng tối đa',
                size: 95
            },
            {
                accessorKey: 'admin.fullname',
                header: 'Người chỉnh sửa',
                size: 100
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                size: 95
            },
            {
                accessorFn: (row) =>
                    moment(row.modifyDate).format('DD-MM-yyyy, h:mm:ss a'),
                header: 'Ngày Chỉnh Sửa',
                size: 120
            },
            {
                accessorKey: 'action',
                accessorFn: (row) => displayActionHistory(row.action),
                header: 'Hành động',
                size: 100
            }
        ],
        []
    )

    // lấy tấc cả dữ liệu ClassHistory từ database (gọi api)
    const getDataClassHistory = async () => {
        try {
            const resp = await classHistoryApi.getAllClassHistory()
            console.log(
                '🚀 ~ file: Classs.js:335 ~ getDataClassHistory ~ resp:',
                resp
            )
            setClassHistories(resp.data)
        } catch (error) {
            console.log(error)
        }
    }

    // lấy dữ liệu ClassHistory theo ClassId từ database (gọi api)
    const getDataClassHistoryByClassId = async (classId) => {
        try {
            const resp = await classHistoryApi.getClassHistoryByClassId(classId)
            setClassHistotyByClassId(resp)
            console.log(
                '🚀 ~ file: Classs.js:351 ~ getDataClassHistoryByClassId ~ resp:',
                resp
            )
        } catch (error) {
            console.log(error)
        }
    }

    // khi thay đổi selectedStatus thì sẽ tự động cập nhật lại
    useEffect(() => {
        setClasss({
            ...classs,
            status: selectedStatus
        })
    }, [selectedStatus])

    // Use effect
    useEffect(() => {
        getDataClass()
        getDataClassHistory()
    }, [])

    return (
        <>
            <ToastContainer />
            <ClasssHeader />
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">
                            {isClassHistoryShowing
                                ? 'Bảng lịch sử lớp học'
                                : 'Bảng lớp học'}
                        </h3>
                        <Button
                            color="default"
                            type="button"
                            onClick={() => handleChangeClassListAndHistory()}
                        >
                            {isClassHistoryShowing
                                ? 'Danh sách lớp học'
                                : 'Lịch sử lớp học'}
                        </Button>
                    </CardHeader>

                    {/* bảng lớp học */}
                    {isClassHistoryShowing ? null : (
                        <CardBody>
                            <MaterialReactTable
                                displayColumnDefOptions={{
                                    'mrt-row-actions': {
                                        header: 'Thao tác',
                                        size: 100
                                    }
                                }}
                                // enableColumnResizing
                                enableGrouping
                                enableStickyHeader
                                enableStickyFooter
                                columns={columnClass}
                                data={classses}
                                positionActionsColumn="last"
                                renderTopToolbarCustomActions={() => (
                                    <Box>
                                        <Button
                                            onClick={() =>
                                                setShowFormClass((pre) => !pre)
                                            }
                                            color="success"
                                        >
                                            Thêm lớp học
                                        </Button>
                                        <Button
                                            color="default"
                                            onClick={() => getDataClass()}
                                            variant="contained"
                                        >
                                            <IconRefresh />
                                        </Button>
                                    </Box>
                                )}
                                initialState={{
                                    columnVisibility: { classId: false }
                                }}
                                enableRowActions
                                renderRowActionMenuItems={(row) => [
                                    <MenuItem
                                        key="edit"
                                        onClick={() => {
                                            handleEditRow(row.row)
                                        }}
                                    >
                                        <IconButton color="secondary">
                                            <EditIcon />
                                        </IconButton>
                                        Chỉnh sửa
                                    </MenuItem>,
                                    <MenuItem
                                        key="history"
                                        onClick={() =>
                                            handleShowClassHistory(row.row)
                                        }
                                    >
                                        <IconButton color="info">
                                            <i className="fa-sharp fa-solid fa-eye"></i>
                                        </IconButton>
                                        Lịch sử
                                    </MenuItem>,
                                    <MenuItem
                                        key="setClass"
                                        onClick={() => console.info('Delete')}
                                    >
                                        <Link
                                            to={`/admin/classs/class-detail/${row.row.original.classId}`}
                                            className="text-dark"
                                        >
                                            <IconButton color="primary">
                                                <i className="fa-solid fa-bars-progress"></i>
                                            </IconButton>
                                            Xếp lớp
                                        </Link>
                                    </MenuItem>
                                ]}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: false,
                                    showLastButton: false
                                }}
                                muiTableBodyProps={{
                                    sx: {
                                        //stripe the rows, make odd rows a darker color
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                                state={{ isLoading: loading }}
                            />
                        </CardBody>
                    )}

                    {/* bảng lịch sử lớp học  */}
                    {isClassHistoryShowing ? (
                        <CardBody>
                            <MaterialReactTable
                                enableColumnResizing
                                enableGrouping
                                enableStickyHeader
                                enableStickyFooter
                                columns={columnClassHistory}
                                data={classHistories}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: false,
                                    showLastButton: false
                                }}
                                muiTableBodyProps={{
                                    sx: {
                                        //stripe the rows, make odd rows a darker color
                                        '& tr:nth-of-type(odd)': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }
                                }}
                            />
                        </CardBody>
                    ) : null}
                </Card>
                {/* Modal Class */}
                <Modal
                    backdrop="static"
                    className="modal-dialog-centered"
                    isOpen={showFormClass}
                    toggle={() => setShowFormClass((pre) => !pre)}
                >
                    <div className="modal-header">
                        <h3 className="mb-0">Thông tin lớp học</h3>
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
                        <Form>
                            <div className="px-lg-2">
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-class-name"
                                    >
                                        Tên lớp học
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-class-name"
                                        placeholder="Tên lớp học"
                                        type="text"
                                        onChange={handelOnChangeInput}
                                        name="className"
                                        value={classs.className}
                                    />
                                    {errors.className && (
                                        <div className="text-danger mt-2">
                                            {errors.className}
                                        </div>
                                    )}
                                </FormGroup>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-maximumQuantity"
                                            >
                                                Số lượng tối đa
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-maximumQuantity"
                                                type="number"
                                                min={0}
                                                step={1}
                                                max={50}
                                                value={classs.maximumQuantity}
                                                name="maximumQuantity"
                                                onChange={handelOnChangeInput}
                                            />
                                            {errors.maximumQuantity && (
                                                <div className="text-danger mt-2">
                                                    {errors.maximumQuantity}
                                                </div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Trạng thái
                                            </label>
                                            <Input
                                                id="exampleSelect"
                                                name="status"
                                                type="select"
                                                onChange={handleOnChangeSelect}
                                                readOnly={
                                                    update
                                                        ? 'readOnly'
                                                        : undefined
                                                }
                                                value={classs.status}
                                            >
                                                {update ? (
                                                    <option
                                                        data-value="Đang chờ"
                                                        value="Đang chờ"
                                                    >
                                                        Đang chờ
                                                    </option>
                                                ) : (
                                                    renderSelect(selectedStatus)
                                                )}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={handleResetForm}
                        >
                            Đóng
                        </Button>
                        <Button
                            color="primary"
                            type="button"
                            onClick={update ? createClass : updateClass}
                        >
                            {update ? 'Lưu' : 'Cập nhật'}
                        </Button>
                    </div>
                </Modal>
                {/* Modal ClassHistory */}
                <Modal
                    backdrop="static"
                    className="modal-dialog-centered modal-xl"
                    isOpen={showFormClassHistory}
                    toggle={() => setShowFormClassHistory((pre) => !pre)}
                >
                    <div className="modal-header">
                        <h3 className="mb-0">Lịch sử chi tiết</h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={handleResetClassHistory}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <MaterialReactTable
                            enableColumnResizing
                            enableGrouping
                            enableStickyHeader
                            enableStickyFooter
                            columns={columnClassHistory}
                            data={classHistoryByClassId}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: false,
                                showLastButton: false
                            }}
                            muiTableBodyProps={{
                                sx: {
                                    //stripe the rows, make odd rows a darker color
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }
                            }}
                        />
                    </div>
                </Modal>
            </Container>
        </>
    )
}

export default Classs
