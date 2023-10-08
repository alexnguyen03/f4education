import {Link} from 'react-router-dom';
// reactstrap components
import {UncontrolledCollapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, Row, Col} from 'reactstrap';

const ClientNavbar = () => {
	return (
		<>
			<Navbar
				className='navbar-top navbar-horizontal navbar-dark bg-default'
				expand='md'>
				<Container className='px-4'>
					<NavbarBrand
						to='/'
						tag={Link}>
						<img
							alt='...'
							src={require('../../assets/img/brand/argon-react-white.png')}
						/>
					</NavbarBrand>
					<button
						className='navbar-toggler'
						id='navbar-collapse-main'>
						<span className='navbar-toggler-icon' />
					</button>
					<UncontrolledCollapse
						navbar
						toggler='#navbar-collapse-main'>
						<div className='navbar-collapse-header d-md-none'>
							<Row>
								<Col
									className='collapse-brand'
									xs='6'>
									<Link to='/'>
										<img
											alt='...'
											src={require('../../assets/img/brand/argon-react.png')}
										/>
									</Link>
								</Col>
								<Col
									className='collapse-close'
									xs='6'>
									<button
										className='navbar-toggler'
										id='navbar-collapse-main'>
										<span />
										<span />
									</button>
								</Col>
							</Row>
						</div>
						<Nav
							className='ml-auto'
							navbar>
							<NavItem>
								<NavLink
									className='nav-link-icon'
									to='/course'
									tag={Link}>
									<i className='ni ni-circle-08' />
									<span className='nav-link-inner--text'>Khóa học</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className='nav-link-icon'
									to='/course-register'
									tag={Link}>
									<i className='ni ni-circle-08' />
									<span className='nav-link-inner--text'>Khóa học đăng ký</span>
								</NavLink>
							</NavItem>
						</Nav>
					</UncontrolledCollapse>
				</Container>
				{/* <div className='text-center w-100'>CLIENT NAVBAR</div> */}
			</Navbar>
		</>
	);
};

export default ClientNavbar;
