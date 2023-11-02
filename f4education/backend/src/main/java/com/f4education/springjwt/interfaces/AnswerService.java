package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.AnswerDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AnswerService {
	List<AnswerDTO> getAllAnswer();

	List<AnswerDTO> getAnsweByQuestionDetailId(Integer questionDetailId);

	AnswerDTO getAnswerByAnswerId(Integer answerId);

	AnswerDTO createAnswer(AnswerDTO AnswerDTO);

	AnswerDTO updateAnswer(Integer questionDetailId, AnswerDTO AnswerDTO);

	void deleteAnswer(Integer answerId);
}
