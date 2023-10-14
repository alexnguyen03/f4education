import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    CardFooter
} from 'reactstrap'
import userApi from 'api/userApi'
import { react, useState, useEffect, useRef } from 'react'
import { Box, LoadingOverlay } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script'
import { GoogleOAuthProvider } from '@react-oauth/google'
const Login = () => {
    const [user, setUser] = useState({
        id: '',
        username: '',
        fullName: '',
        email: '',
        accessToken: '',
        roles: [],
        refreshToken: '',
        imageName: ''
    })
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState({
        username: 'namnhpc03517',
        password: '123456789'
    })
    const [msgError, setMsgError] = useState({})
    const handleLogin = async () => {
        validate()
        if (validate()) {
            return
        }
        try {
            setLoading(true)
            const resp = await userApi.signin(account)
            console.log('🚀 ~ file: Login.js:35 ~ handleLogin ~ resp:', resp)
            if ((resp.status === 401 && resp.status) || resp.status === 404) {
                setMsgError({
                    ...msgError,
                    allErr: 'Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.'
                })
            } else {
                setMsgError({ ...msgError, allErr: '' })
            }

            if (resp.status === 200 && resp.status) {
                setUser(resp.data)
                storeUserInfo(resp.data)
                const role = resp.data.roles[0]
                if (role === 'ROLE_ADMIN') {
                    navigate('/admin')
                } else if (role === 'ROLE_TEACHER') {
                    navigate('/teacher')
                } else navigate('/')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('🚀 ~ file: Login.js:49 ~ handleLogin ~ error:', error)

            // if (error.response.status === 401 || error.response.status === 404) {
            // 	setMsgError({...msgError, allErr: 'Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.'});
            // } else {
            // 	setMsgError({...msgError, allErr: ''});
            // }
        }
    }

    const responseGoogleSuccess = async (resp) => {
        const { email, givenName, imageUrl } = resp.profileObj
        setLoading(true)
        console.log(
            '🚀 ~ file: Login.js:63 ~ responseGoogleSuccess ~ givenName:',
            givenName
        )
        // console.log('🚀 ~ file: Login.js:62 ~ responseGoogleSuccess ~ resp.profileObj:', resp);

        try {
            const response = await userApi.getRole(email)
            console.log(
                '🚀 ~ file: Login.js:66 ~ responseGoogleSuccess ~ response:',
                response.data.fullName
            )

            if (response.status === 200 && response.status) {
                setLoading(false)
                const { email, accessToken, id, username, refreshToken } =
                    response.data
                // setUser({email: email, accessToken: accessToken, id: id, username: username, refreshToken: refreshToken, fullName: givenName, imageName: imageUrl});
                storeUserInfo({
                    email: email,
                    accessToken: accessToken,
                    id: id,
                    username: username,
                    refreshToken: refreshToken,
                    fullName: givenName,
                    imageName: imageUrl
                })

                const role = response.data.roles[0]
                if (role === 'ROLE_ADMIN') {
                    navigate('/admin')
                } else if (role === 'ROLE_TEACHER') {
                    navigate('/teacher')
                } else navigate('/')
            }
        } catch (error) {
            setLoading(false)
            console.log('🚀 ~ file: Login.js:49 ~ handleLogin ~ error:', error)

            if (error.response.status === 404 && error.response.status) {
                setMsgError({
                    ...msgError,
                    allErr: 'Tài khoản chưa đăng ký. Vui lòng đăng ký tài khoản để thực hiện tính năng này.'
                })
            } else {
                setMsgError({ ...msgError, allErr: '' })
            }
        }
        setLoading(false)
    }
    const responseGoogleError = (resp) => {}
    const storeUserInfo = (data) => {
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('accessToken', JSON.stringify(data.accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken))
    }
    const handeleOnChangeInput = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }
    const handleKeyDown = (e) => {
        if (e.code === 'Enter') handleLogin()
    }
    const validate = () => {
        if (account.username === '') {
            setMsgError((preErr) => ({
                ...preErr,
                usernameErr: 'Vui lòng nhập Tên đăng nhập hoặc Email'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, usernameErr: '' }))
        }
        if (account.password === '') {
            setMsgError((preErr) => ({
                ...preErr,
                passwordErr: 'Vui lòng nhập Mật khẩu'
            }))
        } else {
            setMsgError((preErr) => ({ ...preErr, passwordErr: '' }))
        }
        if (account.usernameErr != '' || account.passwordErr != '') {
            return false
        }
        return true
    }
    useEffect(() => {
        if (process.env.REACT_APP_CLIENTID) {
            gapi.load('client:auth2', () => {
                gapi.auth2.init({ clientId: process.env.REACT_APP_CLIENTID })
            })
        }
    }, [])
    return (
        <>
            <Col lg="5" md="7">
                <Box maw={400} pos="relative">
                    <LoadingOverlay visible={loading} overlayBlur={2} />
                    <Card className="bg-secondary shadow border-0">
                        <CardHeader className="bg-transparent pb-4">
                            {msgError.allErr && (
                                <p className="text-danger text-center mt-1">
                                    {msgError.allErr}
                                </p>
                            )}

                            <div className="text-muted text-center mt-2 mb-3">
                                <small>Đăng nhập bằng</small>
                            </div>
                            <div className="btn-wrapper text-center">
                                <Button
                                    className="btn-neutral btn-icon"
                                    color="default"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <span className="btn-inner--icon">
                                        <img
                                            alt="..."
                                            src={
                                                require('../../assets/img/icons/common/github.svg')
                                                    .default
                                            }
                                        />
                                    </span>
                                    <span className="btn-inner--text">
                                        Github
                                    </span>
                                </Button>

                                <GoogleLogin
                                    clientId="477164526232-padd6dn43ofdo07ie2uad6avblrp9n9r.apps.googleusercontent.com"
                                    buttonText="Đăng nhập bằng Google"
                                    onSuccess={responseGoogleSuccess}
                                    onFailure={responseGoogleError}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                        </CardHeader>
                        <CardBody className="px-lg-5 ">
                            <div className="text-center text-muted mb-2">
                                <small>hoặc</small>
                            </div>

                            <Form role="form">
                                <FormGroup className="mb-3">
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-username"
                                    >
                                        Email hoặc Username
                                    </label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Email hoặc Username"
                                            type="text"
                                            autoComplete="new-email"
                                            name="username"
                                            value={account.username}
                                            onChange={handeleOnChangeInput}
                                        />
                                    </InputGroup>

                                    {msgError.usernameErr && (
                                        <p className="text-danger mt-1">
                                            {msgError.usernameErr}
                                        </p>
                                    )}
                                </FormGroup>
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-username"
                                    >
                                        Mật khẩu
                                    </label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Mật khẩu"
                                            type="password"
                                            name="password"
                                            onChange={handeleOnChangeInput}
                                            autoComplete="new-password"
                                            onKeyDown={handleKeyDown}
                                            value={account.password}
                                        />
                                    </InputGroup>
                                    {msgError.passwordErr && (
                                        <p className="text-danger mt-1">
                                            {msgError.passwordErr}
                                        </p>
                                    )}
                                </FormGroup>
                                <div className="custom-control custom-control-alternative custom-checkbox">
                                    <input
                                        className="custom-control-input"
                                        id=" customCheckLogin"
                                        type="checkbox"
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor=" customCheckLogin"
                                    >
                                        <span className="text-muted">
                                            Ghi nhớ tài khoản
                                        </span>
                                    </label>
                                </div>
                                <div className="text-center">
                                    <Button
                                        className="my-4"
                                        color="primary"
                                        type="button"
                                        onClick={handleLogin}
                                    >
                                        Đăng nhập
                                    </Button>
                                </div>
                            </Form>
                            <div className="text-center">
                                <a
                                    className="text-light"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <small>Quên mật khẩu ?</small>
                                </a>
                            </div>
                        </CardBody>
                    </Card>
                </Box>
            </Col>
        </>
    )
}
export default Login
