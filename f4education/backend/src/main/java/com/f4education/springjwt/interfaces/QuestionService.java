package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.QuestionDetailRequestDTO;
import com.f4education.springjwt.payload.request.QuestionRequestDTO;
import com.f4education.springjwt.payload.response.QuestionDetailResponseDTO;
import com.f4education.springjwt.payload.response.QuestionResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface QuestionService {
    List<QuestionResponseDTO> getAllQuestion();

    QuestionResponseDTO createQuestion(QuestionRequestDTO questionDTO);

    QuestionResponseDTO updateQuestion(Integer questionId, QuestionRequestDTO questionDTO);
}
