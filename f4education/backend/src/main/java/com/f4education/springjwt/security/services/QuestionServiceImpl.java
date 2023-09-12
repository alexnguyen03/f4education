package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.QuestionReposotory;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class QuestionServiceImpl implements QuestionService {
	@Autowired
	QuestionReposotory questionReposotory;

	@Autowired
	AdminRepository adminRepository;

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	SubjectRepository subjectRepository;

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
		Question question = new Question();
		question.setCreateDate(new Date());
		
		convertToEntityRequest(questionDTO, question);

		Question saveQuestion = questionReposotory.save(question);
		return convertToDtoRequest(saveQuestion);
	}

	@Override
	public QuestionDTORequest updateQuestion(Integer questionId, QuestionDTORequest questionDTO) {
		Question exitQuestion = questionReposotory.findById(questionId).get();
		
		convertToEntityRequest(questionDTO, exitQuestion);
		exitQuestion.setQuestionId(questionId);
		
		Question updateQuestion = questionReposotory.save(exitQuestion);
		return convertToDtoRequest(updateQuestion);
	}

	private QuestionDTO convertToDto(Question question) {
		QuestionDTO questionDTO = new QuestionDTO();
		questionDTO.setAdminName(question.getAdmin().getFullname());
		questionDTO.setAnswer(question.getAnswer());

		BeanUtils.copyProperties(question, questionDTO);

		return questionDTO;
	}

	private QuestionDTORequest convertToDtoRequest(Question question) {
		QuestionDTORequest questionDTO = new QuestionDTORequest();
		
		Admin admin = adminRepository.findById(question.getAdmin().getAdminId()).get();
		Course course = courseRepository.findById(question.getCourse().getCourseId()).get();
		
		questionDTO.setCourseId(course.getCourseId());
		questionDTO.setAdminId(admin.getAdminId());

		BeanUtils.copyProperties(question, questionDTO);

		return questionDTO;
	}

	private void convertToEntityRequest(QuestionDTORequest questionDTO, Question question) {

		Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
		Subject subject = subjectRepository.findById(questionDTO.getSubjectId()).get();
		Course course = courseRepository.findById(questionDTO.getCourseId()).get();

		question.setQuestionTitle(questionDTO.getQuestionTitle());
		question.setSubjectName(subject.getSubjectName());
		question.setAdmin(admin);
		question.setCourse(course);
		question.setCourseName(course.getCourseName());

		BeanUtils.copyProperties(questionDTO, question);
	}

}
