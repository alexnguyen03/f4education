import {Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Row, Col, CardFooter} from 'reactstrap';
import userApi from 'api/userApi';
import {react, useState, useEffect, useRef} from 'react';
import {Box, LoadingOverlay} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
const Login = () => {
	const userLoged = JSON.parse(localStorage.getItem('user') | '');

	const [user, setUser] = useState({
		id: '',
		username: '',
		fullName: '',
		email: '',
		accessToken: '',
		roles: [],
		refreshToken: '',
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [account, setAccount] = useState({
		username: 'namnguyen',
		password: '123456789',
	});
	const [msgError, setMsgError] = useState({});
	const handleLogin = async () => {
		validate();
		if (validate()) {
			return;
		}
		try {
			setLoading(true);
			const resp = await userApi.signin(account);

			if (resp.status === 200 && resp.status) {
				setUser(resp.data);
				storeUserInfo(resp.data);
				const role = resp.data.roles[0];
				if (role === 'ROLE_ADMIN') {
					navigate('/admin');
				} else if (role === 'ROLE_TEACHER') {
					navigate('/teacher');
				} else navigate('/');
			}
		} catch (error) {
			setLoading(false);
			console.log('🚀 ~ file: Login.js:49 ~ handleLogin ~ error:', error);

			if (error.response.status === 401 && error.response.status) {
				setMsgError({...msgError, allErr: 'Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.'});
			} else {
				setMsgError({...msgError, allErr: ''});
			}
		}
		setLoading(false);
	};

	const storeUserInfo = (data) => {
		localStorage.setItem('user', JSON.stringify(data));
		localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
		localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
	};
	const handeleOnChangeInput = (e) => {
		setAccount({...account, [e.target.name]: e.target.value});
	};
	const handleKeyDown = (e) => {
		if (e.code === 'Enter') handleLogin();
	};
	const validate = () => {
		if (account.username === '') {
			setMsgError((preErr) => ({...preErr, usernameErr: 'Vui lòng nhập Tên đăng nhập hoặc Email'}));
		} else {
			setMsgError((preErr) => ({...preErr, usernameErr: ''}));
		}
		if (account.password === '') {
			setMsgError((preErr) => ({...preErr, passwordErr: 'Vui lòng nhập Mật khẩu'}));
		} else {
			setMsgError((preErr) => ({...preErr, passwordErr: ''}));
		}
		if (account.usernameErr != '' || account.passwordErr != '') {
			return false;
		}
		return true;
	};
	useEffect(() => {}, []);
	return (
		<>
			<Col
				lg='5'
				md='7'>
				<Box
					maw={400}
					pos='relative'>
					<LoadingOverlay
						visible={loading}
						overlayBlur={2}
					/>
					<Card className='bg-secondary shadow border-0'>
						<CardHeader className='bg-transparent pb-4'>
							{msgError.allErr && <p className='text-danger text-center mt-1'>{msgError.allErr}</p>}

							<div className='text-muted text-center mt-2 mb-3'>
								<small>Đăng nhập bằng</small>
							</div>
							<div className='btn-wrapper text-center'>
								<Button
									className='btn-neutral btn-icon'
									color='default'
									href='#pablo'
									onClick={(e) => e.preventDefault()}>
									<span className='btn-inner--icon'>
										<img
											alt='...'
											src={require('../../assets/img/icons/common/github.svg').default}
										/>
									</span>
									<span className='btn-inner--text'>Github</span>
								</Button>
								<Button
									className='btn-neutral btn-icon'
									color='default'
									href='#pablo'
									onClick={(e) => e.preventDefault()}>
									<span className='btn-inner--icon'>
										<img
											alt='...'
											src={require('../../assets/img/icons/common/google.svg').default}
										/>
									</span>
									<span className='btn-inner--text'>Google</span>
								</Button>
							</div>
						</CardHeader>
						<CardBody className='px-lg-5 '>
							<div className='text-center text-muted mb-2'>
								<small>hoặc</small>
							</div>

							<Form role='form'>
								<FormGroup className='mb-3'>
									<label
										className='form-control-label'
										htmlFor='input-username'>
										Email hoặc Username
									</label>
									<InputGroup className='input-group-alternative'>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText>
												<i className='ni ni-email-83' />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder='Email hoặc Username'
											type='text'
											autoComplete='new-email'
											name='username'
											value={account.username}
											onChange={handeleOnChangeInput}
										/>
									</InputGroup>

									{msgError.usernameErr && <p className='text-danger mt-1'>{msgError.usernameErr}</p>}
								</FormGroup>
								<FormGroup>
									<label
										className='form-control-label'
										htmlFor='input-username'>
										Mật khẩu
									</label>
									<InputGroup className='input-group-alternative'>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText>
												<i className='ni ni-lock-circle-open' />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder='Mật khẩu'
											type='password'
											name='password'
											onChange={handeleOnChangeInput}
											autoComplete='new-password'
											onKeyDown={handleKeyDown}
											value={account.password}
										/>
									</InputGroup>
									{msgError.passwordErr && <p className='text-danger mt-1'>{msgError.passwordErr}</p>}
								</FormGroup>
								<div className='custom-control custom-control-alternative custom-checkbox'>
									<input
										className='custom-control-input'
										id=' customCheckLogin'
										type='checkbox'
									/>
									<label
										className='custom-control-label'
										htmlFor=' customCheckLogin'>
										<span className='text-muted'>Ghi nhớ tài khoản</span>
									</label>
								</div>
								<div className='text-center'>
									<Button
										className='my-4'
										color='primary'
										type='button'
										onClick={handleLogin}>
										Đăng nhập
									</Button>
								</div>
							</Form>
							<div className='text-center'>
								<a
									className='text-light'
									href='#pablo'
									onClick={(e) => e.preventDefault()}>
									<small>Quên mật khẩu ?</small>
								</a>
							</div>
						</CardBody>
					</Card>
				</Box>
			</Col>
		</>
	);
};
export default Login;
