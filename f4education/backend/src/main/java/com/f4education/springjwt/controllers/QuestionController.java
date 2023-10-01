package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.QuestionDetailRequestDTO;
import com.f4education.springjwt.payload.request.QuestionRequestDTO;
import com.f4education.springjwt.payload.response.QuestionDetailResponseDTO;
import com.f4education.springjwt.payload.response.QuestionResponseDTO;
import com.f4education.springjwt.security.services.QuestionDetailServiceImpl;
import com.f4education.springjwt.security.services.QuestionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question")
public class QuestionController {
    @Autowired
    QuestionServiceImpl questionService;

    @GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
    public List<QuestionResponseDTO> findAll() {
        return questionService.getAllQuestion();
    }

    @PostMapping
    public QuestionResponseDTO createQuestion(@RequestBody QuestionRequestDTO questionDTO) {
        return questionService.createQuestion(questionDTO);
    }

    @PutMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
    public QuestionResponseDTO updateQuestion(@PathVariable("id") Integer id, @RequestBody QuestionRequestDTO questionDTO) {
        return questionService.updateQuestion(id, questionDTO);
    }

}
