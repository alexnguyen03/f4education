import {Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, Label, Modal} from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader.js';
import CoursesHeader from 'components/Headers/CoursesHeader';
import {useState, useMemo} from 'react';
import Delete from '@material-ui/icons/Delete';
import Refresh from '@material-ui/icons/Refresh';
import Save from '@material-ui/icons/Save';

import {MaterialReactTable} from 'material-react-table';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Tooltip} from '@mui/material';
const data = [
	{
		subjectName: 'Java',
		courseName: 'Java cơ bản',
		duration: 150,
		price: 120000,
		description: 'Khóa học Java cho người mới bắt đầu',
	},
	{
		subjectName: 'C#',
		courseName: 'C# cơ bản',
		duration: 120,
		price: 130000,
		description: 'Khóa học C# cho người mới bắt đầu',
	},
	{
		subjectName: 'Java',
		courseName: 'Java cơ bản',
		duration: 150,
		price: 120000,
		description: 'Khóa học Java cho người mới bắt đầu',
	},
	{
		subjectName: 'Java',
		courseName: 'Java cơ bản',
		duration: 150,
		price: 120000,
		description: 'Khóa học Java cho người mới bắt đầu',
	},
	{
		subjectName: 'Java',
		courseName: 'Java cơ bản',
		duration: 150,
		price: 120000,
		description: 'Khóa học Java cho người mới bắt đầu',
	},
	{
		subjectName: 'Java',
		courseName: 'Java cơ bản',
		duration: 150,
		price: 120000,
		description: 'Khóa học Java cho người mới bắt đầu',
	},
	{
		subjectName: 'Java',
		courseName: 'Java cơ bản',
		duration: 150,
		price: 120000,
		description: 'Khóa học Java cho người mới bắt đầu',
	},
];

const Courses = () => {
	const [subjectList, setSubjectList] = useState([{key: 'java', value: 'Java'}, {key: 'c#', value: 'C#'}, , {key: 'python', value: 'Python'}, {key: 'PHP', value: 'PHP'}]);
	const [image, setImage] = useState(null);
	const [imgData, setImgData] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [course, setCourse] = useState({
		subjectName: '',
		courseName: '',
		duration: 0,
		price: 0,
		description: '',
		image: '',
	});

	const handelOnChangeInput = (e) => {
		setCourse({[e.target.name]: e.target.value});
	};
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
	const columns = useMemo(
		() => [
			{
				accessorKey: 'subjectName',
				header: 'Tên môn học',
				size: 150,
			},
			{
				accessorKey: 'courseName',
				header: 'Tên khóa học',
				size: 150,
			},
			{
				accessorKey: 'duration', //normal accessorKey
				header: 'Thời lượng',
				size: 100,
			},
			{
				accessorKey: 'price',
				header: 'Giá',
				size: 100,
			},
		],
		[],
	);

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
					columns={columns}
					data={data}
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
									console.log(course);
								}}>
								<EditIcon />
							</IconButton>
							<IconButton
								color='error'
								onClick={() => {
									data.splice(row.index, 1); //assuming simple data table
								}}>
								<DeleteIcon />
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
