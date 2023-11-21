package com.f4education.springjwt.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.AttendanceService;
import com.f4education.springjwt.models.Attendance;
import com.f4education.springjwt.payload.request.AttendanceDTO;
import com.f4education.springjwt.repository.AttendanceReposotory;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	@Autowired
	AttendanceService attendanceService;

	@Autowired
	AttendanceReposotory attendanceReposotory;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAll() {
		List<AttendanceDTO> attendances = attendanceService.getAllAttendance();
		return ResponseEntity.ok(attendances);
	}

	@GetMapping("/{attendanceId}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAllByAttendanceId(@PathVariable Integer attendanceId) {
		AttendanceDTO attendances = attendanceService.getAttendanceByAttendanceId(attendanceId);
		return ResponseEntity.ok(attendances);
	}

	@GetMapping("/student/{studentId}")
	public ResponseEntity<?> findAllBystudentId(@PathVariable String studentId) {
		List<AttendanceDTO> attendances = attendanceService.getAttendanceByStudentId(studentId);
		return ResponseEntity.ok(attendances);
	}
 
	@PostMapping
	public ResponseEntity<?> createAttendance(@RequestBody List<AttendanceDTO> attendanceDTOList) {
		List<AttendanceDTO> createdAttendance = new ArrayList<>();
		
		for (AttendanceDTO attendenceDTO : attendanceDTOList) {
			createdAttendance.add(attendanceService.createAttendance(attendenceDTO));
		}


		return ResponseEntity.ok(createdAttendance);
	}

	@PutMapping("/{attendanceId}")
	public ResponseEntity<?> updateAttendance(@PathVariable Integer attendanceId,
			@RequestBody AttendanceDTO attendanceDTO) {
		AttendanceDTO attendance = attendanceService.updateAttendance(attendanceId, attendanceDTO);
		return ResponseEntity.ok(attendance);
	}

	@DeleteMapping("/{attendanceId}")
	public ResponseEntity<?> deleteAttendance(@PathVariable Integer attendanceId) {

		Optional<Attendance> attendance = attendanceReposotory.findById(attendanceId);

		if (attendance.isPresent()) {
			attendanceService.deleteAttendance(attendanceId);
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.badRequest().body("Không tìm thấy attendance với ID đã cho");
	}
}
