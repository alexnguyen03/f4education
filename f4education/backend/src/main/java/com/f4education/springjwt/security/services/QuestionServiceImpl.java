package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.*;
import com.f4education.springjwt.payload.request.QuestionDetailRequestDTO;
import com.f4education.springjwt.payload.request.QuestionRequestDTO;
import com.f4education.springjwt.payload.response.QuestionDetailResponseDTO;
import com.f4education.springjwt.payload.response.QuestionResponseDTO;
import com.f4education.springjwt.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {
    @Autowired
    QuestionReposotory questionRepository;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Override
    public List<QuestionResponseDTO> getAllQuestion() {
        List<Question> questions = questionRepository.findDistinctByCourseName();
        return questions.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public QuestionResponseDTO createQuestion(QuestionRequestDTO questionDTO) {
        Question question = this.convertRequestToEntity(questionDTO);

        question.setCreateDate(new Date());

        Question createQuestion = questionRepository.save(question);

        return convertToResponseDTO(createQuestion);
    }

    @Override
    public QuestionResponseDTO updateQuestion(Integer id, QuestionRequestDTO questionDTO) {
        Question question = questionRepository.findById(id).get();

        convertRequestToEntity(questionDTO, question);
        question.setCreateDate(new Date());

        Question updateQuestion = questionRepository.save(question);
        return convertToResponseDTO(updateQuestion);
    }


    private QuestionResponseDTO convertToResponseDTO(Question question) {
        QuestionResponseDTO questionDTO = new QuestionResponseDTO();

        BeanUtils.copyProperties(question, questionDTO);

        questionDTO.setAdminName(question.getAdmin().getFullname());

        return questionDTO;
    }

    private void convertRequestToEntity(QuestionRequestDTO questionDTO, Question question) {
        Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
        Subject subject = subjectRepository.findById(questionDTO.getSubjectId()).get();
        Course course = courseRepository.findById(questionDTO.getCourseId()).get();

        System.out.println(admin);
        System.out.println(subject);
        System.out.println(course);

        BeanUtils.copyProperties(questionDTO, question);

        question.setSubjectName(subject.getSubjectName());
        question.setCourseName(course.getCourseName());
        question.setAdmin(admin);
    }

    private Question convertRequestToEntity(QuestionRequestDTO questionDTO) {
        Question question = new Question();

        Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
        Subject subject = subjectRepository.findById(questionDTO.getSubjectId()).get();
        Course course = courseRepository.findById(questionDTO.getCourseId()).get();

        BeanUtils.copyProperties(questionDTO, question);

        question.setSubjectName(subject.getSubjectName());
        question.setAdmin(admin);
        question.setCourseName(course.getCourseName());

        return question;
    }
}
