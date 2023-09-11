package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.QuestionDTORequest;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.QuestionDTO;

@Service
public interface QuestionService {
	List<QuestionDTO> getAllQuestion();

	QuestionDTO getQuestionById(Integer questionId);

	QuestionDTORequest createQuestion(QuestionDTORequest questionDTO);

	QuestionDTO updateQuestion(Integer questionId, QuestionDTO questionDTO);
}
