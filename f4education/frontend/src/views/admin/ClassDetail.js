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

import {
    Avatar,
    Box,
    Center,
    Group,
    Loader,
    Text,
    TransferList
} from '@mantine/core'
import Checkbox from '@material-ui/core/Checkbox'

import { useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import classApi from '../../api/classApi'
import registerCourseApi from '../../api/registerCourseApi'
import teacherApi from '../../api/teacherApi'
import Notify from '../../utils/Notify'
import {
    IconCirclePlus,
    IconFileMinus,
    IconFilePlus,
    IconMinus,
    IconUserMinus,
    IconUserPlus
} from '@tabler/icons-react'
import { IconPlus } from '@tabler/icons-react'
import { IconCircleMinus } from '@tabler/icons-react'
const IMG_TEACHER_URL = process.env.REACT_APP_IMAGE_URL + '/teachers/'
const ClassDetail = (props) => {
    let { classIdParam } = useParams()
    const [listTeacher, setListTeacher] = useState([])
    const [loadingTransfer, setLoadingTransfer] = useState(true)
    const [showSelectRegisterCourse, setShowSelectRegisterCourse] =
        useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [loadingGetClassDetail, setLoadingGetClassDetail] = useState(true)
    const [allRegisterCourses, setAllRegisterCourse] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [errors, setErrors] = useState({
        maximumQuantityErr: '',
        minimumQuantityErr: ''
    })
    const [registed, setRegisted] = useState(false) // lớp đã có khóa học hay chưa
    const [addListRegisterId, setAddListRegisterId] = useState([])
    const [deleteListRegisterId, setDeleteListRegisterId] = useState([])
    const [classDetail, setClassDetail] = useState({
        classId: 0,
        className: '',
        courseName: '',
        registerCourseId: 0,
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

    const callFunctionInB = () => {
        console.log('Hàm được gọi từ A')
    }
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
            registerCourseId: classDetail.registerCourseId,
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
            console.log(
                '🚀 ~ file: ClassDetail.js:104 ~ handleSave ~ resp:',
                resp
            )
            if (resp.status === 200) {
                toast.update(id, Notify.options.createSuccess())
                setClassDetail((prev) => ({ ...prev, status: 'Đang diễn ra' }))
                checkRegisterCourseHasClass()
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
            console.log(
                '🚀 ~ file: ClassDetail.js:94 ~ handleSave ~ error:',
                error
            )
        }
    }

    const handleOnChangeTransferList = (dataInList) => {
        setShowConfirmModal(true)
        const maximumQuantity =
            classDetail.maximumQuantity - dataInList[1].length
        const minimumQuantity = dataInList[1].length
        console.log(
            '🚀 ~ file: ClassDetail.js:153 ~ handleOnChangeTransferList ~ minimumQuantity:',
            minimumQuantity
        )
        if (maximumQuantity < 0) {
            setErrors((prev) => ({
                ...prev,
                maximumQuantityErr:
                    'Đã đạt số lượng tối đa, vui lòng kiểm tra lại!'
            }))
            return
        } else {
            setErrors((prev) => ({
                ...prev,
                maximumQuantityErr: ''
            }))
        }
        if (minimumQuantity <= 0) {
            setErrors((prev) => ({
                ...prev,
                minimumQuantityErr:
                    'Bạn không thể xóa toàn bộ học viên khỏi lớp, vui lòng kiểm tra lại!'
            }))
            return
        } else {
            setErrors((prev) => ({
                ...prev,
                minimumQuantityErr: ''
            }))
        }
        setDataTransfer(dataInList)
        console.log(
            'classDetail.maximumQuantity ',
            classDetail.maximumQuantity - dataInList[1].length
        )

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
        console.log(
            '🚀 ~ file: ClassDetail.js:140 ~ handleOnChangeRegisterCoure ~ val:',
            val.value
        )
        //! handle get courseId
        const registerCourseSelected = allRegisterCourses.find((item) => {
            console.log(
                '🚀 ~ file: ClassDetail.js:162 ~ registerCourseSelected ~ item:',
                item
            )
            return item.registerCourseId === val.value
        })
        console.log(
            '🚀 ~ file: ClassDetail.js:167 ~ registerCourseSelected ~ registerCourseSelected:',
            registerCourseSelected
        )

        setClassDetail((prev) => ({
            ...prev,
            registerCourseId: val.value,
            courseName: val.label
        }))

        const studentInClass = allRegisterCourses.filter((item) => {
            return item.classId === parseInt(classIdParam)
        })
        console.log(
            '🚀 ~ file: ClassDetail.js:180 ~ studentInClass ~ studentInClass:',
            studentInClass
        )
        console.log(
            '🚀 ~ file: ClassDetail.js:180 ~ studentInClass ~ allRegisterCourses:',
            allRegisterCourses
        )
        setListStudentInClass([
            ...convertRegisterToStudentArray(studentInClass)
        ])
        const studentInCourse = allRegisterCourses.filter((item) => {
            return (
                item.courseId === registerCourseSelected.courseId &&
                item.classId === null
            )
        })

        setListStudentInCourse([
            ...convertRegisterToStudentArray(studentInCourse)
        ])
        setDataTransfer([
            convertRegisterToStudentArray(studentInCourse),
            convertRegisterToStudentArray(studentInClass)
        ])
    }
    //! CALL APIS

    const checkRegisterCourseHasClass = async () => {
        try {
            const resp = await registerCourseApi.checkRegisterCourseHasClass(
                classIdParam
            )
            console.log(
                '🚀 ~ file: ClassDetail.js:184 ~ checkRegisterCourseHasClass ~ resp:',
                resp
            )
            if (!resp.data) {
                getRegisterCourse()
                setShowSelectRegisterCourse(true)
            } else {
                setShowSelectRegisterCourse(false)
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

                const studentInClass = listRegisterCourse.filter((item) => {
                    return item.classId === parseInt(classIdParam)
                })
                setListStudentInClass([
                    ...convertRegisterToStudentArray(studentInClass)
                ])
                const studentInCourse = listRegisterCourse.filter(
                    (item) =>
                        item.classId !== parseInt(classIdParam) &&
                        item.classId === null
                )

                setListStudentInCourse([
                    ...convertRegisterToStudentArray(studentInCourse)
                ])
                console.log(
                    '🚀 ~ file: ClassDetail.js:259 ~ getAllStudentInCourse ~ ...convertRegisterToStudentArray(studentInCourse):',
                    studentInCourse
                )

                console.log(
                    '🚀 ~ file: ClassDetail.js:263 ~ getAllStudentInCourse ~ ...convertRegisterToStudentArray(studentInClass):',
                    studentInClass
                )

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
            if (resp.status === 200) {
                let firstRegisterCourseId = null
                if (resp.data.registerCourses.length > 0) {
                    firstRegisterCourseId =
                        resp.data.registerCourses[0].registerCourseId
                }

                const { teacher } = resp.data

                if (teacher !== null) {
                    setSelectedTeacher({
                        fullname: teacher.fullname,
                        teacherId: teacher.teacherId
                    })
                } else {
                    setSelectedTeacher({
                        fullname: 'Chưa chọn',
                        teacherId: ''
                    })
                }

                console.log(
                    '🚀 ~ file: ClassDetail.js:393 ~ getClassByClassId ~ resp.data.classId:',
                    resp.data.classId
                )
                setClassDetail({
                    classId: resp.data.classId,
                    ...resp.data,
                    registerCourseId: firstRegisterCourseId
                })
            }
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
            case 'Đang chờ':
                return (
                    <Badge className="font-weight-bold" color="primary">
                        {status}
                    </Badge>
                )
            case 'Đang diễn ra':
                return (
                    <Badge claszsName="font-weight-bold" color="primary">
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
            <Box pos={'relative'}>
                <Text
                    pos={'absolute'}
                    top={0}
                    right={'55%'}
                    translate=""
                    className="text-danger text-center"
                >
                    {errors.maximumQuantityErr}
                </Text>
                <Text
                    pos={'absolute'}
                    top={0}
                    left={'65%'}
                    translate=""
                    className="text-danger text-center"
                >
                    {errors.minimumQuantityErr}
                </Text>
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
                    // showTransferAll={false}
                    placeholder={[
                        'Không còn học viên nào đã đăng ký',
                        'Không còn học viên nào trong lớp'
                    ]}
                    transferAllMatchingFilter={true}
                    listHeight={450}
                    transferIcon={({ reversed }) => {
                        return reversed ? (
                            <IconCircleMinus color="red" />
                        ) : (
                            <IconCirclePlus color="green" />
                        )
                    }}
                />
            </Box>
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
            <ClasssDetailHeader
                courseName={classDetail.courseName}
                className={classDetail.className}
            />

            <Container className="mt--7" fluid>
                <Card>
                    <CardHeader>
                        <Row className=" d-flex justify-content-between">
                            {!showSelectRegisterCourse ? null : (
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
                                    disabled={
                                        selectedTeacher.teacherId === '' ||
                                        classDetail.registerCourseId === 0
                                    }
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
