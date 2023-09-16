import {Button, Card, CardBody, CardHeader, FormGroup, Form, Input, Container, Row, Col, Modal} from 'reactstrap';
import ClasssHeader from 'components/Headers/ClasssHeader';
import {useState, useMemo, useEffect} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';
import moment from 'moment';
import {notifications} from '@mantine/notifications';

// gọi API từ classApi
import classApi from 'api/classApi';

// gọi API từ classHistoryApi
import classHistoryApi from 'api/classHistoryApi';

const Classs = () => {
	const [classses, setClassses] = useState([]);
	const [classHistories, setClassHistories] = useState([]);
	const [classHistoryByClassId, setClassHistotyByClassId] = useState([]);
	const [showFormClass, setShowFormClass] = useState(false);
	const [showFormClassHistory, setShowFormClassHistory] = useState(false);
	const [update, setUpdate] = useState(true);
	const [isClassHistoryShowing, setIsClassHistoryShowing] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [errors, setErrors] = useState({});

	// khởi tạo Class
	const [classs, setClasss] = useState({
		classId: '',
		className: '',
		startDate: '',
		endDate: '',
		maximumQuantity: 0,
		status: 'Đang chờ',
	});

	// bắt lỗi form
	const validateForm = () => {
		let validationErrors = {};
		if (!classs.className) {
			validationErrors.className = 'Vui lòng nhập tên lớp học !!!';
		}
		if (classs.maximumQuantity <= 0) {
			validationErrors.maximumQuantity = 'Số lượng tối đa phải lớn hơn 0 !!!';
		}
		if (classs.maximumQuantity >= 50) {
			validationErrors.maximumQuantity = 'Số lượng tối đa không được lớn hơn 50 !!!';
		}
		return validationErrors;
	};

	// thay đổi giá trị của biến
	const handleChangeClassListAndHistory = () => {
		setIsClassHistoryShowing(!isClassHistoryShowing);
	};

	// xử lý status
	const renderSelect = (status) => {
		switch (status) {
			case 'Đang chờ':
				return (
					<>
						<option
							data-value='Đang chờ'
							value='Đang chờ'>
							Đang chờ
						</option>
						<option
							data-value='Đang diễn ra'
							value='Đang diễn ra'>
							Đang diễn ra
						</option>
					</>
				);
				break;
			case 'Đang diễn ra':
				return (
					<>
						<option
							data-value='Đang diễn ra'
							value='Đang diễn ra'>
							Đang diễn ra
						</option>
						<option
							data-value='Kết thúc'
							value='Kết thúc'>
							Kết thúc
						</option>
					</>
				);
				break;
			case 'Kết thúc':
				return (
					<>
						<option
							data-value='Đang diễn ra'
							value='Đang diễn ra'>
							Đang diễn ra
						</option>
						<option
							data-value='Kết thúc'
							value='Kết thúc'>
							Kết thúc
						</option>
					</>
				);
				break;
			default:
				break;
		}
	};

	// lấy dữ liệu của select status
	const handleOnChangeSelect = (e) => {
		const selectedIndex = e.target.options.selectedIndex;
		const status = e.target.options[selectedIndex].getAttribute('data-value');
		// setSelectedStatus(status);
		setClasss({
			...classs,
			status: status,
		});
		console.log(status);
	};

	// edit row class
	const handleEditRow = (row) => {
		setShowFormClass(true);
		setUpdate(false);
		setSelectedStatus(row.original.status);
		console.log(selectedStatus);
		setClasss({...row.original});
	};

	// show modal classhistory
	const handleShowClassHistory = (row) => {
		setShowFormClassHistory(true);
		getDataClassHistoryByClassId(row.original.classId);
	};

	// lấy dữ liệu từ form
	const handelOnChangeInput = (e) => {
		setClasss({
			...classs,
			[e.target.name]: e.target.value,
		});
	};

	// xóa trắng form
	const handleResetForm = () => {
		setShowFormClass((pre) => !pre);
		setClasss({
			className: '',
			maximumQuantity: 0,
			status: 'Đang chờ',
		});
		setUpdate(true);
		setErrors({});
	};

	// resetModal ClassHistory
	const handleResetClassHistory = () => {
		setShowFormClassHistory((pre) => !pre);
	};

	// lấy tấc cả dữ liệu Class từ database (gọi api)
	const getDataClass = async () => {
		try {
			const resp = await classApi.getAllClass();
			setClassses(resp);
		} catch (error) {
			console.log(error);
		}
	};

	// thêm class
	const createClass = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length === 0) {
			try {
				const resp = await classApi.createClass(classs);
				alert('Thêm thành công');
				handleResetForm();
			} catch (error) {
				console.log('Thêm thất bại', error);
			}
		} else {
			setErrors(validationErrors);
		}
	};

	// cập nhật class
	const updateClass = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length === 0) {
			try {
				console.log(classs);
				const body = classs;
				if (body.status === 'Đang chờ' || body.status === 'Đang diễn ra') {
					body.endDate = null;
				} else {
					body.endDate = new Date();
				}
				const resp = await classApi.updateClass(body, classs.classId);
				alert('Cập nhật thành công');
				handleResetForm();
			} catch (error) {
				console.log('Cập nhật thất bại', error);
			}
		} else {
			setErrors(validationErrors);
		}
	};

	// bảng lớp học
	const columnClass = useMemo(
		() => [
			{
				accessorKey: 'classId',
				header: 'Mã lớp học',
				size: 100,
			},
			{
				accessorKey: 'className',
				header: 'Tên lớp học',
				size: 100,
			},
			{
				accessorKey: 'startDate',
				accessorFn: (row) => moment(row.startDate).format('DD/MM/yyyy, h:mm:ss a'),
				header: 'Ngày bắt đầu',
				size: 90,
			},
			{
				accessorKey: 'endDate',
				accessorFn: (row) => row,
				Cell: ({cell}) => {
					const row = cell.getValue();
					if (row.endDate !== null) {
						return <span>{moment(row.endDate).format('DD/MM/yyyy, h:mm:ss a')}</span>;
					} else {
						return <span>Chưa kết thúc</span>;
					}
				},
				header: 'Ngày kết thúc',
				size: 90,
			},
			{
				accessorKey: 'maximumQuantity',
				header: 'Số lượng tối đa',
				size: 95,
			},
			{
				accessorKey: 'admin.fullname',
				header: 'Người tạo',
				size: 95,
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

	// bảng lịch sử lớp học
	const columnClassHistory = useMemo(
		() => [
			{
				accessorKey: 'classId',
				header: 'Mã lớp học',
				size: 90,
			},
			{
				accessorKey: 'className',
				header: 'Tên lớp học',
				size: 100,
			},
			{
				accessorKey: 'startDate',
				accessorFn: (row) => moment(row.startDate).format('DD/MM/yyyy, h:mm:ss a'),
				header: 'Ngày bắt đầu',
				size: 105,
			},
			{
				accessorKey: 'endDate',
				accessorFn: (row) => row,
				Cell: ({cell}) => {
					const row = cell.getValue();
					if (row.endDate !== null) {
						return <span>{moment(row.endDate).format('DD/MM/yyyy, h:mm:ss a')}</span>;
					} else {
						return <span>Chưa kết thúc</span>;
					}
				},
				header: 'Ngày kết thúc',
				size: 105,
			},
			{
				accessorKey: 'maximumQuantity',
				header: 'Số lượng tối đa',
				size: 95,
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

	// lấy tấc cả dữ liệu ClassHistory từ database (gọi api)
	const getDataClassHistory = async () => {
		try {
			const resp = await classHistoryApi.getAllClassHistory();
			setClassHistories(resp);
		} catch (error) {
			console.log(error);
		}
	};

	// lấy dữ liệu ClassHistory theo ClassId từ database (gọi api)
	const getDataClassHistoryByClassId = async (classId) => {
		try {
			const resp = await classHistoryApi.getClassHistoryByClassId(classId);
			setClassHistotyByClassId(resp);
			console.log('🚀 ~ file: Classs.js:351 ~ getDataClassHistoryByClassId ~ resp:', resp);
		} catch (error) {
			console.log(error);
		}
	};

	// khi thay đổi selectedStatus thì sẽ tự động cập nhật lại
	useEffect(() => {
		setClasss({
			...classs,
			status: selectedStatus,
		});
	}, [selectedStatus]);

	// Use effect
	useEffect(() => {
		getDataClass();
		getDataClassHistory();
		getDataClassHistoryByClassId();
	}, []);

	return (
		<>
			<ClasssHeader />
			<Container
				className='mt--7'
				fluid>
				<Card className='bg-secondary shadow'>
					{/* Header */}
					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
						<h3 className='mb-0'>{isClassHistoryShowing ? 'Bảng lịch sử lớp học' : 'Bảng lớp học'}</h3>
						<Button
							color='default'
							type='button'
							onClick={() => handleChangeClassListAndHistory()}>
							{isClassHistoryShowing ? 'Danh sách lớp học' : 'Lịch sử lớp học'}
						</Button>
					</CardHeader>

					{/* bảng lớp học */}
					{isClassHistoryShowing ? null : (
						<CardBody>
							<MaterialReactTable
								displayColumnDefOptions={{
									'mrt-row-actions': {
										header: 'Thao tác',
										size: 100,
									},
								}}
								enableColumnResizing
								enableGrouping
								enableStickyHeader
								enableStickyFooter
								columns={columnClass}
								data={classses}
								positionActionsColumn='last'
								renderTopToolbarCustomActions={() => (
									<Button
										onClick={() => setShowFormClass((pre) => !pre)}
										color='success'>
										Thêm lớp học
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
												handleShowClassHistory(row);
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
								muiTableBodyProps={{
									sx: {
										//stripe the rows, make odd rows a darker color
										'& tr:nth-of-type(odd)': {
											backgroundColor: '#f5f5f5',
										},
									},
								}}
							/>
						</CardBody>
					)}

					{/* bảng lịch sử lớp học  */}
					{isClassHistoryShowing ? (
						<CardBody>
							<MaterialReactTable
								enableColumnResizing
								enableGrouping
								enableStickyHeader
								enableStickyFooter
								columns={columnClassHistory}
								data={classHistories}
								muiTablePaginationProps={{
									rowsPerPageOptions: [10, 20, 50, 100],
									showFirstButton: false,
									showLastButton: false,
								}}
								muiTableBodyProps={{
									sx: {
										//stripe the rows, make odd rows a darker color
										'& tr:nth-of-type(odd)': {
											backgroundColor: '#f5f5f5',
										},
									},
								}}
							/>
						</CardBody>
					) : null}
				</Card>
				{/* Modal Class */}
				<Modal
					backdrop='static'
					className='modal-dialog-centered'
					isOpen={showFormClass}
					toggle={() => setShowFormClass((pre) => !pre)}>
					<div className='modal-header'>
						<h3 className='mb-0'>Thông tin lớp học</h3>
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
										htmlFor='input-class-name'>
										Tên lớp học
									</label>
									<Input
										className='form-control-alternative'
										id='input-class-name'
										placeholder='Tên lớp học'
										type='text'
										onChange={handelOnChangeInput}
										name='className'
										value={classs.className}
									/>
									{errors.className && <div className='text-danger mt-2'>{errors.className}</div>}
								</FormGroup>
								{/* <Row>
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-start-date'>
												Ngày bắt đầu
											</label>
											<Input
												className='form-control-alternative'
												id='input-start-date'
												type='date'
												value={classs.startDate}
												name='startDate'
												onChange={handelOnChangeInput}
											/>
										</FormGroup>
									</Col>
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-end-date'>
												Ngày kết thúc
											</label>
											<Input
												className='form-control-alternative'
												id='input-end-date'
												type='date'
												value={classs.endDate}
												name='endDate'
												onChange={handelOnChangeInput}
											/>
										</FormGroup>
									</Col>
								</Row> */}
								<Row>
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-maximumQuantity'>
												Số lượng tối đa
											</label>
											<Input
												className='form-control-alternative'
												id='input-maximumQuantity'
												type='number'
												min={0}
												step={1}
												max={50}
												value={classs.maximumQuantity}
												name='maximumQuantity'
												onChange={handelOnChangeInput}
											/>
											{errors.maximumQuantity && <div className='text-danger mt-2'>{errors.maximumQuantity}</div>}
										</FormGroup>
									</Col>
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='input-username'>
												Trạng thái
											</label>
											<Input
												id='exampleSelect'
												name='status'
												type='select'
												onChange={handleOnChangeSelect}
												readOnly={update ? 'readOnly' : undefined}
												value={classs.status}>
												{(classs.status === 'Đang chờ' || classs.status === 'Đang diễn ra' || classs.status === 'Kết thúc') &&
													(update ? (
														<option
															data-value='Đang chờ'
															value='Đang chờ'>
															Đang chờ
														</option>
													) : (
														renderSelect(selectedStatus)
													))}
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
							onClick={update ? createClass : updateClass}>
							{update ? 'Lưu' : 'Cập nhật'}
						</Button>
					</div>
				</Modal>
				{/* Modal ClassHistory */}
				<Modal
					backdrop='static'
					className='modal-dialog-centered modal-xl'
					isOpen={showFormClassHistory}
					toggle={() => setShowFormClassHistory((pre) => !pre)}>
					<div className='modal-header'>
						<h3 className='mb-0'>Lịch sử chi tiết</h3>
						<button
							aria-label='Close'
							className='close'
							data-dismiss='modal'
							type='button'
							onClick={handleResetClassHistory}>
							<span aria-hidden={true}>×</span>
						</button>
					</div>
					<div className='modal-body'>
						<MaterialReactTable
							enableColumnResizing
							enableGrouping
							enableStickyHeader
							enableStickyFooter
							columns={columnClassHistory}
							data={classHistoryByClassId}
							muiTablePaginationProps={{
								rowsPerPageOptions: [10, 20, 50, 100],
								showFirstButton: false,
								showLastButton: false,
							}}
							muiTableBodyProps={{
								sx: {
									//stripe the rows, make odd rows a darker color
									'& tr:nth-of-type(odd)': {
										backgroundColor: '#f5f5f5',
									},
								},
							}}
						/>
					</div>
				</Modal>
			</Container>
		</>
	);
};

export default Classs;
