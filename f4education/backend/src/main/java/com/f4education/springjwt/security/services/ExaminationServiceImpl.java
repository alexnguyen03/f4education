package com.f4education.springjwt.security.services;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
    public Examination saveExamination(Examination examination) {
        return examinationRepository.save(examination);
    }

    @Override
    public Boolean isActivedExam(Integer classId) {
        Integer rs = examinationRepository.isActivedExam(classId);
        return rs == 1 ? true : false;
    }

    @Override
    public Boolean isActivedExamByTodayAndClassId(Integer classId) {
        Date now = new Date();
        String dateString = now.toString();
        Integer rs = null;
        try {
            // Bước 1: Chuyển đổi ngày tháng sang đối tượng Date
            SimpleDateFormat inputDateFormat = new SimpleDateFormat("E MMM dd HH:mm:ss z yyyy");
            Date date = inputDateFormat.parse(dateString);

            // Bước 2: Chuyển đổi Date sang LocalDate
            LocalDate localDate = date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();

            // Bước 3: Chuyển đổi LocalDate thành chuỗi theo định dạng "yyyy-MM-dd"
            DateTimeFormatter outputDateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String outputDate = localDate.format(outputDateFormat);
            rs = examinationRepository.isActivedExamByTodayAndClassId(classId, outputDate);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return rs == 1 ? true : false;
    }

	@Override
	public Examination getByClassId(Integer classId) {
		return examinationRepository.getByClassId(classId);
	}

}
