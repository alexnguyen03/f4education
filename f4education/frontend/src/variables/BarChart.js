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
                    datasets: [
                        {
                            label: 'Thống kê doanh thu khóa học',
                            data: sortedData.map(
                                (course) => course.totalRenueve
                            )
                        }
                    ]
                }
            })

            // format currency
            myChart.options.scales.y.ticks.callback = (value) =>
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
            <canvas id="revenueChart"></canvas>
        </div>
    )
}

export default BarChart

// const chartData = {
//     labels: sortedData.map((course) => course.courseName),
//     datasets: [
//         {
//             label: 'Tổng doanh thu',
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1,
//             data: sortedData.map((course) => course.totalRenueve)
//         }
//     ]
// }

// const chartOptions = {
//     scales: {
//         x: { title: { display: true, text: 'Khóa học' } },
//         y: {
//             title: { display: true, text: 'Tổng doanh thu' },
//             // ticks: {
//             //     callback: (value) => formatCurrency(value / 1000)
//             // }
//             ticks: {
//                 callback: (value) => `${value / 1000} đ`
//             }
//         }
//     },
//     scaleLabel: function (label) {
//         return (
//             '$' +
//             label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//         )
//     }
// }

// const myChart = new Chart(chartRef.current, {
//     type: 'bar',
//     data: chartData,
//     options: chartOptions
// })
