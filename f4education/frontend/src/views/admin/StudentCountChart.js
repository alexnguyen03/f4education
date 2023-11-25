import React, { useEffect, useState } from 'react'
import { HorizontalBar } from 'react-chartjs-2'

import reportApi from 'api/reportApi'

const StudentCountChart = () => {
    const [chartData, setChartData] = useState({})

    const fetchData = async () => {
        try {
            const resp = await reportApi.getCoursesWithStudentCount()
            if (resp.status === 200) {
                const formattedData = resp.data.map((item) => ({
                    label: item.courseName,
                    data: [item.studentCount]
                }))
                setChartData({
                    labels: formattedData.map((item) => item.label),
                    datasets: [
                        {
                            label: 'Số lượng học viên',
                            data: formattedData.map((item) => item.data[0]),
                            borderWidth: 1,
                        }
                    ]
                })
            }
        } catch (error) {
            console.error('Lấy dữ liệu thất bại', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const options = {
        indexAxis: 'y', 
        scales: {
            y: {
                beginAtZero: true,
                stepSize: 2
            }
        }
    }

    return (
        <div style={{ width: 600, height: 500, margin: "auto" }}>
             <h2>THỐNG KÊ SỐ LƯỢNG HỌC VIÊN ĐÃ ĐĂNG KÝ KHÓA HỌC</h2>
            <HorizontalBar data={chartData} options={options} />
        </div>
    )
}

export default StudentCountChart