package com.f4education.springjwt.security.services;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.models.QuizResult;
import com.f4education.springjwt.payload.request.QuestionDetailClientDTO;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionDetailRepository;
import com.f4education.springjwt.repository.QuestionRepository;
import com.f4education.springjwt.repository.QuizResultRepository;

@Service
public class QuestionDetailServiceImpl implements QuestionDetailService {
	@Autowired
	QuestionDetailRepository questionDetailReposotory;

	@Autowired
	private QuizResultRepository quizResultRepository;

	@Autowired
	QuestionRepository questionReposotory;

	@Autowired
	AnswerReposotory answerReposotory;

	private List<QuestionDetail> cachedRandomQuestions = null;

	@Override
	public List<QuestionDetailClientDTO> getQuestionDetailsByStudentId(Integer classId, String studentId) {
		List<QuizResult> quizResults = quizResultRepository.getAllByClassIdAndStudenId(classId, studentId);
		if (cachedRandomQuestions == null) {
			// Khối này chỉ thực thi trong lần gọi đầu tiên, xáo trộn và lưu trữ câu hỏi vào cache
			List<QuestionDetail> questionDetail = questionDetailReposotory.findQuestionDetailByStudentId(classId);
			if (quizResults.size() < 1) {
				if (questionDetail.size() > 0) {
					// Xáo trộn câu hỏi chỉ nếu có câu hỏi
					Collections.shuffle(questionDetail);
					// Lấy 50 câu hỏi đầu tiên hoặc tất cả câu hỏi nếu ít hơn 50
					cachedRandomQuestions = questionDetail.subList(0, Math.min(questionDetail.size(), 50));
				} else {
					cachedRandomQuestions = new ArrayList<>();
				}

				System.out.println(cachedRandomQuestions);
			}
		}

		if (quizResults.size() < 1) {
			return cachedRandomQuestions.stream().map(this::convertToDto).collect(Collectors.toList());
		}
		return null;
	}

	private QuestionDetailClientDTO convertToDto(QuestionDetail questionDetail) {
		QuestionDetailClientDTO questionDetailClientDTO = new QuestionDetailClientDTO();
		BeanUtils.copyProperties(questionDetail, questionDetailClientDTO);
		questionDetailClientDTO.setAnswer(questionDetail.getAnswers());
		questionDetailClientDTO.setCourseId(questionDetail.getQuestion().getCourse().getCourseId());
		questionDetailClientDTO.setClassId(
				questionDetail.getQuestion().getCourse().getRegisterCourses().get(0).getClasses().getClassId());
		return questionDetailClientDTO;
	}

	@Override
	public List<QuestionDetailDTO> findAll() {
		List<QuestionDetail> questionDetail = questionDetailReposotory.findAll();
		return questionDetail.stream().map(this::convertToQuestionDetailResponse).collect(Collectors.toList());
	}

	@Override
	public List<QuestionDetailDTO> getAllQuestionDetailByQuestionId(Integer questionId) {
		List<QuestionDetail> questionDetail = questionDetailReposotory.findAllQuestionDetailByQuestionId(questionId);
		return questionDetail.stream().map(this::convertToQuestionDetailResponse).collect(Collectors.toList());
	}

	@Override
	public QuestionDetailDTO getQuestionDetailById(Integer questionDetailId) {
		QuestionDetail questionDetail = questionDetailReposotory.findById(questionDetailId).get();
		return this.convertToQuestionDetailResponse(questionDetail);
	}

	@Override
	public QuestionDetailDTO createQuestionDetail(QuestionDetailDTO questionDetailDTO) {
		QuestionDetail questionDetail = this.convertDTOtoEntity(questionDetailDTO);
		questionDetail.setCreateDate(new Date());

		QuestionDetail saveQuestionDetail = questionDetailReposotory.save(questionDetail);

		if (questionDetailDTO.getAnswers().size() > 0) {
			for (Answer as : questionDetailDTO.getAnswers()) {
				as.setQuestionDetail(saveQuestionDetail);
				answerReposotory.save(as);
			}
		}
		cachedRandomQuestions = null;
		return convertToQuestionDetailResponse(saveQuestionDetail);
	}

	@Override
	public QuestionDetailDTO updateQuestionDetail(Integer questionDetailId, QuestionDetailDTO questionDetailDTO) {
		Optional<QuestionDetail> questionDetail = questionDetailReposotory.findById(questionDetailId);

		if (questionDetail.isPresent()) {
			QuestionDetail exitQuestionDetail = questionDetail.get();

			this.convertDTOtoEntity(questionDetailDTO, exitQuestionDetail);

			// List<Answer> answers = questionDetailDTO.getAnswers();
			// for (Answer as : answers) {
			// Optional<Answer> exitAnswer = answerReposotory.findById(as.getAnswerId());
			//
			// if (exitAnswer.isPresent()) {
			// Answer existingAnswer = exitAnswer.get();
			// System.out.println(existingAnswer);
			//
			// answerReposotory.save(existingAnswer);
			// }
			// }

			QuestionDetail updateQuestionDetail = questionDetailReposotory.save(exitQuestionDetail);
			
			cachedRandomQuestions = null;
			return convertToQuestionDetailResponse(updateQuestionDetail);
		}
		return null;
	}

	@Override
	public QuestionDetailDTO deleteQuestion(Integer questionDetailId) {
		QuestionDetail questionDetail = questionDetailReposotory.findById(questionDetailId).get();

		if (questionDetail == null) {
			return null;
		}

		questionDetailReposotory.deleteById(questionDetailId);
		cachedRandomQuestions = null;
		return this.convertToQuestionDetailResponse(questionDetail);
	}

	private QuestionDetail convertDTOtoEntity(QuestionDetailDTO questionDetailDTO) {
		QuestionDetail questionDetail = new QuestionDetail();

		Optional<Question> question = questionReposotory.findById(questionDetailDTO.getQuestionId());

		BeanUtils.copyProperties(questionDetailDTO, questionDetail);

		question.ifPresent(questionDetail::setQuestion);

		return questionDetail;
	}

	private void convertDTOtoEntity(QuestionDetailDTO questionDetailDTO, QuestionDetail questionDetail) {
		Optional<Question> question = questionReposotory.findById(questionDetailDTO.getQuestionId());

		question.ifPresent(questionDetail::setQuestion);
		questionDetail.setQuestionTitle(questionDetailDTO.getQuestionTitle());
		questionDetail.setAnswers(questionDetailDTO.getAnswers());
		questionDetail.setCreateDate(questionDetailDTO.getCreateDate());
	}

	private QuestionDetailDTO convertToQuestionDetailResponse(QuestionDetail questionDetail) {
		QuestionDetailDTO questionDetailDTO = new QuestionDetailDTO();

		BeanUtils.copyProperties(questionDetail, questionDetailDTO);

		questionDetailDTO.setQuestionId(questionDetail.getQuestion().getQuestionId());
		questionDetailDTO.setAnswers(questionDetail.getAnswers());

		return questionDetailDTO;
	}
}