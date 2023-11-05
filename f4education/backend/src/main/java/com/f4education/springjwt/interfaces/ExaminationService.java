package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Examination;

@Service
public interface ExaminationService {
    public List<Examination> saveExamination(List<Examination> listExam);

    public Boolean isActivedExam(Integer classId);
    public Boolean isActivedExamByTodayAndClassId(Integer classId);
}
