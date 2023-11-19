package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.AttendanceDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AttendanceService {
	List<AttendanceDTO> getAllAttendance();

	AttendanceDTO getAttendanceByAttendanceId(Integer attendanceId);

	List<AttendanceDTO> getAttendanceByStudentId(String studentId);

	AttendanceDTO createAttendance(AttendanceDTO attendanceDTO, List<String> listStudentId);

	AttendanceDTO updateAttendance(Integer attendanceId, AttendanceDTO attendanceDTO);

	void deleteAttendance(Integer attendanceId);
}
