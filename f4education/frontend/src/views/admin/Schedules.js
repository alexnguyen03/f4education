import SchedulesHeader from 'components/Headers/SchedulesHeader';
import React, {useState} from 'react';
import {Alert, Button, Card, CardBody, CardHeader, Col, Container, Nav, NavItem, NavLink, Row} from 'reactstrap';
import classnames from 'classnames';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import {INITIAL_EVENTS, createEventId} from '../../utils/event-utils';
function Schedules() {
	const [navPills, setNavPills] = useState(1);
	const toggleNavs = (e, state, index) => {
		e.preventDefault();
		setNavPills(index);
	};
	const handleDateSelect = (selectInfo) => {
		let title = prompt('Please enter a new title for your event');
		let calendarApi = selectInfo.view.calendar;

		calendarApi.unselect(); // clear date selection

		if (title) {
			calendarApi.addEvent({
				id: createEventId(),
				title,
				start: selectInfo.startStr,
				end: selectInfo.endStr,
				allDay: selectInfo.allDay,
			});
		}
	};
	return (
		<>
			<SchedulesHeader />
			<Container
				className='mt--7'
				fluid>
				<Row>
					<Col sm={3}>
						<Card className='card-profile shadow'>
							<CardHeader className='text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
								<div className='d-flex justify-content-center border-bottom '>
									<h3>DANH SÁCH LỚP HỌC</h3>
								</div>
							</CardHeader>
							<CardBody className='pt-0 pt-md-4'>
								<Row>
									<div className='col'>
										<div className='card-profile-stats d-flex justify-content-center mt-md-5'>
											<div>
												<span className='heading'>22</span>
												<span className='description'>Friends</span>
											</div>
											<div>
												<span className='heading'>10</span>
												<span className='description'>Photos</span>
											</div>
											<div>
												<span className='heading'>89</span>
												<span className='description'>Comments</span>
											</div>
										</div>
									</div>
								</Row>
								<div className='text-center'>
									<h3>
										Jessica Jones
										<span className='font-weight-light'>, 27</span>
									</h3>
									<div className='h5 font-weight-300'>
										<i className='ni location_pin mr-2' />
										Bucharest, Romania
									</div>
									<div className='h5 mt-4'>
										<i className='ni business_briefcase-24 mr-2' />
										Solution Manager - Creative Tim Officer
									</div>
									<div>
										<i className='ni education_hat mr-2' />
										University of Computer Science
									</div>
									<hr className='my-4' />
									<p>Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music.</p>
									<a
										href='#pablo'
										onClick={(e) => e.preventDefault()}>
										Show more
									</a>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col sm={9}>
						<Card className='card-profile shadow'>
							<CardHeader className='text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
								<div className='d-flex justify-content-between'>
									<div>
										<i class='fa-solid fa-expand'></i>
										{/* <i class="fa-solid fa-compress"></i> */}
									</div>
									{/* <Alert color='transferent'>Thông tin khóa học:</Alert> */}
									<div className='shadow px-3 py-2 rounded-sm'>Tên lớp học: JAVAB001 </div>
									<div className='shadow px-3 py-2 rounded-sm'>Giáo viên giảng dạy: Thầy Trần Văn Thiện </div>
									<div className='shadow px-3 py-2 rounded-sm'>Thời lượng: 120 H </div>
									<div>
										<Button
											className='float-right'
											color='success'
											onClick={(e) => e.preventDefault()}>
											Lưu thay đổi
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardBody className='pt-0 pt-md-4'>
								<Row>
									<Col sm={2}>
										<Nav
											className='nav-fill '
											id='tabs-text'
											pills
											role='tablist'>
											<NavItem className='pr-0'>
												<NavLink
													aria-selected={navPills === 1}
													className={classnames('mb-sm-3 mb-md-3', {
														active: navPills === 1,
													})}
													onClick={(e) => toggleNavs(e, 'navPills', 1)}
													href='#pablo'
													role='tab'>
													UI/UX Design
												</NavLink>
											</NavItem>
											<NavItem className='pr-0'>
												<NavLink
													aria-selected={navPills === 2}
													className={classnames('mb-sm-3 mb-md-3', {
														active: navPills === 2,
													})}
													onClick={(e) => toggleNavs(e, 'navPills', 2)}
													href='#pablo'
													role='tab'>
													Programming
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													aria-selected={navPills === 3}
													className={classnames('mb-sm-3 mb-md-3', {
														active: navPills === 3,
													})}
													onClick={(e) => toggleNavs(e, 'navPills', 3)}
													href='#pablo'
													role='tab'>
													Graphic
												</NavLink>
											</NavItem>
										</Nav>
									</Col>
									<Col sm={10}>
										<FullCalendar
											plugins={[dayGridPlugin]}
											headerToolbar={{
												left: 'prev,next today',
												center: 'title',
												right: 'dayGridMonth,timeGridWeek,timeGridDay',
											}}
											initialView='dayGridMonth'
											editable={true}
											selectable={true}
											selectMirror={true}
											dayMaxEvents={true}
											weekends={true}
											// initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
											// select={this.handleDateSelect}
											// eventContent={renderEventContent} // custom render function
											eventClick={(e) => {
												console.log(e);
											}}
											// eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
											/* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
										/>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Schedules;
