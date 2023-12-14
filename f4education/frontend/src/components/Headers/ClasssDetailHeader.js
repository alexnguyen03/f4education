import classApi from 'api/classApi'
import { forwardRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Row, Col, Alert } from 'reactstrap'

const ClasssDetailHeader = (props) => {
    const [className, setClassName] = useState('')

    return (
        <div
            className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style={{
                minHeight: '200px',
                backgroundImage:
                    'url(' +
                    require('../../assets/img/theme/profile-cover.jpg') +
                    ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center top'
            }}
        >
            {/* Mask */}
            <span className="mask bg-gradient-default opacity-8" />
            {/* Header container */}
            <Container className=" " fluid>
                <Row>
                    <Col sm="6">
                        <h1 className="display-1 text-white">
                            LỚP HỌC: {props.className}{' '}
                        </h1>
                    </Col>
                    <Col
                        sm="6 "
                        className="d-flex flex-column justify-content-center "
                    >
                        <div className="font-weight-bold mb-0 bg-primary rounded py-3 ">
                            <h3 className="text-white mb-0 text-center">
                                <span> Khóa học: </span>
                                {props.courseName
                                    ? props.courseName
                                    : 'Chưa chọn'}
                            </h3>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ClasssDetailHeader
