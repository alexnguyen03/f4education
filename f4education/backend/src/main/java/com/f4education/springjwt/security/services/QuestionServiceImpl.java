package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.QuestionRepository;
import com.f4education.springjwt.repository.SubjectRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {
	@Autowired
	QuestionRepository questionReposotory;

	@Autowired
	AdminRepository adminRepository;

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	SubjectRepository subjectRepository;

	@Override
	public List<QuestionDTO> getAllQuestion() {
		List<Question> question = questionReposotory.findAll();
		return question.stream().map(this::convertToQuestionResponse).collect(Collectors.toList());
	}

	@Override
	public QuestionDTO findQuestionById(Integer questionId) {
		Question question = questionReposotory.findById(questionId).get();
		return question != null ? this.convertToQuestionResponse(question) : null;
	}

	@Override
	public QuestionDTO createQuestion(QuestionDTORequest questionDTO) {
		Question question = this.convertRequestToEntity(questionDTO);
		question.setCreateDate(new Date());

		Question saveQuestion = questionReposotory.save(question);

		return convertToQuestionResponse(saveQuestion);
	}

	@Override
	public QuestionDTO updateQuestion(Integer questionId, QuestionDTORequest questionDTO) {
		Optional<Question> exitQuestion = questionReposotory.findById(questionId);

		if (exitQuestion.isEmpty()) {
			return null;
		}

		Question updateQuestion = questionReposotory.save(exitQuestion.get());

		return convertToQuestionResponse(updateQuestion);
	}

	private QuestionDTO convertToQuestionResponse(Question question) {
		QuestionDTO questionDTO = new QuestionDTO();

		BeanUtils.copyProperties(question, questionDTO);

		questionDTO.setAdminName(question.getAdmin().getFullname());
		questionDTO.setQuestionId(question.getQuestionId());
		questionDTO.setSubjectName(question.getSubject().getSubjectName());
		questionDTO.setCourseName(question.getCourse().getCourseName());

		return questionDTO;
	}

	private Question convertRequestToEntity(QuestionDTORequest questionDTORequest) {
		Question question = new Question();

		Admin admin = adminRepository.findById(questionDTORequest.getAdminId()).get();
		Subject subject = subjectRepository.findById(questionDTORequest.getSubjectId()).get();
		Course course = courseRepository.findById(questionDTORequest.getCourseId()).get();

		BeanUtils.copyProperties(questionDTORequest, question);

		question.setCourse(course);
		question.setSubject(subject);
		question.setAdmin(admin);

		return question;
	}

	@Override
	public List<Question> get60QuestionRamdomsByCourseId(Integer courseId) {
		return questionReposotory.findAllByCourseId(courseId);
	}

}
