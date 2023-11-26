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
import ReportEvaluationTeacher from './admin/ReportEvaluationTeacher'

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
        // getAllReportEvaluationTeacher()
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
                                        <ReportEvaluationTeacher />
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
