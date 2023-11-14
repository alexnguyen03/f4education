package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.QuizResultInfo;
import com.f4education.springjwt.payload.request.QuizResultDTO;
import com.f4education.springjwt.payload.request.QuizResultRequest;

public interface QuizResultService {
	QuizResultDTO createQuizzResult(QuizResultRequest quizResultRequest);

	List<Object[]> getQuizInfoByClassId(Integer classId);
}
