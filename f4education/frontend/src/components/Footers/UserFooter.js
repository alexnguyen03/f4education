// reactstrap components
import {Container, Row, Col, Nav, NavItem, NavLink} from 'reactstrap';

const UserFooter = () => {
	return (
		<footer className='footer'>
			<Row className='align-items-center justify-content-xl-between'>
				<Col xl='6'>
					<div className='copyright text-center text-xl-left text-muted'>
						© {new Date().getFullYear()}{' '}
						<a
							className='font-weight-bold ml-1'
							href='https://www.creative-tim.com?ref=adr-admin-footer'
							rel='noopener noreferrer'
							target='_blank'>
							Bộ Tứ Siêu Đẳng
						</a>
					</div>
				</Col>

				<Col xl='6'>
					<h2>User footer nè bạn ơi</h2>
				</Col>
			</Row>
		</footer>
	);
};

export default UserFooter;
