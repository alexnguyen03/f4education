package com.f4education.springjwt.controllers;

import java.util.List;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
	@Autowired
	QuestionDetailService questionDetailService;

	@GetMapping("/{studentId}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getQuestionDetailsByStudentId(@PathVariable("studentId") String studentId) {
		List<QuestionDetailDTO> questionDetailDTO = questionDetailService.getQuestionDetailsByStudentId(studentId);
		return ResponseEntity.ok(questionDetailDTO);
	}
}
