import {
    Badge,
    Loader,
    Breadcrumbs,
    Anchor,
    Text,
    Rating,
    Group,
    Pagination
} from '@mantine/core'
import React, { useState, useEffect } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import StarIcon from '@mui/icons-material/Star'
import { Link, useNavigate } from 'react-router-dom'
import { Search as SearchIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../../utils/Notify'
import MicIcon from '@mui/icons-material/Mic'
import SpeechRecognition, {
    useSpeechRecognition
} from 'react-speech-recognition'

import courseApi from 'api/courseApi'
import subjectApi from 'api/subjectApi'
const IMG_URL = '/avatars/courses/'
const PRODUCTS_PER_PAGE = 10 // Số lượng sản phẩm trên mỗi trang

function CourseClient() {
    const user = JSON.parse(localStorage.getItem('user'))
    let navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [expandedRating, setExpandedRating] = useState(false)
    const [expandedTopic, setExpandedTopic] = useState(false)
    const [expandedDuration, setExpandedDuration] = useState(false)
    const [checkedSubjects, setCheckedSubjects] = useState([])
    const [checkedDurations, setCheckedDurations] = useState([])
    const [selectedValuePrice, setSelectedValuePrice] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const { transcript, resetTranscript } = useSpeechRecognition()

    // Tính toán chỉ mục sản phẩm đầu tiên và cuối cùng trên trang hiện tại
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE

    const toggleAccordionRating = () => {
        setExpandedRating(!expandedRating)
    }

    const toggleAccordionTopic = () => {
        setExpandedTopic(!expandedTopic)
    }

    const toggleAccordionDuration = () => {
        setExpandedDuration(!expandedDuration)
    }

    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const itemsBreadcum = [
        { title: 'Trang chủ', href: '/' },
        { title: 'Khóa học', href: '/course' }
    ].map((item, index) => (
        <Anchor href={item.href} key={index} color="dimmed">
            <Text fs="italic">{item.title}</Text>
        </Anchor>
    ))

    // lấy tất cả các khóa học
    const getAllCourse = async () => {
        try {
            const resp = await courseApi.getAll(user.username)
            setCourses(resp.data.reverse())
            setLoading(false)
        } catch (error) {
            console.log('GetAllCourse', error)
        }
    }

    // lấy tất cả các môn học
    const getAllSubject = async () => {
        try {
            const resp = await subjectApi.getAllSubject()
            setSubjects(resp.data)
        } catch (error) {
            console.log('GetAllSubject', error)
        }
    }

    const [selectedRating, setSelectedRating] = useState(null)

    const handleRatingChange = (event) => {
        setSelectedRating(parseFloat(event.target.value))
    }

    // lấy giá trị checkbox chủ đề
    const handleCheckboxChangeTopic = (event) => {
        const { value, checked } = event.target
        if (checked) {
            // Nếu checkbox được chọn, thêm giá trị vào mảng checkedSubjects
            setCheckedSubjects((prevCheckedSubjects) => [
                ...prevCheckedSubjects,
                value.toLowerCase()
            ])
        } else {
            // Nếu checkbox bị bỏ chọn, xóa giá trị khỏi mảng checkedSubjects
            setCheckedSubjects((prevCheckedSubjects) =>
                prevCheckedSubjects.filter(
                    (subject) => subject !== value.toLowerCase()
                )
            )
        }
    }

    // lấy giá trị checkbox thời lượng
    const handleCheckboxChangeDuration = (event) => {
        const { value, checked } = event.target
        if (checked) {
            // Nếu checkbox được chọn, thêm giá trị vào mảng checkedSubjects
            setCheckedDurations((prevCheckedDurations) => [
                ...prevCheckedDurations,
                value
            ])
        } else {
            // Nếu checkbox bị bỏ chọn, xóa giá trị khỏi mảng checkedSubjects
            setCheckedDurations((prevCheckedDurations) =>
                prevCheckedDurations.filter((duration) => duration !== value)
            )
        }
    }

    const findCoursesByCheckedSubject = async (checkedSubjects) => {
        try {
            setLoading(true)
            const resp = await courseApi.findCoursesByCheckedSubjects(
                checkedSubjects
            )
            setCourses(resp.data.reverse())
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const findCoursesByCheckedDuration = async (checkedDurations) => {
        try {
            setLoading(true)
            const resp = await courseApi.findCoursesByCheckedDurations(
                checkedDurations
            )
            setCourses(resp.data.reverse())
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectChange = (event) => {
        setSelectedValuePrice(event.target.value)
        courses.sort((a, b) => {
            const durationA = parseFloat(a.coursePrice)
            const durationB = parseFloat(b.coursePrice)

            if (event.target.value === 'ascending') {
                return durationA - durationB
            } else if (event.target.value === 'decrease') {
                return durationB - durationA
            }
        })
    }

    const navigateToStudent = (e) => {
        e.preventDefault()
        navigate('/student/classes')
    }

    // const filteredCourses = courses.filter((course) => {
    //     const courseValues = Object.values(course)
    //     const subjectName = course.subject.subjectName.toLowerCase()

    //     // Kiểm tra xem có tên môn học trong mảng checkedSubjects hay không
    //     const isSubjectChecked = checkedSubjects.includes(
    //         subjectName.toLowerCase()
    //     )

    //     for (let i = 0; i < courseValues.length; i++) {
    //         const value = courseValues[i]
    //         if (
    //             typeof value === 'string' &&
    //             value.toLowerCase().includes(searchTerm.toLowerCase())
    //         ) {
    //             return value.toLowerCase().includes(searchTerm.toLowerCase())
    //         }
    //         if (typeof value === 'number' && value.toString() === searchTerm) {
    //             return value.toString() === searchTerm
    //         }
    //         if (subjectName.toLowerCase().includes(searchTerm.toLowerCase())) {
    //             return subjectName
    //                 .toLowerCase()
    //                 .includes(searchTerm.toLowerCase())
    //         }
    //     }
    //     return false
    // })

    const filteredCourses = courses.filter((course) => {
        const courseValues = Object.values(course)
        const lowerCaseSearchTerm = searchTerm.toLowerCase()

        for (let i = 0; i < courseValues.length; i++) {
            const value = courseValues[i]

            if (
                (typeof value === 'string' || typeof value === 'number') &&
                value.toString().toLowerCase().includes(lowerCaseSearchTerm)
            ) {
                return true
            }
        }
        return false
    })

    const currentCourses = filteredCourses.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    )

    const totalPages = Math.ceil(filteredCourses.length / PRODUCTS_PER_PAGE)

    // CART - CHECK OUT
    const handleAddCart = (course, e) => {
        e.preventDefault()
        return new Promise((resolve, reject) => {
            const id = toast(Notify.msg.loading, Notify.options.loading())

            try {
                const userCart =
                    JSON.parse(localStorage.getItem('userCart')) || []

                const cart = {
                    course: course
                }

                let currentCart = []

                const cartExists = userCart.some(
                    (userCartMap) =>
                        userCartMap.course.courseId === course.courseId
                )

                if (!cartExists) {
                    userCart.push(cart)
                    localStorage.setItem('userCart', JSON.stringify(userCart))
                    currentCart = [cart]
                } else {
                    const prevCart = userCart.filter(
                        (userCartMap) =>
                            userCartMap.course.courseId === course.courseId
                    )
                    currentCart = prevCart
                }

                toast.update(
                    id,
                    Notify.options.createSuccessParam(
                        'Thêm vào giỏ hàng thành công'
                    )
                )
                resolve(currentCart)
            } catch (error) {
                toast.update(id, Notify.options.createError())
                console.log(error)
                reject(error)
            }
        })
    }

    const handleCheckOutNow = async (course, e) => {
        e.preventDefault()
        const id = toast(Notify.msg.loading, Notify.options.loading())

        if (user === null) {
            toast.update(
                id,
                Notify.options.createErrorParam(
                    'Vui lòng đăng nhập trước khi thanh toán'
                )
            )
            return
        }

        try {
            const selectedCart = await handleAddCart(course, e)

            // store cart to localstorage
            localStorage.setItem('cartCheckout', JSON.stringify(selectedCart))
            return navigate('/payment/checkout')
        } catch (error) {
            toast.update(id, Notify.options.createError())
            console.log(error)
        }
    }

    useEffect(() => {
        if (courses.length > 0) return
        getAllCourse()
        getAllSubject()
    }, [])

    useEffect(() => {
        findCoursesByCheckedSubject(checkedSubjects)
        if (checkedSubjects.length === 0) {
            getAllCourse()
        }
    }, [checkedSubjects])

    useEffect(() => {
        findCoursesByCheckedDuration(checkedDurations)
        // Kiểm tra nếu không có checkbox nào được chọn
        if (checkedDurations.length === 0 || checkedDurations.length === 3) {
            getAllCourse()
        }
    }, [checkedDurations])

    useEffect(() => {
        if (selectedValuePrice === 'none') {
            getAllCourse()
        }
    }, [selectedValuePrice])

    useEffect(() => {
        setSearchTerm(transcript)
    }, [transcript])

    return (
        <>
            <ToastContainer />
            {/* <Container> */}
            {/* BreadCums */}
            <Breadcrumbs
                className="my-5 p-3"
                style={{ backgroundColor: '#ebebeb' }}
            >
                {itemsBreadcum}
            </Breadcrumbs>

            <h1 className="font-weight-700 text-dark my-4 display-4">
                Danh sách các khóa học
            </h1>

            <div className="d-flex mb-3">
                <div class="pl-0 pt-2 pr-2 pb-2">
                    <div
                        className="border border-dark p-1 pt-4 pl-3 filter-panel"
                        style={{ height: '95%', width: 120 }}
                    >
                        <FilterListIcon />
                        <span className="ml-1 font-weight-bold text-dark">
                            Bộ lọc
                        </span>
                    </div>
                </div>
                <div class="p-2">
                    <div
                        className="filter-select border border-dark p-1"
                        style={{ height: '95%', width: 145 }}
                    >
                        <label
                            for="exampleFormControlSelect1"
                            class="font-weight-bold h4 mb-3 ml-2 w-100 text-dark"
                        >
                            Sắp xếp theo giá
                        </label>
                        <select
                            style={{
                                borderColor: 'transparent',
                                boxShadow: 'none',
                                width: 130
                            }}
                            class="form-control mt-n3 pb-1 pt-0 bg-transparent text-dark"
                            id="exampleFormControlSelect1"
                            onChange={handleSelectChange}
                        >
                            <option value="none">Chọn</option>
                            <option value="ascending">Tăng dần</option>
                            <option value="decrease">Giảm dần</option>
                        </select>
                    </div>
                </div>
                <div
                    className="p-2 mt-3"
                    style={{
                        marginLeft: 700,
                        width: '350px',
                        height: 58,
                        border: '1px solid #282a354d',
                        borderRadius: '40px',
                        background: '#fff'
                    }}
                >
                    <div class="input-group">
                        <input
                            style={{ border: 'none', marginRight: 10 }}
                            class="form-control"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div class="input-group-prepend">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <button
                    onClick={SpeechRecognition.startListening}
                    style={{
                        border: 'none',
                        borderRadius: '50%',
                        marginLeft: 20,
                        width: 70,
                        height: 70,
                        marginTop: 10
                    }}
                >
                    <IconButton>
                        <MicIcon style={{ fontSize: 35, color: 'black' }} />
                    </IconButton>
                </button>
                <div class="ml-auto p-2 mt-4">
                    <span class="text-dark font-weight-bold h2">
                        {currentCourses.length} kết quả
                    </span>
                </div>
            </div>
            <div className="d-flex">
                <div className="pl-0 col-3">
                    <div className="col-lg-12 pl-0 pt-2 pr-2 pb-2">
                        <div className="border-top border-bottom pt-3">
                            <div
                                onClick={toggleAccordionRating}
                                className="my-2"
                            >
                                <h1 className="mb-3 text-dark">
                                    Xếp hạng
                                    {expandedRating ? (
                                        <ExpandLess
                                            style={{ float: 'right' }}
                                        />
                                    ) : (
                                        <ExpandMore
                                            style={{ float: 'right' }}
                                        />
                                    )}
                                </h1>
                            </div>
                            {expandedRating && (
                                <div className="text-dark h3 ml-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="exampleRadios"
                                            id="exampleRadios1"
                                            value="4.0"
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 4.0}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="exampleRadios1"
                                        >
                                            <StarIcon
                                                style={{ marginBottom: 5 }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <StarIcon
                                                style={{ marginBottom: 5 }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <StarIcon
                                                style={{ marginBottom: 5 }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <StarIcon
                                                style={{
                                                    marginBottom: 5,
                                                    marginRight: 10
                                                }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            Từ 4.0 sao trở lên
                                        </label>
                                        <span class="text-muted ml-2">
                                            (9.900)
                                        </span>
                                    </div>
                                    <div className="form-check my-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="exampleRadios"
                                            id="exampleRadios2"
                                            value="3.0"
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 3.0}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="exampleRadios2"
                                        >
                                            <StarIcon
                                                style={{ marginBottom: 5 }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <StarIcon
                                                style={{ marginBottom: 5 }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <StarIcon
                                                style={{
                                                    marginBottom: 5,
                                                    marginRight: 10
                                                }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <span className="ml-3">
                                                Từ 3.0 sao trở lên
                                            </span>
                                            <span class="text-muted ml-2">
                                                (3.470)
                                            </span>
                                        </label>
                                    </div>
                                    <div className="form-check my-2 mb-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="exampleRadios"
                                            id="exampleRadios3"
                                            value="2.0"
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 2.0}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="exampleRadios3"
                                        >
                                            <StarIcon
                                                style={{ marginBottom: 5 }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <StarIcon
                                                style={{
                                                    marginBottom: 5,
                                                    marginRight: 10
                                                }}
                                                fontSize="inherit"
                                                color="warning"
                                            />
                                            <span className="ml-4">
                                                &ensp;Từ 2.0 sao trở lên
                                            </span>
                                            <span class="text-muted ml-2">
                                                (3.900)
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-12 pl-0 pt-2 pr-2 pb-2">
                        <div className="border-bottom pt-2">
                            <div
                                onClick={toggleAccordionTopic}
                                className="my-2"
                            >
                                <h1 className="mb-3 text-dark">
                                    Chủ đề
                                    {expandedTopic ? (
                                        <ExpandLess
                                            style={{ float: 'right' }}
                                        />
                                    ) : (
                                        <ExpandMore
                                            style={{ float: 'right' }}
                                        />
                                    )}
                                </h1>
                            </div>
                            {expandedTopic && (
                                <div className="text-dark h3 ml-3">
                                    {subjects.map((subject) => (
                                        <div
                                            className="form-check mb-3"
                                            key={subject.subjectId}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={subject.subjectName}
                                                id={subject.subjectId}
                                                onChange={
                                                    handleCheckboxChangeTopic
                                                }
                                                defaultChecked={checkedSubjects.includes(
                                                    subject.subjectName
                                                )}
                                            />
                                            <label
                                                className="form-check-label font-weight-normal"
                                                htmlFor={subject.subjectId}
                                            >
                                                {subject.subjectName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-12 pl-0 pt-2 pr-2 pb-2">
                        <div className="border-bottom pt-1">
                            <div
                                onClick={toggleAccordionDuration}
                                className="my-2"
                            >
                                <h1 className="mb-3 text-dark">
                                    Thời lượng
                                    {expandedDuration ? (
                                        <ExpandLess
                                            style={{ float: 'right' }}
                                        />
                                    ) : (
                                        <ExpandMore
                                            style={{ float: 'right' }}
                                        />
                                    )}
                                </h1>
                            </div>
                            {expandedDuration && (
                                <div className="text-dark h3 ml-3">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="short"
                                            id="short"
                                            onChange={
                                                handleCheckboxChangeDuration
                                            }
                                        />
                                        <label
                                            className="form-check-label font-weight-normal"
                                            htmlFor="short"
                                        >
                                            0 - 60 giờ
                                        </label>
                                        <span className="text-muted small ml-2">
                                            (212)
                                        </span>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="medium"
                                            id="medium"
                                            onChange={
                                                handleCheckboxChangeDuration
                                            }
                                        />
                                        <label
                                            className="form-check-label font-weight-normal"
                                            htmlFor="medium"
                                        >
                                            60 - 90 giờ
                                        </label>
                                        <span className="text-muted small ml-2">
                                            (212)
                                        </span>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="long"
                                            id="long"
                                            onChange={
                                                handleCheckboxChangeDuration
                                            }
                                        />
                                        <label
                                            className="form-check-label font-weight-normal"
                                            htmlFor="long"
                                        >
                                            90 - 120 giờ
                                        </label>
                                        <span className="text-muted small ml-2">
                                            (212)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-2 col-9">
                    {isLoading ? (
                        <>
                            <div className="w-100 text-center mt-6">
                                <Loader color="rgba(46, 46, 46, 1)" size={50} />
                                <h3 className="text-muted mt-3">
                                    Vui lòng chờ trong giây lát!
                                </h3>
                            </div>
                        </>
                    ) : (
                        currentCourses.map((course) => (
                            <div
                                className="d-flex border-bottom mb-3"
                                key={course.courseId}
                            >
                                <div className="col-lg-3 p-0 mb-3">
                                    <Link to={`/course/${course.courseId}`}>
                                        <img
                                            src={
                                                process.env
                                                    .REACT_APP_IMAGE_URL +
                                                IMG_URL +
                                                course.image
                                            }
                                            style={{
                                                width: 260,
                                                height: 145
                                            }}
                                            className="img-fluid"
                                            alt="Course"
                                        />
                                    </Link>
                                </div>
                                <div className="col-lg-7 mb-3">
                                    <Link to={`/course/${course.courseId}`}>
                                        <Text lineClamp={1} size="xl">
                                            <h1
                                                className="font-weight-700 text-dark"
                                                style={{
                                                    lineHeight: '0.8'
                                                }}
                                            >
                                                {course.courseName}
                                            </h1>
                                        </Text>
                                    </Link>
                                    <Text lineClamp={1}>
                                        <span className="text-dark">
                                            {course.courseDescription}
                                        </span>
                                    </Text>
                                    <Group position="left">
                                        <Rating
                                            value={
                                                course.rating === 'NaN'
                                                    ? 0
                                                    : course.rating
                                            }
                                            fractions={2}
                                            readOnly
                                            mx={2}
                                        />
                                        <Text color="dimmed">
                                            ({course.reviewNumber})
                                        </Text>
                                    </Group>
                                    <Badge
                                        className="p-0"
                                        mb={5}
                                        size="md"
                                        color="pink"
                                        variant="light"
                                    >
                                        Thời lượng: {course.courseDuration}{' '}
                                        (giờ)
                                    </Badge>
                                    <br />
                                    <span class="text-dark">
                                        <b>Chủ đề:</b>{' '}
                                        {course.subject.subjectName}
                                    </span>
                                    {course.isPurchase === false && (
                                        <>
                                            <button
                                                type="button"
                                                class="btn"
                                                style={{
                                                    backgroundColor: '#a435f0',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    borderRadius: 0,
                                                    float: 'right',
                                                    marginTop: 9
                                                }}
                                                onClick={(e) =>
                                                    handleAddCart(course, e)
                                                }
                                            >
                                                Thêm vào giỏ hàng
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div
                                    className="col-lg-2 mb-3 p-0"
                                    style={{ lineHeight: '0.7' }}
                                >
                                    <div
                                        class="d-flex align-items-start flex-column mt-1 mb-3"
                                        style={{ height: 140 }}
                                    >
                                        <div class="mb-auto w-100">
                                            <b className="float-right">
                                                <h2 className="text-dark">
                                                    {course.coursePrice} VND
                                                </h2>
                                            </b>
                                        </div>
                                        {course.isPurchase ? (
                                            <>
                                                <button
                                                    type="button"
                                                    class="btn w-100"
                                                    style={{
                                                        backgroundColor:
                                                            '#172b4d',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        borderRadius: 0,
                                                        marginTop: 74
                                                    }}
                                                    onClick={(e) =>
                                                        navigateToStudent(e)
                                                    }
                                                >
                                                    Đã đăng ký khóa học
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    class="btn w-100"
                                                    style={{
                                                        backgroundColor:
                                                            '#172b4d',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        borderRadius: 0,
                                                        marginTop: 74
                                                    }}
                                                    onClick={(e) =>
                                                        handleCheckOutNow(
                                                            course,
                                                            e
                                                        )
                                                    }
                                                >
                                                    Đăng ký
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {/* Hiển thị thanh phân trang */}
                    {isLoading === false && (
                        <Pagination
                            mb={20}
                            position="center"
                            total={totalPages}
                            limit={PRODUCTS_PER_PAGE}
                            value={currentPage}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default CourseClient
