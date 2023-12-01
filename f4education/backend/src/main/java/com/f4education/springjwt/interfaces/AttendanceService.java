package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.AttendanceDTO;
import com.f4education.springjwt.payload.response.AttendanceStudentReviewResponse;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AttendanceService {
	List<Object[]> getAllByClassId(Integer classId);

	List<AttendanceDTO> getAllAttendance();

	AttendanceDTO getAttendanceByAttendanceId(Integer attendanceId);

	List<AttendanceDTO> getAttendanceByStudentId(String studentId);

	AttendanceDTO createAttendance(AttendanceDTO attendanceDTO);

	AttendanceDTO updateAttendance(Integer attendanceId, AttendanceDTO attendanceDTO);

	void deleteAttendance(Integer attendanceId);

	List<AttendanceStudentReviewResponse> getAttendanceForStudentReview(String studentId, Integer classId);
}
