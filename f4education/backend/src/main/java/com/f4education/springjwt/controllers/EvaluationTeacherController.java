package com.f4education.springjwt.controllers;

import com.f4education.springjwt.interfaces.EvaluationTeacherService;
import com.f4education.springjwt.models.EvaluationTeacher;
import com.f4education.springjwt.payload.request.EvaluationTeacherRequest;
import com.f4education.springjwt.security.services.EvaluationTeacherServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/evaluation")
public class EvaluationTeacherController {

	@Autowired(required = true)
	EvaluationTeacherService evaluationTeacherService;

	@PostMapping(value = "/student")
	public ResponseEntity<?> saveEvaluationTeacher(@RequestBody EvaluationTeacherRequest evaluationTeacherRequest) {
		EvaluationTeacher savedEvaluationTeacher = evaluationTeacherService.saveEvaluation(evaluationTeacherRequest);
		return ResponseEntity.ok(savedEvaluationTeacher);
	}

	@GetMapping("/teacher/{teacherId}")
	public ResponseEntity<?> getEvaluationTeacherByTeacherId(@PathVariable("teacherId") String teacherId) {
		return ResponseEntity.ok(evaluationTeacherService.getAllEvaluationsByTeacherId(teacherId));

	}

	@GetMapping("/report")
	public ResponseEntity<?> getAllReportEvaluationTeacher() {
		return ResponseEntity.ok(evaluationTeacherService.getAllReportEvaluationTeacher());

	}

	@GetMapping("/check-has-evaluated")
	public ResponseEntity<?> checkStudentHasEvaluated(@RequestParam("classId") Integer classId,
			@RequestParam("studentId") String studentId) {
		return ResponseEntity.ok(evaluationTeacherService.checkStudentHasEvaluated(classId, studentId));

	}

}
