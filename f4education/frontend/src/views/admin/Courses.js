import CoursesHeader from 'components/Headers/CoursesHeader';
import {useEffect, useMemo, useState} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label, Modal, Row} from 'reactstrap';

import {Edit as EditIcon, RemoveCircleOutline as RemoveCircleOutlineIcon} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';
import courseApi from 'api/courseApi';
import {MaterialReactTable} from 'material-react-table';

const Courses = () => {
	const [subjectList, setSubjectList] = useState([{key: 'java', value: 'Java'}, {key: 'c#', value: 'C#'}, , {key: 'python', value: 'Python'}, {key: 'PHP', value: 'PHP'}]);
	const [image, setImage] = useState(null);
	const [imgData, setImgData] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [courses, setCourses] = useState([]);
	const [course, setCourse] = useState({
		subjectName: '',
		courseName: '',
		duration: 0,
		price: 0,
		description: '',
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
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImgData(reader.result);
			});
			reader.readAsDataURL(e.target.files[0]);
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
				header: 'Thời lượng',
				size: 100,
			},
			{
				accessorKey: 'coursePrice',
				header: 'Giá',
				size: 100,
			},
		],
		[],
	);
	const fetchCourses = async () => {
		try {
			const resp = await courseApi.getAll();
			setCourses(resp);
		} catch (error) {
			console.log('failed to fetch data', error);
		}
	};
	const fetchSubject = () => {};
	useEffect(() => {
		fetchCourses();
	}, []);
	return (
		<>
			<CoursesHeader />
			<Container
				className='mt--7'
				fluid>
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
							onClick={() => setShowForm((pre) => !pre)}
							color='success'>
							Create New Account
						</Button>
					)}
					enableRowActions
					renderRowActions={({row, table}) => (
						<Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
							<IconButton
								color='secondary'
								onClick={() => {
									setShowForm(true);
									setCourse({...row.original});
									console.log(row);
								}}>
								<EditIcon />
							</IconButton>
							<IconButton
								color='error'
								onClick={() => {
									courses.splice(row.index, 1); //assuming simple data table
								}}>
								<RemoveCircleOutlineIcon />
							</IconButton>
						</Box>
					)}
				/>

				<Modal
					className='modal-dialog-centered'
					isOpen={showForm}
					toggle={() => setShowForm((pre) => !pre)}>
					<div className='modal-header'>
						<h3 className='mb-0'>Thông tin khóa học</h3>

						<button
							aria-label='Close'
							className='close'
							data-dismiss='modal'
							type='button'
							onClick={() => setShowForm((pre) => !pre)}>
							<span aria-hidden={true}>×</span>
						</button>
					</div>
					<div className='modal-body'>
						<Form>
							{/* <h6 className='heading-small text-muted mb-4'>Thông tin môn học</h6> */}
							<div className='px-lg-2'>
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
										{subjectList.map((item) => {
											return (
												<option
													key={item.key}
													value={item.value}>
													{item.value}
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
												Thời lượng (phút)
											</label>
											<Input
												className='form-control-alternative'
												id='input-duration'
												placeholder='Thời lượng'
												type='number'
												min={120}
												step={30}
												value={course.duration}
												name='duration'
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
												value={course.price}
												id='input-price'
												type='number'
												name='price'
												onChange={handelOnChangeInput}
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
												id='input-description'
												name='description'
												value={course.description}
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
					</div>
					<div className='modal-footer'>
						<Button
							color='secondary'
							data-dismiss='modal'
							type='button'
							onClick={() => setShowForm((pre) => !pre)}>
							Close
						</Button>
						<Button
							color='primary'
							type='button'>
							Save changes
						</Button>
					</div>
				</Modal>
			</Container>
		</>
	);
};

export default Courses;
