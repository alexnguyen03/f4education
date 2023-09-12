package com.f4education.springjwt.controllers;

import java.util.ArrayList;
import java.util.Arrays;
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

import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.security.services.AnswerServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/answers")
public class AnswerController {
	@Autowired
	AnswerServiceImpl answerService;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public List<AnswerDTO> findAll() {
		return answerService.getAllAnswer();
	}

	@PostMapping
	public List<AnswerDTO> createAnswer(@RequestBody List<AnswerDTO> answerDTOList) {
		List<AnswerDTO> createdAnswers = new ArrayList<>();
		for (AnswerDTO answerDTO : answerDTOList) {
			answerService.createAnswer(answerDTO);
			createdAnswers.add(answerService.createAnswer(answerDTO));
		}
		return createdAnswers;
	}

	@PutMapping("/{answerId}")
//	@PreAuthorize("hasRole('ADMIN')")
	public AnswerDTO updateAnswer(@PathVariable("answerId") Integer answerId, @RequestBody AnswerDTO answerDTO) {
		return answerService.updateAnswer(answerId, answerDTO);
	}

}
