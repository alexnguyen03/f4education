import React, { useEffect, useState } from 'react'
import { Tabs, Stack, Title, Text, LoadingOverlay } from '@mantine/core'
import { Button, Label, ButtonGroup } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ContentEditable from 'react-contenteditable'
import { Link } from 'react-router-dom'

import studentApi from 'api/studentApi'
const IMG_URL = '/students/'
const user = JSON.parse(localStorage.getItem('user'))

const StudentInformation = () => {
    const [imgData, setImgData] = useState(null)
    const [image, setImage] = useState(null)
    const [errorFullName, setErrorFullName] = useState({})
    const [errorAddress, setErrorAddress] = useState({})
    const [errorPhone, setErrorPhone] = useState({})
    const toastId = React.useRef(null)
    const [loading, setLoading] = useState(true)
    const [validated, setValidated] = useState(false)

    //Nhận data gửi lên từ server
    const [student, setStudent] = useState({
        studentId: 0,
        fullname: '',
        gender: true,
        address: '',
        phone: '',
        image: ''
    })

    const setGender = (gender) => {
        setStudent((preStudent) => ({
            ...preStudent,
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
            setStudent((preStudent) => ({
                ...preStudent,
                image: e.target.files[0].name
            }))
        }
    }

    const getStudent = async () => {
        try {
            setLoading(true)
            const resp = await studentApi.getStudent(user.username)
            console.log(resp.data)

            if (resp.status === 200) {
                setStudent(resp.data)
                setHtmlFullName(resp.data.fullname)
                setHtmlAddress(resp.data.address)
                setHtmlPhone(resp.data.phone)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [htmlFullName, setHtmlFullName] = useState('')
    const [htmlAddress, setHtmlAddress] = useState('')
    const [htmlPhone, setHtmlPhone] = useState('')
    const [isEditing, setIsEditing] = useState(true)
    const [contentEditableStyle, setContentEditableStyle] = useState({
        padding: '10px',
        backgroundColor: 'lightgray'
    })

    const handleChangeFullName = (evt) => {
        setHtmlFullName(evt.target.value)
        setStudent((preStudent) => ({
            ...preStudent,
            fullname: evt.target.value
        }))
        const validationErrors = {}
        if (evt.target.value.trim() === '') {
            validationErrors.fullname = 'Vui lòng nhập họ và tên !!!'
        } else {
            validationErrors.fullname = ''
            setValidated(true)
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrorFullName(validationErrors)
        }
    }

    const handleChangeAddress = (evt) => {
        setHtmlAddress(evt.target.value)
        setStudent((preStudent) => ({
            ...preStudent,
            address: evt.target.value
        }))
        const validationErrors = {}
        if (evt.target.value.trim() === '') {
            validationErrors.address = 'Vui lòng nhập địa chỉ !!!'
        } else {
            validationErrors.address = ''
            setValidated(true)
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrorAddress(validationErrors)
        }
    }

    const handleChangePhone = (evt) => {
        setHtmlPhone(evt.target.value)
        setStudent((preStudent) => ({
            ...preStudent,
            phone: evt.target.value
        }))
        const validationErrors = {}
        if (evt.target.value.trim() === '') {
            validationErrors.phone = 'Vui lòng nhập số điện thoại !!!'
        } else {
            validationErrors.phone = ''
            setValidated(true)
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrorPhone(validationErrors)
        }
    }

    const handleEditClick = () => {
        setIsEditing((prevState) => !prevState)
        if (isEditing === true) {
            setContentEditableStyle({
                padding: '10px',
                backgroundColor: 'white',
                border: '1px solid gray'
            })
        } else {
            setContentEditableStyle({
                padding: '11px',
                backgroundColor: 'lightgray'
            })
        }
    }

    // notification loading
    const notifi_loading = () => {
        toastId.current = toast('Đang cập nhật dữ liệu...', {
            type: toast.TYPE.LOADING,
            autoClose: false,
            isLoading: true,
            closeButton: false,
            closeOnClick: true
        })
    }

    //notifications fail
    const update_fail = () => {
        toast.update(toastId.current, {
            type: toast.TYPE.ERROR,
            render: 'Lỗi kết nối server',
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

    //notifications success
    const update_success = () => {
        toast.update(toastId.current, {
            type: toast.TYPE.SUCCESS,
            render: 'Cập nhật dữ liệu thành công',
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

    const updateStudent = async () => {
        if (validated) {
            notifi_loading()
            const formData = new FormData()
            formData.append('studentRequest', JSON.stringify(student))
            formData.append('file', image)
            try {
                const resp = await studentApi.updateStudent(formData)
                console.log(
                    '🚀 ~ file: Teachers.js:391 ~ updateTeacher ~ resp:',
                    resp
                )
                if (resp.status === 200) {
                    getStudent()
                    update_success()
                } else {
                    update_fail()
                }
            } catch (error) {
                update_fail()
            }
        }
    }

    useEffect(() => {
        getStudent()
    }, [])

    return (
        <>
            <Tabs
                color="violet"
                variant="pills"
                radius="xl"
                defaultValue="gallery"
                orientation="vertical"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 p-0">
                            <h1 className="my-3 text-dark">
                                Cài đặt tài khoản
                            </h1>
                        </div>
                        <div className="col-lg-3 border">
                            <Tabs.List>
                                <Tabs.Tab
                                    value="gallery"
                                    className="d-flex justify-content-center text-lg mt-4 font-weight-bold"
                                >
                                    Thông tin của tôi
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="messages"
                                    className="d-flex justify-content-center text-lg mt-3 font-weight-bold"
                                >
                                    Lớp học của tôi
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="settings"
                                    className="d-flex justify-content-center text-lg mt-3 font-weight-bold"
                                >
                                    Thời khóa biểu
                                </Tabs.Tab>
                            </Tabs.List>
                        </div>
                        <div className="col-lg-9 border">
                            <Tabs.Panel value="gallery">
                                <LoadingOverlay
                                    visible={loading}
                                    zIndex={1000}
                                    color="rgba(46, 46, 46, 1)"
                                    size={50}
                                    overlayProps={{ radius: 'sm', blur: 2 }}
                                />
                                <div className="container px-4">
                                    <div className="row">
                                        <div className="col-lg-12 p-0">
                                            <p className="h1 font-weight-bold text-dark mt-3">
                                                Thông tin của tôi
                                            </p>
                                        </div>
                                        <div className="col-lg-12 shadow">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-lg-3">
                                                        {imgData && (
                                                            <img
                                                                className="rounded-circle p-3 w-100"
                                                                height={180}
                                                                src={imgData}
                                                            />
                                                        )}
                                                        {!imgData && (
                                                            <img
                                                                className="rounded-circle p-3 w-100"
                                                                height={180}
                                                                src={
                                                                    process.env
                                                                        .REACT_APP_IMAGE_URL +
                                                                    IMG_URL +
                                                                    student.image
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="col-lg-9 p-0 d-flex align-content-center flex-wrap">
                                                        <span className="w-100 text-dark text-lg font-weight-bold mb-2">
                                                            {student.fullname}
                                                        </span>
                                                        <Label
                                                            htmlFor="customFile"
                                                            className="form-control-label text-dark font-weight-bold"
                                                        >
                                                            Thay đổi hình ảnh
                                                        </Label>
                                                        <div className="custom-file">
                                                            <input
                                                                type="file"
                                                                name="imageFile"
                                                                accept="image/*"
                                                                className="custom-file-input form-control-alternative"
                                                                id="customFile"
                                                                disabled={
                                                                    isEditing
                                                                }
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container px-4 py-2">
                                    <div className="row">
                                        <div className="col-lg-12 mb-3 shadow">
                                            <div className="container mb-2">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <p className="text-lg font-weight-bold text-dark mt-2">
                                                            Thông tin cá nhân
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <p class="text-dark font-weight-bold mb-2">
                                                            Họ và tên
                                                        </p>
                                                        <ContentEditable
                                                            style={
                                                                contentEditableStyle
                                                            }
                                                            html={htmlFullName} // innerHTML of the editable div
                                                            disabled={isEditing} // use true to disable edition
                                                            onChange={
                                                                handleChangeFullName
                                                            } // handle innerHTML change
                                                        />
                                                        {errorFullName.fullname && (
                                                            <div className="text-danger mt-1 font-italic font-weight-light">
                                                                {
                                                                    errorFullName.fullname
                                                                }
                                                            </div>
                                                        )}
                                                        <p class="text-dark font-weight-bold mb-2 mt-3">
                                                            Địa chỉ
                                                        </p>
                                                        <ContentEditable
                                                            style={
                                                                contentEditableStyle
                                                            }
                                                            html={htmlAddress} // innerHTML of the editable div
                                                            disabled={isEditing} // use true to disable edition
                                                            onChange={
                                                                handleChangeAddress
                                                            } // handle innerHTML change
                                                        />
                                                        {errorAddress.address && (
                                                            <div className="text-danger mt-1 font-italic font-weight-light">
                                                                {
                                                                    errorAddress.address
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <p class="text-dark font-weight-bold mb-2">
                                                            Số điện thoại
                                                        </p>
                                                        <ContentEditable
                                                            style={
                                                                contentEditableStyle
                                                            }
                                                            html={htmlPhone} // innerHTML of the editable div
                                                            disabled={isEditing} // use true to disable edition
                                                            onChange={
                                                                handleChangePhone
                                                            } // handle innerHTML change
                                                        />
                                                        {errorPhone.phone && (
                                                            <div className="text-danger mt-1 font-italic font-weight-light">
                                                                {
                                                                    errorPhone.phone
                                                                }
                                                            </div>
                                                        )}
                                                        <p class="text-dark font-weight-bold mb-2 mt-3">
                                                            Giới tính
                                                        </p>
                                                        {isEditing ? (
                                                            <Button color="primary mb-3">
                                                                {student.gender
                                                                    ? 'Nam'
                                                                    : 'Nữ'}
                                                            </Button>
                                                        ) : (
                                                            <ButtonGroup>
                                                                <Button
                                                                    color="primary mb-3"
                                                                    outline
                                                                    onClick={() =>
                                                                        setGender(
                                                                            true
                                                                        )
                                                                    }
                                                                    active={
                                                                        student.gender ===
                                                                        true
                                                                    }
                                                                >
                                                                    Nam
                                                                </Button>
                                                                <Button
                                                                    color="primary mb-3"
                                                                    outline
                                                                    name="gender"
                                                                    onClick={() =>
                                                                        setGender(
                                                                            false
                                                                        )
                                                                    }
                                                                    active={
                                                                        student.gender ===
                                                                        false
                                                                    }
                                                                >
                                                                    Nữ
                                                                </Button>
                                                            </ButtonGroup>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <Button
                                                            color="dark"
                                                            role="button"
                                                            className="float-right mb-3"
                                                            disabled={isEditing}
                                                            onClick={
                                                                updateStudent
                                                            }
                                                        >
                                                            Cập nhật
                                                        </Button>
                                                        <Button
                                                            color="info"
                                                            role="button"
                                                            className="float-right mr-3 mb-3"
                                                            onClick={
                                                                handleEditClick
                                                            }
                                                        >
                                                            Chỉnh sửa
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="messages">
                                <Link to='/quizz'>
                                    <Button
                                        color="dark"
                                        role="button"
                                        className="my-3"
                                    >
                                        Lớp học
                                    </Button>
                                </Link>
                            </Tabs.Panel>
                            <Tabs.Panel value="settings">
                                Settings tab content
                            </Tabs.Panel>
                        </div>
                    </div>
                </div>
            </Tabs>
            <ToastContainer />
        </>
    )
}

export default StudentInformation
