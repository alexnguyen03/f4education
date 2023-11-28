import { useEffect } from 'react'
import Chart from 'chart.js/auto'

import { formatCurrency } from '../utils/formater'

const BarChart = ({ data }) => {
    useEffect(() => {
        const sortedData = [...data].sort(
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
                            label: 'Tổng doanh thu Khóa học',
                            data: sortedData.map(
                                (course) => course.totalRenueve
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

            // format currency
            myChart.options.scales.x.ticks.callback = (value) =>
                formatCurrency(value)

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

export default BarChart
