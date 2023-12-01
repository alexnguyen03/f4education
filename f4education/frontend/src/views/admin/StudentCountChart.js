import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'

import reportApi from 'api/reportApi'

const StudentCountChart = () => {
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
                    certificateCount: matchingCertificateCourse.certificateCount,
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
                setData(combinedData)
                console.log(combinedData);
            }
        } catch (error) {
            console.error('Lấy dữ liệu thất bại', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                            barThickness: 25,
                            backgroundColor: '#00CCCC'
                        },
                        {
                            label: 'Tổng số học viên đã nhận chứng chỉ',
                            data: sortedData.map(
                                (course) => course.certificateCount
                            ),
                            barThickness: 25,
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
        <div className="w-100 h-100">
            <canvas id="revenueChart" className="w-100 h-100" />
        </div>
    )
}

export default StudentCountChart
