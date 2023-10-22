package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface QuestionDetailService {
	List<QuestionDetailDTO> getAllQuestionDetailByQuestionId(Integer QuestionId);

	QuestionDetailDTO getQuestionDetailById(Integer questionDetailId);

	QuestionDetailDTO createQuestionDetail(QuestionDetailDTO questionDetailDTO);

	QuestionDetailDTO updateQuestionDetail(Integer questionDetailId, QuestionDetailDTO questionDetailDTO);
}
