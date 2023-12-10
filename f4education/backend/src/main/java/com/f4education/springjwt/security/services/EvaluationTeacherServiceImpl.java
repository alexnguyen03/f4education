package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.interfaces.EvaluationTeacherDetailService;
import com.f4education.springjwt.interfaces.EvaluationTeacherService;
import com.f4education.springjwt.models.AttendanceInfo;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.EvaluationTeacher;
import com.f4education.springjwt.models.EvaluationTeacherDetail;
import com.f4education.springjwt.payload.request.EvaluationDetailInRequest;
import com.f4education.springjwt.payload.request.EvaluationTeacherRequest;
import com.f4education.springjwt.payload.response.EvaluationTeacherResponse;
import com.f4education.springjwt.repository.EvaluationTeacherRepository;
import com.f4education.springjwt.repository.ReportEvaluationTeacher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluationTeacherServiceImpl implements EvaluationTeacherService {

	@Autowired(required = true)
	EvaluationTeacherRepository evaluationTeacherRepository;

	@Autowired(required = true)
	ClassService classService;

	@Autowired(required = true)
	EvaluationTeacherDetailService evaluationTeacherDetailService;

	@Override
	public List<EvaluationTeacherResponse> getAllEvaluationsByTeacherId(String teacherId) {
		return evaluationTeacherRepository.getAllEvaluationsByTeacherId(teacherId).stream()
				.map(obj -> new EvaluationTeacherResponse((String) obj[0], (Integer) obj[1], (Integer) obj[2]))
				.collect(Collectors.toList());
	}

	@Override
	public EvaluationTeacher saveEvaluation(EvaluationTeacherRequest evaluationTeacherRequest) {
		Classes foundClasses = classService.findById(evaluationTeacherRequest.getClassId());
		EvaluationTeacher evaluationTeacher = new EvaluationTeacher();
		evaluationTeacher.setClasses(foundClasses);
		evaluationTeacher.setCompleteDate(new Date());
		EvaluationTeacher savedEvaluationTeacher = evaluationTeacherRepository.save(evaluationTeacher);
		List<EvaluationTeacherDetail> listEvaluationDetailInRequest = evaluationTeacherRequest
				.getListEvaluationDetailInRequest().stream().map(this::convertEvaluationTeacherDetailReqToEntity)
				.collect(Collectors.toList());
		for (EvaluationTeacherDetail evaluationTeacherDetail : listEvaluationDetailInRequest) {
			evaluationTeacherDetail.setEvaluationTeacher(savedEvaluationTeacher);
			evaluationTeacherDetailService.save(evaluationTeacherDetail);
		}

		return evaluationTeacher;
	}

	private EvaluationTeacherDetail convertEvaluationTeacherDetailReqToEntity(
			EvaluationDetailInRequest evaluationDetailInRequest) {

		return new EvaluationTeacherDetail(evaluationDetailInRequest.getTitle(),
				evaluationDetailInRequest.getValue());

	}

	@Override
	public List<ReportEvaluationTeacher> getAllReportEvaluationTeacher() {
		return evaluationTeacherRepository.getAllReportEvaluationTeacher().stream()
				.map(obj -> new ReportEvaluationTeacher((String) obj[0], (String) obj[1], (Integer) obj[2],
						(Integer) obj[3], (Integer) obj[4]))
				.collect(Collectors.toList());
	}
}
