package com.f4education.springjwt.controllers;

import java.util.List;

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

import com.f4education.springjwt.interfaces.AnswerService;
import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
	@Autowired
	QuestionDetailService questionDetailService;

	@Autowired
	AnswerService answerService;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAll() {
		List<QuestionDetailDTO> questionDetail = questionDetailService.findAll();
		return ResponseEntity.ok(questionDetail);
	}

	@GetMapping("/{questionId}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAllByQuestionID(@PathVariable Integer questionId) {
		List<QuestionDetailDTO> questionDetail = questionDetailService.getAllQuestionDetailByQuestionId(questionId);
		return ResponseEntity.ok(questionDetail);
	}

	@PostMapping
	public ResponseEntity<?> createQuestion(@RequestBody QuestionDetailDTO questionDetailDTO) {
		QuestionDetailDTO questionDetail = questionDetailService.createQuestionDetail(questionDetailDTO);
		return ResponseEntity.ok(questionDetail);
	}

	@PutMapping("/{questionDetailId}")
	public ResponseEntity<?> updateQuestion(@PathVariable("questionDetailId") Integer questionDetailId,
			@RequestBody QuestionDetailDTO questionDetailDTO) {
		QuestionDetailDTO questionDetail = questionDetailService.updateQuestionDetail(questionDetailId,
				questionDetailDTO);
		return ResponseEntity.ok(questionDetail);
	}

	@DeleteMapping("{questionDetailId}")
	public ResponseEntity<?> deleteQuestion(@PathVariable Integer questionDetailId) {
		QuestionDetailDTO questionDetail = questionDetailService.deleteQuestion(questionDetailId);

		if (questionDetail == null) {
			return ResponseEntity.badRequest().body("Question does not exist");
		}

		return ResponseEntity.noContent().build();
	}

}
