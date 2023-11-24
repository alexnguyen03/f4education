import {
    Edit as EditIcon,
    Margin,
    RemoveCircleOutline as RemoveCircleOutlineIcon
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import accountApi from '../../../api/accountApi'
import moment from 'moment'
import AccountHeader from 'components/Headers/AccountHeader'
import { MaterialReactTable } from 'material-react-table'
import { memo, useEffect, useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams } from 'react-router-dom'
import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
    ButtonGroup
} from 'reactstrap'
import { create } from 'nouislider'
const IMG_URL = '/courses/'
const Register = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')
    const [imgData, setImgData] = useState(null)
    const [students, setStudents] = useState([])
    const [rSelected, setRSelected] = useState(null) //radio button
    const [image, setImage] = useState(null)
    const [update, setUpdate] = useState(false)
    const [errors, setErrors] = useState({})
    const toastId = React.useRef(null)
    const { email } = useParams()

    // notification loading
    const notifi_loading = (mess) => {
        toastId.current = toast(mess, {
            type: toast.TYPE.LOADING,
            autoClose: false,
            isLoading: true,
            closeButton: false,
            closeOnClick: true
        })
    }

    //notifications success
    const update_success = (mess) => {
        toast.update(toastId.current, {
            type: toast.TYPE.SUCCESS,
            render: mess,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            isLoading: false
        })
    }

    //notifications fail
    const update_fail = (mess) => {
        toast.update(toastId.current, {
            type: toast.TYPE.ERROR,
            render: mess,
            position: 'top-right',
            // autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            isLoading: false
        })
    }

    //custom notification
    const notifi = (mess, type) => {
        toast(mess, {
            type: toast.TYPE[type],
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        })
    }

    //Nhận data vai trò học viên gửi lên từ server
    const [student, setStudent] = useState({
        id: 0,
        username: '',
        password: '',
        email: email,
        roles: 1,
        status: true,
        student: {
            studentId: 0,
            fullname: '',
            gender: true,
            address: '',
            phone: '',
            image: ''
        }
    })

    const [studentRequest, setStudentRequest] = useState({
        id: 0,
        username: '',
        password: '',
        email: '',
        roles: 1,
        status: false,
        student: {
            studentId: 0,
            fullname: '',
            gender: true,
            address: '',
            phone: '',
            image: ''
        }
    })

    const handelOnChangeInput = (e) => {
        const { name, value } = e.target
        setStudent((preStudent) => ({
            ...preStudent,
            [name]: value,
            student: {
                ...preStudent.student,
                [name]: value
            }
        }))
    }

    // Gọi API của học viên
    const handleSubmitForm = (e) => {
        e.preventDefault()
        create()
    }

    const validateForm = () => {
        let validationErrors = {}
        let test = 0

        if (!student.password) {
            validationErrors.password = 'Vui lòng nhập password!!!'
            test++
        } else {
            if (student.password.length < 6) {
                validationErrors.password = 'Password tối thiểu gồm 6 kí tự!!!'
                test++
            } else {
                validationErrors.password = ''
            }
        }

        if (!student.student.fullname) {
            validationErrors.fullname = 'Vui lòng nhập tên!!!'
            test++
        } else {
            validationErrors.fullname = ''
        }

        if (!student.student.address) {
            validationErrors.address = 'Vui lòng nhập địa chỉ!!!'
            test++
        } else {
            validationErrors.address = ''
        }

        const isVNPhoneMobile =
            /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/

        if (!isVNPhoneMobile.test(student.student.phone)) {
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

    const onChangePicture = (e) => {
        setImage(null)
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            setStudent((preStudent) => ({
                ...preStudent,
                image: e.target.files[0].name
            }))
        }
    }

    // Thêm thông tin học viên
    const create = async () => {
        const validate = validateForm()

        if (Object.keys(validate).length === 0) {
            notifi_loading('Đang thêm dữ liệu...')
            setErrors([])
            const formData = new FormData()
            formData.append('request', JSON.stringify(studentRequest))
            formData.append('file', image)
            // console.log("🚀 ~ file: Teachers.js:300 ~ updateTeacher ~ image:", image);
            try {
                const resp = await accountApi.addAccount(formData)
                if (resp.status === 200) {
                    update_success('Tạo tài khoản thành công')
                } else {
                    if (resp.data.message === '1') {
                        update_fail('Email đã được sử dụng')
                    } else {
                        update_fail('Lỗi kết nối server')
                    }
                }
            } catch (error) {
                console.log('updateTeacher', error)
                update_fail('Lỗi kết nối server')
            }
        } else {
            setErrors(validate)
        }
    }

    const setGender = (gender) => {
        setStudent((preStudent) => ({
            ...preStudent,
            student: {
                ...preStudent.student,
                gender: gender
            }
        }))
    }

    useEffect(() => {
        const {
            id,
            username,
            password,
            email,
            status,
            student: { studentId, fullname, gender, address, phone, image }
        } = { ...student }
        setStudentRequest({
            id: id,
            username: username,
            password: password,
            email: email,
            status: true,
            roles: 1,
            student: {
                studentId: studentId,
                fullname: fullname,
                gender: gender,
                address: address,
                phone: phone,
                image: image
            }
        })
    }, [student])

    return (
        <>
            <ToastContainer />
            <Container
                className="mt--7"
                fluid
                style={{ paddingTop: '72px', width: '80%' }}
            >
                <CardBody>
                    <Form
                        onSubmit={handleSubmitForm}
                        encType="multipart/form-data"
                    >
                        <div className="modal-body">
                            <div className="px-lg-2">
                                <Row>
                                    <Col sm={6}>
                                        <FormGroup>
                                            <label
                                                hidden={update}
                                                className="form-control-label"
                                                htmlFor="input-password"
                                            >
                                                Mật khẩu
                                            </label>

                                            <Input
                                                className="form-control-alternative"
                                                id="input-password"
                                                placeholder="Nhập mật khẩu của bạn..."
                                                type="password"
                                                onChange={handelOnChangeInput}
                                                name="password"
                                                hidden={update}
                                                value={student.password}
                                            />
                                            {errors.password && (
                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                    {errors.password}
                                                </div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm={6}>
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-email"
                                            >
                                                Họ và tên
                                            </label>

                                            <Input
                                                className="form-control-alternative"
                                                id="input-course-name"
                                                placeholder="Họ và tên của bạn..."
                                                type="text"
                                                onChange={handelOnChangeInput}
                                                name="fullname"
                                                value={student.student.fullname}
                                            />
                                            {errors.fullname && (
                                                <div className="text-danger mt-1 font-italic font-weight-light">
                                                    {errors.fullname}
                                                </div>
                                            )}
                                        </FormGroup>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Số điện thoại
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-course-name"
                                                        placeholder="Số điện thoại..."
                                                        type="text"
                                                        onChange={
                                                            handelOnChangeInput
                                                        }
                                                        name="phone"
                                                        value={
                                                            student.student
                                                                .phone
                                                        }
                                                    />
                                                    {errors.phone && (
                                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                                            {errors.phone}
                                                        </div>
                                                    )}
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
                                                        placeholder="Địa chỉ..."
                                                        value={
                                                            student.student
                                                                .address
                                                        }
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
                                                        Giới tính
                                                    </label>
                                                    <br />
                                                    <ButtonGroup>
                                                        <Button
                                                            color="primary"
                                                            outline
                                                            onClick={() =>
                                                                setGender(true)
                                                            }
                                                            active={
                                                                student.student
                                                                    .gender ===
                                                                true
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
                                                                student.student
                                                                    .gender ===
                                                                false
                                                            }
                                                        >
                                                            Nữ
                                                        </Button>
                                                    </ButtonGroup>
                                                    <br />
                                                    <br />
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
                                                        alt=""
                                                        width={350}
                                                        className="playerProfilePic_home_tile"
                                                        src={imgData}
                                                    />
                                                )}
                                                {!imgData && (
                                                    <img
                                                        alt=""
                                                        width={350}
                                                        className=""
                                                        src={
                                                            process.env
                                                                .REACT_APP_IMAGE_URL +
                                                            IMG_URL +
                                                            student.student
                                                                .image
                                                        }
                                                    />
                                                )}
                                                {!student.student.image &&
                                                    !imgData && (
                                                        <img
                                                            alt=""
                                                            width={350}
                                                            className=""
                                                            src={
                                                                process.env
                                                                    .REACT_APP_IMAGE_URL +
                                                                IMG_URL +
                                                                'defaultImgUser.jpg'
                                                            }
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
                            {/* <Button
                                color="secondary"
                                data-dismiss="modal"
                                type="button"
                                onClick={handleResetForm}
                            >
                                Hủy
                            </Button> */}
                            <Button
                                color="primary"
                                type="submit"
                                className="px-5"
                            >
                                Lưu
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Container>
        </>
    )
}
export default memo(Register)