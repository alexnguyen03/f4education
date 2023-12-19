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

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap'

import { formatCurrency } from 'utils/formater'

const Header = ({
    totalRevenue,
    totalStudent,
    totalRegister,
    totalCertificate
}) => {
    return (
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
                <div className="header-body">
                    {/* Card stats */}
                    <Row>
                        <Col lg="6" xl="3" className="gap-3">
                            <Card className="card-stats mb-4 mb-xl-0 ">
                                <CardBody>
                                    <Row>
                                        <div className="col">
                                            <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                            >
                                                Tổng doanh thu
                                            </CardTitle>
                                            <span className="h2 font-weight-bold mb-0">
                                                {formatCurrency(totalRevenue)}
                                            </span>
                                        </div>
                                        <Col className="col-auto">
                                            <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                <i className="fas fa-chart-bar" />
                                            </div>
                                        </Col>
                                    </Row>
                                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-success mr-2">
                                                <i className="fa fa-arrow-up" />{' '}
                                                3.48%
                                            </span>{' '}
                                            <span className="text-nowrap">
                                                so với tháng trước
                                            </span>
                                        </p> */}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6" xl="3" className="gap-3">
                            <Card className="card-stats mb-4 mb-xl-0 ">
                                <CardBody>
                                    <Row>
                                        <div className="col">
                                            <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                            >
                                                Tổng học viên
                                            </CardTitle>
                                            <span className="h2 font-weight-bold mb-0">
                                                {totalStudent}
                                            </span>
                                        </div>
                                        <Col className="col-auto">
                                            <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                <i className="fas fa-chart-pie" />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6" xl="3" className="gap-3">
                            <Card className="card-stats mb-4 mb-xl-0 ">
                                <CardBody>
                                    <Row>
                                        <div className="col">
                                            <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                            >
                                                Số khóa học đã được đăng ký
                                            </CardTitle>
                                            <span className="h2 font-weight-bold mb-0">
                                                {totalRegister}
                                            </span>
                                        </div>
                                        <Col className="col-auto">
                                            <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                <i className="fas fa-users" />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6" xl="3" className="gap-3">
                            <Card className="card-stats mb-4 mb-xl-0 ">
                                <CardBody>
                                    <Row>
                                        <div className="col">
                                            <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                            >
                                                Số học viên nhận chứng nhận
                                            </CardTitle>
                                            <span className="h2 font-weight-bold mb-0">
                                                {totalCertificate}
                                            </span>
                                        </div>
                                        <Col className="col-auto">
                                            <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                <i className="fas fa-users" />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Header
