import ClasssDetailHeader from 'components/Headers/ClasssDetailHeader'
import React, { useEffect } from 'react'
import { useState } from 'react'
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Label,
    Modal,
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
import { Avatar, Group, Loader, Text, TransferList } from '@mantine/core'

import 'react-toastify/dist/ReactToastify.css'
import courseApi from '../../api/courseApi'
import teacherApi from '../../api/teacherApi'
import { useParams } from 'react-router-dom'
import classApi from '../../api/classApi'
import registerCourseApi from '../../api/registerCourseApi'
import { ToastContainer, toast } from 'react-toastify'
import { useRef } from 'react'
import Notify from '../../utils/Notify'
const IMG_TEACHER_URL = process.env.REACT_APP_IMAGE_URL + '/teachers/'
const ClassDetail = () => {
    let { classIdParam } = useParams()
    const [listTeacher, setListTeacher] = useState([])
    const [loadingTransfer, setLoadingTransfer] = useState(true)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [loadingGetClassDetail, setLoadingGetClassDetail] = useState(true)
    const [allRegisterCourses, setAllRegisterCourse] = useState([])
    const toastId = useRef(null)

    const [classDetail, setClassDetail] = useState({
        classId: 0,
        className: '',
        courseName: '',
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
    const [classRequest, setClassRequest] = useState({
        classId: '',
        courseId: '',
        teacherId: '',
        listRegisterCourseId: [] //lay register course de cap nhat
    })
    const [listCourse, setListCourse] = useState([])
    const [listStudentInCourse, setListStudentInCourse] = useState([{}])
    const [listStudentInClass, setListStudentInClass] = useState([{}])
    const [dataTransfer, setDataTransfer] = useState([
        listStudentInCourse,
        listStudentInClass
    ])
    const notifi_loading = () => {
        toast('Notify.msg.loading', {
            type: toast.TYPE.DEFAULT,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton: true,
            pauseOnHover: true,
            theme: 'colored',
            isLoading: true
        })
    }
    // ! HANDLE FUNCTIONS
    const handleSave = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())
        console.log(classRequest)
        try {
            const resp = await registerCourseApi.updateRegisterCourse(
                JSON.stringify(classRequest)
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
            console.log(
                '🚀 ~ file: ClassDetail.js:94 ~ handleSave ~ error:',
                error
            )
        }
    }
    const convertStudentIdToRegisterCouserId = (studentId) => {
        const matchingIds = []
        for (const registration of allRegisterCourses) {
            if (studentId.includes(registration.studentId)) {
                matchingIds.push(registration.registerCourseId)
            }
        }
        return matchingIds
    }
    const handleOnChangeTransferList = (dataInList) => {
        setShowConfirmModal(true)
        setListStudentInCourse(dataInList[0])
        setDataTransfer(dataInList)
        setListStudentInClass(dataInList[1])
        setClassRequest((prev) => ({
            ...prev,
            classId: classDetail.classId,
            courseId: classDetail.courseId,
            teacherId: classDetail.teacher.teacherId,
            listRegisterCourseId: convertStudentIdToRegisterCouserId(
                dataTransfer[1].map((item) => {
                    const { value } = { ...item }
                    return value
                })
            )
        }))
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
    const convertRegisterToStudentArray = (arr) => {
        const convertedArray = arr.map((item) => ({
            value: item.studentId,
            label: item.studentName
        }))
        return convertedArray
    }
    const getAllStudentInCourse = async () => {
        setLoadingTransfer(true)
        console.log('run getAll Student')
        try {
            const resp = await registerCourseApi.getAllRegisterCourse()
            console.log(
                '🚀 ~ file: ClassDetail.js:171 ~ getAllStudentInCourse ~ resp:',
                resp
            )

            if (resp.status === 200) {
                setAllRegisterCourse(resp.data.data)
                const listRegisterCourse = resp.data.data.filter((item) => {
                    return item.courseId === classDetail.courseId
                })
                console.log(classDetail.courseId)
                console.log(listRegisterCourse)
                const studentInClass = listRegisterCourse.filter((item) => {
                    return item.classId === parseInt(classIdParam)
                })

                const studentInCourse = listRegisterCourse.filter(
                    (item) => item.classId !== parseInt(classIdParam)
                )

                // setListStudentInCourse(
                //     convertRegisterToStudentArray(studentInCourse)
                // )
                // setListStudentInClass(
                //     convertRegisterToStudentArray(studentInClass)
                // )

                setLoadingTransfer(false)
                setDataTransfer([
                    convertRegisterToStudentArray(studentInCourse),
                    convertRegisterToStudentArray(studentInClass)
                ])
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

    //! HANDLE FUNCTIONS
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
    }
    const getClassByClassId = async () => {
        setLoadingGetClassDetail(true)
        try {
            const resp = await classApi.getByClassId(classIdParam)

            setClassDetail(resp.data)
            setLoadingGetClassDetail(false)
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
    const renderTransferData = () => {
        if (loadingTransfer) {
            return (
                <div
                    className="d-flex justify-content-center pt-5"
                    style={{ minHeight: '200px' }}
                >
                    <Loader color="blue" />
                </div>
            )
        }
        return (
            <TransferList
                className="mt-2"
                value={dataTransfer}
                itemComponent={React.memo(({ data, selected }) => (
                    <Group noWrap>
                        <Avatar src={data.image} radius="xl" size="lg" />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" weight={500}>
                                {data.label}
                            </Text>
                            <Text size="xs" color="dimmed" weight={400}>
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
                    `Học viên đã đăng ký: ${dataTransfer[0].length}`,
                    `Học viên trong lớp: ${dataTransfer[1].length}`
                ]}
                showTransferAll={false}
                placeholder={[
                    'Không còn học viên nào đã đăng ký',
                    'Không còn học viên nào trong lớp'
                ]}
                transferAllMatchingFilter={true}
                listHeight={450}
            />
        )
    }
    useEffect(() => {
        getClassByClassId()
        getAllTeachers()
        getRegisterCourse()
    }, [])
    useEffect(() => {
        setClassRequest((prev) => ({
            ...prev,
            classId: classDetail.classId,
            courseId: classDetail.courseId,
            teacherId: classDetail.teacher.teacherId,
            listRegisterCourseId: convertStudentIdToRegisterCouserId(
                dataTransfer[1].map((item) => {
                    const { value } = { ...item }
                    return value
                })
            )
        }))
    }, [dataTransfer])

    useEffect(() => {
        if (!loadingGetClassDetail) {
            console.log(
                '🚀 ~ file: ClassDetail.js:317 ~ useEffect ~ loadingGetClassDetail:',
                loadingGetClassDetail
            )
            getAllStudentInCourse()
        }
    }, [loadingGetClassDetail])

    return (
        <>
            <ToastContainer />
            <ClasssDetailHeader />
            <Container className="mt--7" fluid>
                <Card>
                    <CardHeader>
                        <Row className=" d-flex justify-content-between">
                            {
                                <>
                                    <Col md={4}>
                                        <Label>Chọn giáo viên phụ trách</Label>
                                        <span>{listStudentInClass.length}</span>
                                        <Select
                                            // formatOptionLabel={(teacher) => (
                                            //     <div className="d-flex">
                                            //         <div className="country-option ">
                                            //             <img
                                            //                 width={'35'}
                                            //                 height={'35'}
                                            //                 className="rounded-circle"
                                            //                 src={
                                            //                     IMG_TEACHER_URL +
                                            //                     teacher.image
                                            //                 }
                                            //                 alt="teacher-image"
                                            //             />
                                            //         </div>
                                            //         <div className="d-flex flex-column justify-content-center ml-3">
                                            //             {teacher.label}
                                            //         </div>
                                            //     </div>
                                            // )}
                                            options={listTeacher}
                                            placeholder="Chọn giáo viên"
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
                            <Col
                                md={4}
                                className="mt-4 pt-1 d-flex flex-column-revert"
                            >
                                <Button
                                    className="btn-icon ml-auto btn-3"
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
                                                {dataTransfer[1] &&
                                                    classDetail.maximumQuantity -
                                                        dataTransfer[1].length}
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
                        {renderTransferData()}
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}

export default ClassDetail
