package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.payload.request.QuestionDTO;

@Service
public interface QuestionDetailService {
	List<QuestionDetailDTO> getQuestionDetailsByStudentId(String studentId);
}
