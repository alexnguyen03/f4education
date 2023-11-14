package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.request.ScheduleCourseProgressDTO;
import com.f4education.springjwt.payload.response.CourseProgressResponseDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.security.services.RegisterCourseServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/register-course")
public class RegisterCourseController {
	@Autowired
	RegisterCourseServiceImp registerCourseService;

	@GetMapping
	public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAll() {
		return registerCourseService.getAllRegisterCourse();
	}

	@GetMapping("/distinc")
	public ResponseEntity<?> findAllDistincByCourse_CourseName() {
		List<RegisterCourseResponseDTO> list = registerCourseService.getAllRegisterCoursesByCourse_CourseName();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/check-course-has-class/{classId}")
	public ResponseEntity<?> checkRegisterCourseHasClass(@PathVariable("classId") Integer classId) {
		return ResponseEntity.ok(registerCourseService.getRegisterCourseHasClass(classId));
	}

	@GetMapping("/student/{studentId}")
	public ResponseEntity<?> findAllCourseProgressByStudentId(@PathVariable String studentId) {
		List<CourseProgressResponseDTO> lst = registerCourseService.getCourseProgressByStudentID(studentId);
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/student/is-done")
	public ResponseEntity<?> checkIfPointGreaterThanFive(@RequestParam(value = "studentId") String studentId,
			@RequestParam(value = "classId") Integer classId,
			@RequestParam(value = "registerCourseId") Integer registerCourseId) {
		return ResponseEntity.ok(registerCourseService.checkIfCourseIsDone(studentId, classId, registerCourseId));
	}

	@GetMapping("/student/progress/{classId}")
	public ResponseEntity<?> getAllScheduleByClassId(@PathVariable("classId") Integer classId) {
		List<ScheduleCourseProgressDTO> scheduleResponse = registerCourseService.findAllScheduleByClassId(classId);
		return ResponseEntity.ok(scheduleResponse);
	}

	@GetMapping("/{studentId}")
	public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllByStudentId(@PathVariable String studentId) {
		return registerCourseService.findAllRegisterCourseByStudentId(studentId);
	}

	@PostMapping
	public HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(
			@RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {
		return registerCourseService.createRegisterCourse(registerCourseRequestDTO);
	}

	@PutMapping("/{id}")
	public HandleResponseDTO<RegisterCourseResponseDTO> updateRegisterCourse(@PathVariable("id") Integer id,
			@RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {
		return registerCourseService.updateRegisterCourse(id, registerCourseRequestDTO);
	}

	@PutMapping
	public ResponseEntity<?> updateRegisterCourseInClass(
			@RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {

		List<RegisterCourseResponseDTO> ls = registerCourseService
				.updateRegisterCourseInClass(registerCourseRequestDTO);
		return ResponseEntity.ok(ls);
	}
}
