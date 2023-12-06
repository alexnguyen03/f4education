package com.f4education.springjwt.controllers;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.payload.request.ScheduleRequest;
import com.f4education.springjwt.payload.request.ScheduleTeacherDTO;
import com.f4education.springjwt.payload.response.AttendanceReviewStudent;
import com.f4education.springjwt.payload.response.ScheduleResponse;
import com.f4education.springjwt.security.services.ScheduleServiceImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
	@Autowired
	ScheduleServiceImpl scheduleService;

	@PostMapping("")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveSchedule(@RequestBody ScheduleRequest scheduleRequest) {

		List<Schedule> list = scheduleService.saveSchedule(scheduleRequest);

		return ResponseEntity.ok(list);
	}

	@GetMapping("/{classId}")
	public ResponseEntity<?> getAllScheduleByClassId(@PathVariable("classId") Integer classId) {
		ScheduleResponse scheduleResponse = scheduleService.findAllScheduleByClassId(classId);
		return ResponseEntity.ok(scheduleResponse);
	}

	@GetMapping("/teacher/{accountId}")
	public ResponseEntity<?> findAllScheduleTeacherByID(@PathVariable("accountId") Integer accountId) {
		List<ScheduleTeacherDTO> list = scheduleService.findAllScheduleTeacherByID(accountId);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/classes")
	public ResponseEntity<?> getAllScheduleByClassId(@RequestParam("classId") Integer classId,
			@RequestParam("studyDate") Date studyDate) {
		Schedule scheduleResponse = scheduleService.findScheduleByClassAndStudyDate(classId, studyDate);
		return ResponseEntity.ok(scheduleResponse);
	}

	@GetMapping("/student")
	public ResponseEntity<?> findAllScheduleByAttendance(@RequestParam("classId") Integer classId,
			@RequestParam("studentId") String studentId) {
		List<AttendanceReviewStudent> scheduleResponse = scheduleService.findAllScheduleByAttendance(classId,
				studentId);
		return ResponseEntity.ok(scheduleResponse);
	}

}
