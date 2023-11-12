import {
    Badge,
    Loader,
    Breadcrumbs,
    Anchor,
    Text,
    Pagination,
    Container
} from '@mantine/core'
import React, { useState, useEffect } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import StarIcon from '@mui/icons-material/Star'
import { Link } from 'react-router-dom'
import { Search as SearchIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'

import courseApi from 'api/courseApi'
import subjectApi from 'api/subjectApi'
const IMG_URL = '/courses/'
const PRODUCTS_PER_PAGE = 10 // Số lượng sản phẩm trên mỗi trang

function CourseClient() {
    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [expandedRating, setExpandedRating] = useState(false)
    const [expandedTopic, setExpandedTopic] = useState(false)
    const [expandedDuration, setExpandedDuration] = useState(false)
    const [checkedSubjects, setCheckedSubjects] = useState([])
    const [checkedDurations, setCheckedDurations] = useState([])
    const [selectedValuePrice, setSelectedValuePrice] = useState(null)
    const [activeFilter, setActiveFilter] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

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
            const resp = await courseApi.getAll()
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

    // lấy giá trị checkbox chủ đề
    const handleCheckboxChangeTopic = (event) => {
        const { value, checked } = event.target
        if (checked) {
            // Nếu checkbox được chọn, thêm giá trị vào mảng checkedSubjects
            setCheckedSubjects((prevCheckedSubjects) => [
                ...prevCheckedSubjects,
                value
            ])
            setActiveFilter(true)
        } else {
            // Nếu checkbox bị bỏ chọn, xóa giá trị khỏi mảng checkedSubjects
            setCheckedSubjects((prevCheckedSubjects) =>
                prevCheckedSubjects.filter((subject) => subject !== value)
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
            setActiveFilter(true)
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
            setCourses(resp.reverse())
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
            setCourses(resp.reverse())
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectChange = (event) => {
        setSelectedValuePrice(event.target.value)
        setActiveFilter(true)
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

    const handleDeleteFilter = async () => {
        getAllCourse()
        setActiveFilter(false)
    }

    const handleRegistration = (course) => {
        // Lưu thông tin khóa học vào state
        console.log(course)
        // Thực hiện các thao tác khác tại đây
    }

    const filteredCourses = courses.filter((course) => {
        const courseValues = Object.values(course)
        const subjectName = course.subject.subjectName.toLowerCase()
        for (let i = 0; i < courseValues.length; i++) {
            const value = courseValues[i]
            if (
                typeof value === 'string' &&
                value.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return value.toLowerCase().includes(searchTerm.toLowerCase())
            }
            if (typeof value === 'number' && value.toString() === searchTerm) {
                return value.toString() === searchTerm
            }
            if (subjectName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return subjectName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            }
        }
        return false
    })

    const currentCourses = filteredCourses.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    )

    const totalPages = Math.ceil(filteredCourses.length / PRODUCTS_PER_PAGE)

    useEffect(() => {
        if (courses.length > 0) return
        getAllCourse()
        getAllSubject()
    }, [])

    useEffect(() => {
        findCoursesByCheckedSubject(checkedSubjects)
        if (checkedSubjects.length === 0) {
            getAllCourse()
            setActiveFilter(false)
        }
    }, [checkedSubjects])

    useEffect(() => {
        findCoursesByCheckedDuration(checkedDurations)
        // Kiểm tra nếu không có checkbox nào được chọn
        if (checkedDurations.length === 0 || checkedDurations.length === 3) {
            getAllCourse()
            setActiveFilter(false)
        }
    }, [checkedDurations])

    useEffect(() => {
        if (selectedValuePrice === 'none') {
            getAllCourse()
            setActiveFilter(false)
        }
    }, [selectedValuePrice])

    return (
        <>
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
                {activeFilter && (
                    <div className="pl-2 my-auto">
                        <button
                            className="border-0 bg-white"
                            onClick={() => handleDeleteFilter()}
                        >
                            <h5>Xóa bộ lọc</h5>
                        </button>
                    </div>
                )}
                <div
                    className="p-1 mt-3"
                    style={{
                        marginLeft: 350,
                        width: '350px',
                        height: 50,
                        border: '1px solid #282a354d',
                        borderRadius: '25px',
                        background: '#fff'
                    }}
                >
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </div>
                        <input
                            style={{ border: 'none', marginRight: 10 }}
                            class="form-control"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div class="ml-auto p-2 mt-3">
                    <span class="text-dark font-weight-bold">
                        {currentCourses.length} kết quả
                    </span>
                </div>
            </div>
            <div className="d-flex">
                <div className="pl-0 col-4">
                    <div className="col-lg-12 pl-0 pt-2 pr-2 pb-2">
                        <div className="border-top border-bottom pt-3">
                            <div
                                onClick={toggleAccordionRating}
                                className="my-2"
                            >
                                <h3 className="mb-4">
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
                                </h3>
                            </div>
                            {expandedRating && (
                                <div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="exampleRadios"
                                            id="exampleRadios1"
                                            value="option1"
                                            checked
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
                                                style={{ marginBottom: 5 }}
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
                                            value="option2"
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
                                                style={{ marginBottom: 5 }}
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
                                            value="option3"
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
                                                style={{ marginBottom: 5 }}
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
                        <div className="border-bottom pt-3">
                            <div
                                onClick={toggleAccordionTopic}
                                className="my-2"
                            >
                                <h3 className="mb-4">
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
                                </h3>
                            </div>
                            {expandedTopic && (
                                <div>
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
                                                checked={checkedSubjects.includes(
                                                    subject.subjectName
                                                )}
                                            />
                                            <label
                                                className="form-check-label font-weight-normal"
                                                htmlFor={subject.subjectId}
                                            >
                                                {subject.subjectName}
                                            </label>
                                            <span className="text-muted small ml-2">
                                                (212)
                                            </span>
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
                                <h3 className="mb-4">
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
                                </h3>
                            </div>
                            {expandedDuration && (
                                <div>
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
                <div className="p-2 col-8">
                    {isLoading ? (
                        <Loader
                            color="rgba(46, 46, 46, 1)"
                            size={50}
                            style={{ margin: '20% 50%' }}
                        />
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
                                        <Text lineClamp={1}>
                                            <h3
                                                className="font-weight-700 text-dark"
                                                style={{
                                                    lineHeight: '0.6'
                                                }}
                                            >
                                                {course.courseName}
                                            </h3>
                                        </Text>
                                    </Link>
                                    <Text lineClamp={1}>
                                        <span className="text-dark small">
                                            {course.courseDescription}
                                        </span>
                                    </Text>
                                    <span class="text-dark small">
                                        <b>Chủ đề:</b>{' '}
                                        {course.subject.subjectName}
                                    </span>
                                    <br />
                                    <b>4.0</b>
                                    <span className="ml-2">
                                        <StarIcon
                                            style={{ marginBottom: 3 }}
                                            fontSize="inherit"
                                            color="warning"
                                        />
                                        <StarIcon
                                            style={{ marginBottom: 3 }}
                                            fontSize="inherit"
                                            color="warning"
                                        />
                                        <StarIcon
                                            style={{ marginBottom: 3 }}
                                            fontSize="inherit"
                                            color="warning"
                                        />
                                        <StarIcon
                                            style={{ marginBottom: 3 }}
                                            fontSize="inherit"
                                            color="warning"
                                        />
                                        <StarIcon
                                            style={{ marginBottom: 3 }}
                                            fontSize="inherit"
                                            color="warning"
                                        />
                                        <span class="text-muted small ml-2">
                                            (212)
                                        </span>
                                    </span>
                                    <br />
                                    <Badge
                                        className="p-0"
                                        size="md"
                                        color="pink"
                                        variant="light"
                                    >
                                        Thời lượng: {course.courseDuration}{' '}
                                        (giờ)
                                    </Badge>
                                    <button
                                        type="button"
                                        class="btn"
                                        style={{
                                            backgroundColor: '#a435f0',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderRadius: 0,
                                            float: 'right',
                                            marginTop: 10
                                        }}
                                        onClick={() =>
                                            handleRegistration(course)
                                        }
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                                <div
                                    className="col-lg-2 mb-3 p-0"
                                    style={{ lineHeight: '0.6' }}
                                >
                                    <div
                                        class="d-flex align-items-start flex-column mt-1"
                                        style={{ height: 140 }}
                                    >
                                        <div class="mb-auto w-100">
                                            <b className="float-right text-dark">
                                                {course.coursePrice}
                                                <u>đ</u>
                                            </b>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn w-100"
                                            style={{
                                                backgroundColor: '#172b4d',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                borderRadius: 0,
                                                marginTop: 40
                                            }}
                                            onClick={() =>
                                                handleRegistration(course)
                                            }
                                        >
                                            Đăng ký
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {/* Hiển thị thanh phân trang */}
                    <Pagination
                        total={totalPages}
                        limit={PRODUCTS_PER_PAGE}
                        value={currentPage}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            {/* </Container>{' '} */}
        </>
    )
}

export default CourseClient
