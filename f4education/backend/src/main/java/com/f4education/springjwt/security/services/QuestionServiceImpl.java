package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.repository.QuestionReposotory;

@Service
public class QuestionServiceImpl implements QuestionService {
    @Autowired
    QuestionReposotory questionReposotory;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    CourseRepository courseRepository;

    @Override
    public List<QuestionDTO> getAllQuestion() {
        List<Question> question = questionReposotory.findDistinctByCourseName();
//        List<Question> question = questionReposotory.findAll();
        return question.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public QuestionDTO getQuestionById(Integer questionId) {
        // TODO Auto-generated method stub
        return null;
    }

    public List<QuestionDTO> getQuestionByCourseName(String courseName) {
        List<Question> questions = questionReposotory.findByCourseName(courseName.trim());
        return questions.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public QuestionDTORequest createQuestion(QuestionDTORequest questionDTO) {
        Question question = this.convertToEntity(questionDTO);
        Question saveQuestion = questionReposotory.save(question);
        return convertToDtoRequest(saveQuestion);
    }

    @Override
    public QuestionDTO updateQuestion(Integer questionId, QuestionDTO questionDTO) {
        // TODO Auto-generated method stub
        return null;
    }

    private QuestionDTO convertToDto(Question question) {
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setAdminName(question.getAdmin().getFullname());
        questionDTO.setAnswer(question.getAnswer());
        question.setCreateDate(new Date());
        BeanUtils.copyProperties(question, questionDTO);
        return questionDTO;
    }

    private QuestionDTORequest convertToDtoRequest(Question question) {
        QuestionDTORequest questionDTO = new QuestionDTORequest();
        Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
        Course course = courseRepository.findById(questionDTO.getCourseId()).get();
        question.setAdmin(admin);
        question.setCourse(course);
        BeanUtils.copyProperties(question, questionDTO);
        return questionDTO;
    }

    private Question convertToEntity(QuestionDTORequest questionDTO) {
        Question question = new Question();
        BeanUtils.copyProperties(questionDTO, question);
        Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
        Course course = courseRepository.findById(questionDTO.getCourseId()).get();
        System.out.println(admin);
        System.out.println(course);
        question.setAdmin(admin);
        question.setCourse(course);
        return question;
    }

}
