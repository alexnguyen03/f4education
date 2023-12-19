/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useEffect, useState } from 'react'
// node.js library that concatenates classes (strings)
import classnames from 'classnames'
// javascipt plugin for creating charts
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2'
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    NavItem,
    NavLink,
    Nav,
    Progress,
    Table,
    Container,
    Row,
    Col,
    TabPane,
    TabContent
} from 'reactstrap'

// core components
// import {
//     chartOptions,
//     parseOptions,
//     chartExample1,
//     chartExample2
// } from 'variables/charts.js'

// Component import
import Header from 'components/Headers/Header.js'

import evaluateApi from '../api/evaluateApi'
import {
    Alert,
    Box,
    Center,
    Group,
    Loader,
    Paper,
    Space,
    Title
} from '@mantine/core'
import ReportEvaluationTeacher from './admin/ReportEvaluationTeacher'

// API
import courseAPI from '../api/courseApi'
import reportApi from 'api/reportApi'
import { Chart } from 'chart.js'
import { LoadingOverlay } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import moment from 'moment/moment'
import { DateInput, MonthPickerInput, YearPickerInput } from '@mantine/dates'
import BarChart from 'variables/BarChart'
import { IconCalendar, IconRefresh } from '@tabler/icons-react'
import EvaluationTeacherByTime from 'variables/EvaluationTeacherByTime'
import EvaluationTeacherByEncourrage from 'variables/EvaluationTeacherByEncourrage'
import EvaluationTeacherByContent from '../variables/EvaluationTeacherByContent'
import EvaluationTeacherByFairness from 'variables/EvaluationTeacherByFairness'
import { IconAlertCircle } from '@tabler/icons-react'
import Select from 'react-select'
import teacherApi from 'api/teacherApi'

import { CheckUserLogin } from '../utils/formater'
import { useNavigate } from 'react-router-dom'
import accountApi from 'api/accountApi'
import registerCourseApi from 'api/registerCourseApi'
import certificateApi from 'api/certificateApi'

