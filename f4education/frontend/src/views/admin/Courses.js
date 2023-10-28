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
    Badge
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
const IMG_URL = '/courses/'
const Courses = () => {
    const user = JSON.parse(localStorage.getItem('user') | '')
    const [image, setImage] = useState(null)

    const [imgData, setImgData] = useState(null)
    const [showForm, setShowForm] = useState(false)
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

    const [options, setOptions] = useState([{ value: '0', label: '' }])
    const [msgError, setMsgError] = useState({})
    const [listHistoryById, setListHistoryById] = useState([])
    const [course, setCourse] = useState({
        courseId: 'null',
        courseName: '',
        courseDuration: 0,
        numberSession: 0,
        coursePrice: 6000000,
        courseDescription: '',
        image: '',
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

    const [courseRequest, setCourseRequest] = useState({
        subjectId: 0,
        adminId: '',
        courseId: '',
        courseName: '',
        coursePrice: 0,
        courseDuration: 100,
        courseDescription: '',
        numberSession: 0,
        image: ''
    })

    // Thực hiện binding data
    const handelOnChangeInput = (e) => {
        setCourse({
            ...course,
            [e.target.name]: e.target.value,
            courseDuration: course.numberSession * 2
        })
    }

    const validate = () => {
        if (course.courseName === '') {
            setMsgError((preErr) => ({
                ...preErr,
                courseNameErr: 'Vui lòng nhập Tên khóa học'
            }))
        } else if (course.courseName.length < 10) {
            setMsgError((preErr) => ({
                ...preErr,
                courseNameErr: 'Tên khóa học không hợp lệ (quá ngắn)'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, courseNameErr: '' }))
        }
        if (course.courseDuration === '') {
            setMsgError((preErr) => ({
                ...preErr,
                courseDurationErr: 'Vui lòng nhập Thời lượng của khóa học'
            }))
        } else if (
            course.courseDuration === '0' ||
            parseInt(course.courseDuration) < 0
        ) {
            setMsgError((preErr) => ({
                ...preErr,
                courseDurationErr: 'Thời lượng khóa học phải lớn hơn 0 '
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, courseDurationErr: '' }))
        }
        if (course.coursePrice === '') {
            setMsgError((preErr) => ({
                ...preErr,
                coursePriceErr: 'Vui lòng nhập Học phí của khóa học'
            }))
        } else if (
            course.coursePrice === '0' ||
            parseInt(course.coursePrice) < 0
        ) {
            setMsgError((preErr) => ({
                ...preErr,
                coursePriceErr: 'Học phí phải lớn hơn 0'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, coursePriceErr: '' }))
        }
        if (course.image === '') {
            setMsgError((preErr) => ({
                ...preErr,
                imgErr: 'Vui lòng chọn ảnh cho khóa học'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, imgErr: '' }))
        }
        if (course.hourPerSession === '') {
            setMsgError((preErr) => ({
                ...preErr,
                hourPerSessionErr: 'Vui lòng chọn số giờ cho ca học'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, hourPerSessionErr: '' }))
        }

        if (course.courseDescription === '') {
            setMsgError((preErr) => ({
                ...preErr,
                courseDescriptionErr: 'Vui lòng nhập mô tả cho khóa học'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, courseDescriptionErr: '' }))
        }
        if (
            msgError.courseNameErr != '' ||
            msgError.courseDescriptionErr != '' ||
            msgError.courseDurationErr != '' ||
            msgError.imgErr != '' ||
            msgError.coursePriceErr != ''
        ) {
            return false
        }
        return true
    }
    const onChangePicture = (e) => {
        setImage(null)
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            setCourse((preCourse) => ({
                ...preCourse,
                image: e.target.files[0].name
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
            // {
            //     accessorKey: 'courseDuration',
            //     header: 'Thời lượng (h)',
            //     size: 75
            // },

            {
                accessorKey: 'numberSession',
                header: 'Số ca',
                size: 55
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
                accessorKey: 'subject.admin.fullname',
                header: 'Tên người tạo',
                size: 80
            }
        ],
        []
    )

    const columnsCoursesHistory = useMemo(
        () => [
            // {
            // 	enableColumnOrdering: true,
            // 	enableEditing: false, //disable editing on this column
            // 	enableSorting: true,
            // 	accessorKey: 'courseId',
            // 	header: 'Mã khóa học',
            // 	size: 20,
            // },
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
                Cell: ({ cell }) => {
                    const row = cell.getValue()

                    if (row.action === 'UPDATE') {
                        return <Badge color="primary">Cập nhật</Badge>
                    } else {
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
            setCourseHistories(resp.data.reverse())
            setLoadingCoursesHistory(false)
            console.log(courseHistories)
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
        // console.log(
        //     '🚀 ~ file: Courses.js:360 ~ handleResetForm ~ course:',
        //     course
        // )
        setMsgError({})
        setUpdate((pre) => !pre)
        setShowForm((pre) => !pre)
        setImgData(null)
        setCourse({
            courseName: '',
            courseDuration: 100,
            coursePrice: 6000000,
            courseDescription: '',
            image: '',
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
        handleSelect(options[0])
        console.log(courseRequest)
    }
    const handleSubmitForm = (e) => {
        e.preventDefault()
        validate()
        if (!validate) {
            return
        }
        if (update) {
            updateCourse()
            console.log('updated')
        } else {
            console.log(courseRequest)
            addCourse()
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
    const addCourse = async () => {
        const formData = new FormData()
        formData.append('courseRequest', JSON.stringify(courseRequest))
        formData.append('file', image)
        if (!validate()) {
            return
        }
        try {
            const resp = await courseApi.addCourse(formData)
            getAllCourse()
        } catch (error) {
            console.log('failed to fetch data', error)
        }
    }

    const updateCourse = async () => {
        const formData = new FormData()
        formData.append('courseRequest', JSON.stringify(courseRequest))
        console.log(
            '🚀 ~ file: Courses.js:462 ~ updateCourse ~ courseRequest:',
            courseRequest
        )
        formData.append('file', image)

        // try {
        //     const resp = await courseApi.updateCourse(formData)
        //     handleResetForm()
        //     getAllCourse()
        //     console.log('get all')
        // } catch (error) {
        //     console.log('failed to fetch data', error)
        // }
    }

    //chọn 1 môn học trong select box
    function handleSelect(data) {
        setSelectedSubject(data)
        if (selectedSubject != undefined) {
            setCourseRequest((pre) => ({
                ...pre,
                subjectId: parseInt(selectedSubject.value)
            }))
        }
        // console.log(courseRequest);
    }

    // useLayoutEffect(() => {
    //     setCourse({
    //         ...course,
    //         courseDuration: 2 * course.numberSession
    //     })
    // }, [course.numberSession])

    useEffect(() => {
        setListHistoryById([...listHistoryById])
        console.log(
            '🚀 ~ file: Courses.js:330 ~ useEffect ~ listHistoryById:',
            listHistoryById
        )
    }, [loadingHistoryInfo])

    useEffect(() => {
        if (courses.length > 0) return
        getAllCourse()
        getAllSubject()
        console.log(
            '🚀 ~ file: Courses.js:361 ~ handleEditForm ~ course:',
            course
        )
    }, []) // không có ngoặc vuông thì thực hiện gọi return trước call back// thực hiện 1 lần duy nhất

    useEffect(() => {
        const convertedOptions = convertToArray()
        setOptions(convertedOptions)
    }, [subjects, selectedSubject]) // nếu có thì thực hiện khi có sử thay đổi

    useEffect(() => {
        const {
            courseId,
            courseName,
            coursePrice,
            courseDuration,
            courseDescription,
            numberSession,
            image,
            hourPerSession
        } = { ...course }
        if (selectedSubject !== undefined) {
            setCourseRequest({
                courseId: courseId,
                courseName: courseName,
                coursePrice: coursePrice,
                courseDuration: courseDuration,
                courseDescription: courseDescription,
                numberSession: parseInt(numberSession),
                image: image,
                subjectId: parseInt(selectedSubject.value),
                adminId: user.username,
                hourPerSession: parseInt(hourPerSession)
            })
        }
    }, [course, selectedSubject])
    return (
        <>
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
                                        size: 20
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
                                            Số học phần:
                                            {row.original.numberSession}
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
                            >
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
                                <div className="modal-body">
                                    <div className="px-lg-2">
                                        <div
                                            className="previewProfilePic px-3 border d-flex justify-content-center"
                                            style={{
                                                height: '200px',
                                                overflow: 'hidden'
                                            }}
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
                                        </div>
                                        <FormGroup>
                                            <Label
                                                htmlFor="exampleFile"
                                                className="form-control-label"
                                            >
                                                Hình ảnh khóa học
                                            </Label>
                                            <div className="custom-file">
                                                <input
                                                    type="file"
                                                    name="imageFile"
                                                    accept="image/*"
                                                    className="custom-file-input form-control-alternative"
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
                                            {msgError.imgErr && (
                                                <p className="text-danger mt-1">
                                                    {msgError.imgErr}
                                                </p>
                                            )}
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
                                                className="form-control-alternative text-dark"
                                                id="input-course-name"
                                                placeholder="Tên khóa học"
                                                type="text"
                                                onChange={handelOnChangeInput}
                                                name="courseName"
                                                value={course.courseName}
                                            />
                                            {msgError.courseNameErr && (
                                                <p className="text-danger mt-1">
                                                    {msgError.courseNameErr}
                                                </p>
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
                                                className="form-control-alternative"
                                                id="input-courseDescription"
                                                name="courseDescription"
                                                value={course.courseDescription}
                                                type="textarea"
                                                rows={5}
                                                placeholder="Mô tả khóa học"
                                                onChange={handelOnChangeInput}
                                            />
                                            {msgError.courseDescriptionErr && (
                                                <p className="text-danger mt-1">
                                                    {
                                                        msgError.courseDescriptionErr
                                                    }
                                                </p>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-last-name"
                                            >
                                                Số ca học
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                value={course.numberSession}
                                                id="input-numberSession"
                                                type="number"
                                                name="numberSession"
                                                placeholder="Số ca học"
                                                onBlur={handelOnChangeInput}
                                                // onChange={handelOnChangeInput}
                                                onKeyDown={handelOnChangeInput}
                                            />
                                            {msgError.coursePriceErr && (
                                                <p className="text-danger mt-1">
                                                    {msgError.coursePriceErr}
                                                </p>
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
                                                className="form-control-alternative"
                                                id="input-courseDuration"
                                                placeholder="Thời lượng"
                                                type="number"
                                                // readOnly
                                                value={course.courseDuration}
                                                name="courseDuration"
                                                onChange={handelOnChangeInput}
                                            />
                                            {msgError.courseDurationErr && (
                                                <p className="text-danger mt-1">
                                                    {msgError.courseDurationErr}
                                                </p>
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
                                                className="form-control-alternative"
                                                value={course.coursePrice}
                                                id="input-coursePrice"
                                                type="number"
                                                min={1000000}
                                                name="coursePrice"
                                                placeholder="Học phí"
                                                onChange={handelOnChangeInput}
                                            />
                                            {msgError.coursePriceErr && (
                                                <p className="text-danger mt-1">
                                                    {msgError.coursePriceErr}
                                                </p>
                                            )}
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
