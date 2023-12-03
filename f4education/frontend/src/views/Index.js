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

    const mergeData = (studentCountData, studentCountCertificateData) => {
        return studentCountData.map((course) => {
            const matchingCertificateCourse = studentCountCertificateData.find(
                (certCourse) => certCourse.courseName === course.courseName
            )

            if (matchingCertificateCourse) {
                return {
                    courseName: course.courseName,
                    studentCount: course.studentCount,
                    certificateCount: matchingCertificateCourse.certificateCount
                }
            }

            return course
        })
    }

    const fetchData = async () => {
        try {
            const respStudentCount = await reportApi.getCoursesWithStudentCount(
                startDate,
                endDate
            )
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
                setData(combinedData)
            }
        } catch (error) {
            console.error('Lấy dữ liệu thất bại', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [startDate, endDate])

    useEffect(() => {
        const sortedData = data.sort((a, b) => b.totalRenueve - a.totalRenueve)

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
    }, [data])

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row className="mt-5">
                    <Col className="mt-5">
                        <div className="d-flex justify-content-start mt-5">
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
                        <div className="w-100 h-100">
                            <canvas id="revenueChart" className="w-100 h-100" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Index
