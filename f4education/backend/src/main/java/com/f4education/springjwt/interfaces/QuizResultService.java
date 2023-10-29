package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.QuizResultDTO;
import com.f4education.springjwt.payload.request.QuizResultRequest;

public interface QuizResultService {
	QuizResultDTO createQuizzResult(QuizResultRequest quizResultRequest);
}
