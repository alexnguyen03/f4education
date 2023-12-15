import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    Row
} from 'reactstrap'

import {
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    Image,
    Overlay,
    Paper,
    Tabs,
    Text,
    Title
} from '@mantine/core'
import { ToastContainer, toast } from 'react-toastify'
import Notify from '../../utils/Notify'
import teacherApi from 'api/teacherApi'
const IMG_URL = '/avatars/teachers/'

const Information = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [imgData, setImgData] = useState(null)
    const [image, setImage] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [rSelected, setRSelected] = useState(null) //radio button
    const [errors, setErrors] = useState({})

    //Nhận data gửi lên từ server
    const [teacher, setTeacher] = useState({
        teacherId: '',
        fullname: '',
        gender: true,
        dateOfBirth: '',
        citizenIdentification: '',
        address: '',
        levels: '',
        phone: '',
        image: '',
        acccountID: 0
    })

    // Dùng để gửi request về sever
    const [teacherRequest, setTeacherRequest] = useState({
        teacherId: '',
        fullname: '',
        gender: true,
        dateOfBirth: '',
        citizenIdentification: '',
        address: '',
        levels: '',
        phone: '',
        image: '',
        acccountID: 0
    })

    //Reset form edit
    const handleResetForm = () => {
        // hide form
        setShowForm((pre) => !pre)
        setImgData(null)
        setErrors({})
    }

    //Show form edit thông tin giáo viên
    const handleEditFrom = (row) => {
        setShowForm(true)
    }

    // Thay đổi giá trị trên ô input
    const handelOnChangeInput = (e) => {
        //Còn đang xử lý
        setTeacher({
            ...teacher,
            [e.target.name]: e.target.value,
            numberSession: 0
        })
    }

    const setGender = (gender) => {
        setTeacher((preTeacher) => ({
            ...preTeacher,
            gender: gender
        }))
    }

    // Cập nhật hình ảnh
    const onChangePicture = (e) => {
        setImage(null)
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            setTeacher((preTeacher) => ({
                ...preTeacher,
                image: e.target.files[0].name
            }))
        }
    }

    const getTeacher = async () => {
        try {
            // const resp = await teacherApi.getTeacher('johnpc03517')
            const resp = await teacherApi.getTeacher(user.username)
            if (resp.status === 200) {
                setTeacher(resp.data)
                setRSelected(resp.data.gender)
            }
        } catch (error) {
            console.log(error)
        } finally {
        }
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()
        updateTeacher()
    }

    const validateForm = () => {
        let validationErrors = {}
        let test = 0
        if (!teacher.fullname) {
            validationErrors.fullname = 'Vui lòng nhập tên giảng viên !!!'
            test++
        } else {
            validationErrors.fullname = ''
        }

        if (!teacher.citizenIdentification) {
            validationErrors.citizenIdentification =
                'Vui lòng nhập CCCD của giảng viên!!!'
            test++
        } else {
            if (teacher.citizenIdentification.length != 12) {
                validationErrors.citizenIdentification = 'Số CCCD gồm 12 số!!!'
                test++
            } else {
                validationErrors.citizenIdentification = ''
            }
        }

        if (!teacher.address) {
            validationErrors.address = 'Vui lòng nhập địa chỉ của giảng viên!!!'
            test++
        } else {
            validationErrors.address = ''
        }

        if (!teacher.levels) {
            validationErrors.levels =
                'Vui lòng nhập trình độ học vấn của giảng viên!!!'
            test++
        } else {
            validationErrors.levels = ''
        }

        const isVNPhoneMobile =
            /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/

        if (!isVNPhoneMobile.test(teacher.phone)) {
            validationErrors.phone = 'Không đúng định dạng số điện thoại!!!'
            test++
        } else {
            validationErrors.phone = ''
        }

        if (test === 0) {
            return {}
        }
        return validationErrors
    }

    const updateTeacher = async () => {
        const validationErrors = validateForm()
        console.log(Object.keys(validationErrors).length)

        if (Object.keys(validationErrors).length === 0) {
            var id = null
            const formData = new FormData()
            formData.append('teacherRequest', JSON.stringify(teacherRequest))
            formData.append('file', image)
            try {
                id = toast(Notify.msg.loading, Notify.options.loading())
                const resp = await teacherApi.updateTeacher(formData)
                console.log(
                    '🚀 ~ file: Teachers.js:391 ~ updateTeacher ~ resp:',
                    resp
                )
                if (resp.status === 200) {
                    toast.update(id, Notify.options.updateSuccess())
                    handleResetForm()
                    getTeacher()
                } else {
                    toast.update(id, Notify.options.updateError())
                }
            } catch (error) {
                toast.update(id, Notify.options.updateError())
            }
        } else {
            setErrors(validationErrors)
        }
    }

    useEffect(() => {
        const {
            teacherId,
            fullname,
            gender,
            dateOfBirth,
            citizenIdentification,
            address,
            levels,
            phone,
            image,
            acccountID
        } = { ...teacher }

        setTeacherRequest({
            teacherId: teacherId,
            fullname: fullname,
            gender: gender,
            dateOfBirth: dateOfBirth,
            citizenIdentification: citizenIdentification,
            address: address,
            levels: levels,
            phone: phone,
            image: image,
            acccountID: acccountID
        })
    }, [teacher])

    useEffect(() => {
        getTeacher()
    }, [])

    return (
        <>
            {/* Toast  */}
            <ToastContainer />

            {/* Main content */}
            <Container fluid>
                <Title color="dark" order={1} fw={500} mt={10}>
                    Cập nhật thông tin cá nhân
                </Title>

                <Paper shadow="sm" p="xl" mt={10} radius="md" withBorder>
                    <Grid>
                        <Grid.Col span={2}>
                            <Flex
                                direction={'column'}
                                justify="center"
                                align={'center'}
                                gap={8}
                                my={'auto'}
                                mx={'auto'}
                            >
                                <Image
                                    src={
                                        process.env.REACT_APP_IMAGE_URL +
                                        IMG_URL +
                                        teacher.image
                                    }
                                    radius={30}
                                    width={150}
                                    height={150}
                                    fit={'contain'}
                                    alt="teacher_image"
                                    withPlaceholder
                                />
                                <Text
                                    color="dimmed"
                                    size="md"
                                    fw={500}
                                    lineClamp={3}
                                >
                                    Giảng viên
                                </Text>
                                <Text
                                    color="dark"
                                    size="xl"
                                    fw={500}
                                    lineClamp={3}
                                >
                                    {teacher.fullname}
                                </Text>
                            </Flex>
                        </Grid.Col>
                        <Grid.Col span={10}>
                            <Grid my={'auto'}>
                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Email:
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {`${teacher.teacherId}@gmail.com`}
                                        </Text>
                                    </Group>
                                </Grid.Col>
                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Giới tính:
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {teacher.gender ? 'Nam' : 'Nữ'}
                                        </Text>
                                    </Group>
                                </Grid.Col>
                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Ngày sinh:
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {moment(teacher.dateOfBirth).format(
                                                'DD/MM/yyyy'
                                            )}
                                        </Text>
                                    </Group>
                                </Grid.Col>
                            </Grid>

                            <Divider mt={30} />

                            <Grid mt={30}>
                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Địa chỉ:
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {teacher.address}
                                        </Text>
                                    </Group>
                                </Grid.Col>

                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Số điện thoại:
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {teacher.phone}
                                        </Text>
                                    </Group>
                                </Grid.Col>
                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Căn cước công dân (CCCD):
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {teacher.citizenIdentification}
                                        </Text>
                                    </Group>
                                </Grid.Col>
                                <Grid.Col xl={6} lg={6} md={6}>
                                    <Group position="left">
                                        <Text color="dimmed" size="xl" fw={500}>
                                            Trình độ:
                                        </Text>
                                        <Text color="dark" size="xl" fw={500}>
                                            {teacher.levels}
                                        </Text>
                                    </Group>
                                </Grid.Col>
                                <Grid.Col mt={30}>
                                    <Button
                                        color="primary"
                                        sỉze="lg"
                                        onClick={() => {
                                            handleEditFrom()
                                        }}
                                    >
                                        Cập nhật thông tin cá nhân
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </Container>

            {/* Modal */}
            <Modal
                className="modal-dialog-centered  modal-lg "
                isOpen={showForm}
                backdrop="static"
                toggle={() => setShowForm((pre) => !pre)}
            >
                <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
                    <div className="modal-header">
                        <h3 className="mb-0">
                            Thông tin giảng viên '{teacher.fullname}'
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={handleResetForm}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="px-lg-2">
                            <Row>
                                <Col sm={6}>
                                    <FormGroup>
                                        <label
                                            className="form-control-label"
                                            htmlFor="input-email"
                                        >
                                            Tên giảng viên
                                        </label>

                                        <Input
                                            className="form-control-alternative"
                                            id="input-course-name"
                                            placeholder="Tên giảng viên"
                                            type="text"
                                            onChange={handelOnChangeInput}
                                            name="fullname"
                                            value={teacher.fullname}
                                        />
                                        {errors.fullname && (
                                            <div className="text-danger mt-1 font-italic font-weight-light">
                                                {errors.fullname}
                                            </div>
                                        )}
                                    </FormGroup>
                                    <Row>
                                        <Col md={12}>
                                            <ButtonGroup>
                                                <Button
                                                    color="primary"
                                                    outline
                                                    onClick={() =>
                                                        setGender(true)
                                                    }
                                                    active={
                                                        teacher.gender === true
                                                    }
                                                >
                                                    Nam
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    outline
                                                    name="gender"
                                                    onClick={() =>
                                                        setGender(false)
                                                    }
                                                    active={
                                                        teacher.gender === false
                                                    }
                                                >
                                                    Nữ
                                                </Button>
                                            </ButtonGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <br></br>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    Trình độ học vấn
                                                </label>

                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-course-name"
                                                    placeholder="Trình độ học vấn"
                                                    type="text"
                                                    onChange={
                                                        handelOnChangeInput
                                                    }
                                                    name="levels"
                                                    value={teacher.levels}
                                                />
                                                {errors.levels && (
                                                    <div className="text-danger mt-1 font-italic font-weight-light">
                                                        {errors.levels}
                                                    </div>
                                                )}
                                                <br></br>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-email"
                                                >
                                                    Số điện thoại
                                                </label>

                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-course-name"
                                                    placeholder="Số điện thoại"
                                                    type="text"
                                                    onChange={
                                                        handelOnChangeInput
                                                    }
                                                    name="phone"
                                                    value={teacher.phone}
                                                />
                                                {errors.phone && (
                                                    <div className="text-danger mt-1 font-italic font-weight-light">
                                                        {errors.phone}
                                                    </div>
                                                )}
                                                <br></br>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="citizenIdentification"
                                                >
                                                    Số CCCD
                                                </label>

                                                <Input
                                                    className="form-control-alternative"
                                                    id="citizenIdentification"
                                                    placeholder="Số CCCD"
                                                    type="text"
                                                    onChange={
                                                        handelOnChangeInput
                                                    }
                                                    name="citizenIdentification"
                                                    value={
                                                        teacher.citizenIdentification
                                                    }
                                                />
                                                {errors.citizenIdentification && (
                                                    <div className="text-danger mt-1 font-italic font-weight-light">
                                                        {
                                                            errors.citizenIdentification
                                                        }
                                                    </div>
                                                )}
                                                <br></br>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-last-name"
                                                >
                                                    Ngày sinh
                                                </label>

                                                <Input
                                                    className="form-control-alternative"
                                                    // value={teacher.dateOfBirth}
                                                    value={moment(
                                                        teacher.dateOfBirth
                                                    ).format('YYYY-MM-DD')}
                                                    // pattern="yyyy-MM-dd"
                                                    id="input-coursePrice"
                                                    type="date"
                                                    name="dateOfBirth"
                                                    onChange={
                                                        handelOnChangeInput
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={6}>
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-last-name"
                                                >
                                                    Địa chỉ
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-courseDescription"
                                                    name="address"
                                                    value={teacher.address}
                                                    type="textarea"
                                                    onChange={
                                                        handelOnChangeInput
                                                    }
                                                />
                                                {errors.address && (
                                                    <div className="text-danger mt-1 font-italic font-weight-light">
                                                        {errors.address}
                                                    </div>
                                                )}
                                                <Label
                                                    htmlFor="exampleFile"
                                                    className="form-control-label"
                                                >
                                                    Ảnh đại diện
                                                </Label>
                                                <div className="custom-file">
                                                    <input
                                                        type="file"
                                                        name="imageFile"
                                                        accept="image/*"
                                                        className="custom-file-input form-control-alternative"
                                                        id="customFile"
                                                        onChange={
                                                            onChangePicture
                                                        }
                                                    />
                                                    <label
                                                        className="custom-file-label"
                                                        htmlFor="customFile"
                                                    >
                                                        Chọn hình ảnh
                                                    </label>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <div className="previewProfilePic px-3">
                                            {imgData && (
                                                <img
                                                    width={350}
                                                    height={330}
                                                    className="playerProfilePic_home_tile"
                                                    src={imgData}
                                                    alt="teacher_image"
                                                />
                                            )}
                                            {!imgData && (
                                                <img
                                                    width={350}
                                                    height={330}
                                                    src={
                                                        process.env
                                                            .REACT_APP_IMAGE_URL +
                                                        IMG_URL +
                                                        teacher.image
                                                    }
                                                    alt="teacher_image"
                                                />
                                            )}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <hr className="my-4" />
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={handleResetForm}
                        >
                            Đóng
                        </Button>
                        <Button color="primary" type="submit" className="px-5">
                            Cập nhật
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default Information
