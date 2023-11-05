package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.ExaminationService;
import com.f4education.springjwt.models.Examination;
import com.f4education.springjwt.repository.ExaminationRepository;

@Service
public class ExaminationServiceImpl implements ExaminationService {

    @Autowired
    ExaminationRepository examinationRepository;

    @Override
    public List<Examination> saveExamination(List<Examination> listExam) {
        return examinationRepository.saveAll(listExam);
    }

    @Override
    public Boolean isActivedExam(Integer classId) {
        Integer rs = examinationRepository.isActivedExam(classId);
        return rs == 1 ? true : false;
    }
    @Override
    public Boolean isActivedExamByTodayAndClassId(Integer classId) {
        Integer rs = examinationRepository.isActivedExamByTodayAndClassId(classId, new Date());
        return rs == 1 ? true : false;
    }

}
