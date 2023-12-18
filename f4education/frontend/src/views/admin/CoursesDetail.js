import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { MaterialReactTable } from 'material-react-table'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Modal,
    Row
} from 'reactstrap'

// ROUTES
import { Link, useParams } from 'react-router-dom'

// UI IMPORT
import { Group, rem, Text, useMantineTheme } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import {
    IconBookDownload,
    IconBookUpload,
    IconFile3d,
    IconRefresh,
    IconUpload,
    IconX
} from '@tabler/icons-react'
import CoursesHeader from 'components/Headers/CoursesHeader'

import moment from 'moment/moment'
import { useEffect, useMemo, useState } from 'react'

// API
import courseApi from '../../api/courseApi'
import courseDetailApi from '../../api/courseDetailApi'

// Utils
import { toast, ToastContainer } from 'react-toastify'
import Notify from '../../utils/Notify'

const CoursesDetail = () => {
    // ROUTE PARAMS
    const params = useParams()
    const theme = useMantineTheme()

    // MAIN VARIABLE
    const [selectedFile, setSelectedFile] = useState(null)
    const [courseDetail, setCourseDetail] = useState([])
    const [currentCourse, setCurrentCourse] = useState({})

    // ACTION VARIABLE
    const [showModal, setShowModal] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [upLoadExcel, setUploadExcel] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingDropZone, setLoadingDropZone] = useState(false)

    // FORM VARIABLE
    const [courseDetailRequest, setCourseDetailRequest] = useState({
        courseDetailId: '',
        lessionTitle: '',
        lessionContent: '',
        courseId: params.courseId
    })

    // FETCH - AREA
    const fetchCourseDetail = async () => {
        setLoading(true)
        try {
            const resp = await courseDetailApi.getAllByCourseId(params.courseId)

            if (resp.status === 200) {
                setCourseDetail(resp.data)
                setShowModal(false)
                setLoading(false)
                console.log('Fetch successfully')
            }
        } catch (error) {
            console.error('Failed to upload file.', error)
        }
    }

    const fetchCurrentCourse = async () => {
        setLoading(true)
        try {
            const resp = await courseApi.getCourseByCourseId(params.courseId)

            if (resp.status === 200) {
                setCurrentCourse(resp.data)
                setShowModal(false)
                setLoading(false)
            }
        } catch (error) {
            console.error('Failed to upload file.', error)
        }
    }

    // ACTION AREA
    const handleExcelFileUpload = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        setLoadingDropZone(true)

        const formData = new FormData()
        formData.append('excelFile', selectedFile)

        try {
            const resp = await courseDetailApi.uploadExcel(
                formData,
                params.courseId
            )

            if (resp.status === 204) {
                toast.update(
                    id,
                    Notify.options.createErrorParam('Không tìm thấy file')
                )
                return
            }

            if (resp.status === 403) {
                console.log(resp.data)
                const str = resp.data
                const parts = str.split('_')
                let number = 0
                if (parts.length === 2) {
                    number = parseInt(parts[1].trim())
                } else {
                    console.log('Không tìm thấy số trong chuỗi')
                }

                toast.update(
                    id,
                    Notify.options.createErrorParam(
                        'Số bài học phải nhiều hơn hoặc bằng ' +
                            number +
                            ' buổi học'
                    )
                )
                setLoadingDropZone(false)
            }

            if (resp.status === 200) {
                setLoadingDropZone(false)
                setUploadExcel(false)
                setShowModal(false)
                toast.update(id, Notify.options.createSuccess())
                console.log('File uploaded successfully.')
                fetchCourseDetail()
            }
        } catch (error) {
            toast.update(id, Notify.options.createError())
            console.error('Failed to upload file.', error)
        }
    }

    const handleStoreCourseDetail = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            const courseDetailRequest = handleDataTranfer()
            console.log(courseDetailRequest)

            const resp = await courseDetailApi.createCourseDetail(
                courseDetailRequest
            )
            if (resp.status === 200) {
                setUploadExcel(false)
                setShowModal(false)
                toast.update(id, Notify.options.createSuccess())
                console.log('create successfully.')
                fetchCourseDetail()
            }
        } catch (error) {
            toast.update(id, Notify.options.createError())
            console.error('Failed to upload file.', error)
        }
    }

    const handelUpdateCourseDetail = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            console.log(courseDetailRequest)
            const resp = await courseDetailApi.updateCourseDetail(
                courseDetailRequest.courseDetailId,
                courseDetailRequest
            )

            if (resp.status === 200) {
                setUploadExcel(false)
                setShowModal(false)
                toast.update(id, Notify.options.updateSuccess())
                fetchCourseDetail()
                console.log('update successfully.')
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
            console.error('Failed to upload file.', error)
        }
    }

    // const handleConfirmDelete = (course) => {
    //     setDeleteId(course.courseDetailId)
    // }

    const handleDeleteCourseDetail = async (course) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            const updatedCourseDetailList = [...courseDetail]
            const indexToDelete = updatedCourseDetailList.findIndex(
                (courseDetail) =>
                    courseDetail.courseDetailId === course.courseDetailId
            )
            if (indexToDelete !== -1) {
                updatedCourseDetailList.splice(indexToDelete, 1)
            }
            setCourseDetail(updatedCourseDetailList)

            const resp = await courseDetailApi.deleteCourseDetail(
                course.courseDetailId
            )
            if (resp.status === 204) {
                setUploadExcel(false)
                toast.update(id, Notify.options.deleteSuccess())
                setShowModalDelete(false)
                console.log('Delete success.')
            }
        } catch (error) {
            toast.update(id, Notify.options.deleteError())
            console.error('Failed to upload file.', error)
        }
    }

    // const handleDeleteAll = async () => {
    //     const id = toast(Notify.msg.loading, Notify.options.loading())
    //     const listCourseId = courseDetail.map((item) => item.courseDetailId)

    //     console.log(listCourseId)
    //     try {
    //         console.log(courseDetailRequest)
    //         const resp = await courseDetailApi.deleteAll(listCourseId)

    //         if (resp.status === 204) {
    //             setUploadExcel(false)
    //             setShowModal(false)
    //             toast.update(id, Notify.options.deleteSuccess())
    //             fetchCourseDetail()
    //             console.log('delete successfully.')
    //         }
    //     } catch (error) {
    //         toast.update(id, Notify.options.deleteErrorr())
    //         console.error('Failed delete.', error)
    //     }
    // }

    const handleDataTranfer = () => {
        const newCourseDetail = createCourseDetail.map((group) => ({
            lessionTitle: group.lessionTitle,
            lessionContent: group.lessionContent,
            courseId: parseInt(params.courseId)
        }))
        return newCourseDetail
    }

    const handleOnChangeInput = (e) => {
        setCourseDetailRequest((prevSubject) => ({
            ...prevSubject,
            [e.target.name]: e.target.value
        }))
    }

    const handleEditCourseDetail = (row) => {
        setCourseDetailRequest({
            courseDetailId: row.courseDetailId,
            lessionTitle: row.lessionTitle,
            lessionContent: row.lessionContent,
            courseId: params.courseId
        })
    }

    // TABLE COLUMNS
    const CourseDetailColumn = useMemo(
        () => [
            {
                accessorKey: 'lessionTitle',
                header: 'Tiêu đề bài học',
                size: 150
            },
            {
                accessorKey: 'lessionContent',
                header: 'Nội dung bài học',
                size: 150
            },
            {
                accessorKey: 'createDate',
                accessorFn: (row) =>
                    moment(row.createDate).format('DD-MM-yyyy h:m:s A'),
                header: 'Ngày tạo',
                size: 90
            }
        ],
        []
    )

    // Dowload excel file
    const handleDownloadExcel = async () => {
        try {
            const response = await courseDetailApi.downloadExcel()

            // Convert the response data to a Blob
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })

            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'example.xlsx'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading Excel file:', error)
        }
    }

    // ADD NEW COURSEDETAIL
    // *************** CREATE NEW QUESTION - ANSWER - START
    const [createCourseDetail, setCreateCourseDetail] = useState([
        { lessionTitle: '', lessionContent: '', error: '' },
        { lessionTitle: '', lessionContent: '', error: '' }
    ])

    const handleOnChangeLesstionTitleChange = (index, value) => {
        const updatedGroups = [...createCourseDetail]
        updatedGroups[index].lessionTitle = value

        if (value !== '') {
            updatedGroups[index].error = ''
        }

        setCreateCourseDetail(updatedGroups)
    }

    const handleOnChangeLesstionContentChange = (index, value) => {
        const updatedGroups = [...createCourseDetail]
        updatedGroups[index].lessionContent = value

        if (value !== '') {
            updatedGroups[index].error = ''
        }

        setCreateCourseDetail(updatedGroups)
    }

    const handleAddGroup = () => {
        const newGroup = { lessionTitle: '', lessionContent: '', error: '' }
        setCreateCourseDetail([...createCourseDetail, newGroup])
    }

    const handleSliceDeleteFromGroup = (index) => {
        const newGroup = [...createCourseDetail]
        if (createCourseDetail.length > 2) {
            newGroup.splice(index, 1)
        }
        setCreateCourseDetail(newGroup)
    }

    const renderInputs = () => {
        return createCourseDetail.map((group, index) => (
            <Col xl={12} lg={12} md={12} sm={12} key={index}>
                <FormGroup className="mt-3">
                    <label className="form-control-label w-100">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <span>Bài học {index + 1}</span>
                            <IconButton
                                className="float-right text-danger"
                                onClick={() =>
                                    handleSliceDeleteFromGroup(index)
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </label>
                    <Row>
                        <Col xl={6} lg={6} md={12} sm={12}>
                            <FormGroup className="mb-3">
                                <label
                                    className="form-control-label"
                                    htmlFor="id"
                                >
                                    Tiêu đề bài học
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    placeholder="Tiêu đề bài học"
                                    value={group.lessionTitle}
                                    onChange={(e) =>
                                        handleOnChangeLesstionTitleChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                            </FormGroup>
                        </Col>
                        <Col xl={6} lg={6} md={12} sm={12}>
                            <FormGroup className="mb-3">
                                <label
                                    className="form-control-label"
                                    htmlFor="id"
                                >
                                    Nội dung bài học
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    placeholder="Nội dung bài học"
                                    value={group.lessionContent}
                                    onChange={(e) =>
                                        handleOnChangeLesstionContentChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    {group.error !== '' && (
                        <span className="text-danger ml-4">{group.error}</span>
                    )}
                </FormGroup>
            </Col>
        ))
    }

    // USE EFECT AREA
    useEffect(() => {
        fetchCourseDetail()
        fetchCurrentCourse()
    }, [])

    return (
        <>
            <ToastContainer />

            {/* Course Header */}
            <CoursesHeader />

            {/* Main Content */}
            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex flex-column justify-content-between align-items-start">
                        <Link
                            to="/admin/courses"
                            className="text-muted text-underline mb-3"
                        >
                            khóa học / chi tiết khóa học
                        </Link>
                        <h2 className="mb-0 text-uppercase">
                            BẢNG CHI TIẾT KHÓA HỌC - {currentCourse.courseName}
                        </h2>
                        <h3 className="text-muted text-left">
                            Số buổi học: {currentCourse.courseDuration / 2}
                            {'  -  '}
                            Tổng số bài học:{' '}
                            {courseDetail.length > 0 ? courseDetail.length : 0}
                        </h3>
                        <h3 className="text-muted text-left">
                            Số bài học phải là :{' '}
                            {(currentCourse.courseDuration / 2).toFixed(0)} bài
                        </h3>
                    </CardHeader>

                    <CardBody>
                        <MaterialReactTable
                            muiTableBodyProps={{
                                sx: {
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
                            state={{ isLoading: loading }}
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
                            columns={CourseDetailColumn}
                            data={courseDetail}
                            renderTopToolbarCustomActions={() => (
                                <Box>
                                    <Button
                                        onClick={() => {
                                            setShowModal(true)
                                            setUploadExcel(false)
                                        }}
                                        color="success"
                                        variant="contained"
                                    >
                                        <i className="bx bx-layer-plus"></i>{' '}
                                        Thêm bài học
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => {
                                            setShowModal(true)
                                            setUploadExcel(true)
                                        }}
                                    >
                                        <IconBookUpload /> Upload excel
                                    </Button>
                                    <Button
                                        color="primary"
                                        outline
                                        variant="contained"
                                        onClick={() => {
                                            handleDownloadExcel()
                                        }}
                                    >
                                        <IconBookDownload /> Tải về file mẫu
                                    </Button>
                                    {/* <Button
                                        color="danger"
                                        variant="contained"
                                        onClick={() => {
                                            handleDeleteAll()
                                        }}
                                    >
                                        <DeleteIcon />
                                        Xóa tất cả
                                    </Button> */}
                                    <Button
                                        color="default"
                                        onClick={() => fetchCourseDetail()}
                                        variant="contained"
                                    >
                                        <IconRefresh />
                                    </Button>
                                </Box>
                            )}
                            enableRowActions
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
                                            setShowModal(true)
                                            setIsUpdate(true)
                                            handleEditCourseDetail(row.original)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="danger"
                                        onClick={() => {
                                            handleDeleteCourseDetail(
                                                row.original
                                            )
                                        }}
                                    >
                                        <DeleteIcon className="text-danger" />
                                    </IconButton>
                                </Box>
                            )}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 20, 50, 100],
                                showFirstButton: true,
                                showLastButton: true
                            }}
                        />
                    </CardBody>
                </Card>
            </Container>

            {/* Modal start*/}
            <Modal
                className="modal-dialog-centered modal-lg"
                isOpen={showModal}
                backdrop={'static'}
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        {isUpdate
                            ? 'Cập nhật tài nguyên khóa học'
                            : 'Thêm tài nguyên khóa học'}
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            setShowModal(false)
                            setIsUpdate(false)
                        }}
                    >
                        <span
                            aria-hidden={true}
                            onClick={() => {
                                setShowModal(false)
                                setIsUpdate(false)
                            }}
                        >
                            ×
                        </span>
                    </button>
                </div>
                <div className="modal-body">
                    {upLoadExcel ? (
                        <>
                            <Dropzone
                                onDrop={(files) => {
                                    console.log('accepted files', files)
                                    setSelectedFile(files[0])
                                }}
                                onReject={(files) =>
                                    console.log('rejected files', files)
                                }
                                maxSize={3 * 1024 ** 2}
                                accept={[MIME_TYPES.xls, MIME_TYPES.xlsx]}
                                name="excelFile"
                                loading={loadingDropZone}
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
                                                    theme.primaryColor
                                                ][
                                                    theme.colorScheme === 'dark'
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
                                                theme.colors.red[
                                                    theme.colorScheme === 'dark'
                                                        ? 4
                                                        : 6
                                                ]
                                            }
                                        />
                                    </Dropzone.Reject>

                                    <Dropzone.Idle>
                                        <IconFile3d size="3rem" stroke={1.5} />
                                    </Dropzone.Idle>

                                    <div>
                                        {selectedFile !== null ? (
                                            <Text
                                                size="xl"
                                                inline
                                                color={'lime'}
                                            >
                                                {selectedFile.name}
                                            </Text>
                                        ) : (
                                            <>
                                                <Text size="xl" inline>
                                                    Thả files excel vào đây hoặc
                                                    click vào để chọn files
                                                </Text>
                                                <Text
                                                    size="sm"
                                                    color="dimmed"
                                                    inline
                                                    mt={7}
                                                >
                                                    Thả mỗi lần một file, lưu ý
                                                    dung lượng file phải dưới
                                                    5MB
                                                </Text>
                                            </>
                                        )}
                                    </div>
                                </Group>
                            </Dropzone>
                        </>
                    ) : (
                        <>
                            <form method="post" className="mt--4">
                                {isUpdate ? (
                                    <>
                                        <Row>
                                            <Col
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                sm={12}
                                            >
                                                <FormGroup className="mb-3">
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="id"
                                                    >
                                                        Tiêu đề bài học
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        onChange={
                                                            handleOnChangeInput
                                                        }
                                                        name="lessionTitle"
                                                        value={
                                                            courseDetailRequest.lessionTitle
                                                        }
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                sm={12}
                                            >
                                                <FormGroup className="mb-3">
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="id"
                                                    >
                                                        Nội dung bài học
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        onChange={
                                                            handleOnChangeInput
                                                        }
                                                        name="lessionContent"
                                                        value={
                                                            courseDetailRequest.lessionContent
                                                        }
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <>
                                        {renderInputs()}
                                        <div className="container">
                                            <Button
                                                color="dark"
                                                className="mt-3 float-left"
                                                onClick={handleAddGroup}
                                            >
                                                <i className="bx bx-list-plus"></i>{' '}
                                                Thêm câu trả lời
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    <Button
                        color="default"
                        outline
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            setShowModal(false)
                            setIsUpdate(false)
                            setUploadExcel(false)
                        }}
                    >
                        Trở lại
                    </Button>
                    <Button
                        // color="success"
                        color={upLoadExcel ? 'primary' : 'success'}
                        type="button"
                        onClick={() => {
                            isUpdate
                                ? handelUpdateCourseDetail()
                                : upLoadExcel
                                ? handleExcelFileUpload()
                                : handleStoreCourseDetail()
                            setIsUpdate(false)
                        }}
                    >
                        {isUpdate ? 'Cập nhật câu hỏi' : 'Thêm đề cương'}
                    </Button>
                </div>
            </Modal>

            <Modal
                className="modal-dialog-centered modal-danger"
                contentClassName="bg-gradient-danger"
                isOpen={showModalDelete}
            >
                <div className="modal-body">
                    <div className="py-3 text-center">
                        <i className="ni ni-bell-55 ni-3x" />
                        <h4 className="heading mt-4">Thông báo!</h4>
                        <p>Bạn có chắc chắn muốn xóa bài học này?</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button
                            className="btn-white"
                            color="default"
                            type="button"
                            onClick={() => {
                                setShowModalDelete(false)
                                setIsUpdate(false)
                                setUploadExcel(false)
                            }}
                        >
                            Trở về
                        </Button>
                        <Button
                            className="text-white ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                handleDeleteCourseDetail()
                                setShowModalDelete(false)
                            }}
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* Modal End*/}
        </>
    )
}

export default CoursesDetail
