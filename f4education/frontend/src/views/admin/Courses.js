import {
    Edit as EditIcon,
    EscalatorWarningOutlined,
    RemoveCircleOutline as RemoveCircleOutlineIcon,
    Search
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import courseApi from '../../api/courseApi'
import moment from 'moment'
import CoursesHeader from 'components/Headers/CoursesHeader'
import { MaterialReactTable } from 'material-react-table'
import {
    memo,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Modal,
    Button,
    CardSubtitle,
    CardText,
    CardTitle,
    CardImg,
    CardGroup,
    ListGroupItem,
    ListGroup,
    Badge,
    FormFeedback,
    ButtonGroup
} from 'reactstrap'
import subjectApi from '../../api/subjectApi'
import Select from 'react-select'
import { Typography } from '@material-ui/core'
import { formatCurrency } from 'utils/formater'
import { IconEyeSearch } from '@tabler/icons-react'
import ReactLoading from 'react-loading'
import { Timeline, Event } from 'react-timeline-scribble'
import { Warning } from '@material-ui/icons'
import { formatDate } from '../../utils/formater'
import { Link } from 'react-router-dom'
import Notify from '../../utils/Notify'
import { ToastContainer, toast } from 'react-toastify'
import { LoadingOverlay } from '@mantine/core'
const IMG_URL = '/avatars/courses/'
const Courses = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState('')
    const [imgData, setImgData] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loadingValidate, setLoadingValidate] = useState(false)
    const [showHistoryTable, setShowHistoryTable] = useState(false)
    const [update, setUpdate] = useState(false)
    const [loadingCourses, setLoadingCourses] = useState(true)
    const [loadingCoursesHistory, setLoadingCoursesHistory] = useState(true)
    const [showHistoryInfo, setShowHistoryInfo] = useState(false)
    const [loadingHistoryInfo, setLoadingHistoryInfo] = useState(true)
    const [courses, setCourses] = useState([])
    const [courseHistories, setCourseHistories] = useState([])
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState({
        value: '0',
        label: ''
    })
    const fileInputRef = useRef(null)
    const [options, setOptions] = useState([{ value: '0', label: '' }])
    const [msgError, setMsgError] = useState({})
    const [listHistoryById, setListHistoryById] = useState([])

    const [course, setCourse] = useState({
        courseId: 'null',
        courseName: '',
        courseDuration: 120,
        coursePrice: 6000000,
        courseDescription: '',
        image: '',
        status: '',
        subject: {
            subjectId: 0,
            subjectName: '',
            admin: {
                adminId: '',
                fullname: '',
                gender: true,
                dateOfBirth: '',
                citizenIdentification: '',
                address: '',
                phone: '',
                image: ''
            }
        }
    })

    // Thực hiện binding data
    const handelOnChangeInput = (e) => {
        setCourse({
            ...course,
            [e.target.name]: e.target.value
        })
    }
    const hasSpecialCharacters = (inputString) => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
        return regex.test(inputString)
    }
    const validate = () => {
        const esxistCourseName = courses.some((item) => {
            return item.courseName === course.courseName
        })
        console.log(
            '🚀 ~ file: Courses.js:114 ~ esxistCourseName ~ esxistCourseName:',
            esxistCourseName
        )

        // console.log('🚀 ~ file: Courses.js:122 ~ validate ~ courses:', courses)
        let isValid = true
        if (course.courseName === '') {
            setMsgError((prevErr) => ({
                ...prevErr,
                courseNameErr: 'Vui lòng nhập Tên khóa học'
            }))
            isValid = false
        } else if (hasSpecialCharacters(course.courseName)) {
            setMsgError((prevErr) => ({
                ...prevErr,
                courseNameErr: 'Tên khóa học không được chứa ký tự đặc biêt!'
            }))
            isValid = false
        } else if (course.courseName.length < 10) {
            setMsgError((prevErr) => ({
                ...prevErr,
                courseNameErr: 'Tên khóa học không hợp lệ (quá ngắn)'
            }))
            isValid = false
        } else {
            setMsgError((prevErr) => ({ ...prevErr, courseNameErr: '' }))
        }
        if (course.courseDuration === '') {
            setMsgError((prevErr) => ({
                ...prevErr,
                courseDurationErr: 'Vui lòng nhập Thời lượng của khóa học'
            }))
            isValid = false
        } else if (
            course.courseDuration === '0' ||
            parseInt(course.courseDuration) < 0
        ) {
            setMsgError((prevErr) => ({
                ...prevErr,
                courseDurationErr: 'Thời lượng khóa học phải lớn hơn 0 '
            }))
            isValid = false
        } else {
            setMsgError((prevErr) => ({ ...prevErr, courseDurationErr: '' }))
        }
        if (course.coursePrice === '') {
            setMsgError((prevErr) => ({
                ...prevErr,
                coursePriceErr: 'Vui lòng nhập Học phí của khóa học'
            }))
            isValid = false
        } else if (
            course.coursePrice === '0' ||
            parseInt(course.coursePrice) < 0
        ) {
            setMsgError((prevErr) => ({
                ...prevErr,
                coursePriceErr: 'Học phí phải lớn hơn 0'
            }))
            isValid = false
        } else {
            setMsgError((prevErr) => ({ ...prevErr, coursePriceErr: '' }))
        }
        if (course.image === '') {
            setMsgError((prevErr) => ({
                ...prevErr,
                imgErr: 'Vui lòng chọn ảnh cho khóa học'
            }))
            isValid = false
        } else {
            setMsgError((prevErr) => ({ ...prevErr, imgErr: '' }))
        }

        if (course.courseDescription === '') {
            setMsgError((prevErr) => ({
                ...prevErr,
                courseDescriptionErr: 'Vui lòng nhập mô tả cho khóa học'
            }))
            isValid = false
        } else {
            setMsgError((prevErr) => ({ ...prevErr, courseDescriptionErr: '' }))
        }
        return isValid
    }

    const handleImageClick = () => {
        fileInputRef.current.click()
        console.log(
            '🚀 ~ file: Courses.js:205 ~ handleImageClick ~ fileInputRef.current:',
            fileInputRef.current
        )
    }
    const onChangePicture = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)

            const reader = new FileReader()
            reader.onload = () => {
                setImgData(reader.result)
            }
            reader.readAsDataURL(file)

            setCourse((prevCourse) => ({
                ...prevCourse,
                image: file.name
            }))
            setMsgError((prevErr) => ({ ...prevErr, imgErr: '' }))
        } else {
            setImage(null)
            setImgData(null)
            setCourse((prevCourse) => ({
                ...prevCourse,
                image: '' // Clear the image name
            }))
        }
    }
    const columnsCourses = useMemo(
        () => [
            {
                accessorKey: 'subject.subjectName',
                header: 'Tên môn học',
                size: 100
            },
            {
                accessorKey: 'courseName',
                header: 'Tên khóa học',
                size: 150
            },

            {
                accessorKey: 'coursePrice',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return <span>{formatCurrency(row.coursePrice)}</span>
                },
                header: 'Học phí (đ)',
                size: 60
            },
            {
                accessorKey: 'status',
                accessorFn: (row) => row,
                Cell: ({ cell }) => {
                    const row = cell.getValue()
                    return (
                        <Badge color={row.status ? 'success' : 'danger'}>
                            {row.status ? 'Đang hoạt động' : 'Đang ẩn'}
                        </Badge>
                    )
                },
                header: 'Trạng thái',
                size: 60
            },
            {
                accessorKey: 'subject.admin.fullname',
                header: 'Tên người tạo',
                size: 80
            }
        ],
        []
    )

    const columnsCoursesHistory = useMemo(
        () => [
            {
                accessorKey: 'subjectName',
                header: 'Tên môn học',
                size: 150
            },
            {
                accessorKey: 'courseName',
                header: 'Tên khóa học',
                size: 150
            },
            {
                accessorKey: 'action',

                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    if (row === 'UPDATE') {
                        return <Badge color="primary">Cập nhật</Badge>
                    } else if (row === 'CREATE') {
                        return <Badge color="success">Tạo mới </Badge>
                    }
                },
                header: 'Hành động',
                size: 75
            },
            {
                accessorFn: (row) =>
                    moment(row.modifyDate).format('DD/MM/yyyy, h:mm:ss A'),
                header: 'Ngày chỉnh sửa',
                size: 60
            },
            {
                accessorKey: 'adminName',
                header: 'Tên người tạo',
                size: 80
            }
        ],
        []
    )
    const getAllCourse = async () => {
        try {
            setLoadingCourses(true)
            const resp = await courseApi.getAll()
            console.log(
                '🚀 ~ file: Courses.js:312 ~ getAllCourse ~ resp:',
                resp
            )
            setCourses(resp.data.reverse())
            setLoadingCourses(false)
        } catch (error) {
            console.log('failed to fetch data', error)
        }
    }
    const getAllSubject = async () => {
        try {
            const resp = await subjectApi.getAllSubject()
            setSubjects(resp.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }
    const handleShowAllHistory = () => {
        if (courseHistories.length === 0) {
            getAllCourseHistory()
        }
        setShowHistoryTable((pre) => !pre)
    }
    const getAllCourseHistory = async () => {
        try {
            setLoadingCoursesHistory(true)
            const resp = await courseApi.getAllCourseHistory()
            console.log(
                '🚀 ~ file: Courses.js:348 ~ getAllCourseHistory ~ resp:',
                resp.data
            )
            setCourseHistories(resp.data.reverse())
            setLoadingCoursesHistory(false)
        } catch (error) {
            console.log(error)
        }
    }
    const convertToArray = () => {
        const convertedArray = subjects.map((item) => ({
            value: item.subjectId,
            label: item.subjectName
        }))
        return convertedArray
    }

    const handleEditForm = (row) => {
        setShowForm(true)
        const selectedCourse = courses.find(
            (course) => course.courseId === row.original.courseId
        )

        setUpdate(true)

        setCourse({ ...selectedCourse })

        const { subject } = { ...row.original }
        setSelectedSubject({
            ...selectedSubject,
            value: subject.subjectId,
            label: subject.subjectName
        })
    }

    const handleResetForm = () => {
        setMsgError({})
        setUpdate((pre) => !pre)
        setShowForm((pre) => !pre)
        setImgData(null)
        setCourse({
            courseName: '',
            courseDuration: 120,
            coursePrice: 6000000,
            courseDescription: '',
            image: '',
            status: '',
            subject: {
                subjectId: 0,
                subjectName: '',
                admin: {
                    adminId: '',
                    fullname: '',
                    gender: true,
                    dateOfBirth: '',
                    citizenIdentification: '',
                    address: '',
                    phone: '',
                    image: ''
                }
            }
        })
    }

    const handleShowAddForm = () => {
        setShowForm((pre) => !pre)
        setUpdate(false)
        setCourse((prev) => ({ ...prev, status: true }))
        handleSelect(options[0])
    }
    const handleSubmitForm = (e) => {
        e.preventDefault()
        console.log('save')
        if (!validate()) return

        const courseRequest = {
            courseId: course.courseId,
            courseName: course.courseName,
            coursePrice: course.coursePrice,
            courseDuration: course.courseDuration,
            courseDescription: course.courseDescription,
            image: course.image,
            subjectId: parseInt(selectedSubject.value),
            adminId: user.username,
            status: course.status
        }

        console.log(
            '🚀 ~ file: Courses.js:431 ~ handleSubmitForm ~ user.username:',
            user.username
        )
        const formData = new FormData()
        console.log(
            '🚀 ~ file: Courses.js:472 ~ addCourse ~ courseRequest:',
            courseRequest
        )
        formData.append('courseRequest', JSON.stringify(courseRequest))
        formData.append('file', image)

        if (update) {
            updateCourse(formData)
            handleResetForm()
            console.log('updated')
        } else {
            addCourse(formData)
            console.log('add')
        }
    }
    const handelShowHistory = async (id) => {
        setShowHistoryInfo(true)
        setLoadingHistoryInfo(true)
        try {
            const resp = await courseApi.getHistoryByCourseid(id)
            console.log(
                '🚀 ~ file: Courses.js:290 ~ handelShowHistory ~ id:',
                id
            )
            setListHistoryById(resp.data.reverse())
            console.log(
                '🚀 ~ file: Courses.js:291 ~ handelShowHistory ~ resp:',
                resp
            )
            setLoadingHistoryInfo(false)
            console.log(
                '🚀 ~ file: Courses.js:284 ~ handelShowHistory ~ history:',
                listHistoryById
            )
        } catch (error) {
            console.log('failed to fetch data', error)
        }
    }
    const addCourse = async (formData) => {
        var id = null
        try {
            setLoadingValidate(true)
            const respValidate = await courseApi.validateCourseName(
                course.courseName
            )

            console.log(
                '🚀 ~ file: Courses.js:469 ~ addCourse ~ respValidate:',
                respValidate
            )
            if (!respValidate.data) {
                id = toast(Notify.msg.loading, Notify.options.loading())
                const resp = await courseApi.addCourse(formData)
                console.log(
                    '🚀 ~ file: Courses.js:468 ~ addCourse ~ resp:',
                    resp
                )
                if (resp.status === 200) {
                    toast.update(id, Notify.options.createSuccess())
                    setCourses([resp.data, ...courses])
                    handleResetForm()
                }
            } else {
                setMsgError((prevErr) => ({
                    ...prevErr,
                    courseNameErr:
                        'Tên khóa học đã tồn tại. Vui lòng nhâp tên khác!'
                }))
            }
            setLoadingValidate(false)

            // getAllCourse()
        } catch (error) {
            toast.update(id, Notify.options.createError())

            setLoadingValidate(false)

            console.log('failed to fetch data', error)
        }
    }

    const updateCourse = async (formData) => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            const resp = await courseApi.updateCourse(formData)
            console.log(
                '🚀 ~ file: Courses.js:489 ~ updateCourse ~ resp:',
                resp
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.updateSuccess())
                setCourses(
                    courses.map((item) => {
                        if (item.courseId === course.courseId) {
                            return resp.data
                        }
                        return item
                    })
                )
            }
        } catch (error) {
            toast.update(Notify.options.updateError())
            console.log('failed to fetch data', error)
        }
    }

    //chọn 1 môn học trong select box
    function handleSelect(data) {
        setSelectedSubject(data)
        // if (selectedSubject != undefined) {
        //     setCourseRequest((pre) => ({
        //         ...pre,
        //         subjectId: parseInt(selectedSubject.value)
        //     }))
        // }
        // console.log(courseRequest);
    }

    useEffect(() => {
        setListHistoryById([...listHistoryById])
    }, [loadingHistoryInfo])

    useEffect(() => {}, [courses])

    useEffect(() => {
        if (courses.length > 0) return
        getAllCourse()
        getAllSubject()

        getAllCourseHistory()
    }, []) // không có ngoặc vuông thì thực hiện gọi return trước call back// thực hiện 1 lần duy nhất

    useEffect(() => {
        const convertedOptions = convertToArray()
        setOptions(convertedOptions)
    }, [subjects, selectedSubject]) // nếu có thì thực hiện khi có sử thay đổi

    return (
        <>
            <ToastContainer />

            <CoursesHeader />

            <Container className="mt--7" fluid>
                <Card className="bg-secondary shadow">
                    {/* Header */}
                    <CardHeader className="bg-white border-0 d-flex justify-content-between">
                        <h3 className="mb-0">
                            {showHistoryTable
                                ? 'LỊCH SỬ CHỈNH SỬA KHÓA HỌC'
                                : 'BẢNG KHÓA HỌC'}
                        </h3>
                        <Button
                            color="info"
                            type="button"
                            onClick={handleShowAllHistory}
                        >
                            {showHistoryTable
                                ? 'Danh sách khóa học'
                                : 'Lịch sử khóa học'}
                        </Button>
                    </CardHeader>

                    <CardBody>
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
                                enableColumnResizing
                                enableGrouping
                                enableStickyHeader
                                enableStickyFooter
                                enableRowNumbers
                                state={{ isLoading: loadingCourses }}
                                displayColumnDefOptions={{
                                    'mrt-row-actions': {
                                        header: 'Thao tác',
                                        size: 70
                                        // Something else here
                                    },
                                    'mrt-row-numbers': {
                                        size: 5
                                    }
                                }}
                                positionActionsColumn="last"
                                columns={columnsCourses}
                                data={courses}
                                renderTopToolbarCustomActions={() => (
                                    <Button
                                        onClick={handleShowAddForm}
                                        color="success"
                                        variant="contained"
                                    >
                                        <i className="bx bx-layer-plus"></i>
                                        Thêm khóa học
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
                                                handleEditForm(row)
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="info"
                                            onClick={() => {
                                                handelShowHistory(
                                                    row.original.courseId
                                                )
                                            }}
                                        >
                                            <IconEyeSearch />
                                        </IconButton>
                                        <Link
                                            to={`/admin/courses-detail/${row.original.courseId}`}
                                        >
                                            <IconButton color="info">
                                                <i className="bx bx-layer-plus"></i>
                                            </IconButton>
                                        </Link>
                                    </Box>
                                )}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: true,
                                    showLastButton: true
                                }}
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
                                enableColumnResizing
                                enableGrouping
                                enableStickyHeader
                                enableStickyFooter
                                enableRowNumbers
                                state={{ isLoading: loadingCoursesHistory }}
                                displayColumnDefOptions={{
                                    // 'mrt-row-actions': {
                                    // 	header: 'Thao tác',
                                    // 	size: 20,
                                    // 	// Something else here
                                    // },
                                    'mrt-row-numbers': {
                                        size: 5
                                    }
                                }}
                                columns={columnsCoursesHistory}
                                data={courseHistories}
                                renderDetailPanel={({ row }) => (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            margin: 'auto',
                                            gridTemplateColumns: '1fr 1fr',
                                            width: '100%'
                                        }}
                                    >
                                        <Typography>
                                            Học phí: {row.original.coursePrice}
                                        </Typography>

                                        <Typography>
                                            Thời lượng:
                                            {row.original.courseDuration}
                                        </Typography>
                                        <Typography>
                                            Mô tả:
                                            {row.original.courseDescription}
                                        </Typography>
                                    </Box>
                                )}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [10, 20, 50, 100],
                                    showFirstButton: true,
                                    showLastButton: true
                                }}
                            />
                        )}

                        <Modal
                            className="modal-dialog-centered  modal-lg "
                            isOpen={showForm}
                            backdrop="static"
                            toggle={() => setShowForm((pre) => !pre)}
                        >
                            <Form
                                onSubmit={handleSubmitForm}
                                encType="multipart/form-data"
                                className="position-relative"
                            >
                                <LoadingOverlay
                                    visible={loadingValidate}
                                    overlayBlur={2}
                                />
                                <div className="modal-header">
                                    <h3 className="mb-0">Thông tin khóa học</h3>
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
                                <div className="modal-body ">
                                    <div className="px-lg-2 ">
                                        <div
                                            className="previewProfilePic px-3 border d-flex justify-content-center"
                                            style={{
                                                height: '200px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}
                                            onClick={handleImageClick}
                                        >
                                            {imgData && (
                                                <img
                                                    alt=""
                                                    // width={120}
                                                    className="playerProfilePic_home_tile"
                                                    src={imgData}
                                                />
                                            )}
                                            {update && !imgData && (
                                                <img
                                                    alt=""
                                                    className=""
                                                    src={
                                                        process.env
                                                            .REACT_APP_IMAGE_URL +
                                                        IMG_URL +
                                                        course.image
                                                    }
                                                />
                                            )}
                                            <small
                                                className={`${
                                                    msgError.imgErr === ''
                                                        ? 'text-danger'
                                                        : ''
                                                } position-absolute  text-center `}
                                                style={{
                                                    top: '50%',
                                                    left: '50%',
                                                    transform:
                                                        'translate(-50%, -50%)',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {msgError.imgErr !== ''
                                                    ? msgError.imgErr
                                                    : null}

                                                {course.image === ''
                                                    ? 'Nhấn chọn ảnh cho khóa học'
                                                    : null}
                                            </small>
                                        </div>

                                        <FormGroup className="d-none">
                                            <div className="custom-file">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    name="imageFile"
                                                    accept="image/*"
                                                    id="customFile"
                                                    onChange={onChangePicture}
                                                    // multiple={true}
                                                />
                                                <label
                                                    className="custom-file-label"
                                                    htmlFor="customFile"
                                                >
                                                    {imgData
                                                        ? 'Chọn một ảnh khác'
                                                        : 'Chọn hình ảnh'}
                                                </label>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Tên môn học
                                            </label>

                                            <Select
                                                options={options}
                                                placeholder="Chọn môn học"
                                                value={selectedSubject}
                                                onChange={handleSelect}
                                                isSearchable={true}
                                                className="form-control-alternative "
                                                styles={{ outline: 'none' }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-email"
                                            >
                                                Tên khóa học
                                            </label>
                                            <Input
                                                className={`${
                                                    msgError.courseNameErr
                                                        ? 'is-invalid'
                                                        : 'form-control-alternative'
                                                } text-dark`}
                                                id="input-course-name"
                                                placeholder="Tên khóa học"
                                                type="text"
                                                onChange={handelOnChangeInput}
                                                name="courseName"
                                                value={course.courseName}
                                            />
                                            {msgError.courseNameErr && (
                                                <FormFeedback>
                                                    {msgError.courseNameErr}
                                                </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-last-name"
                                            >
                                                Mô tả khóa học
                                            </label>
                                            <Input
                                                className={`${
                                                    msgError.courseDescriptionErr
                                                        ? 'is-invalid'
                                                        : 'form-control-alternative'
                                                } text-dark`}
                                                id="input-courseDescription"
                                                name="courseDescription"
                                                value={course.courseDescription}
                                                type="textarea"
                                                rows={5}
                                                placeholder="Mô tả khóa học"
                                                onChange={handelOnChangeInput}
                                            />
                                            {msgError.courseDescriptionErr && (
                                                <FormFeedback>
                                                    {
                                                        msgError.courseDescriptionErr
                                                    }
                                                </FormFeedback>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-first-name"
                                            >
                                                Thời lượng (giờ)
                                            </label>
                                            <Input
                                                className={`${
                                                    msgError.courseDurationErr
                                                        ? 'is-invalid'
                                                        : 'form-control-alternative'
                                                } text-dark`}
                                                id="input-courseDuration"
                                                placeholder="Thời lượng"
                                                type="number"
                                                // readOnly
                                                value={course.courseDuration}
                                                name="courseDuration"
                                                onChange={handelOnChangeInput}
                                                onFocus={(e) => {
                                                    e.target.select()
                                                }}
                                            />
                                            {msgError.courseDurationErr && (
                                                <FormFeedback>
                                                    {msgError.courseDurationErr}
                                                </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-last-name"
                                            >
                                                Học phí (đồng)
                                            </label>
                                            <Input
                                                className={`${
                                                    msgError.coursePriceErr
                                                        ? 'is-invalid'
                                                        : 'form-control-alternative'
                                                } text-dark`}
                                                value={course.coursePrice}
                                                id="input-coursePrice"
                                                type="number"
                                                min={1000000}
                                                name="coursePrice"
                                                placeholder="Học phí"
                                                onChange={handelOnChangeInput}
                                            />
                                            {msgError.coursePriceErr && (
                                                <FormFeedback>
                                                    {msgError.coursePriceErr}
                                                </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-last-name"
                                            >
                                                Trạng thái
                                            </label>
                                            <div>
                                                <ButtonGroup>
                                                    <Button
                                                        color="success"
                                                        outline
                                                        onClick={() => {
                                                            setCourse(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    status: true
                                                                })
                                                            )
                                                        }}
                                                        name="status"
                                                        active={course.status}
                                                    >
                                                        Hoạt động
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        outline
                                                        name="status"
                                                        active={!course.status}
                                                        onClick={() => {
                                                            setCourse(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    status: false
                                                                })
                                                            )
                                                        }}
                                                    >
                                                        Ẩn
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <hr className="my-4" />
                                </div>
                                <div className="modal-footer">
                                    <Button
                                        color="secondary"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={handleResetForm}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        color={update ? 'primary' : 'success'}
                                        type="submit"
                                        className="px-5"
                                        disabled={loadingValidate}
                                    >
                                        Lưu
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
                                <h3 className="mb-0">
                                    Lịch sử chỉnh sửa khóa học
                                </h3>
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
                                    {moment(new Date()).format(
                                        'DD/MM/yyyy, h:mm A'
                                    )}
                                </div>
                                {loadingHistoryInfo ? (
                                    <div className="d-flex justify-content-center">
                                        <ReactLoading
                                            type={'cylon'}
                                            color="#357edd"
                                        />
                                    </div>
                                ) : (
                                    listHistoryById.map((item) => (
                                        <Timeline key={item.courseHistoryId}>
                                            <Event
                                                interval={
                                                    <span className="fw-bold fs-3">
                                                        {formatDate(
                                                            item.modifyDate
                                                        )}
                                                    </span>
                                                }
                                                title={
                                                    <span
                                                        className={`alert alert-${
                                                            item.action ===
                                                            'UPDATE'
                                                                ? 'primary'
                                                                : 'success'
                                                        } px-3 mb-3`}
                                                    >
                                                        {item.action ===
                                                        'UPDATE'
                                                            ? 'Cập nhật'
                                                            : 'Thêm mới'}
                                                    </span>
                                                }
                                                subtitle={
                                                    <u> {item.adminName}</u>
                                                }
                                            >
                                                <Card>
                                                    <CardImg
                                                        alt="Card image cap"
                                                        src={
                                                            process.env
                                                                .REACT_APP_IMAGE_URL +
                                                            IMG_URL +
                                                            item.image
                                                        }
                                                        width="30%"
                                                    />
                                                    <CardBody>
                                                        <Row>
                                                            <Col
                                                                xl={5}
                                                                className="text-center"
                                                            >
                                                                <div className="d-flex justify-content-center">
                                                                    <strong>
                                                                        Thời
                                                                        lượng:
                                                                    </strong>
                                                                    {
                                                                        item.courseDuration
                                                                    }
                                                                    <strong>
                                                                        Học phí:
                                                                    </strong>
                                                                    {formatCurrency(
                                                                        item.coursePrice
                                                                    )}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col
                                                                xl={5}
                                                                className="text-center"
                                                            >
                                                                <strong>
                                                                    Tên môn học:
                                                                </strong>
                                                                {
                                                                    item.subjectName
                                                                }
                                                                <strong>
                                                                    Mô tả:
                                                                </strong>
                                                                {
                                                                    item.courseDescription
                                                                }
                                                            </Col>
                                                        </Row>
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
                                <div className="text-center">
                                    NƠI MỌI THỨ BẮT ĐẦU
                                </div>
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
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}
export default memo(Courses)
