import { useEffect } from 'react'
import Chart from 'chart.js/auto'

import { formatCurrency } from '../utils/formater'
import { useState } from 'react'

const EvaluationTeacherByTime = ({ data, title }) => {
    console.log(
        '🚀 ~ file: EvaluationTeacherByTime.js:8 ~ EvaluationTeacherByTime ~ data:',
        data.options
    )

    useEffect(() => {
        const evaluationTeacherByTimeChart = document.getElementById(
            'evaluationTeacherByTimeChart'
        )

        if (evaluationTeacherByTimeChart) {
            const myChart = new Chart(evaluationTeacherByTimeChart, {
                type: 'bar',
                data: {
                    labels: data.options.map((item) => item.label),
                    axis: 'x',
                    datasets: [
                        {
                            label: 'Số lượt đánh giá',
                            data: data.options.map(
                                (item) => item.totalVoteItem
                            ),
                            backgroundColor: [
                                '#f03e3e',
                                '#f59f00',
                                '#1098ad',
                                '#37b24d'
                            ]
                        }
                    ]
                },
                options: {
                    indexAxis: 'x',
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                            color: '#000'
                        }
                    },
                    layout: {
                        autoPadding: true
                    }
                }
            })

            // format currency
            // myChart.options.scales.x.ticks.callback = (value) =>
            //     formatCurrency(value)

            return () => {
                myChart.destroy()
            }
        } else {
            console.error(
                "Element with id 'evaluationTeacherByTimeChart' not found"
            )
        }
    }, [data])

    return <canvas id="evaluationTeacherByTimeChart" className="w-100 h-100" />
}

export default EvaluationTeacherByTime
