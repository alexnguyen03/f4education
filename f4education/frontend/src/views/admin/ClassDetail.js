import ClasssHeader from 'components/Headers/ClasssHeader'
import React, { useEffect } from 'react'
import { useState } from 'react'
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Label,
    Row
} from 'reactstrap'
import Select from 'react-select'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import { Avatar, Group, Text, TransferList } from '@mantine/core'

import courseApi from '../../api/courseApi'
import teacherApi from '../../api/teacherApi'
import { useParams } from 'react-router-dom'
import classApi from 'api/classApi'
import registerCourseApi from 'api/registerCourseApi'
const IMG_URL = process.env.REACT_APP_IMAGE_URL + '/courses/'
const ClassDetail = () => {
    let { classIdParam } = useParams()
    const [listTeacher, setListTeacher] = useState([])

    const [classDetail, setClassDetail] = useState({
        classId: 0,
        className: '',
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
    const [listCourse, setListCourse] = useState([])
    const [listStudentInCourse, setListStudentInCourse] = useState([])
    const [listStudentInClass, setListStudentInClass] = useState([
        { value: 'sv', label: 'Svelte' },
        { value: 'rw', label: 'Redwood' },
        { value: 'np', label: 'NumPy' }
    ])
    const [data, setData] = useState([listStudentInCourse, listStudentInClass])

    // ! HANDLE FUNCTIONS
    const handleSave = () => {
        setListStudentInCourse(data[0])
        setListStudentInClass([data[1]])
        console.log(
            '🚀 ~ file: ClassDetail.js:65 ~ handleSave ~ classDetail:',
            classDetail
        )
    }

    const handleOnChangeTransferList = (dataInList) => {
        setData(dataInList)
        setListStudentInCourse(data[0])
        setListStudentInClass(data[1])
    }

    //! CALL APIS
    const getRegisterCourse = async () => {
        try {
            const resp = await registerCourseApi.getRegisterCourseDistinc()
            if (resp.status === 200 && resp.data.length > 0) {
                setListCourse(
                    resp.data.map((item) => {
                        // do class registerCourseController co lop HandleResponseDTO nen phai lay data x 2
                        const { registerCourseId, courseName, image, classes } =
                            { ...item }

                        return {
                            value: registerCourseId,
                            label: courseName,
                            image: image
                        }
                    })
                )
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:74 ~ getRegisterCourse ~ error:',
                error
            )
        }
    }
    const getAllStudentInCourse = async () => {
        try {
            const resp = await registerCourseApi.getAllRegisterCourse()
            console.log(
                '🚀 ~ file: ClassDetail.js:93 ~ getAllStudentInCourse ~ resp:',
                resp
            )
            const listRegisterCourse = resp.data.data.filter(
                (item) => item.courseId === classDetail.courseId
            )
            // console.log('🚀 ~ file: ClassDetail.js:95 ~ getAllStudentInCourse ~ listRegisterCourse:', listRegisterCourse.length);
            // console.log('🚀 ~ file: ClassDetail.js:95 ~ getAllStudentInCourse ~ classDetail.courseId:', classDetail.courseId);
            if (resp.status === 200 && resp.data.length > 0) {
                console.log(
                    '🚀 ~ file: ClassDetail.js:99 ~ getAllStudentInCourse ~ resp.data:',
                    resp.data
                )
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:74 ~ getRegisterCourse ~ error:',
                error
            )
        }
    }
    const getAllTeachers = async () => {
        try {
            const resp = await teacherApi.getAllTeachers()
            console.log(
                '🚀 ~ file: ClassDetail.js:63 ~ getAllTeachers ~ resp:',
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
                            label: `${gender ? 'Thầy ' : 'Cô '} ${fullname}`,
                            image: image
                        }
                    })
                )
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:109 ~ getAllTeachers ~ error:',
                error
            )
        }
    }
    const handleOnChangeTeacher = (val) => {
        const { value, label } = { ...val }
        setClassDetail((prevState) => ({
            ...prevState,
            teacher: {
                ...prevState.teacher,
                teacherId: value,
                fullname: label
            }
        }))
        console.log(
            '🚀 ~ file: ClassDetail.js:81 ~ handleOnChangeTeacher ~ e.target.value:',
            value
        )
    }
    const getClassByClassId = async () => {
        try {
            const resp = await classApi.getClassById(classIdParam)
            console.log(
                '🚀 ~ file: ClassDetail.js:135 ~ getClassByClassId ~ resp:',
                resp
            )
            setClassDetail(resp.data)
            const { students } = { ...resp.data.students }

            setListStudentInClass(
                students.map((student) => {
                    return {
                        studentId: student.studentId,
                        fullname: student.fullname
                    }
                })
            )
            console.log(
                '🚀 ~ file: ClassDetail.js:90 ~ getClassByClassId ~ resp:',
                resp
            )
        } catch (error) {
            console.log(error)
        }
    }
    // ! render UI
    const renderStatus = (status) => {
        switch (status) {
            case 'Chưa bắt đầu':
                return (
                    <Badge className="font-weight-bold" color="warning">
                        {status}
                    </Badge>
                )
                break
            case 'Đang diễn ra':
                return (
                    <Badge className="font-weight-bold" color="primary">
                        {status}
                    </Badge>
                )
                break
            case 'Kết thúc':
                return (
                    <Badge className="font-weight-bold" color="success">
                        {status}
                    </Badge>
                )
                break

            default:
                break
        }
    }
    useEffect(() => {
        getClassByClassId()
        getRegisterCourse()
        getAllTeachers()
        getAllStudentInCourse()
    }, [])

    return (
        <>
            <ClasssHeader />
            <Container className="mt--7" fluid>
                <Card>
                    <CardHeader>
                        <Row>
                            {
                                <>
                                    <Col md={4}>
                                        <Label>Chọn khóa học</Label>
                                        <Select
                                            options={listCourse}
                                            placeholder="Chọn khóa học"
                                            onChange={(e) => {
                                                console.log(e)
                                            }}
                                            isSearchable={true}
                                            className="form-control-alternative "
                                            styles={{ outline: 'none' }}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Label>Chọn giáo viên phụ trách</Label>
                                        <Select
                                            formatOptionLabel={(teacher) => (
                                                <div className="d-flex">
                                                    <div className="country-option ">
                                                        <img
                                                            width={'35'}
                                                            height={'35'}
                                                            className="rounded-circle"
                                                            src={
                                                                IMG_URL +
                                                                teacher.image
                                                            }
                                                            alt="teacher-image"
                                                        />
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center ml-3">
                                                        {teacher.label}
                                                    </div>
                                                </div>
                                            )}
                                            options={listTeacher}
                                            placeholder="Chọn môn học"
                                            onChange={(val) => {
                                                handleOnChangeTeacher(val)
                                            }}
                                            isSearchable={true}
                                            className="form-control-alternative "
                                            styles={{ outline: 'none' }}
                                        />
                                    </Col>
                                </>
                            }
                            <Col md={4} className="mt-4 pt-1">
                                <Button
                                    className="btn-icon btn-3"
                                    color="primary"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    <span className="btn-inner--text">
                                        Lưu thay đổi
                                    </span>
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row className="d-flex justify-content-end border-bottom pb-2">
                            <Row className="flex-grow-1 px-3">
                                <Col md={3} className="">
                                    <div className="shadow text-center   py-4 rounded px-4">
                                        <span>Học viên tối đa:</span>
                                        <div>
                                            <Badge
                                                className="font-weight-bold"
                                                color="success"
                                            >
                                                {classDetail.maximumQuantity}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={3} className="">
                                    <div className="shadow text-center   py-4 rounded px-4">
                                        <span>Số lượng còn lại:</span>
                                        <div>
                                            <Badge
                                                className="font-weight-bold"
                                                color="info"
                                            >
                                                {classDetail.maximumQuantity -
                                                    data[1].length}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={3} className="">
                                    <div className="shadow text-center   py-4 rounded px-4">
                                        <span>Trạng thái :</span>
                                        <div>
                                            {renderStatus(classDetail.status)}
                                        </div>
                                    </div>
                                </Col>

                                <Col md={3} className="">
                                    <div className="shadow text-center   py-4 rounded px-4">
                                        <div>Giáo viên phụ trách: </div>
                                        <div>
                                            <Badge
                                                className="font-weight-bold"
                                                color={`${
                                                    classDetail.teacher
                                                        ? 'info'
                                                        : 'danger'
                                                } `}
                                            >
                                                {classDetail.teacher != null
                                                    ? classDetail.teacher
                                                          .fullname
                                                    : 'Chưa có giáo viên'}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Row>

                        <TransferList
                            className="mt-2"
                            value={data}
                            itemComponent={React.memo(({ data, selected }) => (
                                <Group noWrap>
                                    <Avatar
                                        src={data.image}
                                        radius="xl"
                                        size="lg"
                                    />
                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" weight={500}>
                                            {data.label}
                                        </Text>
                                        <Text
                                            size="xs"
                                            color="dimmed"
                                            weight={400}
                                        >
                                            {data.description}
                                        </Text>
                                    </div>
                                    <Checkbox
                                        checked={selected}
                                        onChange={() => {}}
                                        tabIndex={-1}
                                        sx={{ pointerEvents: 'none' }}
                                    />
                                </Group>
                            ))}
                            onChange={handleOnChangeTransferList}
                            searchPlaceholder={[
                                'Tìm kiếm học viên để thêm vào lớp',
                                'Tìm kiếm học viên trong lớp'
                            ]}
                            nothingFound={'Danh sách học viên trống'}
                            titles={[
                                `Học viên đã đăng ký: ${data[0].length}`,
                                `Học viên trong lớp: ${data[1].length}`
                            ]}
                            showTransferAll={false}
                            placeholder={[
                                'Không còn học viên nào đã đăng ký',
                                'Không còn học viên nào trong lớp'
                            ]}
                            transferAllMatchingFilter={true}
                            listHeight={450}
                        />
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}

export default ClassDetail
