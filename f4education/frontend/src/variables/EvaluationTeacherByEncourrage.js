import { useEffect } from 'react'
import Chart from 'chart.js/auto'

import { formatCurrency } from '../utils/formater'
import { useState } from 'react'

const EvaluationTeacherByEncourrage = ({ data, title }) => {
    console.log(
        '🚀 ~ file: EvaluationTeacherByEncourrage.js:8 ~ EvaluationTeacherByEncourrage ~ data:',
        data.options
    )

    useEffect(() => {
        const EvaluationTeacherByEncourrageChart = document.getElementById(
            'EvaluationTeacherByEncourrageChart'
        )

        if (EvaluationTeacherByEncourrageChart) {
            const myChart = new Chart(EvaluationTeacherByEncourrageChart, {
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
                                'grey',
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
                "Element with id 'EvaluationTeacherByEncourrageChart' not found"
            )
        }
    }, [data])

    return (
        <canvas
            id="EvaluationTeacherByEncourrageChart"
            className="w-100 h-100"
        />
    )
}

export default EvaluationTeacherByEncourrage
