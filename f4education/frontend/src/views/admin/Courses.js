// import {Edit as EditIcon, RemoveCircleOutline as RemoveCircleOutlineIcon, Search} from '@mui/icons-material';
// import {Box, IconButton} from '@mui/material';
// import courseApi from 'api/courseApi';
// import CoursesHeader from 'components/Headers/CoursesHeader';
// import {MaterialReactTable} from 'material-react-table';
// import {memo, useEffect, useMemo, useState} from 'react';
// import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Modal, Row} from 'reactstrap';
// import subjectApi from '../../api/subjectApi';
// import Select from 'react-select';
// const IMG_URL = '/courses/';
// const Courses = () => {
// 	const user = JSON.parse(localStorage.getItem('user') ?? '');
// 	const [image, setImage] = useState(null);
// 	const [imgData, setImgData] = useState(null);
// 	const [showForm, setShowForm] = useState(false);
// 	// const [selectedId, setSelectedId] = useState(-1);
// 	const [update, setUpdate] = useState(false);
// 	const [courses, setCourses] = useState([]);
// 	const [subjects, setSubjects] = useState([]);
// 	const [selectedSubject, setSelectedSubject] = useState({value: '0', label: ''});
// 	const [options, setOptions] = useState([{value: '0', label: ''}]);
// 	const [subjectId, setSubjectId] = useState(0);
// 	const [course, setCourse] = useState({
// 		courseId: 0,
// 		courseName: '',
// 		courseDuration: 100,
// 		coursePrice: 6000000,
// 		courseDescription: '',
// 		image: '',
// 		subject: {
// 			subjectId: 0,
// 			subjectName: '',
// 			admin: {
// 				adminId: '',
// 				fullname: '',
// 				gender: true,
// 				dateOfBirth: '',
// 				citizenIdentification: '',
// 				address: '',
// 				phone: '',
// 				image: '',
// 			},
// 		},
// 	});
// 	const [courseRequest, setCourseRequest] = useState({
// 		subjectId: 0,
// 		adminId: '',
// 		courseId: '',
// 		courseName: '',
// 		coursePrice: 0,
// 		courseDuration: '',
// 		courseDescription: '',
// 		numberSession: 0,
// 		image: '',
// 	});
// 	const handelOnChangeInput = (e) => {
// 		setCourse({...course, [e.target.name]: e.target.value, numberSession: 0});
// 	};
// 	const handleOnChangeSelect = (e) => {
// 		const selectedIndex = e.target.options.selectedIndex;
// 		setSubjectId(e.target.options[selectedIndex].getAttribute('data-value'));
// 		setCourseRequest((preCourse) => ({
// 			...preCourse,
// 			subjectId: parseInt(subjectId),
// 		}));
// 	};
// 	const onChangePicture = (e) => {
// 		setImage(null);
// 		if (e.target.files[0]) {
// 			setImage(e.target.files[0]);
// 			const reader = new FileReader();
// 			reader.addEventListener('load', () => {
// 				setImgData(reader.result);
// 			});
// 			reader.readAsDataURL(e.target.files[0]);
// 			setCourse((preCourse) => ({
// 				...preCourse,
// 				image: e.target.files[0].name,
// 			}));
// 		}
// 	};
// 	const columns = useMemo(
// 		() => [
// 			{
// 				enableColumnOrdering: true,
// 				enableEditing: false, //disable editing on this column
// 				enableSorting: true,
// 				accessorKey: 'courseId',
// 				header: 'Mã khóa học',
// 				size: 20,
// 			},
// 			{
// 				accessorKey: 'subject.subjectName',
// 				header: 'Tên môn học',
// 				size: 150,
// 			},
// 			{
// 				accessorKey: 'courseName',
// 				header: 'Tên khóa học',
// 				size: 150,
// 			},
// 			{
// 				accessorKey: 'courseDuration',
// 				header: 'Thời lượng (h)',
// 				size: 75,
// 			},
// 			{
// 				accessorKey: 'coursePrice',
// 				header: 'Giá (đ)',
// 				size: 60,
// 			},
// 			{
// 				accessorKey: 'subject.admin.adminId',
// 				header: 'Mã người tạo',
// 				size: 80,
// 			},
// 		],
// 		[],
// 	);
// 	const fetchCourses = async () => {
// 		try {
// 			const resp = await courseApi.getAll();
// 			setCourses([...resp]);
// 		} catch (error) {
// 			console.log('failed to fetch data', error);
// 		}
// 	};
// 	const fetchSubject = async () => {
// 		try {
// 			const resp = await subjectApi.getAllSubject();
// 			setSubjects(resp);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// 	const convertToArray = () => {
// 		const convertedArray = subjects.map((item) => ({
// 			value: item.subjectId,
// 			label: item.subjectName,
// 		}));
// 		console.log(options);
// 		return convertedArray;
// 	};
// 	const handleEditFrom = (row) => {
// 		setShowForm(true);
// 		const selectedCourse = courses.find((course) => course.courseId === row.original.courseId);
// 		setUpdate(true);
// 		setCourse({...selectedCourse});
// 		console.log(course);
// 		setSelectedSubject({...selectedSubject, value: selectedCourse.subject.subjectId, label: selectedCourse.subject.subjectName});
// 		console.log(selectedSubject);
// 	};
// 	const handleResetForm = () => {
// 		// hide form
// 		setShowForm((pre) => !pre);
// 		setImgData(null);
// 		// set course == null
// 		setCourse({
// 			// subjectName: '',
// 			courseName: '',
// 			courseDuration: 100,
// 			coursePrice: 6000000,
// 			courseDescription: '',
// 			image: '',
// 			subject: {
// 				subjectId: 0,
// 				subjectName: '',
// 				admin: {
// 					adminId: '',
// 					fullname: '',
// 					gender: true,
// 					dateOfBirth: '',
// 					citizenIdentification: '',
// 					address: '',
// 					phone: '',
// 					image: '',
// 				},
// 			},
// 		});
// 	};
// 	const handleShowAddForm = () => {
// 		setShowForm((pre) => !pre);
// 		setUpdate(false);
// 		handleSelect(options[0]);
// 		console.log(courseRequest);
// 	};
// 	const handleSubmitForm = (e) => {
// 		e.preventDefault();
// 		if (update) {
// 			updateCourse();
// 			console.log(courseRequest);
// 			console.log('updated');
// 			// if (image) {
// 			// 	setCourse((preCourse) => ({
// 			// 		...preCourse,
// 			// 		image: image.name,
// 			// 	}));
// 			// }
// 			// console.log(courseRequest);
// 		} else {
// 			console.log(courseRequest);
// 			addCourse();

