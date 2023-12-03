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
import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'
import moment from 'moment'

import reportApi from 'api/reportApi'
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
import { DateInput } from '@mantine/dates'

import Header from 'components/Headers/Header.js'

const Index = () => {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

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

        const revenueChart = document.getElementById('revenueChart')

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
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row className="mt-5">
                    <Col className="mt-5">
                        <div className="d-flex justify-content-end align-items-center my-5">
                            <h5 className="text-uppercase text-dark mr-4 mt-2 ls-1 mb-2">
                                Bộ lọc theo ngày tháng năm:
                            </h5>
                            <div className="d-flex justify-content-start">
                                <DateInput
                                    placeholder="Ngày bắt đầu"
                                    variant="filled"
                                    mr={10}
                                    clearable
                                    w={320}
                                    value={startDate}
                                    onChange={(value) => setStartDate(value)}
                                />

                                <DateInput
                                    placeholder="Ngày kết thúc"
                                    variant="filled"
                                    clearable
                                    w={320}
                                    value={endDate}
                                    onChange={(value) => setEndDate(value)}
                                />
                            </div>
                        </div>
                        <canvas id="revenueChart" className="w-100 h-100" />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Index
