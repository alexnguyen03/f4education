package com.f4education.springjwt.controllers;

import java.util.List;

import com.f4education.springjwt.payload.request.QuestionDetailRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.response.QuestionDetailResponseDTO;
import com.f4education.springjwt.security.services.QuestionDetailServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
    @Autowired
    QuestionDetailServiceImpl questionService;

    @GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
    public List<QuestionDetailResponseDTO> findAll() {
        return questionService.getAllQuestionDetail();
    }

    @GetMapping("/{courseName}")
//	@PreAuthorize("hasRole('ADMIN')")
    public List<QuestionDetailResponseDTO> findByCourseName(@PathVariable("courseName") String courseName) {
        return questionService.getQuestionByCourseName(courseName);
    }

    @PostMapping
    public QuestionDetailResponseDTO createQuestion(@RequestBody QuestionDetailRequestDTO questionDTO) {
        return questionService.createQuestionDetail(questionDTO);
    }

    @PutMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
    public QuestionDetailResponseDTO updateQuestion(@PathVariable("id") Integer id, @RequestBody QuestionDetailRequestDTO questionDTO) {
        return questionService.updateQuestionDetail(id, questionDTO);
    }

}
