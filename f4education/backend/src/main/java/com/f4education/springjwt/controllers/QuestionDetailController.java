package com.f4education.springjwt.controllers;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
    @Autowired
    QuestionDetailService questionDetailService;

    @GetMapping("/{questionId}")
//	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findAll(@PathVariable Integer questionId) {
        List<QuestionDetailDTO> questionDetail = questionDetailService.getAllQuestionDetailByQuestionId(questionId);
        return ResponseEntity.ok(questionDetail);
    }

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody QuestionDetailDTO questionDetailDTO) {
        QuestionDetailDTO questionDetail = questionDetailService.createQuestionDetail(questionDetailDTO);
        return ResponseEntity.ok(questionDetail);
    }
//
//    @PutMapping("/{questionId}")
////	@PreAuthorize("hasRole('ADMIN')")
//    public QuestionDTORequest updateQuestion(@PathVariable("questionId") Integer questionId, @RequestBody QuestionDTORequest questionDTO) {
//        return questionService.updateQuestion(questionId, questionDTO);
//    }

}
