package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.payload.request.QuestionDTORequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.QuestionReposotory;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class QuestionServiceImpl implements QuestionService {
	@Autowired
	QuestionReposotory questionReposotory;

	@Autowired
	AnswerReposotory answerReposotory;

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
		Question question = this.convertRequestToEntity(questionDTO);

		Question saveQuestion = questionReposotory.save(question);

		if (saveQuestion.getAnswer().size() > 0) {
			for (Answer as : saveQuestion.getAnswer()) {
				as.setQuestion(saveQuestion);
				answerReposotory.save(as);
			}
		}

		return convertToDtoRequest(saveQuestion);
	}

	@Override
	public QuestionDTORequest updateQuestion(Integer questionId, QuestionDTORequest questionDTO) {
		Optional<Question> exitQuestion = questionReposotory.findById(questionId);

		if (!exitQuestion.isPresent()) {
			return null;
		}

		Question question = this.convertRequestToEntity(questionDTO);

		Question updateQuestion = questionReposotory.save(question);

		for (Answer as : updateQuestion.getAnswer()) {
			as.setQuestion(updateQuestion);
			answerReposotory.save(as);
		}

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

	private Question convertRequestToEntity(QuestionDTORequest questionDTO) {
		Question question = new Question();

		Admin admin = adminRepository.findById(questionDTO.getAdminId()).get();
		Subject subject = subjectRepository.findById(questionDTO.getSubjectId()).get();
		Course course = courseRepository.findById(questionDTO.getCourseId()).get();

		BeanUtils.copyProperties(questionDTO, question);

		question.setQuestionTitle(questionDTO.getQuestionTitle());
		question.setSubjectName(subject.getSubjectName());
		question.setAdmin(admin);
		question.setCourse(course);
		question.setCreateDate(new Date());
		question.setCourseName(course.getCourseName());
		question.setAnswer(questionDTO.getAnswers());

		return question;
	}

//	public List<Answer> getListAnswerFormQuestionRequest(QuestionDTORequest questionRequest) {
//		List<Answer> = this.convert
//		return null;
//	}

}
