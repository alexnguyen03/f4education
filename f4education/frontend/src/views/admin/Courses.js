import CoursesHeader from 'components/Headers/CoursesHeader';
import {memo, useEffect, useMemo, useState} from 'react';
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Modal, Row} from 'reactstrap';
import {Edit as EditIcon, RemoveCircleOutline as RemoveCircleOutlineIcon} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';
import courseApi from 'api/courseApi';
import {MaterialReactTable} from 'material-react-table';
import subjectApi from '../../api/subjectApi';
const Courses = () => {
	const [image, setImage] = useState(null);
	const [imgData, setImgData] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [selectedId, setSelectedId] = useState(-1);
	const [update, setUpdate] = useState(false);
	const [courses, setCourses] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [course, setCourse] = useState({
		subjectName: '',
		courseName: '',
		courseDuration: 0,
		coursePrice: 0,
		courseDescription: '',
		image: '',
		subject: {
			subjectId: 0,
			subjectName: '',
			admin: {
				adminId: '',
				fullname: '',
				gender: true,
				dateOfBirth: '',
				citizenIdentification: '',
				address: '',
				phone: '',
				image: '',
			},
		},
	});
	const handelOnChangeInput = (e) => {
		setCourse({[e.target.name]: e.target.value});
	};
	const onChangePicture = (e) => {
		setImage(null);
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImgData(reader.result);
			});
			reader.readAsDataURL(e.target.files[0]);
			setCourse((preCourse) => ({
				...preCourse,
				image: e.target.files[0].name,
			}));
		}
	};
	const columns = useMemo(
		() => [
			{
				accessorKey: 'subject.subjectName',
				header: 'Tên môn học',
				size: 150,
			},
			{
				accessorKey: 'courseName',
				header: 'Tên khóa học',
				size: 150,
			},
			{
				accessorKey: 'courseDuration',
				header: 'Thời lượng (h)',

				size: 75,
			},
			{
				accessorKey: 'coursePrice',
				header: 'Giá (đ)',
				size: 60,
			},
			{
				accessorKey: 'subject.admin.adminId',
				header: 'Mã người tạo',
				size: 80,
			},
		],
		[],
	);
	const fetchCourses = async () => {
		try {
			const resp = await courseApi.getAll();
			setCourses([...resp]);
		} catch (error) {
			console.log('failed to fetch data', error);
		}
	};
	const fetchSubject = async () => {
		try {
			const resp = await subjectApi.getAllSubject();
			setSubjects(resp);
			console.log(subjects);
		} catch (error) {
			console.log(error);
		}
	};
	const handleEditFrom = (row) => {
		console.log(row.original.courseId);

		const selectedCourse = courses.find((course) => course.courseId === row.original.courseId);
		setSelectedId(row.original.courseId);
		console.log(selectedId);
		setUpdate((pre) => !pre);
		setShowForm(true);
		setCourse({...selectedCourse});
	};
	const handleResetForm = () => {
		// hide form
		setShowForm((pre) => !pre);
		setImgData(null);
		// set course == null
		setCourse({
			subjectName: '',
			courseName: '',
			courseDuration: 0,
			coursePrice: 0,
			courseDescription: '',
			image: '',
			subject: {
				subjectId: 0,
				subjectName: '',
				admin: {
					adminId: '',
					fullname: '',
					gender: true,
					dateOfBirth: '',
					citizenIdentification: '',
					address: '',
					phone: '',
					image: '',
				},
			},
		});
	};
	const handleShowAddForm = () => {
		setShowForm((pre) => !pre);
		setUpdate((pre) => !pre);
	};
	const handleSubmitForm = () => {
		if (update) {
			console.log('updated');
			// console.log(image.name);
			setCourse((preCourse) => ({
				...preCourse,
				image: image.name,
			}));
			console.log(course.image);
			// send data to update course
		} else {
			console.log('added');
			// send data to add course
		}
	};
	useEffect(() => {
		fetchCourses();
		fetchSubject();
	}, []);
	return (
		<>
			<CoursesHeader />

			<Container
				className='mt--7'
				fluid>
				<Card className='bg-secondary shadow'>
					{/* Header */}
					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
						<h3 className='mb-0'>BẢNG KHÓA HỌC</h3>
						<Button
							color='default'
							type='button'>
							Lịch sử khóa học
						</Button>
					</CardHeader>
					<CardBody>
						<MaterialReactTable
							enableColumnResizing
							enableGrouping
							enableStickyHeader
							enableStickyFooter
							enableRowNumbers
							displayColumnDefOptions={{
								'mrt-row-actions': {
									header: 'Thao tác',
									size: 20,
									// Something else here
								},
							}}
							positionActionsColumn='last'
							columns={columns}
							data={courses}
							renderTopToolbarCustomActions={() => (
								<Button
									onClick={handleShowAddForm}
									color='primary'
									variant='contained'>
									<i className='bx bx-layer-plus'></i>
									Thêm khóa học
								</Button>
							)}
							enableRowActions
							renderRowActions={({row, table}) => (
								<Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
									<IconButton
										color='secondary'
										onClick={() => {
											handleEditFrom(row);
										}}>
										<EditIcon />
									</IconButton>
									<IconButton
										color='error'
										onClick={() => {
											courses.splice(row.index, 1);
										}}>
										<RemoveCircleOutlineIcon />
									</IconButton>
								</Box>
							)}
						/>
						<Modal
							className='modal-dialog-centered  modal-lg '
							isOpen={showForm}
							backdrop='static'
							toggle={() => setShowForm((pre) => !pre)}>
							<div className='modal-header'>
								<h3 className='mb-0'>Thông tin khóa học</h3>
								<button
									aria-label='Close'
									className='close'
									data-dismiss='modal'
									type='button'
									onClick={handleResetForm}>
									<span aria-hidden={true}>×</span>
								</button>
							</div>
							<div className='modal-body'>
								<Form>
									<div className='px-lg-2'>
										<Row>
											<Col sm={6}>
												{' '}
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-username'>
														Tên môn học
													</label>
													<Input
														id='exampleSelect'
														name='subjectName'
														type='select'
														onChange={handelOnChangeInput}
														value={course.subjectName}>
														{subjects.map((item) => {
															return (
																<option
																	key={item.subjectId}
																	value={item.subjectName}>
																	{item.subjectName}
																</option>
															);
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
														// defaultValue='Java cơ bản cho người mới'
														id='input-course-name'
														placeholder='Tên khóa học'
														type='text'
														onChange={handelOnChangeInput}
														name='course.courseName'
														value={course.courseName}
													/>
												</FormGroup>
												<Row>
													<Col md={12}>
														<FormGroup>
															<label
																className='form-control-label'
																htmlFor='input-first-name'>
																Thời lượng (giờ)
															</label>
															<Input
																className='form-control-alternative'
																id='input-courseDuration'
																placeholder='Thời lượng'
																type='number'
																min={120}
																step={30}
																value={course.courseDuration}
																name='courseDuration'
																onChange={handelOnChangeInput}
															/>
														</FormGroup>
													</Col>
													<Col md={12}>
														<FormGroup>
															<label
																className='form-control-label'
																htmlFor='input-last-name'>
																Giá khóa học (đồng)
															</label>
															<Input
																className='form-control-alternative'
																value={course.coursePrice}
																id='input-coursePrice'
																type='number'
																name='coursePrice'
																onChange={handelOnChangeInput}
															/>
														</FormGroup>
													</Col>
												</Row>
											</Col>
											<Col sm={6}>
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
																id='input-courseDescription'
																name='courseDescription'
																value={course.courseDescription}
																type='textarea'
																onChange={handelOnChangeInput}
															/>
														</FormGroup>
													</Col>
													<Col md={12}>
														<FormGroup>
															<Label
																htmlFor='exampleFile'
																className='form-control-label'>
																Hình ảnh khóa học
															</Label>
															<div className='custom-file'>
																<input
																	type='file'
																	className='custom-file-input form-control-alternative'
																	id='customFile'
																	onChange={onChangePicture}
																	multiple={true}
																/>
																<label
																	className='custom-file-label'
																	htmlFor='customFile'>
																	Chọn hình ảnh
																</label>
															</div>
														</FormGroup>
													</Col>
													<div className='previewProfilePic px-3'>
														<img
															alt=''
															width={120}
															className='playerProfilePic_home_tile'
															src={imgData}
														/>
													</div>
												</Row>
											</Col>
										</Row>
									</div>
									<hr className='my-4' />
								</Form>
							</div>
							<div className='modal-footer'>
								<Button
									color='secondary'
									data-dismiss='modal'
									type='button'
									onClick={handleResetForm}>
									Hủy
								</Button>
								<Button
									color='primary'
									type='button'
									className='px-5'
									onClick={handleSubmitForm}>
									Lưu
								</Button>
							</div>
						</Modal>
					</CardBody>
				</Card>
			</Container>
		</>
	);
};
export default memo(Courses);
