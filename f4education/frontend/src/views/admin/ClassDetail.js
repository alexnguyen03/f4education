import ClasssHeader from 'components/Headers/ClasssHeader';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {Badge, Button, Card, CardBody, CardHeader, Col, Container, Label, Row} from 'reactstrap';
import Select from 'react-select';

import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import {Avatar, Group, Text, TransferList} from '@mantine/core';

import courseApi from '../../api/courseApi';
const ClassDetail = () => {
	const [selectedInClass, setSelectedInClass] = useState([]);

	const [listCourse, setListCourse] = useState([]);
	const [studentInCourse, setStudentInCourse] = useState([]);
	const [studentInClass, setStudentInClass] = useState([
		{value: 'sv', label: 'Svelte'},
		{value: 'rw', label: 'Redwood'},
		{value: 'np', label: 'NumPy'},
	]);
	const [data, setData] = useState([studentInCourse, studentInClass]);

	// ! HANDLE FUNCTIONS
	const handleSave = () => {};

	const handleOnChangeTransferList = (dataInList) => {
		setData(dataInList);
		const stInClass = dataInList[1];

		setStudentInCourse(stInClass);

		console.log('🚀 ~ file: ClassDetail.js:61 ~ handleOnChangeTransferList ~ studentInCourse:', stInClass);
		setStudentInClass([data[1]]);
	};

	//! CALL APIS
	const getRegisterCourse = async () => {
		try {
			const resp = await courseApi.getRegisterCourse();
			setListCourse(
				resp.data.map((item) => {
					const {registerCourseId, courseName, image} = {...item};
					return {value: registerCourseId, label: courseName + ' || id: ' + registerCourseId, image: image};
				}),
			);
			// console.log('🚀 ~ file: ClassDetail.js:71 ~ getRegisterCourse ~ resp:', resp);
		} catch (error) {
			console.log('🚀 ~ file: ClassDetail.js:74 ~ getRegisterCourse ~ error:', error);
		}
	};
	useEffect(() => {
		getRegisterCourse();
	}, []);

	return (
		<>
			<ClasssHeader />
			<Container
				className='mt--7'
				fluid>
				<Card>
					<CardHeader>
						<Row>
							<Col md={4}>
								<Label>Chọn khóa học</Label>
								<Select
									options={listCourse}
									placeholder='Chọn môn học'
									value={{}}
									onChange={() => {}}
									isSearchable={true}
									className='form-control-alternative '
									styles={{outline: 'none'}}
								/>
							</Col>
							<Col md={4}>
								<Label>Chọn giáo viên phụ trách</Label>
								<Select
									options={listCourse}
									placeholder='Chọn môn học'
									value={{}}
									onChange={() => {}}
									isSearchable={true}
									className='form-control-alternative '
									styles={{outline: 'none'}}
								/>
							</Col>
							<Col
								md={4}
								className='mt-4 pt-1'>
								<Button
									className='btn-icon btn-3'
									color='primary'
									type='button'
									onClick={handleSave}>
									<i className='fa-solid fa-floppy-disk'></i>
									<span className='btn-inner--text'>Lưu thay đổi</span>
								</Button>
							</Col>
						</Row>
					</CardHeader>
					<CardBody>
						<Row className='d-flex justify-content-end border-bottom pb-2'>
							<Row className='flex-grow-1 px-3'>
								<Col
									md={3}
									className=''>
									<div className='shadow text-center   py-4 rounded px-4'>
										<span>Học viên tối đa:</span>
										<div>
											<Badge
												className='font-weight-bold'
												color='success'>
												40
											</Badge>
										</div>
									</div>
								</Col>

								<Col
									md={3}
									className=''>
									<div className='shadow text-center   py-4 rounded px-4'>
										<span>Số lượng còn lại:</span>
										<div>
											<Badge
												className='font-weight-bold'
												color='info'>
												40
											</Badge>
										</div>
									</div>
								</Col>

								<Col
									md={3}
									className=''>
									<div className='shadow text-center   py-4 rounded px-4'>
										<span>Trạng thái :</span>
										<div>
											<Badge
												className='font-weight-bold'
												color='warning'>
												Running
											</Badge>
										</div>
									</div>
								</Col>

								<Col
									md={3}
									className=''>
									<div className='shadow text-center   py-4 rounded px-4'>
										<div>Giảng viên phụ trách: </div>
										<div>
											<Badge
												className='font-weight-bold'
												color='info'>
												Trần Văn Thiện
											</Badge>
										</div>
									</div>
								</Col>
							</Row>
						</Row>

						<TransferList
							className='mt-2'
							value={data}
							itemComponent={React.memo(({data, selected}) => (
								<Group noWrap>
									<Avatar
										src={data.image}
										radius='xl'
										size='lg'
									/>
									<div style={{flex: 1}}>
										<Text
											size='sm'
											weight={500}>
											{data.label}
										</Text>
										<Text
											size='xs'
											color='dimmed'
											weight={400}>
											{data.description}
										</Text>
									</div>
									<Checkbox
										checked={selected}
										onChange={() => {}}
										tabIndex={-1}
										sx={{pointerEvents: 'none'}}
									/>
								</Group>
							))}
							onChange={handleOnChangeTransferList}
							searchPlaceholder={['Tìm kiếm học viên để thêm vào lớp', 'Tìm kiếm học viên trong lớp']}
							nothingFound={'Danh sách học viên trống'}
							titles={[`Học viên đã đăng ký: ${data[0].length}`, `Học viên trong lớp: ${data[1].length}`]}
							showTransferAll={false}
							placeholder={['Không còn học viên nào đã đăng ký', 'Không còn học viên nào trong lớp']}
							transferAllMatchingFilter={true}
							listHeight={450}
						/>
					</CardBody>
				</Card>
			</Container>
		</>
	);
};

export default ClassDetail;
