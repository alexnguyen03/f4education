package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.response.ClassesByTeacherResponse;
import com.f4education.springjwt.payload.response.LearningResultResponse;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/classes")
public class ClassController {

	@Autowired
	ClassService classService;

	@GetMapping
	public ResponseEntity<?> getAll() {
		List<ClassDTO> classDTOs = classService.findAll();
		return ResponseEntity.ok(classDTOs);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> findById(@PathVariable("id") Integer classId) {
		ClassDTO classes = classService.getClassById(classId);
		return ResponseEntity.ok(classes);
	}

	@GetMapping("/teacher/{teacherId}")
	public List<ClassesByTeacherResponse> findByTeacherId(@PathVariable("teacherId") String teacherId) {
		return classService.getAllClassesByTeacherId(teacherId);
	}

	@PostMapping("/{adminId}")
	public ResponseEntity<?> createSubject(@RequestBody ClassDTO classDTO, @PathVariable("adminId") String adminId) {
		ClassDTO classes = classService.createClass(classDTO, adminId);
		return ResponseEntity.ok(classes);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateSubject(@PathVariable("id") Integer classId, @RequestBody ClassDTO classDTO) {
		ClassDTO classes = classService.updateClass(classId, classDTO);
		return ResponseEntity.ok(classes);
	}

	@GetMapping("/actived")
	public ResponseEntity<?> getAllClassActive() {
		return ResponseEntity.ok(classService.findAllActiveClasses());
	}
	
	@GetMapping("/actived-schedule-exam")
	public ResponseEntity<?> getAllClassActiveSchedulesExam() {
		return ResponseEntity.ok(classService.findAllActiveClassesSchedulesExam());
	}

	@GetMapping("/student/{studentId}")
	public ResponseEntity<?> getClassByStudentId(@PathVariable("studentId") String studentId) {
		return ResponseEntity.ok(classService.getClassByStudentId(studentId));
	}

	@GetMapping("/student/result/{studentId}")
	public ResponseEntity<?> getLearningResult(@PathVariable("studentId") String studentId) {
		List<LearningResultResponse> classes = classService.getAllClassLearningResult(studentId);
		return ResponseEntity.ok(classes);
	}

	@PostMapping("/teacher/point")
	public ResponseEntity<?> handleEndClass(@RequestParam("classId") Integer classId) {
		Classes classes = classService.overClassByStatus(classId);
		return ResponseEntity.ok(classes);
	}

}
