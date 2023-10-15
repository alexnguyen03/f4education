package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
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

//	@GetMapping("/teacher")
//	public ResponseEntity<?> findAllClassByTeacherId() {
//		List<ClassesByTeacher> lst = registerCourseService
//				.getRegisterCourseWithTeacherAndClasses();
//		return ResponseEntity.ok(lst);
//	}

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
}
