import {Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, Label} from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader.js';
import CoursesHeader from 'components/Headers/CoursesHeader';
import {useState} from 'react';

const Courses = () => {
	const [subjectList, setSubjectList] = useState([{key: 'java', value: 'Java'}, {key: 'c#', value: 'C#'}, , {key: 'python', value: 'Python'}, {key: 'PHP', value: 'PHP'}]);
	const [image, setImage] = useState(null);
	const [imgData, setImgData] = useState(null);
	// ['https://image8.cdn.seaart.ai/2023-07-13/44636826861637/9a63261b1c0f75815a7a3cf8da39724adf3629cf.png', 'https://image7.cdn.seaart.ai/2023-06-15/34756618563653/95386e96704af92a42448bebb7e302603ec46e4d.png'];

	const onChangePicture = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImgData(reader.result);
			});
			reader.readAsDataURL(e.target.files[0]);
		}
	};
	return (
		<>
			<CoursesHeader />
			<Container
				className='mt--7'
				fluid>
				<Row>
					<Col
						className='order-xl-1'
						xl='4'>
						<Card className='bg-secondary shadow'>
							<CardHeader className='bg-white border-0'>
								<Row className='align-items-center'>
									<Col xs='8'>
										<h3 className='mb-0'>Thông tin khóa học</h3>
									</Col>
									<Col
										className='text-right'
										xs='4'>
										<Button
											color='success'
											href='#pablo'
											onClick={(e) => e.preventDefault()}
											size='sm'>
											Lưu
										</Button>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								<Form>
									{/* <h6 className='heading-small text-muted mb-4'>Thông tin môn học</h6> */}
									<div className='p-lg-2'>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-username'>
												Tên môn học
											</label>
											<Input
												id='exampleSelect'
												name='select'
												type='select'>
												{subjectList.map((item) => {
													return <option key={item.key}>{item.value}</option>;
												})}
											</Input>
										</FormGroup>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-email'>
												Tên khóa học
											</label>
											<Input
												className='form-control-alternative'
												defaultValue='Java cơ bản cho người mới'
												id='input-first-name'
												placeholder='First name'
												type='text'
											/>
										</FormGroup>

										<Row>
											<Col md={12}>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-first-name'>
														Thời lượng
													</label>
													<Input
														className='form-control-alternative'
														id='input-first-name'
														placeholder='First name'
														type='number'
														min={120}
														step={30}
														value={120}
													/>
												</FormGroup>
											</Col>
											<Col md={12}>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-last-name'>
														Giá khóa học
													</label>
													<Input
														className='form-control-alternative'
														value={120000}
														id='input-last-name'
														type='number'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col md={12}>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-last-name'>
														Mô tả khóa học
													</label>

													<Input
														className='form-control-alternative'
														id='exampleText'
														name='text'
														type='textarea'
													/>
												</FormGroup>
											</Col>
											<Col md={12}>
												<FormGroup>
													<Label
														for='exampleFile'
														className='form-control-label'>
														Hình ảnh khóa học
													</Label>
													<div class='custom-file'>
														<input
															type='file'
															class='custom-file-input form-control-alternative'
															id='customFile'
															onChange={onChangePicture}
															multiple={true}
														/>
														<label
															class='custom-file-label'
															for='customFile'>
															Chọn hình ảnh
														</label>
													</div>
												</FormGroup>
											</Col>
											<div className='previewProfilePic'>
												<img
													alt=''
													width={120}
													className='playerProfilePic_home_tile'
													src={imgData}
												/>
											</div>
										</Row>
									</div>
									<hr className='my-4' />
								</Form>
							</CardBody>
						</Card>
					</Col>
					<Col xl='8'>hehhee</Col>
				</Row>
			</Container>
		</>
	);
};

export default Courses;
