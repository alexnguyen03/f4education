package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.QuestionDTO;

@Service
public interface QuestionService {
	List<QuestionDTO> getAllQuestion();

	QuestionDTO getQuestionById(Integer questionId);

	QuestionDTO createQuestion(QuestionDTO questionDTO);

	QuestionDTO updateQuestion(Integer questionId, QuestionDTO questionDTO);
}
