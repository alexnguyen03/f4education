import {Modal} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import userApi from 'api/userApi';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Text} from '@mantine/core';
import {modals} from '@mantine/modals';
import {DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Form, FormGroup, InputGroupAddon, InputGroupText, Input, InputGroup, Navbar, Nav, Container, Media} from 'reactstrap';

const AdminNavbar = (props) => {
	const [opened, {open, close}] = useDisclosure(false);
	const navigate = useNavigate();
	console.log('🚀 ~ file: AdminNavbar.js:23 ~ AdminNavbar ~ props.adminName:', props.adminName);
	const handleLogout = async () => {
		const user = JSON.parse(localStorage.getItem('user'));
		console.log('🚀 ~ file: AdminNavbar.js:10 ~ handleLogout ~ user:', user.id);

		try {
			const resp = await userApi.signout(user.id);
			console.log('🚀 ~ file: AdminNavbar.js:11 ~ handleLogout ~ resp:', resp);
			if (resp.status === 200) {
				localStorage.removeItem('user');
				navigate('/');
			}
		} catch (error) {
			console.log('🚀 ~ file: AdminNavbar.js:17 ~ handleLogout ~ error:', error);
		}
	};
	const openModal = () =>
		modals.openConfirmModal({
			title: 'Xác nhận đăng xuất ',
			centered: true,
			children: <Text size='sm'>Bạn có chắc chắc muốn đăng xuất ? </Text>,
			labels: {confirm: 'Có, Đăng xuất ngay', cancel: 'Không, Trở lại'},
			confirmProps: {color: 'red'},
			onCancel: () => console.log('Cancel'),
			onConfirm: () => handleLogout(),
		});

	return (
		<>
			<Navbar
				className='navbar-top navbar-dark'
				expand='md'
				id='navbar-main'>
				<Container fluid>
					<Link
						className='h4 mb-0 text-white text-uppercase d-none d-lg-inline-block'
						to='/'>
						{props.brandText}
					</Link>
					<Form className='navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto'>
						<FormGroup className='mb-0'>
							<InputGroup className='input-group-alternative'>
								<InputGroupAddon addonType='prepend'>
									<InputGroupText>
										<i className='fas fa-search' />
									</InputGroupText>
								</InputGroupAddon>
								<Input
									placeholder='Search'
									type='text'
								/>
							</InputGroup>
						</FormGroup>
					</Form>
					<Nav
						className='align-items-center d-none d-md-flex'
						navbar>
						<UncontrolledDropdown nav>
							<DropdownToggle
								className='pr-0'
								nav>
								<Media className='align-items-center'>
									<span className='avatar avatar-sm rounded-circle'>
										<img
											alt='...'
											src={require('../../assets/img/theme/team-4-800x800.jpg')}
										/>
									</span>
									<Media className='ml-2 d-none d-lg-block'>
										<span className='mb-0 text-sm font-weight-bold'>{props.adminName}</span>
									</Media>
								</Media>
							</DropdownToggle>
							<DropdownMenu
								className='dropdown-menu-arrow'
								right>
								{/* <DropdownItem
									className='noti-title'
									header
									tag='div'>
									<h6 className='text-overflow m-0'>Welcome!</h6>
								</DropdownItem> */}
								<DropdownItem
									to='/admin/user-profile'
									tag={Link}>
									<i className='ni ni-single-02' />
									<span>Tài khoản</span>
								</DropdownItem>
								<DropdownItem
									to='/admin/user-profile'
									tag={Link}>
									<i className='ni ni-settings-gear-65' />
									<span>Đổi mật khẩu</span>
								</DropdownItem>

								<DropdownItem divider />
								<DropdownItem
									href='#pablo'
									onClick={openModal}>
									<i className='ni ni-user-run text-danger' />
									<span>Đăng xuất</span>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>
				</Container>
			</Navbar>
			<Modal
				opened={opened}
				onClose={close}
				title='Authentication'
				centered>
				{/* Modal content */}
			</Modal>
		</>
	);
};

export default AdminNavbar;
