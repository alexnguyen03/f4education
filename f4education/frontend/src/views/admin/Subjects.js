import {FormGroup} from '@mui/material';
import SubjectHeader from 'components/Headers/SubjectHeader';
import {MaterialReactTable} from 'material-react-table';
import {useEffect, useMemo, useState} from 'react';

// reactstrap components
import {Button, Card, CardBody, CardHeader, Container, Input, Modal} from 'reactstrap';

// Stoatify component
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Axios
// import axios from "axios";
import subjectApi from '../../api/subjectApi';

// API URL
// const ROOT_URL = "http://localhost:8080/api/subjects";

const Subjects = () => {
	// Main variable
	const [subjects, setSubjects] = useState([]);

	// Action variable
	const [showModalUpdateSubject, setShowModalUpdateSubject] = useState(false);
	const [showModalAddSubject, setShowModalAddSubject] = useState(false);

	// Form variable
	const [errorInputAddSubject, setErrorInputAddSubject] = useState({
		status: false,
		message: '',
	});

	const [errorInputUpdateSubject, setErrorInputUpdateSubject] = useState({
		status: false,
		message: '',
	});

	const admin = {
		admin_id: 'namnguyen',
		fullname: 'Nguyễn Hoài Nam',
		gender: true,
		date_of_birth: '2003-01-01',
		citizen_identification: '930475892189',
		levels: 'Admin',
		address: 'Can Tho',
		phone: '1234567890',
		image: 'image1.png',
	};

	const [subject, setSubject] = useState({
		subjectId: '',
		adminId: admin.admin_id,
		subjectName: '',
	});

	// Form action area
	const handleChangeInput = (e) => {
		setSubject((prevSubject) => ({
			...prevSubject,
			[e.target.name]: e.target.value,
		}));
	};

	// API Area
	const fetchSubjects = async () => {
		try {
			const resp = await subjectApi.getAllSubject();
			setSubjects(resp);
			console.log('restarted application');
		} catch (error) {
			console.log(error);
		}
		// const resp = await axios(ROOT_URL);
		// console.log(resp.data);
	};

	// API_AREA > CRUD
	const handleCreateNewSubject = async () => {
		subject.subjectId = '';

		const action = 'add';
		if (validateForm(action)) {
			try {
				const body = subject;
				const resp = await subjectApi.createSubject(body);
				console.log(resp);
				// axios({
				//   method: "post",
				//   url: ROOT_URL,
				//   data: subject,
				// });
			} catch (error) {}
			console.log('Add Success');
			setShowModalAddSubject(false);
		} else console.log('Error in validation');
	};

	const handleUpdateSubject = async () => {
		console.log(subject);

		const action = 'update';
		if (validateForm(action)) {
			try {
				const body = subject;
				const resp = await subjectApi.updateSubject(body, subject.subjectId);
				console.log(resp);
			} catch (error) {
				console.log(error);
			}
			// axios({
			//   method: "put",
			//   url: `${ROOT_URL}/${subject.subjectId}`,
			//   data: subject,
			// });

			console.log('Update success');
			fetchSubjects();
			setShowModalUpdateSubject(false);

			setSubject({
				subjectId: '',
				adminId: admin.admin_id,
				subjectName: '',
			});
		}
	};

	// Validation area
	const validateForm = (action) => {
		if (subject.subjectName.length === 0) {
			if (action === 'add') {
				setErrorInputAddSubject({
					status: true,
					message: 'Vui lòng nhập vào tên môn học',
				});
			} else {
				setErrorInputUpdateSubject({
					status: true,
					message: 'Vui lòng nhập vào tên môn học',
				});
			}
			return false;
		} else {
			setErrorInputAddSubject({
				status: false,
				message: '',
			});
			setErrorInputUpdateSubject({
				status: false,
				message: '',
			});
		}
		return true;
	};

	// React Data table area
	const columns = useMemo(
		() => [
			{
				accessorKey: 'subjectId',
				header: 'ID',
				enableColumnOrdering: false,
				enableEditing: false, //disable editing on this column
				enableSorting: false,
				size: 10,
			},
			{
				accessorKey: 'adminId',
				header: 'Mã người tạo',
				size: 10,
			},
			{
				accessorKey: 'subjectName',
				header: 'Tên Môn Học',
			},
		],
		[],
	);

	// Use effect area
	useEffect(() => {
		fetchSubjects();
	}, []);

	return (
		<>
			{/* HeaderSubject start */}
			<SubjectHeader />
			{/* HeaderSubject End */}

			{/* Page content */}
			<Container
				className='mt--7'
				fluid>
				<Card className='bg-secondary shadow'>
					{/* Header */}
					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
						<h3 className='mb-0'>Bảng Môn học</h3>
						<Button
							color='default'
							type='button'>
							Lịch sử môn học
						</Button>
					</CardHeader>
					<CardBody>
						{/* Table view */}
						<MaterialReactTable
							displayColumnDefOptions={{
								'mrt-row-actions': {
									header: 'Thao tác',
									size: 20,
									// Something else here
								},
							}}
							columns={columns}
							data={subjects}
							editingMode='modal' //default
							enableColumnOrdering
							enableEditing
							positionActionsColumn='last' // actions row at the end
							renderRowActions={({row}) => (
								<div className='d-flex justify-content-start'>
									<Button
										color='warning'
										outline
										onClick={() => {
											setShowModalUpdateSubject(true);
											setSubject({...row.original});
										}}>
										<i className='bx bx-edit'></i>
									</Button>
								</div>
							)}
							// Top Add new Subject button
							renderTopToolbarCustomActions={() => (
								<Button
									color='primary'
									onClick={() => setShowModalAddSubject(true)}
									variant='contained'
									data-placement='top'
									id='addSubjects'>
									<i className='bx bx-layer-plus'></i> Thêm môn học
								</Button>
							)}
						/>
					</CardBody>
				</Card>

				{/* Toast */}
				{/* <ToastContainer /> */}

				{/* Modal */}
				{/* Modal Add Subject */}
				<Modal
					className='modal-dialog-centered'
					isOpen={showModalAddSubject}
					toggle={showModalAddSubject}
					backdrop={'static'}>
					<div className='modal-header'>
						<h3
							className='modal-title'
							id='modal-title-default'>
							Thêm môn học
						</h3>
						<button
							aria-label='Close'
							className='close'
							data-dismiss='modal'
							type='button'
							onClick={() => setShowModalAddSubject(false)}>
							<span aria-hidden={true}>×</span>
						</button>
					</div>
					<div className='modal-body'>
						<form method='post'>
							<FormGroup className='mb-3'>
								<label
									className='form-control-label'
									htmlFor='adminId'>
									Mã người tạo
								</label>
								<Input
									className='form-control-alternative'
									disabled
									id='adminId'
									// onChange={handleChangeInput}
									name='adminId'
									value={subject.adminId}
								/>
							</FormGroup>
							<FormGroup className='mb-3'>
								<label
									className='form-control-label'
									htmlFor='name'>
									Tên môn học
								</label>
								<Input
									// className="is-invalid"
									className={`${errorInputAddSubject.status ? 'is-invalid' : 'form-control-alternative'}`}
									id='name'
									onChange={handleChangeInput}
									name='subjectName'
									value={subject.subjectName}
								/>
								<span className='text-danger'>{errorInputAddSubject.message}</span>
							</FormGroup>
						</form>
					</div>
					<div className='modal-footer'>
						<Button
							color='default'
							outline
							data-dismiss='modal'
							type='button'
							onClick={() => setShowModalAddSubject(false)}>
							Trở lại
						</Button>
						<Button
							color='primary'
							type='button'
							onClick={() => {
								handleCreateNewSubject();
								// toast("Cập nhật môn học thành công");
							}}>
							Tạo môn học mới
						</Button>
					</div>
				</Modal>

				{/* Modal Update Suject*/}
				<Modal
					className='modal-dialog-centered'
					isOpen={showModalUpdateSubject}
					toggle={showModalUpdateSubject}
					backdrop={'static'}>
					<div className='modal-header'>
						<h3
							className='modal-title'
							id='modal-title-default'>
							Cập nhật môn học
						</h3>
						<button
							aria-label='Close'
							className='close'
							data-dismiss='modal'
							type='button'
							onClick={() => setShowModalUpdateSubject(false)}>
							<span aria-hidden={true}>×</span>
						</button>
					</div>
					<div className='modal-body'>
						<form method='post'>
							<FormGroup className='mb-3'>
								<label
									className='form-control-label'
									htmlFor='id'>
									Mã môn học
								</label>
								<Input
									className='form-control-alternative'
									id='id'
									// onChange={handleChangeInput}
									disabled
									name='subjectId'
									value={subject.subjectId}
								/>
							</FormGroup>
							<FormGroup className='mb-3'>
								<label
									className='form-control-label'
									htmlFor='adminId'>
									Mã Admin
								</label>
								<Input
									className='form-control-alternative'
									disabled
									id='adminId'
									// onChange={handleChangeInput}
									name='adminId'
									value={subject.adminId}
								/>
							</FormGroup>
							<FormGroup className='mb-3'>
								<label
									className='form-control-label'
									htmlFor='name'>
									Tên môn học
								</label>
								<Input
									className={`${errorInputUpdateSubject.status ? 'is-invalid' : 'form-control-alternative'}`}
									id='name'
									onChange={handleChangeInput}
									name='subjectName'
									value={subject.subjectName}
								/>
								<span className='text-danger'>{errorInputUpdateSubject.message}</span>
							</FormGroup>
						</form>
					</div>
					<div className='modal-footer'>
						<Button
							color='default'
							outline
							data-dismiss='modal'
							type='button'
							onClick={() => setShowModalUpdateSubject(false)}>
							Trở lại
						</Button>
						<Button
							color='primary'
							type='button'
							onClick={() => {
								handleUpdateSubject();
								// toast("Cập nhật môn học thành công");
							}}>
							Cập nhật
						</Button>
					</div>
				</Modal>
			</Container>
			{/* Page content end */}
		</>
	);
};

export default Subjects;
