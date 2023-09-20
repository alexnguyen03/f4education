import {Button, Card, CardBody, CardHeader, FormGroup, Form, Input, Container, Row, Col, Modal} from 'reactstrap';
import ResourceDetailHeader from 'components/Headers/ResourceDetailHeader';
import {useState, useMemo, useEffect} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {Delete as DeleteIcon} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';
import Select from 'react-select';
import {useParams, Link} from 'react-router-dom';

// gọi API từ resourceApi
import resourceApi from 'api/resourceApi';

// gọi API từ courseApi
import courseApi from 'api/courseApi';

// gọi API từ classHistoryApi
import classHistoryApi from 'api/classHistoryApi';

const Resource = () => {
	const user = JSON.parse(localStorage.getItem('user') | '');
	const [allFileByFolderId, setAllFileByFolderId] = useState([]);
	const [showFormClass, setShowFormClass] = useState(false);
	const [update, setUpdate] = useState(true);
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setselectedCourse] = useState({
		value: '0',
		label: '',
	});
	const [options, setOptions] = useState([{value: '0', label: ''}]);
	const [file, setFile] = useState([]);

	// khởi tạo Resource
	const [resource, setResource] = useState({
		resourcesId: '',
		link: '',
		createDate: '',
		course: {
			courseId: 0,
			courseName: '',
		},
		adminName: '',
	});

	const [resourceRequest, setResourceRequest] = useState({
		courseId: '',
		adminId: '',
		resourcesId: 0,
		link: '',
		createDate: '',
	});

	// delete file
	const handleDeleteRow = async (row) => {
		try {
			let fileId = row.original.id;
			const confirmed = window.confirm('Bạn có chắc chắn muốn xóa?');
			if (confirmed) {
				const resp = await resourceApi.deleteFileById(fileId);
				alert('Xóa file thành công !!!');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onChangeFile = (e) => {
		setFile([]);
		if (e.target.files.length > 0) {
			const selectedFiles = Array.from(e.target.files);
			setFile(selectedFiles);
		}
	};

	// xóa trắng form
	const handleResetForm = () => {
		setShowFormClass((pre) => !pre);
		setselectedCourse({});
		setResource({
			resourcesId: '',
			link: '',
			createDate: '',
			course: {
				courseId: 0,
				courseName: '',
			},
			adminName: '',
		});
		setUpdate(true);
	};

	const convertToArray = () => {
		const convertedArray = courses.map((item) => ({
			value: item.courseId,
			label: item.courseName,
		}));
		return convertedArray;
	};

	function handleSelect(data) {
		setselectedCourse(data);
		if (selectedCourse != undefined) {
			setResourceRequest((pre) => ({
				...pre,
				courseId: parseInt(selectedCourse.value),
			}));
		}
	}

	function renderCellWithLink(row) {
		const link = row.link;
		const id = row.resourcesId;
		return (
			<span key={id}>
				<a
					target='_blank'
					rel='noreferrer'
					href={`${link}`}>
					Đường dẫn đi đến file
				</a>
			</span>
		);
	}

	const addResource = async () => {
		const formData = new FormData();
		formData.append('resourceRequest', JSON.stringify(resourceRequest));
		var files = []; // Mảng chứa các đối tượng file
		// Lặp qua mảng file và thêm từng đối tượng file vào formData
		for (var i = 0; i < file.length; i++) {
			formData.append('file', file[i]);
		}
		console.log([...formData]);
		console.log({...resource});
		try {
			const resp = await resourceApi.createResource(formData);
			handleResetForm();
		} catch (error) {
			console.log('Thêm thất bại', error);
		}
	};

	const getAllCourse = async () => {
		try {
			const resp = await courseApi.getAll();
			setCourses(resp.reverse());
		} catch (error) {
			console.log(error);
		}
	};

	// bảng tài nguyên
	const columnClass = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'ID File',
				size: 150,
			},
			{
				accessorKey: 'name',
				header: 'Tên File',
				size: 150,
			},
			{
				accessorFn: (row) => row.link,
				Cell: ({cell}) => renderCellWithLink(cell.row.original),
				header: 'Link',
				size: 120,
			},
			{
				accessorKey: 'size',
				header: 'Size',
				size: 80,
			},
		],
		[],
	);

	// lấy dữ liệu GoogleDriveAllFile theo folderId từ database (gọi api)
	const getAllFileByFolderId = async (folderId) => {
		try {
			const resp = await resourceApi.getAllFileByFolderId(folderId);
			setAllFileByFolderId(resp);
			console.log('resp' + resp);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const convertedOptions = convertToArray();
		setOptions(convertedOptions);
	}, [courses, selectedCourse]);

	useEffect(() => {
		const {resourcesId, link} = {...resource};
		if (selectedCourse.value !== undefined) {
			setResourceRequest({
				resourcesId: resourcesId,
				link: link,
				courseId: parseInt(selectedCourse.value),
				adminId: 'namnguyen',
			});
		}
	}, [resource, selectedCourse]);

	const data = useParams();

	// Use effect
	useEffect(() => {
		getAllFileByFolderId(data.folderId);
		getAllCourse();
	}, []);

	return (
		<>
			<ResourceDetailHeader />
			<Container
				className='mt--7'
				fluid>
				<Card className='bg-secondary shadow'>
					<h2 className='mt-2 ml-4'>
						<Link to={`/admin/resources`}>Tài nguyên</Link> / Tài nguyên chi tiết
					</h2>
					{/* Header */}
					<CardHeader className='bg-white border-0 d-flex justify-content-between'>
						<h3 className='mb-0'>
							Bảng tài nguyên chi tiết của khóa học <b>{data.courseName}</b>{' '}
						</h3>
					</CardHeader>

					{/* bảng tài nguyên chi tiết */}
					<CardBody>
						<MaterialReactTable
							displayColumnDefOptions={{
								'mrt-row-actions': {
									header: 'Xóa',
									size: 80,
								},
							}}
							enableColumnResizing
							enableGrouping
							enableStickyHeader
							enableStickyFooter
							enableRowNumbers
							columns={columnClass}
							data={allFileByFolderId}
							initialState={{columnVisibility: {id: false}}}
							positionActionsColumn='last'
							renderTopToolbarCustomActions={() => (
								<Button
									onClick={() => setShowFormClass((pre) => !pre)}
									color='success'>
									Thêm tài nguyên
								</Button>
							)}
							enableRowActions
							renderRowActions={({row, table}) => (
								<Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
									<IconButton
										color='secondary'
										onClick={() => {
											handleDeleteRow(row);
										}}>
										<DeleteIcon />
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
				</Card>
				{/* Modal Resource */}
				<Modal
					backdrop='static'
					className='modal-dialog-centered'
					isOpen={showFormClass}
					toggle={() => setShowFormClass((pre) => !pre)}>
					<div className='modal-header'>
						<h3 className='mb-0'>Thông tin tài nguyên</h3>
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
									<label className='form-control-label'>Tên khóa học</label>
									<Select
										placeholder='Chọn khóa học'
										options={options}
										value={selectedCourse}
										onChange={handleSelect}
									/>
								</FormGroup>
								<Row>
									{update ? (
										''
									) : (
										<Col md={12}>
											<FormGroup>
												<label className='form-control-label'>Link</label>
												<br />
												<label className='form-control-label'>
													<a href={resource.link}>{resource.link}</a>
												</label>
											</FormGroup>
										</Col>
									)}
									<Col md={12}>
										<FormGroup>
											<label
												className='form-control-label'
												htmlFor='customFile'>
												Chọn File
											</label>
											<br />
											<input
												type='file'
												multiple
												id='customFile'
												className='form-control-alternative'
												onChange={onChangeFile}
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
							onClick={handleResetForm}>
							Đóng
						</Button>
						<Button
							color='primary'
							type='button'
							onClick={update ? addResource : ''}>
							{update ? 'Lưu' : 'Cập nhật'}
						</Button>
					</div>
				</Modal>
			</Container>
		</>
	);
};

export default Resource;
