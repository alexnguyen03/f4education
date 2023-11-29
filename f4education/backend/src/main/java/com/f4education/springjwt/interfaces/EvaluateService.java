package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.EvaluateRequestDTO;
import com.f4education.springjwt.payload.response.EvaluateResponse;

public interface EvaluateService {
	List<EvaluateResponse> getAllEvaluate();

	List<EvaluateResponse> getTop10Evaluate();

	List<EvaluateResponse> getAllEvaluateByCourseId(Integer courseId);

	EvaluateResponse getEvaluateById(Integer evaluateId);

	EvaluateResponse createEvaluate(EvaluateRequestDTO evaluateDTO);

	EvaluateResponse updateEvaluateDTO(Integer evaluateId, EvaluateRequestDTO evaluateDTO);

	void deleteEvaluateDTO(Integer evaluateId);
}
