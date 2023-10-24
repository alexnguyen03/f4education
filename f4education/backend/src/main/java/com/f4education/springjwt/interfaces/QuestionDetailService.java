package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.QuestionDetailDTO;

@Service
public interface QuestionDetailService {
	List<QuestionDetailDTO> getAllQuestionDetailByQuestionId(Integer QuestionId);

	QuestionDetailDTO getQuestionDetailById(Integer questionDetailId);

	QuestionDetailDTO createQuestionDetail(QuestionDetailDTO questionDetailDTO);

	QuestionDetailDTO updateQuestionDetail(Integer questionDetailId, QuestionDetailDTO questionDetailDTO);
}