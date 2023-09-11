package com.f4education.springjwt.controllers;

import java.util.List;

import com.f4education.springjwt.payload.request.QuestionDTORequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.security.services.QuestionServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    QuestionServiceImpl questionService;

    @GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
    public List<QuestionDTO> findAll() {
        return questionService.getAllQuestion();
    }

    @GetMapping("/{courseName}")
//	@PreAuthorize("hasRole('ADMIN')")
    public List<QuestionDTO> findByCourseName(@PathVariable("courseName") String courseName) {
        return questionService.getQuestionByCourseName(courseName);
    }

    @PostMapping
    public QuestionDTORequest createSubject(@RequestBody QuestionDTORequest questionDTO) {
        return questionService.createQuestion(questionDTO);
    }

    @PutMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
    public QuestionDTO updateSubject(@PathVariable("id") Integer questionId, @RequestBody QuestionDTO questionDTO) {
        return questionService.updateQuestion(questionId, questionDTO);
    }

}
