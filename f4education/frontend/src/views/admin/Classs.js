import {Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, Label, Modal} from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader.js';
import ClasssHeader from 'components/Headers/ClasssHeader';
import {useState, useMemo} from 'react';
import Delete from '@material-ui/icons/Delete';
import Refresh from '@material-ui/icons/Refresh';
import Save from '@material-ui/icons/Save';

import {MaterialReactTable} from 'material-react-table';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Tooltip} from '@mui/material';
const data = [
	{
		className: 'Lập trình Java',
		startDate: '27/11/2023',
		endDate: '27/12/2023',
		maximumQuantity: 40,
	},
	{
		className: 'Lập trình PHP',
		startDate: '27/11/2023',
		endDate: '27/12/2023',
		maximumQuantity: 40,
	},
	{
		className: 'Lập trình Python',
		startDate: '27/11/2023',
		endDate: '27/12/2023',
		maximumQuantity: 40,
	},
	{
		className: 'Lập trình Javascript',
		startDate: '27/11/2023',
		endDate: '27/12/2023',
		maximumQuantity: 40,
	},
];

const Classs = () => {
	const [showForm, setShowForm] = useState(false);
	const [classs, setClasss] = useState({
		className: '',
		startate: '',
		endDate: '',
		maximumQuantity: 0,
	});

	const handelOnChangeInput = (e) => {
		setClasss({[e.target.name]: e.target.value});
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
		],
		[],
	);

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
					data={data}
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
												value={classs.startate}
												name='startate'
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
							type='button'>
							Lưu
						</Button>
					</div>
				</Modal>
			</Container>
		</>
	);
};

export default Classs;
