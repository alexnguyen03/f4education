import ClasssDetailHeader from 'components/Headers/ClasssDetailHeader'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
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

import { Avatar, Group, Loader, Text, TransferList } from '@mantine/core'
import Checkbox from '@material-ui/core/Checkbox'

import { useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import classApi from '../../api/classApi'
import registerCourseApi from '../../api/registerCourseApi'
import teacherApi from '../../api/teacherApi'
import Notify from '../../utils/Notify'
const IMG_TEACHER_URL = process.env.REACT_APP_IMAGE_URL + '/teachers/'
const ClassDetail = () => {
    let { classIdParam } = useParams()
    const [listTeacher, setListTeacher] = useState([])
    const [loadingTransfer, setLoadingTransfer] = useState(true)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [loadingGetClassDetail, setLoadingGetClassDetail] = useState(true)
    const [allRegisterCourses, setAllRegisterCourse] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [registed, setRegisted] = useState(false) // lớp đã có khóa học hay chưa
    const [addListRegisterId, setAddListRegisterId] = useState([])
    const [deleteListRegisterId, setDeleteListRegisterId] = useState([])
    const [classDetail, setClassDetail] = useState({
        classId: 0,
        className: '',
        courseName: '',
        courseId: 0,
        startDate: '',
        endDate: '',
        maximumQuantity: 'Đang tải...',
        status: '-',
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
            fullname: 'Đang tải...',
            gender: true
        }
    })

    const [selectedTeacher, setSelectedTeacher] = useState({
        fullname: '',
        teacherId: ''
    })
    const [listCourse, setListCourse] = useState([])
    const [listStudentInCourse, setListStudentInCourse] = useState([{}])
    const [listStudentInClass, setListStudentInClass] = useState([{}])
    const [dataTransfer, setDataTransfer] = useState([
        listStudentInCourse,
        listStudentInClass
    ])

    // ! HANDLE FUNCTIONS
    const handleSave = async () => {
        const id = toast(Notify.msg.loading, Notify.options.loading())

        console.log(addListRegisterId)
        console.log(deleteListRegisterId)
        const classRequest = {
            classId: classDetail.classId,
            courseId: classDetail.courseId,
            teacherId: selectedTeacher.teacherId,
            listRegisterCourseIdToAdd: addListRegisterId.map((item) =>
                item.value.trim()
            ),
            listRegisterCourseIdToDelete: deleteListRegisterId.map((item) =>
                item.value.trim()
            )
        }
        console.log(
            '🚀 ~ file: ClassDetail.js:130 ~ handleSave ~ classRequest:',
            classRequest
        )
        try {
            const resp = await registerCourseApi.updateRegisterCourse(
                classRequest
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())
            }
        } catch (error) {
            // toast.update(id, Notify.options.updateError())
            console.log(
                '🚀 ~ file: ClassDetail.js:94 ~ handleSave ~ error:',
                error
            )
        }
    }

    const handleOnChangeTransferList = (dataInList) => {
        setShowConfirmModal(true)
        setDataTransfer(dataInList)
        let tempAddElement = dataInList[1].filter(
            (item1) =>
                !listStudentInClass
                    .map((item2) => {
                        return item2.value + ' '
                    })
                    .includes(item1.value + ' ')
        )

        setAddListRegisterId([...tempAddElement])

        let tempDeleteElement = listStudentInClass.filter(
            (item1) =>
                !dataInList[1]
                    .map((item2) => item2.value + ' ')
                    .includes(item1.value + ' ')
        )

        setDeleteListRegisterId([...tempDeleteElement])
    }

    const handleOnChangeRegisterCoure = (val) => {
        const registeCourseSelected = allRegisterCourses.find((item) => {
            return item.registerCourseId === val.value
        })

        const studentInCourse = allRegisterCourses.filter((item) => {
            return item.courseId === registeCourseSelected.courseId
        })

        setListStudentInCourse([
            ...convertRegisterToStudentArray(studentInCourse)
        ])
        setDataTransfer([convertRegisterToStudentArray(studentInCourse), []])
    }
    //! CALL APIS

    const checkRegisterCourseHasClass = async () => {
        try {
            const resp = await registerCourseApi.checkRegisterCourseHasClass(
                classIdParam
            )
            if (!resp.data) {
                getRegisterCourse()
            }
        } catch (error) {
            console.log(
                '🚀 ~ file: ClassDetail.js:141 ~ checkRegisterCourseHasClass ~ error:',
                error
            )
        }
    }
    const getRegisterCourse = async () => {
        try {
            const resp = await registerCourseApi.getRegisterCourseDistinc()
            console.log(
                '🚀 ~ file: ClassDetail.js:150 ~ getRegisterCourse ~ resp:',
                resp
            )
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
        const convertedArray = arr.map((item) => {
            return {
                value: item.registerCourseId + ' ',
                label: item.studentName,
                description: item.studentId
            }
        })
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

                setListStudentInCourse([
                    ...convertRegisterToStudentArray(studentInCourse)
                ])

                setListStudentInClass([
                    ...convertRegisterToStudentArray(studentInClass)
                ])

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
                            label: fullname + ' - ' + teacherId,
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
        var fullname = label.split('-')[0].trim()
        setSelectedTeacher({
            fullname: fullname,
            teacherId: value
        })
    }
    const getClassByClassId = async () => {
        setLoadingGetClassDetail(true)
        try {
            const resp = await classApi.getByClassId(classIdParam)
            console.log(
                '🚀 ~ file: ClassDetail.js:267 ~ getClassByClassId ~ resp:',
                resp
            )

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
            case 'Đang diễn ra':
                return (
                    <Badge className="font-weight-bold" color="primary">
                        {status}
                    </Badge>
                )
            case 'Kết thúc':
                return (
                    <Badge className="font-weight-bold" color="success">
                        {status}
                    </Badge>
                )

            default:
                return (
                    <Badge className="font-weight-bold" color="success">
                        Đang tải...
                    </Badge>
                )
        }
    }
    const TransferListItem = ({ data, selected }) => {
        return (
            <Group noWrap>
                <Avatar src={data.image} radius="xl" size="lg" />
                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {data.label}
                    </Text>
                    <Text size="xs" color="dimmed" weight={400}>
                        Mã HV: {data.description}
                    </Text>
                </div>
                <Checkbox
                    checked={selected}
                    onChange={() => {}}
                    tabIndex={-1}
                    sx={{ pointerEvents: 'none' }}
                />
            </Group>
        )
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
                    <TransferListItem data={data} selected={selected} />
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

        checkRegisterCourseHasClass()
    }, [])

    useEffect(() => {
        getAllStudentInCourse()
    }, [classDetail.courseId])
    useEffect(() => {
        setClassDetail((prevState) => ({
            ...prevState,
            teacher: {
                ...prevState.teacher,
                teacherId: selectedTeacher.teacherId,
                fullname: selectedTeacher.fullname
            }
        }))
    }, [selectedTeacher])

    return (
        <>
            <ToastContainer />
            <ClasssDetailHeader />
            <Container className="mt--7" fluid>
                <Card>
                    <CardHeader>
                        <Row className=" d-flex justify-content-between">
                            {listCourse.length === 0 ? null : (
                                <Col md={4}>
                                    <Label>Chọn khóa học</Label>
                                    <Select
                                        options={listCourse}
                                        placeholder="Chọn khóa học"
                                        onChange={(val) => {
                                            handleOnChangeRegisterCoure(val)
                                        }}
                                        isSearchable={true}
                                        className="form-control-alternative "
                                        styles={{ outline: 'none' }}
                                    />
                                </Col>
                            )}
                            {
                                <Col md={4}>
                                    <Label>Chọn giáo viên phụ trách</Label>
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
                                </Col>
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
                                                {!isNaN(
                                                    dataTransfer[1] &&
                                                        classDetail.maximumQuantity -
                                                            dataTransfer[1]
                                                                .length
                                                )
                                                    ? dataTransfer[1] &&
                                                      classDetail.maximumQuantity -
                                                          dataTransfer[1].length
                                                    : 'Đang tải...'}
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
                                                          .fullname +
                                                      ' - ' +
                                                      classDetail.teacher
                                                          .teacherId
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
