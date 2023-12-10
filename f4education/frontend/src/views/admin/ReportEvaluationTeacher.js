import { useState } from 'react'
import evaluateApi from '../../api/evaluateApi'
import { useEffect } from 'react'
import { Bar, Line, Chart } from 'react-chartjs-2'
import axios from 'axios'
import { Button, Col, Row } from 'reactstrap'
import Select from 'react-select'
import teacherApi from 'api/teacherApi'
import { Alert, Center, Loader, Text, Tooltip } from '@mantine/core'
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react'
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title
} from 'chart.js'
const ReportEvaluationTeacher = () => {
    const [loadingChart, setLoadingChart] = useState(false)
    const [listTeacher, setListTeacher] = useState([])
    const [allEvaluationReport, setAllEvaluationReport] = useState([])
    const [notHasReport, setNotHasReport] = useState(false)
    const [dataArray, setDataArray] = useState([
        {
            title: 'Giảng viên có khuyến khích sáng tạo và tư duy độc lập từ học viên',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Không có, không bao giờ nhắc đến'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Có, rất khuyết khích'
                }
            ]
        },
        {
            title: 'Nội dung và phương pháp giảng dạy',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Rất không tốt'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Không tốt'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Tốt'
                },
                {
                    value: 4,
                    totalVoteItem: 0,
                    label: 'Xuất sắc'
                }
            ]
        },
        {
            title: 'Sự công bằng của giảng viên trong kiểm tra đánh giá quá trình và đánh giá kết quả học tập',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: 'Rất không công bằng'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Đôi lúc còn thiên vị'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Bình thường'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Rất công bằng'
                }
            ]
        },
        {
            title: 'Thời gian giảng dạy của giảng viên',
            totalVote: 0,
            options: [
                {
                    value: 0,
                    totalVoteItem: 0,
                    label: ' Rất hay trễ giờ'
                },
                {
                    value: 1,
                    totalVoteItem: 0,
                    label: 'Nhiều lần trễ giờ'
                },
                {
                    value: 2,
                    totalVoteItem: 0,
                    label: 'Trễ giờ 1 vài lần'
                },
                {
                    value: 3,
                    totalVoteItem: 0,
                    label: 'Luôn đi đúng giờ'
                }
            ]
        }
    ])
    const [encourageReport, setEncourageReport] = useState({
        labels: dataArray[0].options.map((item) => item.label),
        datasets: [
            {
                label: `Số lượt đánh giá`,
                data: [],
                backgroundColor: [
                    '#f03e3e',
                    '#f59f00',
                    'grey',
                    '#1098ad',
                    '#37b24d'
                ],
                borderWidth: 1
            }
        ]
    })
    const [contentReport, setContentReport] = useState({
        labels: dataArray[1].options.map((item) => item.label),
        datasets: [
            {
                label: `Số lượt đánh giá`,
                data: [],
                backgroundColor: [
                    '#f03e3e',
                    '#f59f00',
                    'grey',
                    '#1098ad',
                    '#37b24d'
                ],
                borderWidth: 1
            }
        ]
    })
    const [fairnessReport, setFairnessReport] = useState({
        labels: dataArray[2].options.map((item) => item.label),
        datasets: [
            {
                label: `Số lượt đánh giá`,
                data: [],
                backgroundColor: [
                    '#f03e3e',
                    '#f59f00',
                    'grey',
                    '#1098ad',
                    '#37b24d'
                ],
                borderWidth: 1
            }
        ]
    })

    const [timeReport, setTimeReport] = useState({
        labels: dataArray[3].options.map((item) => item.label),
        datasets: [
            {
                label: `Số lượt đánh giá`,
                data: dataArray[3].options.map((item) => item.totalVoteItem),
                backgroundColor: ['#f03e3e', '#f59f00', '#1098ad', '#37b24d'],
                borderWidth: 1
            }
        ]
    })

    const handleOnChangeTeacher = (val) => {
        const { value } = { ...val } //value là teacherId
        const newData = dataArray.map((item) => {
            const newOptions = item.options.map((option) => ({
                ...option,
                totalVoteItem: 0
            }))

            return {
                ...item,
                options: newOptions
            }
        })
        setDataArray(newData)
        if (value === 'all') {
            getAllReportEvaluationTeacher()
        } else {
            const groupByTeacherName = (dataArray) => {
                const groupedData = {}

                dataArray.forEach((item) => {
                    const { teacherId } = item
                    if (!groupedData[teacherId]) {
                        groupedData[teacherId] = []
                    }
                    groupedData[teacherId].push(item)
                })

                return groupedData
            }

            const groupedData = groupByTeacherName(allEvaluationReport)

            console.log(groupedData)

            const filteredData = groupedData[value] || []

            console.log(filteredData)
            const foundTeacher = filteredData.find(
                (item) => item.teacherId === value
            )
            console.log(
                '🚀 ~ file: ReportEvaluationTeacher.js:219 ~ handleOnChangeTeacher ~ foundTeacher:',
                foundTeacher
            )

            if (foundTeacher) {
                const updatedData = filteredData.map((item1) => {
                    const foundItem = newData.find(
                        (item2) => item2.title === item1.title
                    )

                    if (foundItem) {
                        const updatedOptions = foundItem.options.map(
                            (option) => {
                                if (option.value === item1.voteValue) {
                                    return {
                                        ...option,
                                        totalVoteItem: item1.voteCount
                                    }
                                }
                                return option
                            }
                        )

                        return {
                            ...foundItem,
                            totalVote: foundItem.totalVote + item1.voteCount,
                            options: updatedOptions
                        }
                    }
                    return item1
                })

                const groupedByTitle = updatedData.reduce((acc, obj) => {
                    const key = obj.title
                    if (!acc[key]) {
                        acc[key] = {
                            title: obj.title,
                            totalVote: 0,
                            options: []
                        }
                    }

                    acc[key].totalVote += obj.totalVote

                    obj.options.forEach((opt) => {
                        const existingOption = acc[key].options.find(
                            (o) => o.value === opt.value
                        )
                        if (existingOption) {
                            existingOption.totalVoteItem += opt.totalVoteItem
                        } else {
                            acc[key].options.push({
                                value: opt.value,
                                totalVoteItem: opt.totalVoteItem,
                                label: opt.label
                            })
                        }
                    })

                    return acc
                }, {})

                const result = Object.values(groupedByTitle)

                // setDataArray(result)
                setTimeReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[3].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setFairnessReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[2].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setContentReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[1].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setEncourageReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[0].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setNotHasReport(false)
            } else {
                setNotHasReport(true)
            }
        }
    }

    const getAllTeachers = async () => {
        try {
            const resp = await teacherApi.getAllTeachers()
            console.log(
                '🚀 ~ file: ClassDetail.js:162 ~ getAllTeachers ~ resp:',
                resp
            )

            if (resp.status === 200 && resp.data.length > 0) {
                setListTeacher(
                    resp.data.map((item) => {
                        const { fullname, teacherId, image, gender } = {
                            ...item
                        }
                        return {
                            value: teacherId,
                            label: fullname + ' - ' + teacherId,
                            image: image
                        }
                    })
                )
                setListTeacher((prev) => [
                    {
                        value: 'all',
                        label: 'Xem tất cả',
                        image: ''
                    },
                    ...prev
                ])
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:109 ~ getAllTeachers ~ error:',
                error
            )
        }
    }
    const getAllReportEvaluationTeacher = async () => {
        try {
            const newData = dataArray.map((item) => {
                const newOptions = item.options.map((option) => ({
                    ...option,
                    totalVoteItem: 0
                }))

                return {
                    ...item,
                    options: newOptions
                }
            })
            setDataArray(newData)
            setLoadingChart(true)
            const resp = await evaluateApi.getAllReportEvaluationTeacher()
            console.log(
                '🚀 ~ file: Index.js:70 ~ getAllReportEvaluationTeacher ~ resp:',
                resp
            )
            if (resp.status === 200) {
                setAllEvaluationReport(resp.data)
                const updatedData = resp.data.map((item1) => {
                    const foundItem = newData.find(
                        (item2) => item2.title === item1.title
                    )

                    if (foundItem) {
                        const updatedOptions = foundItem.options.map(
                            (option) => {
                                if (option.value === item1.voteValue) {
                                    return {
                                        ...option,
                                        totalVoteItem: item1.voteCount
                                    }
                                }
                                return option
                            }
                        )

                        return {
                            ...foundItem,
                            totalVote: foundItem.totalVote + item1.voteCount,
                            options: updatedOptions
                        }
                    }
                    return item1
                })

                const groupedByTitle = updatedData.reduce((acc, obj) => {
                    const key = obj.title
                    if (!acc[key]) {
                        acc[key] = {
                            title: obj.title,
                            totalVote: 0,
                            options: []
                        }
                    }

                    acc[key].totalVote += obj.totalVote

                    obj.options.forEach((opt) => {
                        const existingOption = acc[key].options.find(
                            (o) => o.value === opt.value
                        )
                        if (existingOption) {
                            existingOption.totalVoteItem += opt.totalVoteItem
                        } else {
                            acc[key].options.push({
                                value: opt.value,
                                totalVoteItem: opt.totalVoteItem,
                                label: opt.label
                            })
                        }
                    })

                    return acc
                }, {})

                const result = Object.values(groupedByTitle)

                setDataArray(result)
                setTimeReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[3].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setFairnessReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[2].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setContentReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[1].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setEncourageReport((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result[0].options.map(
                                (item) => item.totalVoteItem
                            )
                        }
                    ]
                }))
                setLoadingChart(false)
                setNotHasReport(false)
            }
        } catch (error) {
            setLoadingChart(false)
            console.log(
                '🚀 ~ file: Index.js:70 ~ getAllReportEvaluationTeacher ~ error:',
                error
            )
        }
    }

    const renderEvaluationTeacherByTime = () => {
        const options = {
            plugins: {
                title: {
                    display: true,
                    text: 'Custom Chart Title'
                }
            }
        }
        const dataInChart = { ...timeReport }
        return (
            <>
                {' '}
                <Tooltip label={dataArray[3].title} withArrow>
                    <Text lineClamp={1} className="text-center mb-3">
                        {dataArray[3].title}
                    </Text>
                </Tooltip>
                <Bar data={dataInChart} options={options} />
            </>
        )
    }
    const renderEvaluationTeacherByEncourrage = () => {
        const options = {
            plugins: {
                title: {
                    display: true,
                    text: 'Biểu đồ Giá Tiền Tệ',
                    font: {
                        size: 20
                    }
                }
            }
        }
        const dataInChart = { ...encourageReport }
        return (
            <>
                <Tooltip label={dataArray[0].title}>
                    <Text lineClamp={1} className="text-center mb-3">
                        {dataArray[0].title}
                    </Text>
                </Tooltip>
                <Bar data={dataInChart} options={options} />
            </>
        )
    }
    const renderEvaluationTeacherByContent = () => {
        const options = {
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: dataArray[1].title
                }
            }
        }
        const dataInChart = { ...contentReport }
        return (
            <>
                <Tooltip label={dataArray[1].title}>
                    <Text lineClamp={1} className="text-center mb-3">
                        {dataArray[1].title}
                    </Text>
                </Tooltip>
                <Bar data={dataInChart} options={options} />
            </>
        )
    }
    const renderEvaluationTeacherByFairness = () => {
        const options = {
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: dataArray[2].title
                }
            }
        }
        const dataInChart = { ...fairnessReport }
        return (
            <>
                <Tooltip label={dataArray[2].title}>
                    <Text lineClamp={1} className="text-center mb-3">
                        {dataArray[2].title}
                    </Text>
                </Tooltip>
                <Bar data={dataInChart} options={options} />
            </>
        )
    }

    useEffect(() => {
        getAllReportEvaluationTeacher()
        getAllTeachers()
    }, [])
    return (
        <>
            <Select
                options={listTeacher}
                placeholder="Chọn giáo viên"
                onChange={(val) => {
                    handleOnChangeTeacher(val)
                }}
                isSearchable={true}
                className="form-control-alternative "
                styles={{ outline: 'none' }}
            />
            {loadingChart ? (
                <Center mt={'lg'}>
                    <Loader visibility={loadingChart} />{' '}
                </Center>
            ) : null}

            {notHasReport && !loadingChart ? (
                <Alert
                    mt={'lg'}
                    icon={<IconAlertCircle size="1rem" />}
                    title="Thông báo!"
                    color="lime"
                >
                    Giáo viên chưa có đánh giá
                </Alert>
            ) : null}
            {loadingChart || notHasReport ? null : (
                <>
                    <Row className="py-5">
                        <Col>
                            <div className="chart border p-3 rounded">
                                {renderEvaluationTeacherByTime()}
                            </div>
                        </Col>
                        <Col>
                            <div className="chart border p-3 rounded">
                                {renderEvaluationTeacherByEncourrage()}
                            </div>
                        </Col>
                    </Row>

                    <Row className="py-5">
                        <Col>
                            <div className="chart border p-3 rounded">
                                {renderEvaluationTeacherByContent()}
                            </div>
                        </Col>
                        <Col>
                            <div className="chart border p-3 rounded">
                                {renderEvaluationTeacherByFairness()}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default ReportEvaluationTeacher
