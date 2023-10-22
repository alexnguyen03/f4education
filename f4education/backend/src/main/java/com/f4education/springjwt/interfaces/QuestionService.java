package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface QuestionService {
	List<QuestionDTO> getAllQuestion();

	QuestionDTO createQuestion(QuestionDTORequest questionDTO);

	QuestionDTO updateQuestion(Integer questionId, QuestionDTORequest questionDTO);
}
