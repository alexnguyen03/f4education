import { useEffect } from 'react'
import Chart from 'chart.js/auto'

import { formatCurrency } from '../utils/formater'
import { useState } from 'react'

const EvaluationTeacherByContent = ({ data, title }) => {
    console.log(
        '🚀 ~ file: EvaluationTeacherByContent.js:8 ~ EvaluationTeacherByContent ~ data:',
        data.options
    )

    useEffect(() => {
        const EvaluationTeacherByContentChart = document.getElementById(
            'EvaluationTeacherByContentChart'
        )

        if (EvaluationTeacherByContentChart) {
            const myChart = new Chart(EvaluationTeacherByContentChart, {
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

            return () => {
                myChart.destroy()
            }
        } else {
            console.error(
                "Element with id 'EvaluationTeacherByContentChart' not found"
            )
        }
    }, [data])

    return (
        <canvas id="EvaluationTeacherByContentChart" className="w-100 h-100" />
    )
}

export default EvaluationTeacherByContent
