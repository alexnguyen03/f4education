package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.AnswerDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AnswerService {
	List<AnswerDTO> getAllAnswer();

	AnswerDTO getAnswerById(Integer questionId);

	AnswerDTO createAnswer(AnswerDTO AnswerDTO);

	AnswerDTO updateAnswer(Integer questionId, AnswerDTO AnswerDTO);
}