// 			console.log('add');
// 			// setCourseRequest((preCourse) => ({
// 			// 	...preCourse,
// 			// 	adminId: user.username,
// 			// 	numberSession: 0,
// 			// }));
// 		}
// 	};
// 	const addCourse = async () => {
// 		const formData = new FormData();
// 		formData.append('courseRequest', JSON.stringify(courseRequest));
// 		formData.append('file', image);
// 		console.log([...formData]);
// 		console.log({...courseRequest});
// 		try {
// 			const resp = await courseApi.addCourse(formData);
// 			fetchCourses();
// 		} catch (error) {
// 			console.log('failed to fetch data', error);
// 		}
// 	};
// 	const updateCourse = async () => {
// 		const formData = new FormData();
// 		formData.append('courseRequest', JSON.stringify(courseRequest));
// 		formData.append('file', image);
// 		console.log([...formData]);
// 		console.log({...courseRequest});
// 		try {
// 			const resp = await courseApi.updateCourse(formData);
// 			fetchCourses();
// 		} catch (error) {
// 			console.log('failed to fetch data', error);
// 		}
// 	};
// 	function handleSelect(data) {
// 		setSelectedSubject(data);
// 		setCourseRequest((pre) => ({...pre, subjectId: parseInt(selectedSubject.value)}));
// 		// console.log(courseRequest);
// 	}
// 	useEffect(() => {
// 		fetchCourses();
// 		fetchSubject();
// 	}, []);
// 	useEffect(() => {
// 		const convertedOptions = convertToArray();
// 		setOptions(convertedOptions);
// 	}, [subjects, selectedSubject]);
// 	useEffect(() => {
// 		const {courseId, courseName, coursePrice, courseDuration, courseDescription, numberSession, image} = {...course};
// 		if (selectedSubject.value !== undefined) {
// 			setCourseRequest({courseId: courseId, courseName: courseName, coursePrice: coursePrice, courseDuration: courseDuration, courseDescription: courseDescription, numberSession: numberSession, image: image, subjectId: parseInt(selectedSubject.value), adminId: user.username});
// 		}
// 	}, [course, selectedSubject]);
// 	return (
// 		<>
// 			<CoursesHeader />
// 			<Container
// 				className='mt--7'
// 				fluid>
// 				<Card className='bg-secondary shadow'>
// 					{/* Header */}
// 					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
// 						<h3 className='mb-0'>BẢNG KHÓA HỌC</h3>
// 						<Button
// 							color='default'
// 							type='button'>
// 							Lịch sử khóa học
// 						</Button>
// 					</CardHeader>
// 					<CardBody>
// 						<MaterialReactTable
// 							enableColumnResizing
// 							enableGrouping
// 							enableStickyHeader
// 							enableStickyFooter
// 							enableRowNumbers
// 							displayColumnDefOptions={{
// 								'mrt-row-actions': {
// 									header: 'Thao tác',
// 									size: 20,
// 									// Something else here
// 								},
// 								'mrt-row-numbers': {
// 									size: 5,
// 								},
// 							}}
// 							positionActionsColumn='last'
// 							columns={columns}
// 							data={courses}
// 							renderTopToolbarCustomActions={() => (
// 								<Button
// 									onClick={handleShowAddForm}
// 									color='primary'
// 									variant='contained'>
// 									<i className='bx bx-layer-plus'></i>
// 									Thêm khóa học
// 								</Button>
// 							)}
// 							enableRowActions
// 							renderRowActions={({row, table}) => (
// 								<Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
// 									<IconButton
// 										color='secondary'
// 										onClick={() => {
// 											handleEditFrom(row);
// 										}}>
// 										<EditIcon />
// 									</IconButton>
// 									<IconButton
// 										color='error'
// 										onClick={() => {
// 											courses.splice(row.index, 1);
// 										}}>
// 										<RemoveCircleOutlineIcon />
// 									</IconButton>
// 								</Box>
// 							)}
// 							muiTablePaginationProps={{
// 								rowsPerPageOptions: [10, 20, 50, 100],
// 								showFirstButton: true,
// 								showLastButton: true,
// 							}}
// 						/>
// 						<Modal
// 							className='modal-dialog-centered  modal-lg '
// 							isOpen={showForm}
// 							backdrop='static'
// 							toggle={() => setShowForm((pre) => !pre)}>
// 							<Form
// 								onSubmit={handleSubmitForm}
// 								encType='multipart/form-data'>
// 								<div className='modal-header'>
// 									<h3 className='mb-0'>Thông tin khóa học</h3>
// 									<button
// 										aria-label='Close'
// 										className='close'
// 										data-dismiss='modal'
// 										type='button'
// 										onClick={handleResetForm}>
// 										<span aria-hidden={true}>×</span>
// 									</button>
// 								</div>
// 								<div className='modal-body'>
// 									<div className='px-lg-2'>
// 										<Row>
// 											<Col sm={6}>
// 												<FormGroup>
// 													<label
// 														className='form-control-label'
// 														htmlFor='input-username'>
// 														Tên môn học
// 													</label>
// 													{/* <Input
// 														id='exampleSelect'
// 														name='subjectName'
// 														type='select'
// 														onChange={handleOnChangeSelect}
// 														value={course.subjectName}>
// 														<option>Chọn môn học</option>
// 														{subjects.map((item) => {
// 															return (
// 																<option
// 																	key={item.subjectId}
// 																	data-value={item.subjectId}
// 																	value={item.subjectName}>
// 																	{item.subjectName}
// 																</option>
// 															);
// 														})}
// 													</Input> */}
// 													<Select
// 														options={options}
// 														placeholder='Select color'
// 														value={selectedSubject}
// 														onChange={handleSelect}
// 														isSearchable={true}
// 													/>
// 												</FormGroup>
// 												<FormGroup>
// 													<label
// 														className='form-control-label'
// 														htmlFor='input-email'>
// 														Tên khóa học
// 													</label>
// 													<Input
// 														className='form-control-alternative'
// 														// defaultValue='Java cơ bản cho người mới'
// 														id='input-course-name'
// 														placeholder='Tên khóa học'
// 														type='text'
// 														onChange={handelOnChangeInput}
// 														name='courseName'
// 														value={course.courseName}
// 													/>
// 												</FormGroup>
// 												<Row>
// 													<Col md={12}>
// 														<FormGroup>
// 															<label
// 																className='form-control-label'
// 																htmlFor='input-first-name'>
// 																Thời lượng (giờ)
// 															</label>
// 															<Input
// 																className='form-control-alternative'
// 																id='input-courseDuration'
// 																placeholder='Thời lượng'
// 																type='number'
// 																min={120}
// 																step={30}
// 																value={course.courseDuration}
// 																name='courseDuration'
// 																onChange={handelOnChangeInput}
// 															/>
// 														</FormGroup>
// 													</Col>
// 													<Col md={12}>
// 														<FormGroup>
// 															<label
// 																className='form-control-label'
// 																htmlFor='input-last-name'>
// 																Giá khóa học (đồng)
// 															</label>
// 															<Input
// 																className='form-control-alternative'
// 																value={course.coursePrice}
// 																id='input-coursePrice'
// 																type='number'
// 																name='coursePrice'
// 																onChange={handelOnChangeInput}
// 															/>
// 														</FormGroup>
// 													</Col>
// 												</Row>
// 											</Col>
// 											<Col sm={6}>
// 												<Row>
// 													<Col md={12}>
// 														<FormGroup>
// 															<label
// 																className='form-control-label'
// 																htmlFor='input-last-name'>
// 																Mô tả khóa học
// 															</label>
// 															<Input
// 																className='form-control-alternative'
// 																id='input-courseDescription'
// 																name='courseDescription'
// 																value={course.courseDescription}
// 																type='textarea'
// 																onChange={handelOnChangeInput}
// 															/>
// 														</FormGroup>
// 													</Col>
// 													<Col md={12}>
// 														<FormGroup>
// 															<Label
// 																htmlFor='exampleFile'
// 																className='form-control-label'>
// 																Hình ảnh khóa học
// 															</Label>
// 															<div className='custom-file'>
// 																<input
// 																	type='file'
// 																	name='imageFile'
// 																	accept='image/*'
// 																	className='custom-file-input form-control-alternative'
// 																	id='customFile'
// 																	onChange={onChangePicture}
// 																	// multiple={true}
// 																/>
// 																<label
// 																	className='custom-file-label'
// 																	htmlFor='customFile'>
// 																	Chọn hình ảnh
// 																</label>
// 															</div>
// 														</FormGroup>
// 													</Col>
// 													<div className='previewProfilePic px-3'>
// 														{imgData && (
// 															<img
// 																alt=''
// 																width={120}
// 																className='playerProfilePic_home_tile'
// 																src={imgData}
// 															/>
// 														)}
// 														{update && !imgData && (
// 															<img
// 																alt=''
// 																width={120}
// 																className=''
// 																src={process.env.REACT_APP_IMAGE_URL + IMG_URL + course.image}
// 															/>
// 														)}
// 													</div>
// 												</Row>
// 											</Col>
// 										</Row>
// 									</div>
// 									<hr className='my-4' />
// 								</div>
// 								<div className='modal-footer'>
// 									<Button
// 										color='secondary'
// 										data-dismiss='modal'
// 										type='button'
// 										onClick={handleResetForm}>
// 										Hủy
// 									</Button>
// 									<Button
// 										color='primary'
// 										type='submit'
// 										className='px-5'>
// 										Lưu
// 									</Button>
// 								</div>
// 							</Form>
// 						</Modal>
// 					</CardBody>
// 				</Card>
// 			</Container>
// 		</>
// 	);
// };
// export default memo(Courses);
