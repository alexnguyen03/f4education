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
// import Chart from 'chart.js'
// react plugin used to create charts
// import { Line, Bar } from 'react-chartjs-2'
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
    Col
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
import BarChart from 'variables/BarChart'

// API
import courseAPI from '../api/courseApi'
import reportApi from 'api/reportApi'
import { Chart } from 'chart.js'
import { LoadingOverlay } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import moment from 'moment/moment'
import { DateInput } from '@mantine/dates'

const Index = () => {
    const user = JSON.parse(localStorage.getItem('user'))

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
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        {loading ? (
                            <LoadingOverlay
                                visible={visible}
                                overlayOpacity={1}
                                overlayBlur={2}
                                overlayColor="#191c4d"
                            />
                        ) : (
                            <Card className="shadow">
                                <CardHeader>
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h4 className="text-uppercase text-dark ls-1 mb-1">
                                                Tổng quan
                                            </h4>
                                            <h1 className="text-dark mb-0">
                                                Top 10 khóa học theo doanh thu
                                            </h1>
                                        </div>
                                        <div className="col">
                                            <Nav
                                                className="justify-content-end"
                                                pills
                                            >
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
                                                            toggleNavs(e, 1)
                                                        }
                                                    >
                                                        <span className="d-none d-md-block fw-500">
                                                            Theo tháng hiện tại
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
                                                            toggleNavs(e, 2)
                                                        }
                                                    >
                                                        <span className="d-none d-md-block fw-500">
                                                            Theo tuần hiện tại
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
                                        <div className="col">
                                            <div className="d-flex justify-content-end align-items-center">
                                                <h5 className="text-uppercase text-dark mr-4 mt-2 ls-1 mb-2">
                                                    Bộ lọc theo ngày tháng:
                                                </h5>
                                                <div className="d-flex justify-content-start">
                                                    <DateInput
                                                        placeholder="Ngày bắt đầu"
                                                        variant="filled"
                                                        mr={10}
                                                        clearable
                                                        w={320}
                                                        value={startDate}
                                                        onChange={(value) =>
                                                            setStartDate(value)
                                                        }
                                                    />

                                                    <DateInput
                                                        placeholder="Ngày kết thúc"
                                                        variant="filled"
                                                        clearable
                                                        w={320}
                                                        value={endDate}
                                                        onChange={(value) =>
                                                            setEndDate(value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    {/* Chart */}
                                    <BarChart data={filteredRevenueData} />
                                </CardBody>
                            </Card>
                        )}
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" xl="8">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Page visits</h3>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}
                                            size="sm"
                                        >
                                            See all
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table
                                className="align-items-center table-flush"
                                responsive
                            >
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Page name</th>
                                        <th scope="col">Visitors</th>
                                        <th scope="col">Unique users</th>
                                        <th scope="col">Bounce rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">/argon/</th>
                                        <td>4,569</td>
                                        <td>340</td>
                                        <td>
                                            <i className="fas fa-arrow-up text-success mr-3" />{' '}
                                            46,53%
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">/argon/index.html</th>
                                        <td>3,985</td>
                                        <td>319</td>
                                        <td>
                                            <i className="fas fa-arrow-down text-warning mr-3" />{' '}
                                            46,53%
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">/argon/charts.html</th>
                                        <td>3,513</td>
                                        <td>294</td>
                                        <td>
                                            <i className="fas fa-arrow-down text-warning mr-3" />{' '}
                                            36,49%
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">/argon/tables.html</th>
                                        <td>2,050</td>
                                        <td>147</td>
                                        <td>
                                            <i className="fas fa-arrow-up text-success mr-3" />{' '}
                                            50,87%
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">/argon/profile.html</th>
                                        <td>1,795</td>
                                        <td>190</td>
                                        <td>
                                            <i className="fas fa-arrow-down text-danger mr-3" />{' '}
                                            46,53%
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col xl="4">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Social traffic</h3>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}
                                            size="sm"
                                        >
                                            See all
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table
                                className="align-items-center table-flush"
                                responsive
                            >
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Referral</th>
                                        <th scope="col">Visitors</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Facebook</th>
                                        <td>1,480</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">
                                                    60%
                                                </span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value="60"
                                                        barClassName="bg-gradient-danger"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Facebook</th>
                                        <td>5,480</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">
                                                    70%
                                                </span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value="70"
                                                        barClassName="bg-gradient-success"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Google</th>
                                        <td>4,807</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">
                                                    80%
                                                </span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value="80"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Instagram</th>
                                        <td>3,678</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">
                                                    75%
                                                </span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value="75"
                                                        barClassName="bg-gradient-info"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">twitter</th>
                                        <td>2,645</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">
                                                    30%
                                                </span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value="30"
                                                        barClassName="bg-gradient-warning"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* Page content End*/}
            <Container className="mt--7" fluid>
                <Row className="mt-5">
                    <Col className="mt-5">
                        <div className="d-flex justify-content-end align-items-center my-5">
                            <h5 className="text-uppercase text-dark mr-4 mt-2 ls-1 mb-2">
                                Bộ lọc khóa học theo ngày tháng năm:
                            </h5>
                            <div className="d-flex justify-content-start">
                                <DateInput
                                    placeholder="Ngày bắt đầu"
                                    variant="filled"
                                    mr={10}
                                    clearable
                                    w={320}
                                    value={startDateCourse}
                                    onChange={(value) => setStartDateCourse(value)}
                                />

                                <DateInput
                                    placeholder="Ngày kết thúc"
                                    variant="filled"
                                    clearable
                                    w={320}
                                    value={endDateCourse}
                                    onChange={(value) => setEndDateCourse(value)}
                                />
                            </div>
                        </div>
                        <canvas id="revenueChartCourse" className="w-100 h-100" />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Index
