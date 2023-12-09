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
import { Box, Group, Paper, Space, Title } from '@mantine/core'
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

const Index = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    const [dataForEvaluatioTeacherChart, setDataForEvaluatioTeacherChart] =
        useState([])
    // if (window.Chart) {
    //     parseOptions(Chart, chartOptions())
    // }
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

    // Use Effect
    useEffect(() => {
        fetchRevenue()
    }, [])

    useEffect(() => {
        let totalRevenue = 0
        reportRevenue.forEach((revenue) => {
            totalRevenue += revenue.totalRenueve
        })
        setTotalRevenue(totalRevenue)
    }, [reportRevenue])

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

    const optionsInEvaluationTeacherChart = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        title: {
            display: true,
            text: 'Thời gian giảng dạy của giảng viên'
        }
    }
    const dataInEvaluationTeacherChartByTime = {
        labels: [
            'Rất hay trễ giờ',
            'Nhiều lần trễ giờ',
            'Trễ giờ 1 vài lần',
            'Luôn đi đúng giờ'
        ],
        datasets: [
            {
                label: 'Số lượt đánh giá',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    }

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256) // Tạo giá trị ngẫu nhiên từ 0 đến 255 cho thành phần màu đỏ
        const g = Math.floor(Math.random() * 256) // Tạo giá trị ngẫu nhiên từ 0 đến 255 cho thành phần màu xanh lá cây
        const b = Math.floor(Math.random() * 256) // Tạo giá trị ngẫu nhiên từ 0 đến 255 cho thành phần màu xanh lam

        return `rgb(${r}, ${g}, ${b})` // Trả về chuỗi mã màu RGB
    }

    const groupByClassId = (data) => {
        return data.reduce((acc, currentValue) => {
            const { teacherName } = currentValue
            if (!acc[teacherName]) {
                acc[teacherName] = []
            }
            acc[teacherName].push(currentValue)
            return acc
        }, {})
    }

    const groupByClassIdAndTitle = (data) => {
        return data.reduce((acc, currentValue) => {
            const { teacherName, title } = currentValue
            const key = `${teacherName}_${title}`
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(currentValue)
            return acc
        }, {})
    }
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

            // Kiểm tra xem có ít nhất một ngày trong khoảng không
            return registrationDates.some(
                (date) => (!start || date >= start) && (!end || date <= end)
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
                    registrationDates: course.registrationDates
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
        const filteredData = filterDataByDateRange(startDate, endDate)
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
                            label: 'Tổng số học viên đã nhận chứng chỉ',
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
                            text: 'Thống kê khóa học',
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
    }, [data, startDate, endDate])

    return (
        <>
            {/* Header */}
            <Header totalRevenue={totalRevenue} />
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
                                        {/* <ReportEvaluationTeacher /> */}
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
                                                    <div className="d-flex justify-content-end align-items-center my-5">
                                                        <h5 className="text-uppercase text-dark mr-4 mt-2 ls-1 mb-2">
                                                            Bộ lọc khóa học theo
                                                            ngày tháng năm:
                                                        </h5>
                                                        <div className="d-flex justify-content-start">
                                                            <DateInput
                                                                placeholder="Ngày bắt đầu"
                                                                variant="filled"
                                                                mr={10}
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
