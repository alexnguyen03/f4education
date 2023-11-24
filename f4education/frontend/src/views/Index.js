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
import { useEffect, useState } from 'react'
// node.js library that concatenates classes (strings)
import classnames from 'classnames'
// javascipt plugin for creating charts
import Chart from 'chart.js'
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2'
// reactstrap components
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
    Col,
    TabPane,
    TabContent
} from 'reactstrap'

// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2
} from 'variables/charts.js'

import Header from 'components/Headers/Header.js'
import evaluateApi from '../api/evaluateApi'
import { Box, Group, Paper, Space, Title } from '@mantine/core'

const Index = (props) => {
    const [activeNav, setActiveNav] = useState(1)
    const [chartExample1Data, setChartExample1Data] = useState('data1')
    const [dataForEvaluatioTeacherChart, setDataForEvaluatioTeacherChart] =
        useState([])
    if (window.Chart) {
        parseOptions(Chart, chartOptions())
    }
    const [tabs, setTabs] = useState(1)

    const toggleNavs = (e, state, index) => {
        e.preventDefault()
        setTabs(index)
    }
    //! Evauluation Teacher

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
    const optionsInEvaluationTeacherChart = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        title: {
            display: true,
            text: 'Thời gian giảng dạy của giảng viên'
        }
    }
    const dataInEvaluationTeacherChartByTime = {
        labels: [
            'Rất hay trễ giờ',
            'Nhiều lần trễ giờ',
            'Trễ giờ 1 vài lần',
            'Luôn đi đúng giờ'
        ],
        datasets: [
            {
                label: 'Số lượt đánh giá',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    }

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256) // Tạo giá trị ngẫu nhiên từ 0 đến 255 cho thành phần màu đỏ
        const g = Math.floor(Math.random() * 256) // Tạo giá trị ngẫu nhiên từ 0 đến 255 cho thành phần màu xanh lá cây
        const b = Math.floor(Math.random() * 256) // Tạo giá trị ngẫu nhiên từ 0 đến 255 cho thành phần màu xanh lam

        return `rgb(${r}, ${g}, ${b})` // Trả về chuỗi mã màu RGB
    }

    const getAllReportEvaluationTeacher = async () => {
        try {
            const resp = await evaluateApi.getAllReportEvaluationTeacher()
            console.log(
                '🚀 ~ file: Index.js:70 ~ getAllReportEvaluationTeacher ~ resp:',
                resp
            )

            const updatedData = resp.data.map((item1) => {
                console.log(
                    '🚀 ~ file: Index.js:235 ~ updatedData ~ item1:',
                    item1
                )
                const foundItem = dataArray.find(
                    (item2) => item2.title === item1.title
                )
                console.log(
                    '🚀 ~ file: EvaluateTeacherViewByTeacher.js:142 ~ updatedData ~ foundItem:',
                    foundItem
                )

                if (foundItem) {
                    const updatedOptions = foundItem.options.map((option) => {
                        if (option.value === item1.voteValue) {
                            console.log(
                                '🚀 ~ file: Index.js:247 ~ updatedOptions ~ item1.voteCount:',
                                item1.voteCount
                            )
                            return {
                                ...option,
                                totalVoteItem: item1.voteCount
                            }
                        }
                        console.log(
                            '🚀 ~ file: Index.js:257 ~ updatedOptions ~ option:',
                            option
                        )
                        return option
                    })

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

            console.log(result)

            setDataArray(result)
        } catch (error) {
            console.log(
                '🚀 ~ file: Index.js:70 ~ getAllReportEvaluationTeacher ~ error:',
                error
            )
        }
    }
    const renderEvaluationTeacher = () => {
        return dataArray.map((item, index) => {
            console.log(
                '🚀 ~ file: Index.js:307 ~ returndataArray.map ~ item:',
                item
            )
            console.log(
                '🚀 ~ file: Index.js:307 ~ returndataArray.map ~ item:',
                item.options
            )
            const labels = item.options.map((item) => item.label)
            const datas = item.options.map((item) => item.totalVoteItem)
            console.log(
                '🚀 ~ file: Index.js:317 ~ returndataArray.map ~ datas:',
                datas
            )
            console.log(
                '🚀 ~ file: Index.js:316 ~ returndataArray.map ~ labels:',
                labels
            )
            const dataInChart = {
                labels: labels,
                datasets: [
                    {
                        label: `Số lượt đánh giá`,
                        data: datas,
                        backgroundColor: generateRandomColor(), // Màu sắc của cột
                        // borderColor: 'rgba(255, 99, 132, 1)', // Màu sắc viền cột
                        borderWidth: 1
                    }
                ]
            }
            return (
                // <Bar data={dataInChart} />
                <p>kjdflakdj</p>
                // <Paper shadow="lg" p="md" mb={'lg'} key={index}>
                //     <Box>
                //         <Title order={3}> {item.title}</Title>
                //     </Box>
                //     <Group grow position="center">
                //         {item.options.map((subItem, subIndex) => {
                //             var color = 'red'

                //             switch (subItem.value) {
                //                 case 1:
                //                     color = 'yellow'
                //                     break
                //                 case 2:
                //                     color = 'gray'
                //                     break
                //                 case 3:
                //                     color = 'cyan'
                //                     break
                //                 case 4:
                //                     color = 'green'
                //                     break

                //                 default:
                //                     color = 'red'
                //                     break
                //             }
                //             return (
                //                 <>
                //                     <p>{subItem.totalVoteItem}</p>
                //                     {/* <Alert
                //                 key={index}
                //                 icon={<IconAlertCircle size="1rem" />}
                //                 title={subItem.label}
                //                 color={color}
                //             >
                //                 <Group>
                //                     <Title order={4}>
                //                         {subItem.totalVoteItem} Đánh giá - Chiếm{' '}
                //                         {subItem.totalVoteItem *
                //                             (100 / item.totalVote).toFixed(
                //                                 2
                //                             )}{' '}
                //                         %
                //                     </Title>
                //                 </Group>
                //             </Alert> */}
                //                 </>
                //             )
                //         })}
                //     </Group>
                // </Paper>
            )
        })
    }
    // const renderEvaluationTeacherChart = () => {
    //     // Tạo biểu đồ cho mỗi nhóm dữ liệu 'title'
    //     const charts = Object.keys(groupedData).map((title, index) => {
    //         const dataForChart = groupedData[title]

    //         // Tạo 'data' cho biểu đồ từ dữ liệu của từng nhóm 'title'
    //         const data = {
    //             labelxs: dataForChart.map((item) => `Class ${item.classId}`),
    //             datasets: [
    //                 {
    //                     label: `${title} - Chart ${index + 1}`,
    //                     data: dataForChart.map((item) => item.voteValue),
    //                     backgroundColor: 'rgba(255, 99, 132, 0.2)', // Màu sắc của cột
    //                     borderColor: 'rgba(255, 99, 132, 1)', // Màu sắc viền cột
    //                     borderWidth: 1
    //                 }
    //             ]
    //         }

    //         // Options cho biểu đồ (có thể tùy chỉnh)
    //         const options = {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true
    //                 }
    //             }
    //         }

    //         return (
    //             <div key={index}>
    //                 <h2>{title}</h2>
    //                 <Bar data={data} options={options} />
    //             </div>
    //         )
    //     })

    //     return <div>{charts}</div>
    // }
    const groupByClassId = (data) => {
        return data.reduce((acc, currentValue) => {
            const { teacherName } = currentValue
            if (!acc[teacherName]) {
                acc[teacherName] = []
            }
            acc[teacherName].push(currentValue)
            return acc
        }, {})
    }

    const groupByClassIdAndTitle = (data) => {
        return data.reduce((acc, currentValue) => {
            const { teacherName, title } = currentValue
            const key = `${teacherName}_${title}`
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(currentValue)
            return acc
        }, {})
    }

    useEffect(() => {
        getAllReportEvaluationTeacher()
    }, [])

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Card className="shadow">
                    <CardBody>
                        <div className="nav-wrapper">
                            <Nav
                                className="nav-fill flex-column flex-md-row"
                                id="tabs-icons-text"
                                pills
                                role="tablist"
                            >
                                <NavItem>
                                    <NavLink
                                        aria-selected={tabs === 1}
                                        className={classnames(
                                            'mb-sm-3 mb-md-0',
                                            {
                                                active: tabs === 1
                                            }
                                        )}
                                        onClick={(e) =>
                                            toggleNavs(e, 'tabs', 1)
                                        }
                                        href="#pablo"
                                        role="tab"
                                    >
                                        <i className="ni ni-cloud-upload-96 mr-2" />
                                        Đánh giá Giáo Viên
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        aria-selected={tabs === 2}
                                        className={classnames(
                                            'mb-sm-3 mb-md-0',
                                            {
                                                active: tabs === 2
                                            }
                                        )}
                                        onClick={(e) =>
                                            toggleNavs(e, 'tabs', 2)
                                        }
                                        href="#pablo"
                                        role="tab"
                                    >
                                        <i className="ni ni-bell-55 mr-2" />
                                        Profile
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        aria-selected={tabs === 3}
                                        className={classnames(
                                            'mb-sm-3 mb-md-0',
                                            {
                                                active: tabs === 3
                                            }
                                        )}
                                        onClick={(e) =>
                                            toggleNavs(e, 'tabs', 3)
                                        }
                                        href="#pablo"
                                        role="tab"
                                    >
                                        <i className="ni ni-calendar-grid-58 mr-2" />
                                        Messages
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                        <Card className="shadow">
                            <CardBody>
                                <TabContent activeTab={'tabs' + tabs}>
                                    <TabPane tabId="tabs1">
                                        {' '}
                                        {/* <Bar
                                            data={
                                                dataInEvaluationTeacherChartByTime
                                            }
                                            options={
                                                optionsInEvaluationTeacherChart
                                            }
                                        /> */}
                                        {renderEvaluationTeacher()}
                                    </TabPane>
                                    <TabPane tabId="tabs2">
                                        <p className="description">
                                            Cosby sweater eu banh mi, qui irure
                                            terry richardson ex squid. Aliquip
                                            placeat salvia cillum iphone. Seitan
                                            aliquip quis cardigan american
                                            apparel, butcher voluptate nisi qui.
                                        </p>
                                    </TabPane>
                                    <TabPane tabId="tabs3">
                                        <p className="description">
                                            Raw denim you probably haven't heard
                                            of them jean shorts Austin. Nesciunt
                                            tofu stumptown aliqua, retro synth
                                            master cleanse. Mustache cliche
                                            tempor, williamsburg carles vegan
                                            helvetica. Reprehenderit butcher
                                            retro keffiyeh dreamcatcher synth.
                                        </p>
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}

export default Index
