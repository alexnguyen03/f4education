package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;

@Service
public interface QuestionService {
    List<QuestionDTO> getAllQuestion();

    QuestionDTO findQuestionById(Integer questionId);

    QuestionDTO createQuestion(QuestionDTORequest questionDTO);

    List<Question> get60QuestionRamdomsByCourseId(Integer courseId);

    QuestionDTO updateQuestion(Integer questionId, QuestionDTORequest questionDTO);
}
