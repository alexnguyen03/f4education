import { Group, LoadingOverlay, PasswordInput, Stepper } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { Box } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, CardBody, Container, Form, FormGroup, Input } from 'reactstrap'
import accountApi from '../../../api/accountApi'
import Notify from '../../../utils/Notify'
const IMG_URL = '/courses/'
const ForgotPassword = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')
    const [OTP2, setOTP2] = useState(1)
    const [emailStatus, setEmailStatus] = useState(0)
    const [codeOTP, setCodeOTP] = useState(0)
    const [errors, setErrors] = useState({})
    const toastId = React.useRef(null)

    //! Mantine step
    const [active, setActive] = useState(0)
    const nextStep = () =>
        setActive((current) => (current < 3 ? current + 1 : current))
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current))

    //Nhận data vai trò học viên gửi lên từ server
    const [OTP, setOTP] = useState({
        email: 'loinvpc04549@fpt.edu.vn',
        codeOTP: '',
        date: ''
    })

    const [OTPRequest, setOTPRequest] = useState({
        email: '',
        codeOTP: ''
    })

    const handelOnChangeInput = (e) => {
        const { name, value } = e.target
        setOTP((pre) => ({
            ...pre,
            [name]: value
        }))
    }

    //! Xác nhận OTP chính xác
    const handleSubmitForm = async (e) => {
        e.preventDefault()

        const id = toast(Notify.msg.loading, Notify.options.loading())
        if (seconds > 0) {
            try {
                const resp = await accountApi.checkOTP(OTPRequest)
                if (resp.status === 200) {
                    toast.update(id, Notify.options.rightOTP())
                    nextStep()
                } else {
                    if (resp.data === 1) {
                        toast.update(id, Notify.options.deadOTP())
                    } else {
                        if (resp.data === 2) {
                            toast.update(id, Notify.options.wrongOTP())
                        } else {
                            toast.update(id, Notify.options.error())
                        }
                    }
                }
            } catch (error) {
                toast.update(id, Notify.options.error())
            }
        } else {
            toast.update(id, Notify.options.deadOTP())
        }
    }

    //! Gửi OTP đến tài khoản Email
    const senOTP = async (e) => {
        e.preventDefault()

        const id = toast(Notify.msg.loading, Notify.options.loading())
        setOTP({ ...OTP, codeOTP: '' })
        try {
            const resp = await accountApi.checkMailForPassword(OTPRequest)
            if (resp.status === 200) {
                setOTP2(2)
                handleReset()
                setCodeOTP(resp.data.codeOTP)
                toast.update(id, Notify.options.sendedMail())
            } else {
                if (resp.data === 1) {
                    toast.update(id, Notify.options.undefinedAccount())
                } else {
                    toast.update(id, Notify.options.error())
                }
            }
        } catch (error) {
            toast.update(id, Notify.options.error())
        }
    }

    // ! Update OTP start
    const [seconds, setSeconds] = useState(0)

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

    useEffect(() => {
        const { email, codeOTP } = { ...OTP }
        setOTPRequest({
            codeOTP: codeOTP,
            email: email
        })
    }, [OTP])

    const formatTime = (time) => (time < 10 ? `0${time}` : time)

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    const handleReset = () => {
        setSeconds(60)
    }

    const submit = async () => {
        const OTPRequest = {
            email: OTP.email,
            password: form.values.confirmPassword
        }
        // console.log('🚀', taskRequest)
        const id = toast(Notify.msg.loading, Notify.options.loading())
        try {
            const resp = await accountApi.changePassword(OTPRequest)
            if (resp.status === 200) {
                toast.update(id, Notify.options.changePasswordSuccess())
                nextStep()
            }
        } catch (error) {
            toast.update(id, Notify.options.updateError())
        }
    }

    const validatePassword = (value) => {
        if (value.length < 6 || value.length > 16) {
            return 'Mật khẩu phải từ 6 đến 16 kí tự'
        }
        return null
    }

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: ''
        },

        // functions will be used to validate values at corresponding key
        validate: {
            password: (value) => validatePassword(value),
            confirmPassword: (value, values) =>
                value !== values.password
                    ? 'Xác nhận mật khẩu không khớp'
                    : null
        }
    })

    return (
        <>
            <ToastContainer />

            <Container fluid style={{ paddingTop: '72px', width: '45%' }}>
                <CardBody>
                    <Stepper
                        active={active}
                        onStepClick={setActive}
                        breakpoint="sm"
                        allowNextStepsSelect={false}
                    >
                        <Stepper.Step
                            label="Xác minh"
                            description="email tài khoản của bạn"
                        >
                            <Form
                                sm={6}
                                className="mx-auto w-75"
                                onSubmit={handleSubmitForm}
                                encType="multipart/form-data"
                                isLoading="true"
                            >
                                <div className="modal-body shadow rounded">
                                    <div className="px-lg-2">
                                        <div>
                                            {OTP2 != 1 ? (
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-OTP"
                                                    >
                                                        Nhập OTP
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-OTP"
                                                        placeholder="OTP gồm 4 chữ số..."
                                                        type="text"
                                                        maxLength={4}
                                                        onKeyPress={(event) => {
                                                            if (
                                                                !/[0-9]/.test(
                                                                    event.key
                                                                )
                                                            ) {
                                                                event.preventDefault()
                                                            }
                                                        }}
                                                        onChange={
                                                            handelOnChangeInput
                                                        }
                                                        name="codeOTP"
                                                        value={OTP.codeOTP}
                                                    />

                                                    {seconds !== 0 ? (
                                                        <div>
                                                            <p className="text-danger">
                                                                OTP sẽ hết hiệu
                                                                lực trong:{' '}
                                                                {formatTime(
                                                                    minutes
                                                                )}
                                                                :
                                                                {formatTime(
                                                                    remainingSeconds
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-danger">
                                                            OTP đã hết hiệu lực!
                                                        </p>
                                                    )}
                                                </FormGroup>
                                            ) : (
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-email"
                                                    >
                                                        Nhập email tài khoản của
                                                        bạn
                                                    </label>

                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-email"
                                                        placeholder="Nhập vào email của bạn..."
                                                        type="text"
                                                        disabled={OTP2 !== 1}
                                                        onChange={
                                                            handelOnChangeInput
                                                        }
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
                                                </FormGroup>
                                            )}
                                        </div>

                                        <div className="">
                                            <Button
                                                className="form-control-alternative mx-auto w-50 d-flex justify-content-center"
                                                onClick={senOTP}
                                                color="primary"
                                                type="submit"
                                                disabled={OTP2 === 2}
                                            >
                                                {OTP2 === 1
                                                    ? 'Gửi OTP'
                                                    : 'Gửi lại'}
                                            </Button>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="modal-footer">
                                        <a
                                            href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"
                                            target="_blank"
                                        >
                                            Nhận OTP tại đây
                                        </a>
                                        <span>
                                            <Button
                                                color="primary"
                                                type="submit"
                                                className="px-5"
                                                disabled={
                                                    OTP2 == 1 || seconds == 0
                                                }
                                            >
                                                Tiếp tục
                                            </Button>
                                        </span>
                                    </div>
                                </div>
                            </Form>
                        </Stepper.Step>
                        <Stepper.Step
                            label="Cập nhật"
                            description="mật khẩu mới"
                        >
                            <div sm={6} className="mx-auto w-75">
                                <div className="modal-body shadow rounded">
                                    <Box>
                                        <form onSubmit={form.onSubmit(submit)}>
                                            <PasswordInput
                                                label="Mật khẩu mới"
                                                placeholder="Mật khẩu mới..."
                                                {...form.getInputProps(
                                                    'password'
                                                )}
                                            />

                                            <PasswordInput
                                                mt="sm"
                                                label="Xác nhận mật khẩu mới"
                                                placeholder="Xác nhận mật khẩu mới..."
                                                {...form.getInputProps(
                                                    'confirmPassword'
                                                )}
                                            />

                                            <Group position="right" mt="md">
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                >
                                                    Cập nhật
                                                </Button>
                                            </Group>
                                        </form>
                                    </Box>
                                </div>
                            </div>
                        </Stepper.Step>
                        <Stepper.Completed>
                            <h3 className="d-flex justify-content-center">
                                Chúc mừng bạn đã khôi phục mật khẩu thành công!
                            </h3>
                        </Stepper.Completed>
                    </Stepper>

                    <Group position="center" mt="xl">
                        <Button variant="default" onClick={prevStep}>
                            Back
                        </Button>
                        <Button onClick={nextStep}>Next step</Button>
                    </Group>
                </CardBody>
            </Container>
        </>
    )
}
export default memo(ForgotPassword)
