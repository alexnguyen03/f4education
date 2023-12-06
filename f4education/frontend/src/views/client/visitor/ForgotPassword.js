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
import Notify from '../../../utils/Notify'
import {
    Stepper,
    Group,
    TextInput,
    Textarea,
    PasswordInput
} from '@mantine/core'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, hasLength } from '@mantine/form'
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

    //! Xác nhận OTP chính xácp
    const handleSubmitForm = async (e) => {
        e.preventDefault()

        const id = toast(Notify.msg.loading, Notify.options.loading())
        if (seconds > 0) {
            try {
                const resp = await accountApi.checkOTPForPassword(OTPRequest)
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

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: ''
        },

        // functions will be used to validate values at corresponding key
        validate: {
            password: hasLength(
                { min: 6, max: 16 },
                'Mật khẩu từ 6 đến 16 kí tự!'
            ),
            confirmPassword: (value, values) =>
                value !== values.password
                    ? 'Xác nhận mật khẩu không khớp'
                    : null
        }
    })

    return (
        <>
            <ToastContainer />

            <Container fluid style={{ paddingTop: '72px', width: '80%' }}>
                <CardBody>
                    <Stepper
                        active={active}
                        onStepClick={setActive}
                        breakpoint="sm"
                        allowNextStepsSelect={false}
                    >
                        <Stepper.Step
                            label="Xác minh"
                            description="Xác minh email tài khoản của bạn"
                        >
                            <Form
                                sm={6}
                                className="mx-auto w-50"
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
                                                disabled={OTP2 == 1}
                                            >
                                                Tiếp tục
                                            </Button>
                                        </span>
                                    </div>
                                </div>
                            </Form>
                        </Stepper.Step>
                        <Stepper.Step
                            label="Second step"
                            description="Verify email"
                        >
                            <Box maw={340} mx="auto">
                                <form
                                    onSubmit={form.onSubmit((values) =>
                                        console.log(values)
                                    )}
                                >
                                    <PasswordInput
                                        label="Password"
                                        placeholder="Password"
                                        {...form.getInputProps('password')}
                                    />

                                    <PasswordInput
                                        mt="sm"
                                        label="Confirm password"
                                        placeholder="Confirm password"
                                        {...form.getInputProps(
                                            'confirmPassword'
                                        )}
                                    />

                                    <Group position="right" mt="md">
                                        <Button type="submit">Submit</Button>
                                    </Group>
                                </form>
                            </Box>
                        </Stepper.Step>
                        <Stepper.Step
                            label="Final step"
                            description="Get full access"
                        >
                            Step 3 content: Get full access
                        </Stepper.Step>
                        <Stepper.Completed>
                            Completed, click back button to get to previous step
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
