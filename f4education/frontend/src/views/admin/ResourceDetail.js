import { Title, Button } from '@mantine/core'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import classnames from 'classnames'
import ResourceDetailHeader from 'components/Headers/ResourceDetailHeader'
import { MaterialReactTable } from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Modal,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap'

// gọi API từ resourceApi
import resourceApi from '../../api/resourceApi'

// gọi API từ courseApi
import courseApi from 'api/courseApi'

// gọi API từ classHistoryApi

const Resource = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [allFileByFolderLessonId, setAllFileByFolderLessonId] = useState([])
    const [allFileByFolderResourceId, setAllFileByFolderResourceId] = useState(
        []
    )
    const [showFormResourceLesson, setShowFormResourceLesson] = useState(false)
    const [showFormResource, setShowFormResource] = useState(false)
    const [update, setUpdate] = useState(true)
    const [courses, setCourses] = useState([])
    const [selectedCourse, setselectedCourse] = useState({
        value: '0',
        label: ''
    })
    const [options, setOptions] = useState([{ value: '0', label: '' }])
    const [file, setFile] = useState([])
    const [tabs, setTabs] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showModalConfirm, setShowModalConfirm] = useState(false)

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

    // delete file
    const handleDeleteRow = async (row) => {
        try {
            let fileId = row.original.id
            // const confirmed = window.confirm('Bạn có chắc chắn muốn xóa?')
            // if (confirmed) {
            const resp = await resourceApi.deleteFileById(fileId)
            getAllFileByFolderId(data.folderId)
            setShowModalConfirm(false)
            // }
        } catch (error) {
            console.log(error)
        }
    }

    const onChangeFile = (e) => {
        setFile([])
        if (e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files)
            setFile(selectedFiles)
        }
    }

    // xóa trắng form bài học
    const handleResetFormResourceLesson = () => {
        setShowFormResourceLesson((pre) => !pre)
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
        setErrors({})
    }

    // xóa trắng form tài nguyên
    const handleResetFormResource = () => {
        setShowFormResource((pre) => !pre)
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
        setErrors({})
    }

    // bắt lỗi form
    const validateForm = () => {
        let validationErrors = {}
        if (resourceRequest.courseId === 0) {
            validationErrors.courseId = 'Vui lòng chọn khóa học !!!'
        }
        if (file.length === 0) {
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
        const link = row.link
        const id = row.resourcesId
        return (
            <span key={id}>
                <a target="_blank" rel="noreferrer" href={`${link}`}>
                    Đường dẫn đi đến file
                </a>
            </span>
        )
    }

    const addResource = async (e) => {
        e.preventDefault()
        var id = null
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData()
            formData.append('resourceRequest', JSON.stringify(resourceRequest))
            // Lặp qua mảng file và thêm từng đối tượng file vào formData
            for (var i = 0; i < file.length; i++) {
                formData.append('file', file[i])
            }
            if (tabs === 1) {
                formData.append('type', 'BÀI HỌC')
            } else if (tabs === 2) {
                formData.append('type', 'TÀI NGUYÊN')
            }
            console.log([...formData])
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                const resp = await resourceApi.createResource(formData)
                if (resp.status === 200) {
                    if (tabs === 1) {
                        toast.update(id, Notify.options.createSuccess())
                        handleResetFormResourceLesson()
                        getAllFileByFolderId(data.folderId)
                    } else if (tabs === 2) {
                        toast.update(id, Notify.options.createSuccess())
                        handleResetFormResource()
                        getAllFileByFolderId(data.folderId)
                    }
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
            setCourses(resp.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    // bảng tài nguyên
    const columnResource = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID File',
                size: 150
            },
            {
                accessorKey: 'name',
                header: 'Tên File',
                size: 150
            },
            {
                accessorFn: (row) => row.link,
                Cell: ({ cell }) => renderCellWithLink(cell.row.original),
                header: 'Link',
                size: 120
            },
            {
                accessorKey: 'size',
                header: 'Size',
                size: 80
            }
        ],
        []
    )

    // bảng bài học
    const columnLesson = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID File',
                size: 150
            },
            {
                accessorKey: 'name',
                header: 'Tên File',
                size: 150
            },
            {
                accessorFn: (row) => row.link,
                Cell: ({ cell }) => renderCellWithLink(cell.row.original),
                header: 'Link',
                size: 120
            },
            {
                accessorKey: 'size',
                header: 'Size',
                size: 80
            }
        ],
        []
    )

    // lấy dữ liệu GoogleDriveAllFile theo folderId từ database (gọi api)
    const getAllFileByFolderId = async (folderId) => {
        try {
            setIsLoading(true) // Bắt đầu quá trình tải dữ liệu
            const resp = await resourceApi.getAllFileByFolderId(folderId)
            console.log(
                '🚀 ~ file: ResourceDetail.js:306 ~ getAllFileByFolderId ~ folderId:',
                folderId
            )
            console.log(
                '🚀 ~ file: ResourceDetail.js:306 ~ getAllFileByFolderId ~ resp:',
                resp
            )
            const lessonFiles = resp.data.filter(
                (file) => file.type === 'lesson'
            )
            const resourceFiles = resp.data.filter(
                (file) => file.type === 'resource'
            )
            if (resp.status === 200 && resp.data.length > 0) {
                setAllFileByFolderLessonId(lessonFiles)
                setAllFileByFolderResourceId(resourceFiles)
                setIsLoading(false) // Hoàn thành quá trình tải dữ liệu
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false) // Hoàn thành quá trình tải dữ liệu với lỗi
        }
    }

    const toggleNavs = (e, index) => {
        e.preventDefault()
        setTabs(index)
    }

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

    const data = useParams()

    // Use effect
    useEffect(() => {
        getAllFileByFolderId(data.folderId)
        getAllCourse()
    }, [])

    return (
        <>
            <ToastContainer />
            <ResourceDetailHeader />
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    <h2 className="mt-2 ml-4">
                        <Link to={`/admin/resources`}>Tài nguyên</Link> / Tài
                        nguyên chi tiết
                    </h2>
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">
                            Bảng tài nguyên chi tiết của khóa học{' '}
                            <b>{data.courseName}</b>{' '}
                        </h3>
                    </CardHeader>

                    <div className="nav-wrapper px-4 pb-0 mt-2">
                        <Nav
                            className="nav-fill flex-column flex-md-row"
                            id="tabs-icons-text"
                            pills
                            role="tablist"
                        >
                            <NavItem>
                                <NavLink
                                    aria-selected={tabs === 1}
                                    className={classnames('mb-sm-3 mb-md-0', {
                                        active: tabs === 1
                                    })}
                                    onClick={(e) => toggleNavs(e, 1)}
                                    href="#pablo"
                                    role="tab"
                                >
                                    <i className="ni ni-cloud-upload-96 mr-2" />
                                    Bài học
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    aria-selected={tabs === 2}
                                    className={classnames('mb-sm-3 mb-md-0', {
                                        active: tabs === 2
                                    })}
                                    onClick={(e) => toggleNavs(e, 2)}
                                    href="#pablo"
                                    role="tab"
                                >
                                    <i className="ni ni-bell-55 mr-2" />
                                    Tài liệu
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>

                    {/* bảng tài nguyên chi tiết */}
                    <CardBody>
                        <TabContent activeTab={'tabs' + tabs}>
                            <TabPane tabId="tabs1">
                                <p className="description">
                                    <MaterialReactTable
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                header: 'Xóa',
                                                size: 80
                                            }
                                        }}
                                        enableColumnResizing
                                        enableGrouping
                                        enableStickyHeader
                                        enableStickyFooter
                                        enableRowNumbers
                                        columns={columnLesson}
                                        data={allFileByFolderLessonId}
                                        state={{ isLoading: isLoading }}
                                        initialState={{
                                            columnVisibility: { id: false }
                                        }}
                                        positionActionsColumn="last"
                                        renderTopToolbarCustomActions={() => (
                                            <Button
                                                onClick={() =>
                                                    setShowFormResourceLesson(
                                                        (pre) => !pre
                                                    )
                                                }
                                                color='blue'
                                            >
                                                Thêm bài học
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
                                                    isOpen={showModalConfirm}
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
                                                            muốn xóa file ???
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
                                                                    row
                                                                )
                                                            }}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </Modal>
                                            </Box>
                                        )}
                                        muiTablePaginationProps={{
                                            rowsPerPageOptions: [
                                                10, 20, 50, 100
                                            ],
                                            showFirstButton: false,
                                            showLastButton: false
                                        }}
                                    />
                                </p>
                            </TabPane>
                            <TabPane tabId="tabs2">
                                <p className="description">
                                    <MaterialReactTable
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                header: 'Xóa',
                                                size: 80
                                            }
                                        }}
                                        enableColumnResizing
                                        enableGrouping
                                        enableStickyHeader
                                        enableStickyFooter
                                        enableRowNumbers
                                        columns={columnResource}
                                        data={allFileByFolderResourceId}
                                        state={{ isLoading: isLoading }}
                                        initialState={{
                                            columnVisibility: { id: false }
                                        }}
                                        positionActionsColumn="last"
                                        renderTopToolbarCustomActions={() => (
                                            <Button
                                                onClick={() =>
                                                    setShowFormResource(
                                                        (pre) => !pre
                                                    )
                                                }
                                                color="success"
                                            >
                                                Thêm tài nguyên
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
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => {
                                                        handleDeleteRow(row)
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                        muiTablePaginationProps={{
                                            rowsPerPageOptions: [
                                                10, 20, 50, 100
                                            ],
                                            showFirstButton: false,
                                            showLastButton: false
                                        }}
                                    />
                                </p>
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
                {/* Modal Lesson */}
                <Modal
                    backdrop="static"
                    className="modal-dialog-centered"
                    isOpen={showFormResourceLesson}
                    toggle={() => setShowFormResourceLesson((pre) => !pre)}
                >
                    <div className="modal-header">
                        <h3 className="mb-0">Thông tin tài nguyên</h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={handleResetFormResourceLesson}
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
                            onClick={handleResetFormResourceLesson}
                        >
                            Đóng
                        </Button>
                        <Button
                            color="primary"
                            type="button"
                            onClick={update ? addResource : ''}
                        >
                            {update ? 'Lưu' : ''}
                        </Button>
                    </div>
                </Modal>
                {/* Modal Resource */}
                <Modal
                    backdrop="static"
                    className="modal-dialog-centered"
                    isOpen={showFormResource}
                    toggle={() => setShowFormResource((pre) => !pre)}
                >
                    <div className="modal-header">
                        <h3 className="mb-0">Thông tin tài nguyên</h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={handleResetFormResource}
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
                            onClick={handleResetFormResource}
                        >
                            Đóng
                        </Button>
                        <Button
                            color="primary"
                            type="button"
                            onClick={update ? addResource : ''}
                        >
                            {update ? 'Lưu' : ''}
                        </Button>
                    </div>
                </Modal>
            </Container>
        </>
    )
}

export default Resource
