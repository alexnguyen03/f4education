import {Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, Label, Modal} from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader.js';
import ClasssHeader from 'components/Headers/ClasssHeader';
import {useState, useMemo, useEffect} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Tooltip} from '@mui/material';

// Axios
import axios from "axios";

// URL
const ROOT_URL = "http://localhost:8080/api/classs";

const Classs = () => {
	const [classses, setclassses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [classs, setClasss] = useState({
		className: '',
		starDate: '',
		endDate: '',
		maximumQuantity: 0,
	});

	// lấy dữ liệu từ form
	const handelOnChangeInput = (e) => {
		setClasss({
			...classs,
			[e.target.name]: e.target.value
		  });
	};
	
	// lấy dữ liệu từ database (gọi api)
	const getDataClass = async () => {
		const resp = await axios(ROOT_URL);
		console.log(resp.data)
		setclassses(resp.data);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(classs);
		// Gửi dữ liệu đến API
		axios.post(ROOT_URL, classs)
		  .then((response) => {
			// Xử lý response thành công
			console.log(response.data);
			// Reset form
			setClasss({
				className: '',
				startate: '',
				endDate: '',
				maximumQuantity: 0,
			});
		  })
		  .catch((error) => {
			console.error(error);
		  });
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
				accessorKey: 'endDate', //normal accessorKey
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
						"mrt-row-actions": {
						header: "Thao tác",
						size: 50,
						// Something else here
						},
					}}
					enableColumnResizing
					enableGrouping
					enableStickyHeader
					enableStickyFooter
					enableRowNumbers
					columns={columns}
					data={classses}
					positionActionsColumn="last"
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
									setClasss({...row.original});
									console.log(classs);
								}}>
								<EditIcon />
							</IconButton>
							<IconButton
								color='error'
								onClick={() => {
									classses.splice(row.index, 1); //assuming simple data table
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
						<h3 className='mb-0'>Thông tin lớp học</h3>

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
										htmlFor='input-class-name'>
										Tên lớp học
									</label>
									<Input
										className='form-control-alternative'
										// defaultValue='Java cơ bản cho người mới'
										id='input-class-name'
										placeholder='Tên lớp học'
										type='text'
										onChange={handelOnChangeInput}
										name='className'
										value={classs.className}
									/>
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
												value={classs.starDate}
												name='starDate'
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
												max={50}
												value={classs.maximumQuantity}
												name='maximumQuantity'
												onChange={handelOnChangeInput}
											/>
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
							onClick={() => setShowForm((pre) => !pre)}>
							Đóng
						</Button>
						<Button
							color='primary'
							type='button'
							onClick={handleSubmit}>
							Lưu
						</Button>
					</div>
				</Modal>
			</Container>
		</>
	);
};

export default Classs;
