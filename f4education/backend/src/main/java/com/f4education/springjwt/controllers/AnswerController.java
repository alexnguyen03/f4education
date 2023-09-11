package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.security.services.AnswerServiceImpl;
import com.f4education.springjwt.security.services.QuestionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public AnswerDTO createAnswer(@RequestBody AnswerDTO answerDTO) {
        return answerService.createAnswer(answerDTO);
    }

}
