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
const IMG_URL = '/courses/'
const ForgotPassword = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')
    const [first, setFirst] = useState(true)
    const [OTP2, setOTP2] = useState(1)
    const [trueOTP, setTrueOTP] = useState(false)
    const [errors, setErrors] = useState({})
    const toastId = React.useRef(null)

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
    const [OTP, setOTP] = useState({
        email: '',
        OTP: ''
    })

    const [OTPRequest, setOTPRequest] = useState({
        email: '',
        OTP: ''
    })

    const handelOnChangeInput = (e) => {
        // const { name, value } = e.target
        // setStudent((preStudent) => ({
        //     ...preStudent,
        //     [name]: value,
        //     student: {
        //         ...preStudent.student,
        //         [name]: value
        //     },
        //     numberSession: 0
        // }))
    }

    // Gọi API của học viên
    const handleSubmitForm = (e) => {
        e.preventDefault()
        createStudent()
    }

    const senOTP = (e) => {
        handleReset()
        e.preventDefault()
        setOTP2(2)
    }

    const validateForm = () => {
        let validationErrors = {}
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!OTP.email) {
            validationErrors.email = 'Vui lòng nhập email!!!'
            return validationErrors
        } else {
            if (!isEmail.test(OTP.email)) {
                validationErrors.email = 'Không đúng định dạng email!!!'
                return validationErrors
            } else {
                return {}
            }
        }
    }

    // Thêm thông tin học viên
    const createStudent = async () => {
        // const validate = validateForm()
        // if (Object.keys(validate).length === 0) {
        //     notifi_loading('Đang kiểm tra email...')
        //     setErrors([])
        //     try {
        //         const resp = await accountApi.checkMail(student)
        //         if (resp.status === 200) {
        //             update_success('Đã gửi thư xác thực email!')
        //         } else {
        //             if (resp.data.message === '1') {
        //                 update_fail('Email đã được sử dụng')
        //             } else {
        //                 update_fail('Lỗi kết nối server')
        //             }
        //         }
        //     } catch (error) {
        //         console.log('updateTeacher', error)
        //         update_fail('Lỗi kết nối server')
        //     }
        // } else {
        //     setErrors(validate)
        // }
    }

    // useEffect(() => {
    //     const { email } = { ...student }
    //     setStudentRequest({
    //         email: email
    //     })
    // }, [student])

    // ! Update OTP start
    const storedStartTime = localStorage.getItem('countdown_start_time')
    const storedSeconds = localStorage.getItem('countdown_seconds')

    const [startTime, setStartTime] = useState(
        storedStartTime || Date.now().toString()
    )

    const [seconds, setSeconds] = useState(
        storedSeconds ? parseInt(storedSeconds) : 60
    )

    useEffect(() => {
        localStorage.setItem('countdown_start_time', startTime)
        localStorage.setItem('countdown_seconds', seconds.toString())
    }, [startTime, seconds])

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds <= 0) {
                    return 0
                }
                if (prevSeconds === 46) {
                    setOTP2(3)
                }
                return prevSeconds - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (time) => (time < 10 ? `0${time}` : time)

    const handleReset = () => {
        setStartTime(Date.now().toString())
        setSeconds(60)
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return (
        <>
            <ToastContainer />
            <Container
                className="mt--7"
                fluid
                style={{ paddingTop: '72px', width: '50%' }}
            >
                <CardBody>
                    <Form
                        sm={6}
                        onSubmit={handleSubmitForm}
                        encType="multipart/form-data"
                    >
                        <div className="modal-body">
                            <div className="px-lg-2">
                                <FormGroup>
                                    {/* Update OTP --------------------------------------------------------------------------- */}
                                    <div>
                                        <p className="text-danger">
                                            OTP sẽ hết hiệu lực trong:{' '}
                                            {formatTime(minutes)}:
                                            {formatTime(remainingSeconds)}
                                        </p>
                                        {/* <button onClick={handleReset}>
                                            Reset
                                        </button> */}
                                    </div>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Nhập email tài khoản của bạn
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-course-name"
                                        placeholder="Nhập vào email của bạn..."
                                        type="text"
                                        onChange={handelOnChangeInput}
                                        name="email"
                                        value={OTP.email}
                                    />
                                    {errors.email && (
                                        <div className="text-danger mt-1 font-italic font-weight-light">
                                            {errors.email}
                                        </div>
                                    )}
                                    {errors.success && (
                                        <div className="text-success mt-1 font-italic font-weight-light">
                                            {errors.success}
                                        </div>
                                    )}
                                    <br></br>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                    >
                                        Nhập OTP
                                    </label>
                                    <Row>
                                        <Col sm={8} className="p-0">
                                            <Input
                                                className="form-control-alternative"
                                                id="input-course-name"
                                                placeholder="Nhập vào OTP để xác nhận email của bạn..."
                                                type="text"
                                                onChange={handelOnChangeInput}
                                                name="OTP"
                                                value={OTP.OTP}
                                            />
                                        </Col>
                                        <Col sm={4}>
                                            <Button
                                                onClick={senOTP}
                                                color="primary"
                                                type="submit"
                                                className="px-5"
                                                disabled={OTP2 === 2}
                                            >
                                                {OTP2 === 1
                                                    ? 'Gửi OTP'
                                                    : 'Gửi lại'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </div>
                            <hr className="my-4" />
                        </div>
                        <div className="modal-footer">
                            <a
                                href="https://accounts.google.com/AccountChooser/signinchooser?continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fu%2F1%2Ffolders%2F1R5wZXxCmzbjJ6AVYMUm2AI-uS9DFnFTy&faa=1&theme=glif&flowName=GlifWebSignIn&flowEntry=AccountChooser"
                                target="_blank"
                            >
                                Nhận OTP tại đây
                            </a>
                            {/* <Button
                                onClick={senOTP}
                                color="primary"
                                type="submit"
                                className="px-5"
                                disabled={OTP2 === 2}
                            >
                                {OTP2 === 1 ? 'Gửi OTP' : 'Gửi lại OTP'}
                            </Button> */}
                            <span>
                                <Button
                                    color="primary"
                                    type="submit"
                                    className="px-5"
                                    disabled={!trueOTP}
                                >
                                    Tiếp tục
                                </Button>
                            </span>
                        </div>
                    </Form>
                </CardBody>
            </Container>
        </>
    )
}
export default memo(ForgotPassword)
