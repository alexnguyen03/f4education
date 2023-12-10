package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.EvaluationTeacherDetailService;
import com.f4education.springjwt.models.EvaluationTeacherDetail;
import com.f4education.springjwt.repository.EvaluationTeacherDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvaluationTeacherDetailServiceImpl implements EvaluationTeacherDetailService {
	@Autowired
	EvaluationTeacherDetailRepository evaluationTeacherDetailRepository;

	@Override
	public EvaluationTeacherDetail save(EvaluationTeacherDetail evaluationTeacherDetail) {
		return evaluationTeacherDetailRepository.save(evaluationTeacherDetail);
	}

}
