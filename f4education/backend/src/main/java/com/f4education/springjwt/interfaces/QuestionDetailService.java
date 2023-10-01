package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.QuestionDetailRequestDTO;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.response.QuestionDetailResponseDTO;

@Service
public interface QuestionDetailService {
    List<QuestionDetailResponseDTO> getAllQuestionDetail();

    QuestionDetailResponseDTO createQuestionDetail(QuestionDetailRequestDTO questionDTO);

    QuestionDetailResponseDTO updateQuestionDetail(Integer questionId, QuestionDetailRequestDTO questionDTO);
}
