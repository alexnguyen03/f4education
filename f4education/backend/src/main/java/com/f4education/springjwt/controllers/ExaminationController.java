package com.f4education.springjwt.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Examination;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.payload.request.ExaminationDTO;
import com.f4education.springjwt.security.services.ClassServiceImpl;
import com.f4education.springjwt.security.services.ExaminationServiceImpl;
import com.f4education.springjwt.security.services.QuestionServiceImpl;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/exam")
public class ExaminationController {
    @Autowired
    ExaminationServiceImpl examinationService;

    @Autowired
    QuestionServiceImpl questionService;

    @Autowired
    ClassServiceImpl classService;

    @PostMapping("/{classId}")
    public ResponseEntity<?> createExam(@PathVariable("classId") Integer classId) {
        Classes classes = classService.findById(classId);
        List<Question> listQuestion = questionService
                .get60QuestionRamdomsByCourseId(classes.getRegisterCourses().get(0).getCourse().getCourseId());

        List<Examination> listExamination = new ArrayList<Examination>();
        listQuestion.forEach(item -> {
            Examination exam = new Examination();
            exam.setExamId(1);
            exam.setClasses(classes);
            exam.setFinishDate(new Date());
            exam.setQuestion(item);
            listExamination.add(exam);
        });
        List<Examination> listExaminationSaved = examinationService.saveExamination(listExamination);
        return ResponseEntity.ok(listExaminationSaved);
    }

    @GetMapping("/{classId}")
    public ResponseEntity<?> checkActivedExam(@PathVariable("classId") Integer classId) {
        return ResponseEntity.ok(examinationService.isActivedExam(classId));
    }

    @GetMapping("/student/{classId}")
    public ResponseEntity<?> checkActivedExamByDateAndClassid(@PathVariable("classId") Integer classId) {
        return ResponseEntity.ok(examinationService.isActivedExam(classId));
    }
}