const Index = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    let navigate = useNavigate()

    const [totalStudent, setTotalStudent] = useState(0)
    const [totalCertificate, setTotalCertificate] = useState(0)
    const [totalRegister, setTotalRegister] = useState(0)
    const [dataForEvaluatioTeacherChart, setDataForEvaluatioTeacherChart] =
        useState([])

    // Evaluation Teacher Chart vars start
    const [loadingChart, setLoadingChart] = useState(false)
    const [listTeacher, setListTeacher] = useState([])
    const [notHasReport, setNotHasReport] = useState(false)
    const [allEvaluationReport, setAllEvaluationReport] = useState([])

    const [dataArray, setDataArray] = useState([
        {
            title: 'Giảng viên có khuyến khích sáng tạo và tư duy độc lập từ học viên',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Không có, không bao giờ nhắc đến'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Có, rất khuyết khích'
                }
            ]
        },
        {
            title: 'Nội dung và phương pháp giảng dạy',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Rất không tốt'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Không tốt'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Tốt'
                },
                {
                    value: 4,
                    totalVoteItem: 0,
                    label: 'Xuất sắc'
                }
            ]
        },
        {
            title: 'Sự công bằng của giảng viên trong kiểm tra đánh giá quá trình và đánh giá kết quả học tập',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Rất không công bằng'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Đôi lúc còn thiên vị'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Rất công bằng'
                }
            ]
        },
        {
            title: 'Thời gian giảng dạy của giảng viên',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: ' Rất hay trễ giờ'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Nhiều lần trễ giờ'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Trễ giờ 1 vài lần'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Luôn đi đúng giờ'
                }
            ]
        }
    ])

    const getAllRegisterCourse = async () => {
        try {
            const resp = await registerCourseApi.getAllRegisterCourse()
            console.log(
                '🚀 ~ file: ClassDetail.js:171 ~ getAllStudentInCourse ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setTotalRegister(resp.data.data.length)
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:74 ~ getRegisterCourse ~ error:',
                error
            )
        }
    }
    const getAllCertificate = async () => {
        try {
            setLoading(true)

            const resp = await certificateApi.getAllCertificate()
            console.log(
                '🚀 ~ file: Index.js:230 ~ getAllCertificate ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setTotalCertificate(resp.data.length)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getAllTeachers = async () => {
        try {
            const resp = await teacherApi.getAllTeachers()
            console.log(
                '🚀 ~ file: ClassDetail.js:162 ~ getAllTeachers ~ resp:',
                resp
            )

            if (resp.status === 200 && resp.data.length > 0) {
                setListTeacher(
                    resp.data.map((item) => {
                        const { fullname, teacherId, image, gender } = {
                            ...item
                        }
                        return {
                            value: teacherId,
                            label: fullname + ' - ' + teacherId,
                            image: image
                        }
                    })
                )
                setListTeacher((prev) => [
                    {
                        value: 'all',
                        label: 'Xem tất cả',
                        image: ''
                    },
                    ...prev
                ])
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:109 ~ getAllTeachers ~ error:',
                error
            )
        }
    }
    const getAllReportEvaluationTeacher = async () => {
        try {
            const newData = dataArray.map((item) => {
                const newOptions = item.options.map((option) => ({
                    ...option,
                    totalVoteItem: 0
                }))

                return {
                    ...item,
                    options: newOptions
                }
            })
            setDataArray(newData)
            const resp = await evaluateApi.getAllReportEvaluationTeacher()
            console.log(
                '🚀 ~ file: Index.js:70 ~ getAllReportEvaluationTeacher ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setAllEvaluationReport(resp.data)
                const updatedData = resp.data.map((item1) => {
                    const foundItem = newData.find(
                        (item2) => item2.title === item1.title
                    )

                    if (foundItem) {
                        const updatedOptions = foundItem.options.map(
                            (option) => {
                                if (option.value === item1.voteValue) {
                                    return {
                                        ...option,
                                        totalVoteItem: item1.voteCount
                                    }
                                }
                                return option
                            }
                        )

                        return {
                            ...foundItem,
                            totalVote: foundItem.totalVote + item1.voteCount,
                            options: updatedOptions
                        }
                    }
                    return item1
                })

                const groupedByTitle = updatedData.reduce((acc, obj) => {
                    const key = obj.title
                    if (!acc[key]) {
                        acc[key] = {
                            title: obj.title,
                            totalVote: 0,
                            options: []
                        }
                    }

                    acc[key].totalVote += obj.totalVote

                    obj.options.forEach((opt) => {
                        const existingOption = acc[key].options.find(
                            (o) => o.value === opt.value
                        )
                        if (existingOption) {
                            existingOption.totalVoteItem += opt.totalVoteItem
                        } else {
                            acc[key].options.push({
                                value: opt.value,
                                totalVoteItem: opt.totalVoteItem,
                                label: opt.label
                            })
                        }
                    })

                    return acc
                }, {})

                const result = Object.values(groupedByTitle)

                setDataArray(result)
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: Index.js:70 ~ getAllReportEvaluationTeacher ~ error:',
                error
            )
        }
    }

    const handleOnChangeTeacher = (val) => {
        const { value } = { ...val } //value là teacherId
        const newData = dataArray.map((item) => {
            const newOptions = item.options.map((option) => ({
                ...option,
                totalVoteItem: 0
            }))

            return {
                ...item,
                options: newOptions
            }
        })
        setDataArray(newData)
        if (value === 'all') {
            getAllReportEvaluationTeacher()
        } else {
            const groupByTeacherName = (dataArray) => {
                const groupedData = {}

                dataArray.forEach((item) => {
                    const { teacherId } = item
                    if (!groupedData[teacherId]) {
                        groupedData[teacherId] = []
                    }
                    groupedData[teacherId].push(item)
                })

                return groupedData
            }

            const groupedData = groupByTeacherName(allEvaluationReport)

            console.log(groupedData)

            const filteredData = groupedData[value] || []

            console.log(filteredData)
            const foundTeacher = filteredData.find(
                (item) => item.teacherId === value
            )
            console.log(
                '🚀 ~ file: ReportEvaluationTeacher.js:219 ~ handleOnChangeTeacher ~ foundTeacher:',
                foundTeacher
            )

            if (foundTeacher) {
                const updatedData = filteredData.map((item1) => {
                    const foundItem = newData.find(
                        (item2) => item2.title === item1.title
                    )

                    if (foundItem) {
                        const updatedOptions = foundItem.options.map(
                            (option) => {
                                if (option.value === item1.voteValue) {
                                    return {
                                        ...option,
                                        totalVoteItem: item1.voteCount
                                    }
                                }
                                return option
                            }
                        )

                        return {
                            ...foundItem,
                            totalVote: foundItem.totalVote + item1.voteCount,
                            options: updatedOptions
                        }
                    }
                    return item1
                })

                const groupedByTitle = updatedData.reduce((acc, obj) => {
                    const key = obj.title
                    if (!acc[key]) {
                        acc[key] = {
                            title: obj.title,
                            totalVote: 0,
                            options: []
                        }
                    }

                    acc[key].totalVote += obj.totalVote

                    obj.options.forEach((opt) => {
                        const existingOption = acc[key].options.find(
                            (o) => o.value === opt.value
                        )
                        if (existingOption) {
                            existingOption.totalVoteItem += opt.totalVoteItem
                        } else {
                            acc[key].options.push({
                                value: opt.value,
                                totalVoteItem: opt.totalVoteItem,
                                label: opt.label
                            })
                        }
                    })

                    return acc
                }, {})

                const result = Object.values(groupedByTitle)

                setDataArray(result)

                setNotHasReport(false)
            } else {
                setNotHasReport(true)
            }
        }
    }

    // Evaluation Teacher Chart vars end

    const [tabs, setTabs] = useState(2)
    // Main Variable
    // Revenue Start
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [reportRevenue, setReportRevenue] = useState([])

    // Action
    const [loading, setLoading] = useState(false)
    const [visible] = useDisclosure(true)

    // Filter
    const [filteredRevenueData, setFilteredRevenueData] =
        useState(reportRevenue)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [monthFilter, setMonthFilter] = useState(null)
    const [yearFilter, setYearFilter] = useState(null)
    // Revenue End

    // Fetch Area
    const fetchRevenue = async () => {
        try {
            setLoading(true)

            const resp = await courseAPI.getTopSellingCourse('')

            if (resp.status === 200) {
                console.log(resp.data)
                setReportRevenue(resp.data)
                setFilteredRevenueData(resp.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const fetchRevenueHeader = async () => {
        try {
            setLoading(true)

            const resp = await courseAPI.getRevenueSoldCourse()

            if (resp.status === 200) {
                console.log(resp.data)

                let totalRevenue = 0
                resp.data.forEach((revenue) => {
                    totalRevenue += revenue.totalRenueve
                })

                console.log(totalRevenue)

                setTotalRevenue(totalRevenue)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const filterDataByWeek = (data, week) => {
        return data.filter((item) => moment(item.createDate).isoWeek() === week)
    }

    const filterDataByMonth = (data, month) => {
        return data.filter(
            (item) => moment(item.createDate).month() + 1 === month
        )
    }

    const handleResetFilter = () => {
        setFilteredRevenueData(reportRevenue)
        setStartDate(null)
        setEndDate(null)
        setMonthFilter(null)
        setYearFilter(null)
    }

    const handleResetFilterCourse = () => {
        setStartDateCourse(null)
        setEndDateCourse(null)
    }

    const getAllStudent = async () => {
        try {
            const resp = await accountApi.getAllAccountsByRole(1)
            console.log(
                '🚀 ~ file: Accounts.js:1226 ~ getAllStudent ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setTotalStudent(resp.data.length)
            }
        } catch (error) {
            console.log('failed to load data', error)
        }
    }

    // Use Effect
    useEffect(() => {
        fetchRevenue()
        fetchRevenueHeader()
        getAllReportEvaluationTeacher()
        getAllTeachers()
        getAllStudent()
        getAllRegisterCourse()
        getAllCertificate()
    }, [])

    // useEffect(() => {
    //     let totalRevenue = 0
    //     reportRevenue.forEach((revenue) => {
    //         totalRevenue += revenue.totalRenueve
    //     })
    //     setTotalRevenue(totalRevenue)
    // }, [reportRevenue])

    useEffect(() => {
        setFilteredRevenueData(
            reportRevenue.filter((course) => {
                const courseDate = new Date(course.createDate)
                return (
                    (!startDate || courseDate >= startDate) &&
                    (!endDate || courseDate <= endDate)
                )
            })
        )
    }, [startDate, endDate, reportRevenue])

    useEffect(() => {
        if (monthFilter !== null) {
            const newData = reportRevenue.filter(
                (item) =>
                    moment(item.createDate).month() + 1 ===
                    monthFilter.getMonth() + 1
            )
            setFilteredRevenueData(newData)
        }
    }, [monthFilter, reportRevenue])

    useEffect(() => {
        if (yearFilter !== null) {
            const newData = reportRevenue.filter(
                (item) =>
                    moment(item.createDate).year() === yearFilter.getFullYear()
            )
            console.log(newData)
            console.log(yearFilter.getFullYear())
            setFilteredRevenueData(newData)
        }
    }, [yearFilter, reportRevenue])

    // Templates Variable
    const [activeNav, setActiveNav] = useState(1)

    const toggleNavs = (e, index) => {
        e.preventDefault()

        if (index === 1) {
            // Show data for the current month
            setFilteredRevenueData(
                filterDataByMonth(reportRevenue, moment().month() + 1)
            )
        } else if (index === 2) {
            // Show data for the current week
            setFilteredRevenueData(
                filterDataByWeek(reportRevenue, moment().isoWeek())
            )
        }

        setActiveNav(index)
    }

    // Thống kê khóa học
    const [startDateCourse, setStartDateCourse] = useState(null)
    const [endDateCourse, setEndDateCourse] = useState(null)

    const [data, setData] = useState([])

    const toggleNavsInEvaluateTeacher = (e, state, index) => {
        e.preventDefault()
        setTabs(index)
    }
    //! Evauluation Teacher

    // Thêm state mới để lưu trữ dữ liệu gốc không thay đổi
    const [originalData, setOriginalData] = useState([])

    // Hàm lọc dữ liệu theo ngày bắt đầu và kết thúc
    const filterDataByDateRange = (start, end) => {
        if (!start && !end) {
            // Nếu không có ngày bắt đầu và kết thúc, trả về dữ liệu gốc
            return originalData
        }

        return originalData.filter((course) => {
            const registrationDates = course.registrationDates.map(
                (date) => new Date(date)
            )

            const certificateDate = new Date(course.certificateDate)
            const isDateInRange = (certificateDate, start, end) =>
                (!start || certificateDate >= start) &&
                (!end || certificateDate <= end)

            // Kiểm tra xem có ít nhất một ngày trong khoảng không
            return registrationDates.some(
                (date) =>
                    ((!start || date >= start) && (!end || date <= end)) ||
                    isDateInRange(certificateDate, start, end)
            )
        })
    }

    const mergeData = (studentCountData, studentCountCertificateData) => {
        return studentCountData.map((course) => {
            const matchingCertificateCourse = studentCountCertificateData.find(
                (certCourse) => certCourse.courseName === course.courseName
            )

            if (matchingCertificateCourse) {
                return {
                    courseName: course.courseName,
                    studentCount: course.studentCount,
                    certificateCount:
                        matchingCertificateCourse.certificateCount,
                    registrationDates: course.registrationDates,
                    certificateDate: matchingCertificateCourse.certificateDate
                }
            }

            return course
        })
    }

    const fetchData = async () => {
        try {
            const respStudentCount =
                await reportApi.getCoursesWithStudentCount()
            const respStudentCountCertificate =
                await reportApi.getCoursesWithStudentCountCertificate()
            if (
                respStudentCount.status === 200 &&
                respStudentCountCertificate.status === 200
            ) {
                const combinedData = mergeData(
                    respStudentCount.data,
                    respStudentCountCertificate.data
                )
                console.log(combinedData)
                // Lưu trữ dữ liệu gốc và cập nhật dữ liệu hiển thị
                setOriginalData(combinedData)
                setData(combinedData)
            }
        } catch (error) {
            console.error('Lấy dữ liệu thất bại', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // Lọc dữ liệu dựa trên ngày bắt đầu và kết thúc
        const filteredData = filterDataByDateRange(
            startDateCourse,
            endDateCourse
        )
        console.log(filteredData)

        // Chắc chắn rằng sortedData không null hoặc undefined
        const sortedData = filteredData
            ? filteredData.sort((a, b) => b.totalRenueve - a.totalRenueve)
            : []

        const revenueChart = document.getElementById('revenueChartCourse')

        if (revenueChart) {
            const myChart = new Chart(revenueChart, {
                type: 'bar',
                data: {
                    labels: sortedData.map((course) => course.courseName),
                    datasets: [
                        {
                            label: 'Tổng số học viên đã đăng ký Khóa học',
                            data: sortedData.map(
                                (course) => course.studentCount
                            ),
                            backgroundColor: '#00CCCC'
                        },
                        {
                            label: 'Tổng số học viên đã nhận chứng nhận',
                            data: sortedData.map(
                                (course) => course.certificateCount
                            ),
                            backgroundColor: 'lime'
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    plugins: {
                        title: {
                            display: true,
                            text: 'Thống kê số học viên đã đăng ký Khóa học và đã nhận chứng nhận',
                            color: 'black'
                        }
                    },
                    layout: {
                        autoPadding: true
                    }
                }
            })

            return () => {
                myChart.destroy()
            }
        } else {
            console.error("Element with id 'revenueChart' not found")
        }
    }, [data, startDateCourse, endDateCourse])

    useEffect(() => {
        const checkLogin = CheckUserLogin(user)
        console.log(checkLogin)

        if (!checkLogin) {
            return navigate('/auth/login')
        }
    }, [])

    return (
        <>
            {/* Header */}
            <Header
                totalRevenue={totalRevenue}
                totalStudent={totalStudent}
                totalRegister={totalRegister}
                totalCertificate={totalCertificate}
            />
            {/* Header End*/}

            {/* Page content */}
            <Container className="mt--7" fluid>
                <Card className="shadow">
                    <CardBody>
                        <div className="nav-wrapper">
                            <Nav
                                className="nav-fill flex-column flex-md-row"
                                id="tabs-icons-text"
                                pills
                                role="tablist"
                            >
                                <NavItem>
                                    <NavLink
                                        aria-selected={tabs === 1}
                                        className={classnames(
                                            'mb-sm-3 mb-md-0',
                                            {
                                                active: tabs === 1
                                            }
                                        )}
                                        onClick={(e) =>
                                            toggleNavsInEvaluateTeacher(
                                                e,
                                                'tabs',
                                                1
                                            )
                                        }
                                        href="#pablo"
                                        role="tab"
                                    >
                                        <i className="ni ni-cloud-upload-96 mr-2" />
                                        Đánh giá Giáo Viên
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        aria-selected={tabs === 2}
                                        className={classnames(
                                            'mb-sm-3 mb-md-0',
                                            {
                                                active: tabs === 2
                                            }
                                        )}
                                        onClick={(e) =>
                                            toggleNavsInEvaluateTeacher(
                                                e,
                                                'tabs',
                                                2
                                            )
                                        }
                                        href="#pablo"
                                        role="tab"
                                    >
                                        <i className="ni ni-bell-55 mr-2" />
                                        Thông kê doanh thu
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        aria-selected={tabs === 3}
                                        className={classnames(
                                            'mb-sm-3 mb-md-0',
                                            {
                                                active: tabs === 3
                                            }
                                        )}
                                        onClick={(e) =>
                                            toggleNavsInEvaluateTeacher(
                                                e,
                                                'tabs',
                                                3
                                            )
                                        }
                                        href="#pablo"
                                        role="tab"
                                    >
                                        <i className="ni ni-calendar-grid-58 mr-2" />
                                        Thống kê khóa học
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                        <Card className="shadow">
                            <CardBody>
                                <TabContent activeTab={'tabs' + tabs}>
                                    <TabPane tabId="tabs1">
                                        <Select
                                            options={listTeacher}
                                            placeholder="Chọn giáo viên"
                                            onChange={(val) => {
                                                handleOnChangeTeacher(val)
                                            }}
                                            isSearchable={true}
                                            className="form-control-alternative mb-3 "
                                            styles={{ outline: 'none' }}
                                        />
                                        {loadingChart ? (
                                            <Center mt={'lg'}>
                                                <Loader
                                                    visibility={loadingChart}
                                                />{' '}
                                            </Center>
                                        ) : null}

                                        {notHasReport && !loadingChart ? (
                                            <div style={{ minHeight: '70vh' }}>
                                                <Alert
                                                    mt={'lg'}
                                                    icon={
                                                        <IconAlertCircle size="1rem" />
                                                    }
                                                    title="Thông báo!"
                                                    color="lime"
                                                >
                                                    Giáo viên chưa có đánh giá
                                                </Alert>
                                            </div>
                                        ) : null}
                                        {/* <ReportEvaluationTeacher /> */}

                                        {loadingChart || notHasReport ? null : (
                                            <>
                                                <EvaluationTeacherByEncourrage
                                                    data={dataArray[0]}
                                                    title={dataArray[0].title}
                                                />
                                                <EvaluationTeacherByContent
                                                    data={dataArray[1]}
                                                    title={dataArray[1].title}
                                                />
                                                <EvaluationTeacherByFairness
                                                    data={dataArray[2]}
                                                    title={dataArray[2].title}
                                                />
                                                <EvaluationTeacherByTime
                                                    data={dataArray[3]}
                                                    title={dataArray[3].title}
                                                />
                                            </>
                                        )}
                                    </TabPane>
                                    <TabPane tabId="tabs2">
                                        <div
                                            style={{
                                                minHeight: '70vh'
                                            }}
                                        >
                                            <Row className="align-items-center">
                                                <div className="col">
                                                    <h4 className="text-uppercase text-dark ls-1 mb-1">
                                                        Tổng quan
                                                    </h4>
                                                    <h1 className="text-dark mb-0">
                                                        Top 10 khóa học theo
                                                        doanh thu
                                                    </h1>
                                                </div>
                                                <div className="col">
                                                    <Nav
                                                        className="justify-content-end"
                                                        pills
                                                    >
                                                        <NavItem>
                                                            <NavLink
                                                                className="py-2 px-3"
                                                                onClick={() => {
                                                                    handleResetFilter()
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <span className="d-none d-md-block fw-500">
                                                                    <IconRefresh />
                                                                </span>
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames(
                                                                    'py-2 px-3',
                                                                    {
                                                                        active:
                                                                            activeNav ===
                                                                            1
                                                                    }
                                                                )}
                                                                href="#pablo"
                                                                onClick={(e) =>
                                                                    toggleNavs(
                                                                        e,
                                                                        1
                                                                    )
                                                                }
                                                            >
                                                                <span className="d-none d-md-block fw-500">
                                                                    Theo tháng
                                                                    hiện tại
                                                                </span>
                                                                <span className="d-md-none">
                                                                    M
                                                                </span>
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames(
                                                                    'py-2 px-3',
                                                                    {
                                                                        active:
                                                                            activeNav ===
                                                                            2
                                                                    }
                                                                )}
                                                                data-toggle="tab"
                                                                href="#pablo"
                                                                onClick={(e) =>
                                                                    toggleNavs(
                                                                        e,
                                                                        2
                                                                    )
                                                                }
                                                            >
                                                                <span className="d-none d-md-block fw-500">
                                                                    Theo tuần
                                                                    hiện tại
                                                                </span>
                                                                <span className="d-md-none">
                                                                    W
                                                                </span>
                                                            </NavLink>
                                                        </NavItem>
                                                    </Nav>
                                                </div>
                                            </Row>

                                            <div className="row mt-3">
                                                <div className="col mb-4">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex justify-content-start">
                                                            <MonthPickerInput
                                                                icon={
                                                                    <IconCalendar
                                                                        size="1.1rem"
                                                                        stroke={
                                                                            1.5
                                                                        }
                                                                    />
                                                                }
                                                                label="Chọn tháng thống kê"
                                                                placeholder="Chọn tháng thống kê"
                                                                value={
                                                                    monthFilter
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setMonthFilter(
                                                                        value
                                                                    )
                                                                }
                                                                w={250}
                                                                clearable
                                                            />
                                                            <YearPickerInput
                                                                icon={
                                                                    <IconCalendar
                                                                        size="1.1rem"
                                                                        stroke={
                                                                            1.5
                                                                        }
                                                                    />
                                                                }
                                                                label="Chọn năm thống kê"
                                                                placeholder="Chọn năm thống kê"
                                                                value={
                                                                    yearFilter
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setYearFilter(
                                                                        value
                                                                    )
                                                                }
                                                                w={250}
                                                                ml={20}
                                                                clearable
                                                            />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-uppercase text-dark mr-4 mt-2 ls-1 mb-2">
                                                                Bộ lọc theo ngày
                                                                tháng:
                                                            </h5>
                                                            <div className="d-flex justify-content-start">
                                                                <DateInput
                                                                    placeholder="Ngày bắt đầu"
                                                                    variant="filled"
                                                                    mr={10}
                                                                    clearable
                                                                    w={320}
                                                                    value={
                                                                        startDate
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        setStartDate(
                                                                            value
                                                                        )
                                                                    }
                                                                />

                                                                <DateInput
                                                                    placeholder="Ngày kết thúc"
                                                                    variant="filled"
                                                                    clearable
                                                                    w={320}
                                                                    value={
                                                                        endDate
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        setEndDate(
                                                                            value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {loading ? (
                                                <LoadingOverlay
                                                    visible={visible}
                                                    overlayOpacity={1}
                                                    overlayBlur={2}
                                                    overlayColor="#191c4d"
                                                    // overlayColor="rgba(0, 0, 0, 0.3)"
                                                />
                                            ) : (
                                                /* Chart */
                                                <BarChart
                                                    data={filteredRevenueData}
                                                />
                                            )}
                                        </div>
                                    </TabPane>
                                    <TabPane tabId="tabs3">
                                        <Container className="mt--7" fluid>
                                            <Row className="mt-5">
                                                <Col className="mt-5">
                                                    <div className="mt-3 mb-5">
                                                        <h5 className="text-uppercase text-dark mr-4 mt-2 ls-1 mb-2">
                                                            Bộ lọc khóa học theo
                                                            ngày tháng năm:
                                                        </h5>
                                                        <div className="d-flex justify-content-start">
                                                            <Button
                                                                size={'md'}
                                                                onClick={() => {
                                                                    handleResetFilterCourse()
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <IconRefresh
                                                                    size={25}
                                                                />
                                                            </Button>
                                                            <DateInput
                                                                placeholder="Ngày bắt đầu"
                                                                variant="filled"
                                                                mr={10}
                                                                ml={10}
                                                                size={'md'}
                                                                clearable
                                                                w={320}
                                                                value={
                                                                    startDateCourse
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setStartDateCourse(
                                                                        value
                                                                    )
                                                                }
                                                            />

                                                            <DateInput
                                                                placeholder="Ngày kết thúc"
                                                                variant="filled"
                                                                clearable
                                                                size={'md'}
                                                                w={320}
                                                                value={
                                                                    endDateCourse
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setEndDateCourse(
                                                                        value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <canvas
                                                        id="revenueChartCourse"
                                                        // className="w-100 h-100"
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </Container>
            {/* Page content End*/}
        </>
    )
}

export default Index
