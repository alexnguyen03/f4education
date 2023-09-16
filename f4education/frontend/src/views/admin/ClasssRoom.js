import {Button, Card, CardBody, CardHeader, FormGroup, Form, Input, Container, Row, Col, Modal} from 'reactstrap';
import ClassRoomHeader from 'components/Headers/ClassRoomHeader';
import {useState, useMemo, useEffect} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';
import moment from 'moment';

// gọi API từ classRoomApi
import classRoomApi from 'api/classRoomApi';

// gọi API từ classRoomHistoryApi
import classRoomHistoryApi from 'api/classRoomHistoryApi';

const ClasssRoom = () => {
	const [classRooms, setClassRooms] = useState([]);
	const [classRoomHistories, setClassRoomHistories] = useState([]);
	const [classRoomHistoryByClassRoomId, setClassRoomHistotyByClassRoomId] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [showFormClassRoomHistory, setShowFormClassRoomHistory] = useState(false);
	const [update, setUpdate] = useState(true);
	const [isClassRoomHistoryShowing, setIsClassRoomHistoryShowing] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [errors, setErrors] = useState({});

	// khởi tạo ClassRoom
	const [classRoom, setClassRoom] = useState({
		classroomId: '',
		classroomName: '',
		status: 'Khả dụng',
	});

	// bắt lỗi form
	const validateForm = () => {
		let validationErrors = {};
		if (!classRoom.classroomName) {
			validationErrors.classroomName = 'Vui lòng nhập tên phòng học !!!';
		}
		return validationErrors;
	};

	// thay đổi giá trị của biến
	const handleChangeClassListAndHistory = () => {
		setIsClassRoomHistoryShowing(!isClassRoomHistoryShowing);
	};

	// gender status
	const renderSelect = () => {
		return (
			<>
				<option
					data-value='Hoạt động'
					value='Hoạt động'>
					Hoạt động
				</option>
				<option
					data-value='Đang bảo trì'
					value='Đang bảo trì'>
					Đang bảo trì
				</option>
				<option
					data-value='Không hoạt động'
					value='Không hoạt động'>
					Không hoạt động
				</option>
			</>
		);
	};

	// lấy dữ liệu của select status
	const handleOnChangeSelect = (e) => {
		const selectedIndex = e.target.options.selectedIndex;
		const status = e.target.options[selectedIndex].getAttribute('data-value');
		setSelectedStatus(status);
	};

	// edit row classroom
	const handleEditRow = (row) => {
		setShowForm(true);
		setUpdate(false);
		setSelectedStatus(row.original.status);
		setClassRoom({...row.original});
	};

	// show modal classroomhistory
	const handleShowClassRoomHistory = (row) => {
		setShowFormClassRoomHistory(true);
		getDataClassRoomHistoryByClassRoomId(row.original.classroomId);
	};

	// lấy dữ liệu từ form
	const handelOnChangeInput = (e) => {
		setClassRoom({
			...classRoom,
			[e.target.name]: e.target.value,
		});
	};

	// xóa trắng form
	const handleResetForm = () => {
		setShowForm((pre) => !pre);
		setClassRoom({
			classId: '',
			className: '',
			status: 'Khả dụng',
		});
		setUpdate(true);
		setErrors({});
	};

	// lấy tấc cả dữ liệu ClassRoom từ database (gọi api)
	const getDataClassRoom = async () => {
		try {
			const resp = await classRoomApi.getAllClassRoom();
			setClassRooms(resp);
		} catch (error) {
			console.log(error);
		}
	};

	// thêm classroom
	const createClassRoom = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length === 0) {
			try {
				const resp = await classRoomApi.createClassRoom(classRoom);
				alert('Thêm thành công');
				handleResetForm();
			} catch (error) {
				console.log('Thêm thất bại', error);
			}
		} else {
			setErrors(validationErrors);
		}
	};

	// cập nhật classroom
	const updateClassRoom = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length === 0) {
			try {
				console.log(classRoom);
				const body = classRoom;
				const resp = await classRoomApi.updateClassRoom(body, classRoom.classroomId);
				alert('Cập nhật thành công');
				handleResetForm();
			} catch (error) {
				console.log('Cập nhật thất bại', error);
			}
		} else {
			setErrors(validationErrors);
		}
	};

	// bảng phòng học
	const columnClassRoom = useMemo(
		() => [
			{
				accessorKey: 'classroomId',
				header: 'Mã phòng học',
				size: 100,
			},
			{
				accessorKey: 'classroomName',
				header: 'Tên phòng học',
				size: 100,
			},
			{
				accessorKey: 'admin.fullname',
				header: 'Người chỉnh sửa',
				size: 100,
			},
			{
				accessorKey: 'status',
				header: 'Trạng thái',
				size: 95,
			},
		],
		[],
	);

	// hiển thị tiếng việt
	const displayActionHistory = (action) => {
		return action === 'CREATE' ? 'Thêm mới' : 'Cập nhật';
	};

	// bảng lịch sử phòng học
	const columnClassRoomHistory = useMemo(
		() => [
			{
				accessorKey: 'classroomId',
				header: 'Mã phòng học',
				size: 90,
			},
			{
				accessorKey: 'classroomName',
				header: 'Tên phòng học',
				size: 100,
			},
			{
				accessorKey: 'status',
				header: 'Trạng thái',
				size: 95,
			},
			{
				accessorKey: 'admin.fullname',
				header: 'Người chỉnh sửa',
				size: 100,
			},
			{
				accessorFn: (row) => moment(row.modifyDate).format('DD-MM-yyyy, h:mm:ss a'),
				header: 'Ngày Chỉnh Sửa',
				size: 120,
			},
			{
				accessorKey: 'action',
				accessorFn: (row) => displayActionHistory(row.action),
				header: 'Hành động',
				size: 100,
			},
		],
		[],
	);

	// resetModal ClassHistory
	const handleResetClassRoomHistory = () => {
		setShowFormClassRoomHistory((pre) => !pre);
	};

	// lấy tấc cả dữ liệu ClassHistory từ database (gọi api)
	const getDataClassRoomHistory = async () => {
		try {
			const resp = await classRoomHistoryApi.getAllClassRoomHistory();
			console.log(resp);
			setClassRoomHistories(resp);
		} catch (error) {
			console.log(error);
		}
	};

	// lấy dữ liệu ClassHistory theo ClassId từ database (gọi api)
	const getDataClassRoomHistoryByClassRoomId = async (classroomId) => {
		try {
			const resp = await classRoomHistoryApi.getClassRoomHistoryByClassId(classroomId);
			setClassRoomHistotyByClassRoomId(resp);
		} catch (error) {
			console.log(error);
		}
	};

	// khi thay đổi selectedStatus thì sẽ tự động cập nhật lại
	useEffect(() => {
		setClassRoom({
			...classRoom,
			status: selectedStatus,
		});
	}, [selectedStatus]);

	// Use effect
	useEffect(() => {
		getDataClassRoom();
		getDataClassRoomHistory();
	}, []);

	return (
		<>
			<ClassRoomHeader />
			<Container
				className='mt--7'
				fluid>
				<Card className='bg-secondary shadow'>
					{/* Header */}
					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
						<h3 className='mb-0'>{isClassRoomHistoryShowing ? 'Bảng lịch sử phòng học' : 'Bảng phòng học'}</h3>
						<Button
							color='default'
							type='button'
							onClick={() => handleChangeClassListAndHistory()}>
							{isClassRoomHistoryShowing ? 'Danh sách phòng học' : 'Lịch sử phòng học'}
						</Button>
					</CardHeader>

					{/* bảng phòng học */}
					{isClassRoomHistoryShowing ? null : (
						<CardBody>
							<MaterialReactTable
								muiTableBodyProps={{
									sx: {
										//stripe the rows, make odd rows a darker color
										'& tr:nth-of-type(odd)': {
											backgroundColor: '#f5f5f5',
										},
									},
								}}
								displayColumnDefOptions={{
									'mrt-row-actions': {
										header: 'Thao tác',
										size: 50,
									},
								}}
								enableColumnResizing
								enableGrouping
								enableStickyHeader
								enableStickyFooter
								columns={columnClassRoom}
								data={classRooms}
								positionActionsColumn='last'
								renderTopToolbarCustomActions={() => (
									<Button
										onClick={() => setShowForm((pre) => !pre)}
										color='success'>
										Thêm phòng học
									</Button>
								)}
								enableRowActions
								renderRowActions={({row, table}) => (
									<Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
										<IconButton
											color='secondary'
											onClick={() => {
												handleEditRow(row);
											}}>
											<EditIcon />
										</IconButton>
										<IconButton
											color='info'
											onClick={() => {
												handleShowClassRoomHistory(row);
											}}>
											<i class='fa-sharp fa-solid fa-eye'></i>
										</IconButton>
									</Box>
								)}
								muiTablePaginationProps={{
									rowsPerPageOptions: [10, 20, 50, 100],
									showFirstButton: false,
									showLastButton: false,
								}}
							/>
						</CardBody>
					)}

					{/* bảng lịch sử phòng học  */}
					{isClassRoomHistoryShowing ? (
						<CardBody>
							<MaterialReactTable
								muiTableBodyProps={{
									sx: {
										//stripe the rows, make odd rows a darker color
										'& tr:nth-of-type(odd)': {
											backgroundColor: '#f5f5f5',
										},
									},
								}}
								enableColumnResizing
								enableGrouping
								enableStickyHeader
								enableStickyFooter
								columns={columnClassRoomHistory}
								data={classRoomHistories}
								muiTablePaginationProps={{
									rowsPerPageOptions: [10, 20, 50, 100],
									showFirstButton: false,
									showLastButton: false,
								}}
							/>
						</CardBody>
					) : null}
				</Card>
				{/* Modal ClassRoom */}
				<Modal
					backdrop='static'
					className='modal-dialog-centered'
					isOpen={showForm}
					toggle={() => setShowForm((pre) => !pre)}>
					<div className='modal-header'>
						<h3 className='mb-0'>Thông tin phòng học</h3>
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
								<FormGroup>
									<label
										className='form-control-label'
										htmlFor='input-classroom-name'>
										Tên phòng học
									</label>
									<Input
										className='form-control-alternative'
										id='input-classrroom-name'
										placeholder='Tên phòng học'
										type='text'
										onChange={handelOnChangeInput}
										name='classroomName'
										value={classRoom.classroomName}
									/>
									{errors.classroomName && <div className='text-danger mt-2'>{errors.classroomName}</div>}
								</FormGroup>
								<Row>
									<Col md={12}>
										<FormGroup>
											<label className='form-control-label'>Trạng thái</label>
											<Input
												id='exampleSelect'
												name='status'
												type='select'
												onChange={handleOnChangeSelect}
												readOnly={update ? 'readOnly' : undefined}
												value={selectedStatus}>
												{update ? (
													<option
														data-value='Hoạt động'
														value='Hoạt động'>
														Hoạt động
													</option>
												) : (
													renderSelect()
												)}
											</Input>
										</FormGroup>
									</Col>
								</Row>
							</div>
						</Form>
					</div>
					<div className='modal-footer'>
						<Button
							color='secondary'
							data-dismiss='modal'
							type='button'
							onClick={handleResetForm}>
							Đóng
						</Button>
						<Button
							color='primary'
							type='button'
							onClick={update ? createClassRoom : updateClassRoom}>
							{update ? 'Lưu' : 'Cập nhật'}
						</Button>
					</div>
				</Modal>
				{/* Modal ClassRoomHistory */}
				<Modal
					backdrop='static'
					className='modal-dialog-centered modal-xl'
					isOpen={showFormClassRoomHistory}
					toggle={() => setShowFormClassRoomHistory((pre) => !pre)}>
					<div className='modal-header'>
						<h3 className='mb-0'>Lịch sử chi tiết</h3>
						<button
							aria-label='Close'
							className='close'
							data-dismiss='modal'
							type='button'
							onClick={handleResetClassRoomHistory}>
							<span aria-hidden={true}>×</span>
						</button>
					</div>
					<div className='modal-body'>
						<MaterialReactTable
							muiTableBodyProps={{
								sx: {
									//stripe the rows, make odd rows a darker color
									'& tr:nth-of-type(odd)': {
										backgroundColor: '#f5f5f5',
									},
								},
							}}
							enableColumnResizing
							enableGrouping
							enableStickyHeader
							enableStickyFooter
							columns={columnClassRoomHistory}
							data={classRoomHistoryByClassRoomId}
							muiTablePaginationProps={{
								rowsPerPageOptions: [10, 20, 50, 100],
								showFirstButton: false,
								showLastButton: false,
							}}
						/>
					</div>
				</Modal>
			</Container>
		</>
	);
};

export default ClasssRoom;
