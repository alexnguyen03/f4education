import {Button, FormGroup, Form, Input, Container, Row, Col, Modal} from 'reactstrap';
import ClasssHeader from 'components/Headers/ClasssHeader';
import {useState, useMemo, useEffect} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';

// gọi API từ classApi
import classApi from 'api/classApi';

const Classs = () => {
	const [classses, setClassses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [update, setUpdate] = useState(true);
	const [errors, setErrors] = useState({});
	const [statusList, setStatusList] = useState([
		{key: 'W', value: 'Đang chờ'},
		{key: 'R', value: 'Đang diễn ra'},
		{key: 'C', value: 'Kết thúc'},
	]);
	const [classs, setClasss] = useState({
		classId: '',
		className: '',
		startDate: '',
		endDate: '',
		maximumQuantity: 0,
		status: 'Đang chờ',
	});

	const formatStartDate = (startDate) => {
		// Chuyển đổi định dạng ngày tháng từ 'yyyy-MM-dd' thành 'dd/MM/yyyy'
		const parts = startDate.split('T')[0].split('-');
		const year = parts[0];
		const month = parts[1];
		const day = parts[2];
		const formattedStartDate = `${day}/${month}/${year}`;
		return formattedStartDate;
	};

	// lấy dữ liệu từ form
	const handelOnChangeInput = (e) => {
		setClasss({
			...classs,
			[e.target.name]: e.target.value,
		});	

		// bắt lỗi form
		const validationErrors = {};
		if(!classs.className.trim()){
			validationErrors.className = 'Vui lòng nhập tên lớp !!!';
		}
		setErrors(validationErrors);
	};

	// xóa trắng form
	const handleResetForm = () => {
		setShowForm((pre) => !pre);
		setClasss({
			classId: '',
			className: '',
			startDate: '',
			endDate: '',
			maximumQuantity: 0,
			status: 'Đang chờ',
		});
		setUpdate(true);
	};

	// lấy tấc cả dữ liệu từ database (gọi api)
	const getDataClass = async () => {
		try {
			const resp = await classApi.getAllClass();
			setClassses(resp);
		} catch (error) {
			console.log(error);
		}
	};

	// thêm class
	const createClass = async () => {
		try {
			const resp = await classApi.createClass(classs);
			alert('Thêm thành công');
			handleResetForm();
		} catch (error) {
			console.log('Thêm thất bại', error);
		}	
	};

	// cập nhật class
	const updateClass = async () => {
		try {
			const body = classs;
			const resp = await classApi.updateClass(body, classs.classId);
			alert('Cập nhật thành công');
			handleResetForm();
		} catch (error) {
			console.log('Cập nhật thất bại', error);
		}	
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'className',
				header: 'Tên lớp học',
				size: 100,
			},
			{
				accessorKey: 'startDate',
				header: 'Ngày bắt đầu',
				size: 90,
			  },
			{
				accessorKey: 'endDate',
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

	// Use effect
	useEffect(() => {
		getDataClass();
	}, []);

	return (
		<>
			<ClasssHeader />
			<Container
				className='mt--7'
				fluid>
				<MaterialReactTable
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
					enableRowNumbers
					columns={columns}
					data={classses}
					positionActionsColumn='last'
					renderTopToolbarCustomActions={() => (
						<Button
							onClick={() => setShowForm((pre) => !pre)}
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
									setShowForm(true);
									setUpdate(false);
									setClasss({...row.original});
								}}>
								<EditIcon />
							</IconButton>
						</Box>
					)}
				/>

				<Modal
					backdrop='static'
					className='modal-dialog-centered'
					isOpen={showForm}
					toggle={() => setShowForm((pre) => !pre)}>
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
									{errors.className && <span>{errors.className}</span>}
								</FormGroup>
								<Row>
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
								</Row>
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
												onChange={handelOnChangeInput}
												defaultValue={statusList[0].value}
												value={classs.status}>
												{statusList.map((item) => (
													<option
														key={item.key}
														value={item.value}>
														{item.value}
													</option>
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
			</Container>
		</>
	);
};

export default Classs;
