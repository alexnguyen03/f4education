package com.f4education.springjwt.controllers;

import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.security.services.AnswerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/answers")
public class AnswerController {
    @Autowired
    AnswerServiceImpl answerService;

    @Autowired
    private AnswerReposotory answerReposotory;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findAll() {
        List<AnswerDTO> answers = answerService.getAllAnswer();
        return ResponseEntity.ok(answers);
    }

    @GetMapping("/{questionDetailId}")
//	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findAllByQuestionDetailId(@PathVariable Integer questionDetailId) {
        List<AnswerDTO> answers = answerService.getAnsweByQuestionDetailId(questionDetailId);
        return ResponseEntity.ok(answers);
    }

    @PostMapping
    public ResponseEntity<?> createAnswer(@RequestBody List<AnswerDTO> answerDTOList) {
        List<AnswerDTO> createdAnswers = new ArrayList<>();

        for (AnswerDTO answerDTO : answerDTOList) {
            createdAnswers.add(answerService.createAnswer(answerDTO));
        }

        return ResponseEntity.ok(createdAnswers);
    }

    @PutMapping("/{answerId}")
//	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAnswer(@PathVariable("answerId") Integer answerId, @RequestBody AnswerDTO answerDTO) {
        AnswerDTO answer = answerService.updateAnswer(answerId, answerDTO);
        return ResponseEntity.ok(answer);
    }

    @DeleteMapping("/{answerId}")
//	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnswer(@PathVariable("answerId") Integer answerId) {

        Optional<Answer> answer = answerReposotory.findById(answerId);

        if (answer.isPresent()) {
            answerService.deleteAnswer(answerId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body("Không tìm thấy answer với ID đã cho");
    }
}
