import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'

import reportApi from 'api/reportApi'

const StudentCountChart = () => {
    const [data, setData] = useState([])

    const fetchData = async () => {
        try {
            const resp = await reportApi.getCoursesWithStudentCount()
            if (resp.status === 200) {
                setData(resp.data)
            }
        } catch (error) {
            console.error('Lấy dữ liệu thất bại', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const sortedData = data.sort(
            (a, b) => b.totalRenueve - a.totalRenueve
        )

        const revenueChart = document.getElementById('revenueChart')

        if (revenueChart) {
            const myChart = new Chart(revenueChart, {
                type: 'bar',
                data: {
                    labels: sortedData.map((course) => course.courseName),
                    axis: 'y',
                    datasets: [
                        {
                            label: 'Tổng số học viên đã đăng ký Khóa học',
                            data: sortedData.map(
                                (course) => course.studentCount
                            )
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    plugins: {
                        title: {
                            display: true,
                            text: 'Thống kê doanh thu khóa học',
                            color: '#fff'
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
