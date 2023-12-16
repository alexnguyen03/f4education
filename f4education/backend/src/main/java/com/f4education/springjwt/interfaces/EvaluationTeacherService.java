package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.EvaluationTeacher;
import com.f4education.springjwt.payload.request.EvaluationTeacherRequest;
import com.f4education.springjwt.payload.response.EvaluationTeacherResponse;
import com.f4education.springjwt.repository.ReportEvaluationTeacher;

@Service
public interface EvaluationTeacherService {
    public List<EvaluationTeacherResponse> getAllEvaluationsByTeacherId(String teacherId);

    public List<ReportEvaluationTeacher> getAllReportEvaluationTeacher();

    public EvaluationTeacher saveEvaluation(EvaluationTeacherRequest evaluationTeacherRequest);

    public Boolean checkStudentHasEvaluated(Integer classId, String studentId);
}
