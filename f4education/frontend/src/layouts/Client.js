import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
// reactstrap components
import {Col, Container, Row} from 'reactstrap';
import {react, useState, useEffect, useRef} from 'react';
// core components
import ClientFooter from 'components/Footers/ClientFooter.js';
import ClientNavbar from 'components/Navbars/ClientNavbar.js';
import {routesClient} from 'routes.js';

const Client = (props) => {
	const mainContent = useRef(null);
	const location = useLocation();

	useEffect(() => {}, []);

	useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
		mainContent.current.scrollTop = 0;
	}, [location]);

	const getRoutes = (routesClient) => {
		return routesClient.map((prop, key) => {
			console.log('🚀 ~ file: Client.js:28 ~ returnroutesClient.map ~ prop.layout:', prop.component);
			if (prop.layout === '/client') {
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
				<ClientNavbar />

				{/* Page content */}
				<Container fluid={true}>
					<Row>
						<Routes>
							{getRoutes(routesClient)}
							<Route
								path='*'
								element={
									<Navigate
										to='/admin/index'
										replace
									/>
								}
							/>
						</Routes>
					</Row>
				</Container>
			</div>
			<ClientFooter />
		</>
	);
};

export default Client;
