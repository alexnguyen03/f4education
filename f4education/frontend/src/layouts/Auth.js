import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
// reactstrap components
import {Col, Container, Row} from 'reactstrap';
import {react, useState, useEffect, useRef} from 'react';
// core components
import AuthFooter from 'components/Footers/AuthFooter.js';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';

import userApi from 'api/userApi';
import {routes} from 'routes.js';

const Auth = (props) => {
	const mainContent = useRef(null);
	const location = useLocation();

	useEffect(() => {
		document.body.classList.add('bg-default');
		return () => {
			document.body.classList.remove('bg-default');
		};
	}, []);

	useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
		mainContent.current.scrollTop = 0;
	}, [location]);

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === '/auth') {
				return (
					<Route
						path={prop.path}
						element={prop.component}
						key={key}
						exact
					/>
				);
			} else {
				return null;
			}
		});
	};

	return (
		<>
			<div
				className='main-content'
				ref={mainContent}>
				{/* <AuthNavbar /> */}
				<div className='header bg-gradient-info py-7 py-lg-8'>
					<Container>
						<div className='header-body text-center mb-7'>
							<Row className='justify-content-center'>
								<Col md='6'>
									<h1 className='text-white'>F4EDUCATION - LẬP TRÌNH LÀ ĐAM MÊ</h1>
									<p className='text-lead text-light'>Nâng tầm giá trị lập trình viên Viêt Nam</p>
								</Col>
							</Row>
						</div>
					</Container>
					<div className='separator separator-bottom separator-skew zindex-100'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							preserveAspectRatio='none'
							version='1.1'
							viewBox='0 0 2560 100'
							x='0'
							y='0'>
							<polygon
								className='fill-default'
								points='2560 0 2560 100 0 100'
							/>
						</svg>
					</div>
				</div>
				{/* Page content */}
				<Container className='mt--8 pb-5'>
					<Row className='justify-content-center'>
						<Routes>
							{getRoutes(routes)}
							<Route
								path='*'
								element={
									<Navigate
										to='/auth/login'
										replace
									/>
								}
							/>
						</Routes>
					</Row>
				</Container>
			</div>
			<AuthFooter />
		</>
	);
};

export default Auth;
