package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.f4education.springjwt.models.*;
import com.f4education.springjwt.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.payload.response.QuestionDetailResponseDTO;
import com.f4education.springjwt.payload.request.QuestionDetailRequestDTO;

@Service
public class QuestionDetailServiceImpl implements QuestionDetailService {
    @Autowired
    QuestionDetailReposotory questionDetailReposotory;

    @Autowired
    QuestionReposotory questionRepository;

    @Autowired
    AnswerReposotory answerReposotory;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Override
    public List<QuestionDetailResponseDTO> getAllQuestionDetail() {
        List<QuestionDetail> questionDetails = questionDetailReposotory.findAll();
        return questionDetails.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    public List<QuestionDetailResponseDTO> getQuestionByCourseName(String courseName) {
        List<QuestionDetail> questions = questionDetailReposotory.findByCourseName(courseName.trim());
        return questions.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public QuestionDetailResponseDTO createQuestionDetail(QuestionDetailRequestDTO questionDTO) {
        QuestionDetail question = this.convertRequestToEntity(questionDTO);
        question.setCreateDate(new Date());
        question.setQuestionDetailId(questionDTO.getQuestionDetailId());

        QuestionDetail saveQuestion = questionDetailReposotory.save(question);

        if (!saveQuestion.getAnswer().isEmpty()) {
            for (Answer as : saveQuestion.getAnswer()) {
                as.setQuestionDetail(saveQuestion);
                answerReposotory.save(as);
            }
        }

        return convertToResponseDTO(saveQuestion);
    }

    @Override
    public QuestionDetailResponseDTO updateQuestionDetail(Integer questionId, QuestionDetailRequestDTO questionDTO) {
        Optional<QuestionDetail> exitQuestion = questionDetailReposotory.findById(questionId);

        if (exitQuestion.isEmpty()) {
            return null;
        }

        QuestionDetail question = this.convertRequestToEntity(questionDTO);

        QuestionDetail updateQuestion = questionDetailReposotory.save(question);

        for (Answer as : updateQuestion.getAnswer()) {
            as.setQuestionDetail(updateQuestion);
            answerReposotory.save(as);
        }

        return convertToResponseDTO(updateQuestion);
    }

    private QuestionDetailResponseDTO convertToResponseDTO(QuestionDetail question) {
        QuestionDetailResponseDTO questionDTO = new QuestionDetailResponseDTO();

        BeanUtils.copyProperties(question, questionDTO);

        questionDTO.setAdminName(question.getAdmin().getFullname());
        questionDTO.setAnswer(question.getAnswer());

        return questionDTO;
    }

    private void convertRequestToEntity(QuestionDetailRequestDTO questionDTO, QuestionDetail question) {
        Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
        Subject subject = subjectRepository.findById(questionDTO.getSubjectId()).get();
        Course course = courseRepository.findById(questionDTO.getCourseId()).get();

        BeanUtils.copyProperties(questionDTO, question);

        question.setQuestionTitle(questionDTO.getQuestionTitle());
        question.setSubjectName(subject.getSubjectName());
        question.setAdmin(admin);
        question.setCourse(course);
        question.setCourseName(course.getCourseName());
        question.setAnswer(questionDTO.getAnswers());

    }

    private QuestionDetail convertRequestToEntity(QuestionDetailRequestDTO questionDTO) {
        QuestionDetail questionDetail = new QuestionDetail();

        Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
        Subject subject = subjectRepository.findById(questionDTO.getSubjectId()).get();
        Course course = courseRepository.findById(questionDTO.getCourseId()).get();
        Question question = questionRepository.findById(questionDTO.getQuestionDetailId()).get();

        BeanUtils.copyProperties(questionDTO, questionDetail);

        questionDetail.setAdmin(admin);
        questionDetail.setCourse(course);
        questionDetail.setQuestion(question);
        questionDetail.setQuestionTitle(questionDTO.getQuestionTitle());
        questionDetail.setSubjectName(subject.getSubjectName());
        questionDetail.setCourseName(course.getCourseName());
        questionDetail.setAnswer(questionDTO.getAnswers());

        return questionDetail;
    }

//	public List<Answer> getListAnswerFormQuestionRequest(QuestionDTORequest questionRequest) {
//		List<Answer> = this.convert
//		return null;
//	}

}
