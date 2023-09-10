import {FormGroup, IconButton} from '@mui/material';
import {Edit as EditIcon, EscalatorWarningOutlined, RemoveCircleOutline as RemoveCircleOutlineIcon, Search} from '@mui/icons-material';

import SubjectHeader from 'components/Headers/SubjectHeader';
import {MaterialReactTable} from 'material-react-table';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';

// reactstrap components
import {Button, Card, CardBody, CardHeader, Container, Form, Input, Modal} from 'reactstrap';

import sessionsApi from 'api/sessionsApi';
import SessionsHeader from 'components/Headers/SessionsHeader';
import {useRef} from 'react';
import {TimeInput} from '@mantine/dates';
import {ActionIcon} from '@mantine/core';
import {IconClock} from '@tabler/icons-react';

const Sessions = () => {
	// Main variable
	const [sessions, setSessions] = useState([]);
	const user = JSON.parse(localStorage.getItem('user') ?? '');

	const [session, setSession] = useState({
		admin: {
			adminId: '',
			fullname: '',
			gender: true,
			dateOfBirth: '',
			citizenIdentification: '',
		},
		endTime: '',
		sessionId: null,
		sessionName: '',
		startTime: '',
	});
	const [sessionRequest, setSessionRequest] = useState({
		adminId: '',
		endTime: '',
		sessionId: -1,
		sessionName: '',
		startTime: '',
	});

	const startRef = useRef();
	const endRef = useRef();
	// Action variable
	const [showModal, setShowModal] = useState(false);
	const [update, setUpdate] = useState(false);
	const [showSessionsHistory, setShowSessionsHistory] = useState(false);

	// Form action area
	const handleChangeInput = (e) => {
		setSession((preSession) => ({
			...preSession,
			[e.target.name]: e.target.value,
		}));
	};

	const fetchSessions = async () => {
		try {
			const resp = await sessionsApi.getAllSessions();
			setSessions(resp);
			console.log(sessions);
		} catch (error) {
			console.log(error);
		}
	};

	const columnSessions = useMemo(
		() => [
			{
				accessorKey: 'sessionName',
				header: 'Tên ca học',
				size: 80,
			},
			{
				// accessorFn: (row) => moment(row.startTime).format('h:mm:ss a'),
				accessorKey: 'startTime',
				size: 80,
				header: 'Giờ bắt đầu',
			},
			{
				// accessorFn: (row) => moment(row.endTime).format('h:mm:ss a'),
				accessorKey: 'endTime',
				size: 80,
				header: 'Giờ kết thúc',
			},
			{
				accessorKey: 'admin.fullname',
				size: 80,
				header: 'Tên người tạo',
			},
		],
		[],
	);

	const columnSessionsHistory = useMemo(
		() => [
			{
				accessorKey: 'subjectHistoryId',
				header: '#',
				size: 40,
			},
			{
				accessorKey: 'action',
				// accessorFn: (row) => row.action,
				header: 'Hành động',
				size: 40,
			},
			{
				accessorKey: 'subjectName',
				header: 'Tên ca Học',
				size: 120,
			},
			{
				accessorFn: (row) => moment(row.modifyDate).format('dd-MM-yyyy, h:mm:ss a'),
				header: 'Ngày chỉnh sửa',
				size: 120,
			},
			{
				accessorKey: 'adminId',
				header: 'Mã người tạo',
				size: 80,
			},
		],
		[],
	);

	const handleEditForm = (row) => {
		const selectedSession = row.original;
		setSession(selectedSession);

		setUpdate(true);
		setShowModal(true);
	};

	const handleInputTimeOnChange = (e) => {
		setSession((preSession) => ({
			...preSession,
			startTime: startRef.current.value,
			endTime: endRef.current.value,
		}));

		console.log('🚀 ~ file: Sessions.js:145 ~ setSession ~ Session:', session);
	};
	const handleSubmitForm = (e) => {
		e.preventDefault();

		if (update) {
			upateSessions();
		} else {
			addSessions();
		}
	};

	const handleShowAddForm = () => {
		setShowModal(true);
		setUpdate(false);
	};

	const handleResetForm = () => {
		setShowModal(false);
		setSession({
			admin: {
				adminId: '',
				fullname: '',
				gender: true,
				dateOfBirth: '',
				citizenIdentification: '',
			},
			endTime: '',
			sessionId: null,
			sessionName: '',
			startTime: '',
		});
	};

	const addSessions = async () => {
		try {
			const resp = await sessionsApi.createSessions(sessionRequest);
			fetchSessions();
		} catch (error) {
			console.log('failed to fetch data', error);
		}
	};
	const upateSessions = async () => {
		try {
			const resp = await sessionsApi.updateSessions(sessionRequest);
			fetchSessions();
		} catch (error) {
			console.log('failed to fetch data', error);
		}
	};
	useEffect(() => {
		fetchSessions();
	}, []);
	useEffect(() => {
		const {endTime, sessionId, sessionName, startTime} = {...session};
		setSessionRequest({
			adminId: user.username,
			endTime: endTime,
			sessionId: sessionId,
			sessionName: sessionName,
			startTime: startTime,
		});
	}, [session]);

	return (
		<>
			<SessionsHeader />

			<Container
				className='mt--7'
				fluid>
				<Card className='bg-secondary shadow'>
					{/* Header */}
					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
						<h3 className='mb-0'>{showSessionsHistory ? 'BẢNG LỊCH SỬ CA HỌC' : 'BẢNG CA HỌC'}</h3>
						<Button
							color='default'
							type='button'
							onClick={() => {}}>
							{showSessionsHistory ? 'Danh sách ca học' : 'Lịch sử ca học'}
						</Button>
					</CardHeader>
					<CardBody>
						{/* Table view */}
						<MaterialReactTable
							displayColumnDefOptions={
								!showSessionsHistory && {
									'mrt-row-actions': {
										header: 'Thao tác',
										size: 20,
									},
								}
							}
							columns={columnSessions}
							data={sessions}
							initialState={{columnVisibility: {subjectId: false}}}
							positionActionsColumn='last'
							// editingMode="modal" //default
							enableColumnOrdering
							// enableRowOrdering
							enableEditing
							enableStickyHeader
							enableColumnResizing
							muiTablePaginationProps={{
								rowsPerPageOptions: [10, 20, 50, 100],
								showFirstButton: false,
								showLastButton: false,
							}}
							renderRowActions={({row}) => (
								<IconButton
									color='secondary'
									onClick={() => {
										handleEditForm(row);
									}}>
									<EditIcon />
								</IconButton>
							)}
							// Top Add new Subject button
							renderTopToolbarCustomActions={() => (
								<Button
									color='success'
									onClick={handleShowAddForm}
									variant='contained'
									id='addSessions'
									disabled={showSessionsHistory}>
									<i className='bx bx-layer-plus'></i> Thêm ca học
								</Button>
							)}
						/>
					</CardBody>
				</Card>

				{/* Toast */}
				{/* <ToastContainer /> */}

				{/* Modal Add - Update Suject*/}
				<Modal
					className='modal-dialog-centered'
					isOpen={showModal}
					toggle={showModal}
					backdrop={'static'}>
					<Form onSubmit={handleSubmitForm}>
						<div className='modal-header'>
							<h3
								className='modal-title'
								id='modal-title-default'>
								{update ? 'Cập nhật ca học' : 'Thêm ca học mới'}
							</h3>
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
							{update && (
								<FormGroup className='mb-3'>
									<label
										className='form-control-label'
										htmlFor='adminId'>
										Người tạo
									</label>
									<Input
										className='form-control-alternative'
										id='adminId'
										readOnly={true}
										// onChange={handleChangeInput}
										defaultValue={user.fullname}
										name='session.account.adminId'
										value={session.admin.fullname}
									/>
								</FormGroup>
							)}
							<FormGroup className='mb-3'>
								<label
									className='form-control-label'
									htmlFor='name'>
									Tên ca học
								</label>
								<Input
									className={''}
									id='name'
									required={true}
									onChange={handleChangeInput}
									name='sessionName'
									value={session.sessionName}
								/>
								{/* <span className='text-danger'>{errorInputUpdateSubject.message}</span> */}
							</FormGroup>

							<TimeInput
								withSeconds
								label='Giờ bắt đầu'
								required={true}
								ref={startRef}
								onChange={handleInputTimeOnChange}
								value={session.startTime}
								radius='md'
								rightSection={
									<ActionIcon onClick={() => startRef.current.showPicker()}>
										<IconClock
											size='1rem'
											stroke={1.5}
										/>
									</ActionIcon>
								}
								// maw={400}
								mx='auto'
								className='mb-3'
							/>
							<TimeInput
								withSeconds
								label='Giờ kết thúc'
								ref={endRef}
								radius='md'
								required={true}
								variant='default'
								name='endTime'
								onChange={handleInputTimeOnChange}
								value={session.endTime}
								rightSection={
									<ActionIcon onClick={() => endRef.current.showPicker()}>
										<IconClock
											size='1rem'
											stroke={1.5}
										/>
									</ActionIcon>
								}
								// maw={400}
								mx='auto'
							/>
						</div>
						<div className='modal-footer'>
							<Button
								color='default'
								outline
								data-dismiss='modal'
								type='button'
								onClick={handleResetForm}>
								Hủy
							</Button>
							<Button
								color='primary'
								type='submit'>
								{update ? 'Cập nhật' : 'Thêm ca học'}
							</Button>
						</div>
					</Form>
				</Modal>
			</Container>
			{/* Page content end */}
		</>
	);
};

export default Sessions;
