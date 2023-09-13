import {Container, Row, Col} from 'reactstrap';

const SessionsHeader = () => {
	return (
		<>
			<div
				className='header pb-8 pt-5 pt-lg-8 d-flex align-items-center'
				style={{
					minHeight: '200px',
					backgroundImage: 'url(' + require('../../assets/img/theme/profile-cover.jpg') + ')',
					backgroundSize: 'cover',
					backgroundPosition: 'center top',
				}}>
				{/* Mask */}
				<span className='mask bg-gradient-default opacity-8' />
				<Container
					className='d-flex '
					fluid>
					<Row>
						<Col
							lg='7'
							widths={['md']}>
							<h1 className='display-1 text-white'>CA HỌC</h1>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default SessionsHeader;
