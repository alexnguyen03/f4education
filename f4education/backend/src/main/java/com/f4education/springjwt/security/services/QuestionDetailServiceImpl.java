package com.f4education.springjwt.security.services;

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
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionDetailReposotory;
import com.f4education.springjwt.repository.QuestionReposotory;

@Service
public class QuestionDetailServiceImpl implements QuestionDetailService {
	@Autowired
	QuestionDetailReposotory questionDetailReposotory;

	@Autowired
	QuestionReposotory questionReposotory;

	@Autowired
	AnswerReposotory answerReposotory;

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
		System.out.println(saveQuestionDetail);

		if (questionDetailDTO.getAnswers().size() > 0) {
			for (Answer as : questionDetailDTO.getAnswers()) {
				as.setQuestionDetail(saveQuestionDetail);
				answerReposotory.save(as);
			}
		}

		return convertToQuestionDetailResponse(saveQuestionDetail);
	}

	@Override
	public QuestionDetailDTO updateQuestionDetail(Integer questionDetailId, QuestionDetailDTO questionDetailDTO) {
		Optional<QuestionDetail> questionDetail = questionDetailReposotory.findById(questionDetailId);

		if (questionDetail.isPresent()) {
			QuestionDetail exitQuestionDetail = questionDetail.get();

			this.convertDTOtoEntity(questionDetailDTO, exitQuestionDetail);

//			List<Answer> answers = questionDetailDTO.getAnswers();
//			for (Answer as : answers) {
//				Optional<Answer> exitAnswer = answerReposotory.findById(as.getAnswerId());
//
//				if (exitAnswer.isPresent()) {
//		            Answer existingAnswer = exitAnswer.get();
//		            System.out.println(existingAnswer);
//		            
//		            answerReposotory.save(existingAnswer);
//		        }
//			}

			QuestionDetail updateQuestionDetail = questionDetailReposotory.save(exitQuestionDetail);

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