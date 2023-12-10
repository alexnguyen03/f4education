package com.f4education.springjwt.controllers;

import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    QuestionService questionService;

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findAll() {
        List<QuestionDTO> question = questionService.getAllQuestion();
        return ResponseEntity.ok(question);
    }

    @GetMapping("/{questionId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findById(@PathVariable Integer questionId) {
        QuestionDTO question = questionService.findQuestionById(questionId);
        return ResponseEntity.ok(question);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createQuestion(@RequestBody QuestionDTORequest questionDTO) {
        QuestionDTO question = questionService.createQuestion(questionDTO);
        return ResponseEntity.ok(question);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable("questionId") Integer questionId,
            @RequestBody QuestionDTORequest questionDTO) {
        QuestionDTO question = questionService.updateQuestion(questionId, questionDTO);
        return ResponseEntity.ok(question);
    }

}
