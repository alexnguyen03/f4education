import classApi from 'api/classApi'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Container, Row, Col, Alert } from 'reactstrap'

const ClasssDetailHeader = () => {
    const [className, setClassName] = useState('')
    const [classDetail, setClassDetail] = useState({
        classId: 0,
        courseName: 'Đang tải...',
        className: 'Đang tải...',
        courseId: 0,
        startDate: '',
        endDate: '',
        maximumQuantity: 0,
        status: '',
        admin: {
            adminId: '',
            fullname: '',
            gender: true,
            dateOfBirth: '',
            citizenIdentification: '',
            address: '',
            phone: '',
            image: ''
        },
        students: [],
        teacher: {
            teacherId: '',
            fullname: ''
        }
    })

    let { classIdParam } = useParams()
    const getClassByClassId = async () => {
        try {
            const resp = await classApi.getByClassId(classIdParam)
            if (resp.status === 200) {
                setClassDetail(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getClassByClassId()
    }, [])

    return (
        <>
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
                                LỚP HỌC: {classDetail.className}{' '}
                            </h1>
                        </Col>
                        <Col
                            sm="6 "
                            className="d-flex flex-column justify-content-center "
                        >
                            <div className="font-weight-bold mb-0 bg-primary rounded py-3 ">
                                <h3 className="text-white mb-0 text-center">
                                    <span> Khóa học: </span>
                                    {classDetail.courseName
                                        ? classDetail.courseName
                                        : 'Chưa chọn'}
                                </h3>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default ClasssDetailHeader
