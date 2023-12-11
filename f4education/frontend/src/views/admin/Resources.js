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
    ButtonGroup
} from 'reactstrap'
import ResourcesHeader from 'components/Headers/ResourcesHeader'
import { useState, useMemo, useEffect } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import moment from 'moment'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'
import { IconRefresh } from '@tabler/icons-react'

// gọi API từ resourceApi
import resourceApi from 'api/resourceApi'

// gọi API từ courseApi
import courseApi from 'api/courseApi'

// gọi API từ classHistoryApi
import classHistoryApi from 'api/classHistoryApi'
import { formatDate } from '../../utils/formater'

const Resource = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [resources, setResources] = useState([])
    const [classHistories, setClassHistories] = useState([])
    const [classHistoryByClassId, setClassHistotyByClassId] = useState([])
    const [showFormClass, setShowFormClass] = useState(false)
    const [showFormClassHistory, setShowFormClassHistory] = useState(false)
    const [update, setUpdate] = useState(true)
    const [isClassHistoryShowing, setIsClassHistoryShowing] = useState(false)

    const [courses, setCourses] = useState([])
    const [selectedCourse, setselectedCourse] = useState({
        value: '0',
        label: ''
    })
    const [options, setOptions] = useState([{ value: '0', label: '' }])
    const [file, setFile] = useState([null])
    const [rSelected, setRSelected] = useState(null)
    const [loadingResource, setLoadingResource] = useState(false)
    const [errors, setErrors] = useState({})

    // khởi tạo Resource
    const [resource, setResource] = useState({
        resourcesId: '',
        link: '',
        createDate: '',
        course: {
            courseId: 0,
            courseName: ''
        },
        adminName: ''
    })

    const [resourceRequest, setResourceRequest] = useState({
        courseId: '',
        adminId: '',
        resourcesId: 0,
        link: '',
        createDate: ''
    })

    // thay đổi giá trị của biến
    const handleChangeClassListAndHistory = () => {
        setIsClassHistoryShowing(!isClassHistoryShowing)
    }

    // edit row class
    const handleEditRow = (row) => {
        setShowFormClass(true)
        setUpdate(false)
        setResource({ ...row.original })
        setselectedCourse({
            ...selectedCourse,
            value: row.original.course.courseId,
            label: row.original.course.courseName
        })
    }

    // show modal classhistory
    const handleShowClassHistory = (row) => {
        setShowFormClassHistory(true)
    }

    const onChangeFile = (e) => {
        setFile([])
        if (e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files)
            setFile(selectedFiles)
        }
    }

    // xóa trắng form
    const handleResetForm = () => {
        setShowFormClass((pre) => !pre)
        setselectedCourse({})
        setResource({
            resourcesId: '',
            link: '',
            createDate: '',
            course: {
                courseId: 0,
                courseName: ''
            },
            adminName: ''
        })
        setUpdate(true)
        setRSelected(null)
        setErrors({})
    }

    // bắt lỗi form
    const validateForm = () => {
        let validationErrors = {}
        if (resourceRequest.courseId === 0) {
            validationErrors.courseId = 'Vui lòng chọn khóa học !!!'
        }
        if (rSelected === null) {
            validationErrors.typeResource = 'Vui lòng chọn loại tài nguyên !!!'
        }
        if (file[0] === null) {
            validationErrors.file = 'Bạn chưa chọn file !!!'
        }
        return validationErrors
    }

    const convertToArray = () => {
        const convertedArray = courses.map((item) => ({
            value: item.courseId,
            label: item.courseName
        }))
        return convertedArray
    }

    function handleSelect(data) {
        setselectedCourse(data)
        if (selectedCourse != undefined) {
            setResourceRequest((pre) => ({
                ...pre,
                courseId: parseInt(selectedCourse.value)
            }))
        }
    }

    function renderCellWithLink(row) {
        // console.log(row);
        const link = row.link
        const id = row.resourcesId
        return (
            <span key={id}>
                <a target="_blank" rel="noreferrer" href={`${link}`}>
                    Đường dẫn đi đến thư mục
                </a>
            </span>
        )
    }

    function getFolderId(url) {
        const startIndex = url.lastIndexOf('/') + 1 // Tìm vị trí bắt đầu của folderId
        const folderId = url.substring(startIndex) // Lấy phần tử từ startIndex đến hết chuỗi
        return folderId
    }

    // resetModal ClassHistory
    const handleResetClassHistory = () => {
        setShowFormClassHistory((pre) => !pre)
    }

    // lấy tấc cả dữ liệu Resource từ database (gọi api)
    const getDataResource = async () => {
        try {
            setLoadingResource(true) // Bắt đầu quá trình tải dữ liệu
            const resp = await resourceApi.getAllResource()
            console.log(
                '🚀 ~ file: Resources.js:204 ~ getDataResource ~ resp:',
                resp
            )
            if (resp.status === 200 && resp.data.length > 0) {
                setResources(resp.data)
                setLoadingResource(false)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingResource(false)
        }
    }

    const addResource = async (e) => {
        e.preventDefault()
        var id = null
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData()
            formData.append('resourceRequest', JSON.stringify(resourceRequest))
            var files = [] // Mảng chứa các đối tượng file
            // Lặp qua mảng file và thêm từng đối tượng file vào formData
            for (var i = 0; i < file.length; i++) {
                formData.append('file', file[i])
            }
            if (rSelected === 1) {
                formData.append('type', 'BÀI HỌC')
            } else if (rSelected === 2) {
                formData.append('type', 'TÀI LIỆU')
            }
            console.log([...formData])
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                const resp = await resourceApi.createResource(formData)
                if (resp.status === 200) {
                    if (rSelected === 1) {
                        toast.update(id, Notify.options.createSuccess())
                    } else if (rSelected === 2) {
                        toast.update(id, Notify.options.createSuccess())
                    }
                    handleResetForm()
                    getDataResource()
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

    const getAllCourse = async () => {
        try {
            const resp = await courseApi.getAll()
            if (resp.status === 200) {
                setCourses(resp.data.reverse())
            }
        } catch (error) {
            console.log(error)
        }
    }

    // bảng tài nguyên
    const columnClass = useMemo(
        () => [
            {
                accessorKey: 'resourcesId',
                header: 'ID',
                size: 80
            },
            {
                accessorKey: 'course.courseName',
                header: 'Tên khóa học',
                size: 180
            },
            {
                accessorFn: (row) => row.link,
                Cell: ({ cell }) => renderCellWithLink(cell.row.original),
                header: 'Link',
                size: 150
            },
            {
                accessorKey: 'createDate',
                accessorFn: (row) => formatDate(row.createDate),
                header: 'Ngày tạo',
                size: 150
            },
            {
                accessorKey: 'adminName',
                header: 'Người tạo',
                size: 110
            }
        ],
        []
    )

    // hiển thị tiếng việt
    const displayActionHistory = (action) => {
        return action === 'CREATE' ? 'Thêm mới' : 'Cập nhật'
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
                        return (
                            <span>
                                {moment(row.endDate).format(
                                    'DD/MM/yyyy, h:mm:ss a'
                                )}
                            </span>
                        )
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

    useEffect(() => {
        const convertedOptions = convertToArray()
        setOptions(convertedOptions)
    }, [courses, selectedCourse])

    useEffect(() => {
        const { resourcesId, link } = { ...resource }
        if (selectedCourse.value !== undefined) {
            setResourceRequest({
                resourcesId: resourcesId,
                link: link,
                courseId: parseInt(selectedCourse.value),
                adminId: user.username
            })
        }
    }, [resource, selectedCourse])

    // Use effect
    useEffect(() => {
        getDataResource()
        getAllCourse()
    }, [])

    return (
        <>
            <ToastContainer />
            <ResourcesHeader />
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">
                            {isClassHistoryShowing
                                ? 'Bảng lịch sử tài nguyên'
                                : 'Bảng tài nguyên'}
                        </h3>
                        <Button
                            color="default"
                            type="button"
                            onClick={() => handleChangeClassListAndHistory()}
                        >
                            {isClassHistoryShowing
                                ? 'Danh sách tài nguyên'
                                : 'Lịch sử tài nguyên'}
                        </Button>
                    </CardHeader>

                    {/* bảng tài nguyên */}
                    {isClassHistoryShowing ? null : (
                        <CardBody>
                            <MaterialReactTable
                                displayColumnDefOptions={{
                                    'mrt-row-actions': {
                                        header: 'Thao tác',
                                        size: 100
                                    }
                                }}
                                enableColumnResizing
                                enableGrouping
                                enableStickyHeader
                                enableStickyFooter
                                state={{ isLoading: loadingResource }}
                                columns={columnClass}
                                data={resources}
                                positionActionsColumn="last"
                                renderTopToolbarCustomActions={() => (
                                    <Box>
                                        <Button
                                            onClick={() =>
                                                setShowFormClass((pre) => !pre)
                                            }
                                            color="success"
                                        >
                                            Thêm tài nguyên
                                        </Button>
                                        <Button
                                            color="default"
                                            onClick={() => getDataResource()}
                                            variant="contained"
                                        >
                                            <IconRefresh />
                                        </Button>
                                    </Box>
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
                                        {row.original.course &&
                                            row.original.course.courseName && (
                                                <Link
                                                    to={`/admin/resourceDetail/${
                                                        row.original.course
                                                            .courseName
                                                    }/${getFolderId(
                                                        row.original.link
                                                    )}`}
                                                >
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => {
                                                            handleEditRow(row)
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Link>
                                            )}
                                        <IconButton
                                            color="info"
                                            onClick={() => {
                                                handleShowClassHistory(row)
                                            }}
                                        >
                                            <i class="fa-sharp fa-solid fa-eye"></i>
                                        </IconButton>
                                    </Box>
                                )}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: false,
                                    showLastButton: false
                                }}
                            />
                        </CardBody>
                    )}

                    {/* bảng lịch sử tài nguyên  */}
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
                            />
                        </CardBody>
                    ) : null}
                </Card>
                {/* Modal Resource */}
                <Modal
                    backdrop="static"
                    className="modal-dialog-centered"
                    isOpen={showFormClass}
                    toggle={() => setShowFormClass((pre) => !pre)}
                >
                    <div className="modal-header">
                        <h3 className="mb-0">Thông tin tài nguyên</h3>
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
                                    <label className="form-control-label">
                                        Tên khóa học
                                    </label>
                                    <Select
                                        placeholder="Chọn khóa học"
                                        options={options}
                                        value={selectedCourse}
                                        onChange={handleSelect}
                                    />
                                    {errors.courseId && (
                                        <div className="text-danger mt-2">
                                            {errors.courseId}
                                        </div>
                                    )}
                                </FormGroup>
                                <Row>
                                    {update ? (
                                        ''
                                    ) : (
                                        <Col md={12}>
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    Link
                                                </label>
                                                <br />
                                                <label className="form-control-label">
                                                    <a href={resource.link}>
                                                        {resource.link}
                                                    </a>
                                                </label>
                                            </FormGroup>
                                        </Col>
                                    )}
                                    <Col md={12}>
                                        <FormGroup>
                                            <label className="form-control-label">
                                                Loại tài nguyên
                                            </label>
                                            <br />
                                            <ButtonGroup>
                                                <Button
                                                    color="primary"
                                                    outline
                                                    onClick={() =>
                                                        setRSelected(1)
                                                    }
                                                    active={rSelected === 1}
                                                >
                                                    Bài học
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    outline
                                                    onClick={() =>
                                                        setRSelected(2)
                                                    }
                                                    active={rSelected === 2}
                                                >
                                                    Tài liệu
                                                </Button>
                                            </ButtonGroup>
                                            {errors.typeResource && (
                                                <div className="text-danger mt-2">
                                                    {errors.typeResource}
                                                </div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="customFile"
                                            >
                                                Chọn File
                                            </label>
                                            <br />
                                            <input
                                                type="file"
                                                multiple
                                                id="customFile"
                                                className="form-control-alternative"
                                                onChange={onChangeFile}
                                            />
                                            {errors.file && (
                                                <div className="text-danger mt-2">
                                                    {errors.file}
                                                </div>
                                            )}
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
                            onClick={update ? addResource : ''}
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
                        />
                    </div>
                </Modal>
            </Container>
        </>
    )
}

export default Resource
