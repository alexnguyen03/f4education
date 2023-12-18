package com.f4education.springjwt.interfaces;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.payload.request.ScheduleRequest;
import com.f4education.springjwt.payload.request.ScheduleTeacherDTO;
import com.f4education.springjwt.payload.response.AttendanceReviewStudent;
import com.f4education.springjwt.payload.response.ScheduleResponse;

@Service
public interface ScheduleService {
	List<Schedule> saveSchedule(ScheduleRequest scheduleRequest);

	ScheduleResponse findAllScheduleByClassId(Integer classId);
	
	ScheduleResponse findAllScheduleByClassIdAndIsPractice(Integer classId);

	List<ScheduleTeacherDTO> findAllScheduleTeacherByID(Integer id);
	
	ScheduleResponse findAllScheduleByStudentId(String studentId);

	Schedule findScheduleByClassAndStudyDate(Integer classId);
	
	void deleteScheduleExam(Integer scheduleId);

	List<AttendanceReviewStudent> findAllScheduleByAttendance(Integer classId, String studentId);
}
