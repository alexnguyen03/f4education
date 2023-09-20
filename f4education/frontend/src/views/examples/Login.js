import {Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Row, Col, CardFooter} from 'reactstrap';
import userApi from 'api/userApi';
import {react, useState, useEffect, useRef} from 'react';
const Login = () => {
	const [user, setUser] = useState({
		id: '',
		username: '',
		email: '',
		accessToken: '',
		roles: [],
	});
	const [account, setAccount] = useState({
		username: '',
		password: '',
	});
	const handleLogin = () => {
		console.log('🚀 ~ file: Login.js:18 ~ handleLogin ~ account:', account);
		// localStorage.setItem('accessToken', JSON.stringify(user.accessToken));
		// localStorage.setItem('user', JSON.stringify(user));
		// console.log('user' + user);
	};
	const handeleOnChangeInput = (e) => {
		validate();
		setAccount({...account, [e.target.name]: e.target.value});
	};
	const handleKeyDown = (e) => {
		if (e.code === 'Enter') handleLogin();
	};
	const validate = () => {};
	useEffect(() => {
		// const fetchData = async () => {
		// 	try {
		// 		const body = {
		// 			username: 'namnguyen',
		// 			password: '123456789',
		// 		};
		// 		const resp = await userApi.signin(body);
		// 		setUser(resp);
		// 	} catch (error) {
		// 		console.log('failed to fetch data', error);
		// 	}
		// };
		// fetchData();
	}, []);
	return (
		<>
			<Col
				lg='5'
				md='7'>
				<Card className='bg-secondary shadow border-0'>
					<CardHeader className='bg-transparent pb-4'>
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
										onChange={handeleOnChangeInput}
									/>
								</InputGroup>
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
									/>
								</InputGroup>
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
							{' '}
							<a
								className='text-light'
								href='#pablo'
								onClick={(e) => e.preventDefault()}>
								<small>Quên mật khẩu ?</small>
							</a>
						</div>
					</CardBody>
				</Card>
			</Col>
		</>
	);
};
export default Login;
